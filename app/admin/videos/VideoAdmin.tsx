"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { VideoWork } from "../../video-works";
import "./admin.css";
type Work=VideoWork&{visible:boolean;width?:number;height?:number};
type Catalog={items:Work[];version:string};
const empty={category:"",title:"",description:""};
class ApiError extends Error { constructor(message:string,public status:number){super(message);} }
async function api(path:string,init:RequestInit={}) {
  let response:Response;
  try{response=await fetch(`/api/admin/${path}`,{cache:"no-store",...init});}catch(e){if(e instanceof DOMException&&e.name==="AbortError")throw e;throw new Error("无法连接后台，上传尚未完成。请确认后台页面可以打开，然后重试。");}
  let data;try{data=await response.json();}catch{throw new ApiError("服务器未返回有效结果，请确认后台已启动后重试。",response.status);}
  if(!response.ok)throw new ApiError(data.error||"操作失败，请重试",response.status);return data;
}
const payload=(value:unknown)=>({headers:{"Content-Type":"application/json"},body:JSON.stringify(value)});
async function inspect(file:File):Promise<{poster:Blob;orientation:"portrait"|"landscape"}> {
  const video=document.createElement("video"),url=URL.createObjectURL(file);video.muted=true;video.playsInline=true;video.preload="auto";
  try {await new Promise<void>((resolve,reject)=>{
    const timer=setTimeout(()=>reject(new Error("无法读取视频，请使用浏览器可播放的 MP4（H.264）文件。")),20000);
    video.onerror=()=>{clearTimeout(timer);reject(new Error("浏览器无法读取这个视频，请导出为 MP4（H.264）后再上传。"));};
    video.onloadeddata=()=>{clearTimeout(timer);resolve();};
    video.src=url;
  });
  const canvas=document.createElement("canvas");const ratio=Math.min(1,1280/Math.max(video.videoWidth,video.videoHeight));canvas.width=Math.round(video.videoWidth*ratio);canvas.height=Math.round(video.videoHeight*ratio);
  canvas.getContext("2d")!.drawImage(video,0,0,canvas.width,canvas.height);
  const poster=await new Promise<Blob>((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(new Error("无法生成封面")),"image/jpeg",.85));
  return {poster,orientation:video.videoHeight>video.videoWidth?"portrait":"landscape"};
  }finally{video.removeAttribute("src");video.load();URL.revokeObjectURL(url);}
}
export default function VideoAdmin({kind="videos"}:{kind?:"videos"|"images"}){
  const images=kind==="images";
  const [auth,setAuth]=useState<"loading"|"login"|"ready">("loading"),[password,setPassword]=useState(""),[username,setUsername]=useState("");
  const [data,setData]=useState<Catalog>({items:[],version:"new"}),[dirty,setDirty]=useState(false);
  const [busy,setBusy]=useState(false),[uploading,setUploading]=useState(false),[message,setMessage]=useState(""),[error,setError]=useState("");
  const [fields,setFields]=useState(empty),[file,setFile]=useState<File|null>(null),[progress,setProgress]=useState(0);
  const [pending,setPending]=useState<Work|null>(null);
  const [uploadStatus,setUploadStatus]=useState<"idle"|"preparing"|"uploading"|"finalizing"|"ready"|"failed"|"cancelled">("idle");
  const controller=useRef<AbortController|null>(null),fileInput=useRef<HTMLInputElement>(null);
  const locked=busy||uploading;
  const [imagePreview,setImagePreview]=useState("");
  const previewUrl=useRef("");
  useEffect(()=>()=>{if(previewUrl.current)URL.revokeObjectURL(previewUrl.current);},[]);
  useEffect(()=>{let live=true;api("session").then(()=>api(kind)).then(d=>{if(live){setData(d);setAuth("ready");}}).catch(e=>{if(live){setAuth("login");if(e.status!==401)setError(e.message);}});return()=>{live=false;};},[kind]);
  useEffect(()=>{const warn=(event:BeforeUnloadEvent)=>{if(uploading||dirty||pending){event.preventDefault();event.returnValue="";}};window.addEventListener("beforeunload",warn);return()=>window.removeEventListener("beforeunload",warn);},[uploading,dirty,pending]);
  const fail=(e:unknown)=>{setError(e instanceof Error?e.message:"操作失败，请重试");};
  async function login(e:React.FormEvent){e.preventDefault();setBusy(true);setError("");try{await api("session",{method:"POST",...payload({username,password})});setPassword("");setData(await api(kind));setAuth("ready");}catch(e){fail(e);}finally{setBusy(false);}}
  async function save(items=data.items){setBusy(true);setError("");setMessage("");try{const next=await api(kind,{method:"PUT",...payload({items,version:data.version})});setData(next);setDirty(false);setMessage("已保存，访客刷新作品页面即可看到更新。");return true;}catch(e){fail(e);return false;}finally{setBusy(false);}}
  function edit(index:number,patch:Partial<Work>){setData(d=>({...d,items:d.items.map((w,i)=>i===index?{...w,...patch}:w)}));setDirty(true);}
  function move(index:number,delta:number){setData(d=>{const items=[...d.items];[items[index],items[index+delta]]=[items[index+delta],items[index]];return {...d,items};});setDirty(true);}
  async function uploadImage(){
    if(!file)return;
    if(!/\.(jpe?g|png|webp)$/i.test(file.name)||file.size>20*1024**2){setError("请选择 20 MB 以内的 JPG、PNG 或 WebP 图片。");return;}
    setUploading(true);setUploadStatus("preparing");setError("");setProgress(0);setMessage("正在读取图片…");const abort=new AbortController();controller.current=abort;
    try {
      const img=document.createElement("img"),url=URL.createObjectURL(file);let width:number,height:number;
      try{img.src=url;await img.decode();width=img.naturalWidth;height=img.naturalHeight;}catch{throw new Error("无法读取这张图片，请确认文件未损坏，或另存为 JPG、PNG 后重试。");}finally{URL.revokeObjectURL(url);}
      if(width*height>80000000||width>30000||height>30000)throw new Error("图片尺寸过大，请缩小后上传。");
      setUploadStatus("uploading");setMessage("正在上传图片，请保持页面打开…");
      const result=await api("image-upload",{method:"POST",headers:{"Content-Type":file.type||"application/octet-stream"},body:file,signal:abort.signal});
      setPending({id:crypto.randomUUID(),src:result.src,width,height,...fields,visible:true});setProgress(100);setUploadStatus("ready");setMessage("图片已上传，确认三行文字后点击「保存并显示」。");
    }catch(e){setUploadStatus(abort.signal.aborted?"cancelled":"failed");if(abort.signal.aborted)setMessage("上传已取消。");else {setMessage("");fail(e);}}finally{setUploading(false);controller.current=null;}
  }
  async function upload(){
    if(!file||!fields.title.trim()||!fields.category.trim()||!fields.description.trim()){setError(`请选择${images?"图片":"视频"}并填写三行文字。`);return;}
    if(images){await uploadImage();return;}
    if(!/\.mp4$/i.test(file.name)||file.size>2*1024**3||file.size<16){setError("请选择 2 GB 以内的 MP4 视频。");return;}
    setUploading(true);setUploadStatus("preparing");setError("");setMessage("正在读取视频并生成封面…");setProgress(0);
    const abort=new AbortController();controller.current=abort;let token="",completed=false;
    try {
      let details:{poster?:Blob;orientation:"portrait"|"landscape"}={orientation:"landscape"};
      let noCover=false;
      try{details=await inspect(file);}catch{noCover=true;}
      abort.signal.throwIfAborted();
      const created=await api("uploads",{method:"POST",...payload({size:file.size}),signal:abort.signal});token=created.token;
      const parts=[];setUploadStatus("uploading");setMessage("正在上传视频，请保持此页面打开。");
      for(let offset=0,n=1;offset<file.size;offset+=created.chunkSize,n++){
        const chunk=file.slice(offset,offset+created.chunkSize);let part;
        for(let attempt=0;attempt<3;attempt++){
          try{part=await api(`upload/part?part=${n}`,{method:"PUT",headers:{"x-upload-token":token},body:chunk,signal:abort.signal});break;}
          catch(e){if(abort.signal.aborted||attempt===2||e instanceof ApiError&&e.status<500)throw e;await new Promise(resolve=>setTimeout(resolve,1000*(attempt+1)));}
        }
        parts.push(part);setProgress(Math.round(Math.min(file.size,offset+chunk.size)/file.size*95));
      }
      setUploadStatus("finalizing");setMessage("视频已传送，正在确认储存结果…");
      const result=await api("upload/complete",{method:"POST",headers:{"Content-Type":"application/json","x-upload-token":token},body:JSON.stringify({parts}),signal:abort.signal});completed=true;
      const work:Work={id:crypto.randomUUID(),src:result.src,orientation:details.orientation,...fields,visible:true};
      // Keep the finished upload available even if the optional cover upload fails.
      setPending(work);
      if(details.poster){try{const cover=await api("poster",{method:"POST",headers:{"Content-Type":"image/jpeg"},body:details.poster,signal:abort.signal});setPending({...work,poster:cover.poster});}catch{noCover=true;}}
      setProgress(100);setUploadStatus("ready");setMessage(noCover?"视频已上传。未能自动生成封面，请确认横竖屏后点击「保存并显示」，无需重复上传。":"上传完成。确认三行文字后，点击「保存并显示」。");
    }catch(e){setUploadStatus(abort.signal.aborted?"cancelled":"failed");if(abort.signal.aborted)setMessage("上传已取消。");else {setMessage("");fail(e);}if(token&&!completed)await api("upload/abort",{method:"DELETE",headers:{"x-upload-token":token}}).catch(()=>{});}
    finally{setUploading(false);controller.current=null;}
  }
  async function publish(){if(!pending)return;if(await save([{...pending,...fields},...data.items])){setPending(null);setFields(empty);setFile(null);if(previewUrl.current)URL.revokeObjectURL(previewUrl.current);previewUrl.current="";setImagePreview("");if(fileInput.current)fileInput.current.value="";setProgress(0);setUploadStatus("idle");}}
  if(auth==="loading")return <main className="video-admin" translate="no"><p>正在打开作品后台…</p></main>;
  return <main className="video-admin" translate="no">
    <header className="admin-heading"><div><Link href="/">AUTAKSING.</Link><h1>作品管理</h1><p>上传作品，编辑三行文字，让作品出现在你的网站。</p></div><a href={images?"/graphic-design":"/film-production"} target="_blank" rel="noreferrer">查看作品页面 ↗</a></header>
    {auth==="ready"&&<nav className="admin-tabs" aria-label="作品类型">{([["videos","视频作品","/admin/videos"],["images","图片作品","/admin/images"]] as const).map(([value,label,href])=><Link key={value} href={href} aria-current={kind===value?"page":undefined} onNavigate={e=>{if(locked||dirty||pending){e.preventDefault();setError("请先完成上传并保存当前修改，再切换栏目。");}}}>{label}</Link>)}</nav>}
    {auth==="login"&&error&&<p className="admin-error" role="alert">{error}</p>}{auth==="login"&&message&&<p className="admin-message" role="status">{message}</p>}
    {auth==="login"?<form className="admin-login" onSubmit={login}><h2>管理员登录</h2><p>仅限网站拥有者使用。</p><label>管理员账号<input autoComplete="username" name="username" type="text" required maxLength={80} value={username} onChange={e=>setUsername(e.target.value)} disabled={busy}/></label><label>管理密码<input autoComplete="current-password" name="password" disabled={busy} type="password" required value={password} onChange={e=>setPassword(e.target.value)}/></label><button disabled={busy}>{busy?"正在登录…":"登录"}</button><p>仅支持已配置的管理员账号，不开放注册。</p></form>:<>
      <section className="admin-panel"><div className="admin-section-title"><h2>{images?"添加图片作品":"添加新视频"}</h2><button className="admin-secondary" disabled={locked||dirty||!!pending} onClick={async()=>{try{await api("session",{method:"DELETE"});setAuth("login");setMessage("");}catch(e){fail(e);}}}>退出登录</button></div>
        <p>{images?"上传 JPG、PNG 或 WebP，最大 20 MB。保存后显示在「视觉设计」栏目。":"支持 MP4，最大 2 GB。自动识别横竖屏并截取封面。"}</p>
        <label className="admin-file">{images?"选择图片":"选择视频"}<input ref={fileInput} type="file" accept={images?"image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp":"video/mp4,.mp4"} disabled={locked||!!pending} onChange={e=>{const selected=e.target.files?.[0]||null;setFile(selected);setError("");if(previewUrl.current)URL.revokeObjectURL(previewUrl.current);previewUrl.current=images&&selected?URL.createObjectURL(selected):"";setImagePreview(previewUrl.current);}}/></label>
        <div className="admin-editor"><div className="admin-fields">{([['category','第一行 · 分类小字',40],['title','第二行 · 作品大标题',80],['description','第三行 · 说明文字',160]] as const).map(([key,label,max])=><label key={key}>{label}<input value={fields[key]} maxLength={max} disabled={locked} onChange={e=>setFields({...fields,[key]:e.target.value})}/></label>)}</div>
          <div className="admin-text-preview">{images&&imagePreview&&<Image className="admin-image-preview" src={imagePreview} width={800} height={600} unoptimized alt="待上传图片预览"/>}<small>{fields.category||(images?"平面视觉":"空间影像")}</small><h3>{fields.title||(images?"作品标题":"现代居所 · 光影美学")}</h3><p>{fields.description||(images?"作品说明":"室内空间展示")}</p><span>文字效果预览</span></div></div>
        {(uploadStatus!=="idle"||error||message)&&<div className="admin-upload-status" data-status={uploadStatus} aria-live="polite">
          {uploadStatus!=="idle"&&<><strong>{({idle:"",preparing:"正在读取文件",uploading:"正在上传",finalizing:"正在完成储存",ready:"上传完成，待保存",failed:"上传未完成",cancelled:"上传已取消"})[uploadStatus]}</strong><progress aria-label="上传进度" value={uploadStatus==="preparing"||images&&uploading?undefined:progress} max={100}/>{!images&&<p>{progress}%</p>}</>}
          {error&&<p className="admin-upload-error">{error}</p>}{message&&<p>{message}</p>}
        </div>}
        {pending&&!images&&<label className="admin-upload-orientation">画面比例<select value={pending.orientation||"landscape"} disabled={locked} onChange={e=>setPending({...pending,orientation:e.target.value as Work["orientation"]})}><option value="landscape">横屏</option><option value="portrait">竖屏</option></select></label>}
        <div className="admin-actions">{pending?<button disabled={locked} onClick={publish}>保存并显示</button>:<button disabled={locked||!file} onClick={upload}>{uploading?"正在上传…":images?"上传图片":"上传视频"}</button>}{uploading&&<button className="admin-secondary" onClick={()=>controller.current?.abort()}>取消上传</button>}{pending&&<p>{images?"图片":"视频"}已上传到储存桶，保存后才会展示。</p>}</div>
      </section>
      <section className="admin-panel"><div className="admin-section-title"><div><h2>已有作品 <small>{data.items.length}</small></h2><p>{images?"图片按此顺序展示在视觉设计栏目。":"横屏与竖屏分别展示；排序会在各自分组中生效。"}</p></div><button disabled={locked||!dirty} onClick={()=>save()}>保存作品修改</button></div>
      {images&&data.items.length===0&&<p>暂时没有图片作品，上传第一张图片即可开始。</p>}
      {data.items.map((work,index)=><article className="admin-work" key={work.id}><div className="admin-work-number">{String(index+1).padStart(2,"0")}<span>{images?"图片":work.orientation==="portrait"?"竖屏":"横屏"}</span></div><div className="admin-fields">{([['category','分类小字',40],['title','作品大标题',80],['description','说明文字',160]] as const).map(([key,label,max])=><label key={key}>{label}<input value={work[key]} maxLength={max} disabled={locked} onChange={e=>edit(index,{[key]:e.target.value})}/></label>)}</div><div className="admin-work-actions"><label><input type="checkbox" checked={work.visible} disabled={locked} onChange={e=>edit(index,{visible:e.target.checked})}/>在网站显示</label>{!images&&<label>画面比例<select value={work.orientation||"landscape"} disabled={locked} onChange={e=>edit(index,{orientation:e.target.value as Work['orientation']})}><option value="landscape">横屏</option><option value="portrait">竖屏</option></select></label>}<button className="admin-secondary" disabled={locked||index===0} aria-label={`上移 ${work.title}`} onClick={()=>move(index,-1)}>↑ 上移</button><button className="admin-secondary" disabled={locked||index===data.items.length-1} aria-label={`下移 ${work.title}`} onClick={()=>move(index,1)}>↓ 下移</button></div></article>)}
      </section>
    </>}
  </main>;
}
