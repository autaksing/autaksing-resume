"use client";

import { useRef, useState } from "react";

const links = [["#production", "拍攝剪輯", "FILM"], ["#operations", "運營", "OPERATIONS"], ["#ai", "AI", "EXPERIMENTS"], ["#design", "設計", "DESIGN"], ["#about", "關於", "ABOUT"]];

export default function HomeNavigation() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [expanded, setExpanded] = useState(false);
  const close = () => { dialog.current?.close(); setExpanded(false); };
  return <nav className="home-nav" aria-label="主導航">
    <a className="brand" href="#top" aria-label="AUTAKSING，返回頂部">AUTAKSING<span>.</span></a>
    <a className="home-nav-work" href="#areas">SELECTED WORK</a>
    <button className="home-menu-toggle" type="button" aria-expanded={expanded} aria-controls="home-nav-links" onClick={() => { dialog.current?.showModal(); setExpanded(true); }}>MENU <span aria-hidden="true">＋</span></button>
    <dialog ref={dialog} className="home-menu-dialog" id="home-nav-links" aria-label="網站目錄" onClose={() => setExpanded(false)} onCancel={close}>
      <header><span>AUTAKSING.</span><button className="home-menu-close" type="button" onClick={close} aria-label="關閉目錄">CLOSE ×</button></header>
      <div className="home-nav-links">{links.map(([href, label, english]) => <a key={href} href={href} onClick={close}><span>{english}</span><small>{label}</small><i aria-hidden="true">↗</i></a>)}</div>
      <a className="home-menu-email" href="mailto:autaksing0117@gmail.com">autaksing0117@gmail.com ↗</a>
    </dialog>
  </nav>;
}
