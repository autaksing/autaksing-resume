"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { ImageWork } from "./image-works";
import "./image-gallery.css";

export default function ImageGallery(){
  const [items,setItems]=useState<ImageWork[]>([]),[failed,setFailed]=useState(false),[selected,setSelected]=useState<ImageWork|null>(null);
  const modal=useRef<HTMLDialogElement>(null);
  const load=useCallback(async(signal?:AbortSignal)=>{
    try{const r=await fetch("/api/images",{cache:"no-store",signal});if(!r.ok)throw new Error("Unavailable");const d=await r.json();if(!signal?.aborted&&Array.isArray(d.items)){setItems(d.items);setFailed(false);}}
    catch{if(!signal?.aborted)setFailed(true);}
  },[]);
  useEffect(()=>{const c=new AbortController();const frame=requestAnimationFrame(()=>void load(c.signal));return()=>{cancelAnimationFrame(frame);c.abort();};},[load]);
  useEffect(()=>{if(!selected)return;const dialog=modal.current;if(!dialog)return;const previous=document.body.style.overflow;document.body.style.overflow="hidden";dialog.showModal();return()=>{dialog.close();document.body.style.overflow=previous;};},[selected]);
  if(!items.length&&!failed)return null;
  return <section className="design-gallery" aria-labelledby="design-gallery-title"><header><p className="eyebrow">Selected Visual Works</p><h2 id="design-gallery-title">視覺作品</h2></header>
    {failed&&<p role="alert">暫時無法載入作品。<button onClick={()=>void load()}>重新載入</button></p>}
    <div className="design-gallery-grid">{items.map(work=><article className="design-work" key={work.id}><button className="design-work-image" onClick={()=>setSelected(work)} aria-label={`查看作品：${work.title}`}><Image src={work.src} alt={work.title} width={work.width} height={work.height} unoptimized sizes="(max-width:700px) 92vw, 45vw"/><span aria-hidden="true">↗</span></button><div className="design-work-caption"><small>{work.category}</small><h3>{work.title}</h3><p>{work.description}</p></div></article>)}</div>
    {selected&&<dialog ref={modal} className="design-image-dialog" aria-label={selected.title} onClose={()=>setSelected(null)} onClick={e=>{if(e.target===e.currentTarget)setSelected(null);}}><button className="design-dialog-close" onClick={()=>setSelected(null)} aria-label="關閉圖片">關閉 ×</button><Image src={selected.src} alt={selected.title} width={selected.width} height={selected.height} unoptimized/><p>{selected.title}</p></dialog>}
  </section>;
}
