import type { R2Bucket, Headers as WorkerHeaders } from "@cloudflare/workers-types";
import type { ImageWork } from "../app/image-works";
import { videoWorks, type VideoWork } from "../app/video-works";

export type ManagedVideo = VideoWork & { visible: boolean };
type Env = { VIDEOS?: R2Bucket; ADMIN_USERNAME?: string; ADMIN_PASSWORD?: string; ADMIN_SESSION_SECRET?: string; ADMIN_LOGIN_LIMITER?: {limit(input:{key:string}):Promise<{success:boolean}>} };
type ManagedImage = ImageWork & {visible:boolean};
const IMAGE_CATALOG = "website-data/images.json";
const CATALOG = "website-data/videos.json";
const MEDIA = "https://video.autaksing.com/";
const CHUNK = 8 * 1024 * 1024;
const MAX = 2 * 1024 * 1024 * 1024;
const encoder = new TextEncoder();
const local = (r:Request) => ["localhost", "127.0.0.1", "[::1]"].includes(new URL(r.url).hostname);
const json = (data:unknown, status=200, headers:Record<string,string>={}) => Response.json(data, {status,headers:{"Cache-Control":"no-store", "X-Content-Type-Options":"nosniff", ...headers}});
class Problem extends Error { constructor(message:string, public status=400) {super(message);} }
async function hmac(secret:string, payload:string) {
  const key=await crypto.subtle.importKey("raw",encoder.encode(secret),{name:"HMAC",hash:"SHA-256"},false,["sign"]);
  return Array.from(new Uint8Array(await crypto.subtle.sign("HMAC",key,encoder.encode(payload))),x=>x.toString(16).padStart(2,"0")).join("");
}
async function equal(a:string,b:string) { return (await hmac("constant-time-comparison",a)) === (await hmac("constant-time-comparison",b)); }
async function sign(secret:string,data:Record<string,unknown>) {const p=btoa(JSON.stringify(data));return `${p}.${await hmac(secret,p)}`;}
async function verify(secret:string,token:string):Promise<Record<string,unknown>|null> {
  try {const [p,s,...rest]=token.split(".");if(rest.length || !s || !await equal(await hmac(secret,p),s)) return null;const d=JSON.parse(atob(p));return typeof d.exp==="number" && d.exp>Date.now()?d:null;}catch{return null;}
}
function cookie(r:Request,value:string,maxAge=28800) {return `video_admin=${value}; Path=/api/admin; HttpOnly; SameSite=Strict; Max-Age=${maxAge}${local(r)?"":"; Secure"}`;}
async function readBody(r:Request,max:number) {
  if(Number(r.headers.get("content-length"))>max) throw new Problem("文件或请求太大",413);
  const reader=r.body?.getReader(); if(!reader) return new Uint8Array();
  const chunks:Uint8Array[]=[];let total=0;
  while(true){const {done,value}=await reader.read();if(done)break;total+=value.length;if(total>max){await reader.cancel();throw new Problem("文件或请求太大",413);}chunks.push(value);}
  const out=new Uint8Array(total);let offset=0;for(const c of chunks){out.set(c,offset);offset+=c.length;}return out;
}
async function body(r:Request) {try{return JSON.parse(new TextDecoder().decode(await readBody(r,256*1024)));}catch(e){if(e instanceof Problem)throw e;throw new Problem("请求格式错误");}}
async function catalog(bucket:R2Bucket) {const object=await bucket.get(CATALOG);return object?{items:await object.json<ManagedVideo[]>(),version:object.etag}:{items:videoWorks.map(v=>({...v,visible:true})),version:"new"};}
function publicItem(v:ManagedVideo,r:Request) {const {visible:_,...item}=v;void _;if(local(r)){for(const k of ["src","poster"] as const)if(item[k]?.startsWith(MEDIA+"website-media/"))item[k]="/api/media/"+item[k]!.slice(MEDIA.length);}return item;}
function text(v:unknown,max:number) {if(typeof v!=="string"||!v.trim()||v.length>max)throw new Problem("请填写三行文字，且不要超过字数限制");return v.trim();}
function validateItems(input:unknown):ManagedVideo[] {
  if(!Array.isArray(input)||input.length>500)throw new Problem("作品列表无效");
  const ids=new Set<string>();
  return input.map(v=>{
    if(!v||typeof v.id!=="string"||!/^[a-zA-Z0-9-]{1,80}$/.test(v.id)||ids.has(v.id))throw new Problem("作品编号无效或重复");ids.add(v.id);
    if(typeof v.src!=="string"||!v.src.startsWith(MEDIA)||new URL(v.src).origin!==new URL(MEDIA).origin)throw new Problem("视频必须来自你的 R2 视频域名");
    if(v.poster && (typeof v.poster!=="string"||!(v.poster.startsWith("/images/")&&!v.poster.includes("..") || v.poster.startsWith(MEDIA+"website-media/")&&new URL(v.poster).origin===new URL(MEDIA).origin)))throw new Problem("封面地址无效");
    if(v.orientation!==undefined&&!["portrait","landscape"].includes(v.orientation))throw new Problem("请选择横屏或竖屏");
    if(typeof v.visible!=="boolean")throw new Problem("展示状态无效");
    return {id:v.id,title:text(v.title,80),category:text(v.category,40),description:text(v.description,160),src:v.src,poster:v.poster||undefined,orientation:v.orientation||"landscape",visible:v.visible};
  });
}
async function imageCatalog(bucket:R2Bucket) {
  const o=await bucket.get(IMAGE_CATALOG);
  return o?{items:await o.json<ManagedImage[]>(),version:o.etag}:{items:[] as ManagedImage[],version:"new"};
}
function validateImages(input:unknown):ManagedImage[] {
  if(!Array.isArray(input)||input.length>500)throw new Problem("图片列表无效");
  const ids=new Set<string>();
  return input.map(v=>{
    if(!v||typeof v.id!=="string"||!/^[a-zA-Z0-9-]{1,80}$/.test(v.id)||ids.has(v.id))throw new Problem("作品编号无效或重复");ids.add(v.id);
    if(typeof v.src!=="string"||!/^https:\/\/video\.autaksing\.com\/website-media\/[a-f0-9-]+\.(jpg|png|webp)$/.test(v.src))throw new Problem("请先上传有效图片");
    if(!Number.isInteger(v.width)||!Number.isInteger(v.height)||v.width<1||v.height<1||v.width>30000||v.height>30000||v.width*v.height>80000000)throw new Problem("图片尺寸无效或过大");
    if(typeof v.visible!=="boolean")throw new Problem("展示状态无效");
    return {id:v.id,category:text(v.category,40),title:text(v.title,80),description:text(v.description,160),src:v.src,width:v.width,height:v.height,visible:v.visible};
  });
}
export async function videoApi(r:Request,env:Env):Promise<Response|null> {
  const url=new URL(r.url),path=url.pathname;
  if(!path.startsWith("/api/admin/")&&path!=="/api/videos"&&path!=="/api/images"&&!path.startsWith("/api/media/"))return null;
  try {
    if(path==="/api/videos"&&r.method==="GET") {
      const data=env.VIDEOS?await catalog(env.VIDEOS):{items:videoWorks.map(v=>({...v,visible:true}))};
      return json({items:data.items.filter(v=>v.visible).map(v=>publicItem(v,r))});
    }
    if(path==="/api/images"&&r.method==="GET") {
      const data=env.VIDEOS?await imageCatalog(env.VIDEOS):{items:[]};
      return json({items:data.items.filter(v=>v.visible).map(v=>{const {visible,...item}=v;void visible;if(local(r))item.src="/api/media/"+item.src.slice(MEDIA.length);return item;})});
    }
    // Local previews read the emulated bucket; production serves media directly from the existing R2 domain.
    if(path.startsWith("/api/media/")) {
      if(!local(r)||!env.VIDEOS||!["GET","HEAD"].includes(r.method))return json({error:"不存在"},404);
      const key=path.slice(11);if(!/^website-media\/[a-f0-9-]+\.(mp4|jpg|png|webp)$/.test(key))return json({error:"不存在"},404);
      const o=await env.VIDEOS.get(key,{range:r.headers as unknown as WorkerHeaders});if(!o)return json({error:"不存在"},404);
      const h=new Headers({"Content-Type":o.httpMetadata?.contentType||"application/octet-stream","Accept-Ranges":"bytes","ETag":o.httpEtag});
      let status=200;let length=o.size;
      if(o.range&&"offset" in o.range){const start=o.range.offset||0;length=o.range.length||o.size;h.set("Content-Range",`bytes ${start}-${start+length-1}/${o.size}`);status=206;}
      h.set("Content-Length",String(length));return new Response(r.method==="HEAD"?null:o.body as unknown as BodyInit,{status,headers:h});
    }
    if(!env.VIDEOS||!env.ADMIN_USERNAME||!env.ADMIN_PASSWORD||env.ADMIN_PASSWORD.length<6)return json({error:"后台尚未配置管理员账号、密码或储存桶，请先完成设置。"},503);
    const signingKey=env.ADMIN_SESSION_SECRET||env.ADMIN_PASSWORD;
    if(signingKey.length<20)return json({error:"后台尚未配置会话密钥，请先完成设置。"},503);
    const authSecret=await hmac(signingKey,env.ADMIN_PASSWORD);
    if(r.method!=="GET"&&r.headers.get("origin")!==url.origin)throw new Problem("请求来源无效",403);
    if(path==="/api/admin/session"&&r.method==="POST") {
      if(!env.ADMIN_LOGIN_LIMITER)throw new Problem("登录保护尚未配置",503);
      if(!(await env.ADMIN_LOGIN_LIMITER.limit({key:r.headers.get("cf-connecting-ip")||"local"})).success)throw new Problem("尝试次数过多，请一分钟后再试",429);
      const d=await body(r);
      const usernameOK=await equal(typeof d?.username==="string"?d.username:"",env.ADMIN_USERNAME);
      const passwordOK=await equal(typeof d?.password==="string"?d.password:"",env.ADMIN_PASSWORD);
      if(!usernameOK||!passwordOK)throw new Problem("账号或密码不正确",401);
      return json({ok:true},200,{"Set-Cookie":cookie(r,await sign(authSecret,{kind:"session",username:env.ADMIN_USERNAME,exp:Date.now()+8*3600000}))});
    }
    const token=r.headers.get("cookie")?.match(/(?:^|;\s*)video_admin=([^;]+)/)?.[1]||"";
    const session=await verify(authSecret,token);if(session?.kind!=="session"||session.username!==env.ADMIN_USERNAME)throw new Problem("请先登录，或重新登录后继续",401);
    if(path==="/api/admin/session"&&r.method==="GET")return json({ok:true});
    if(path==="/api/admin/session"&&r.method==="DELETE")return json({ok:true},200,{"Set-Cookie":cookie(r,"",0)});
    if(path==="/api/admin/videos") {
      if(r.method==="GET")return json(await catalog(env.VIDEOS));
      if(r.method==="PUT") {
        const d=await body(r),items=validateItems(d.items);
        if(typeof d.version!=="string"||!d.version)throw new Problem("缺少版本信息");
        const existing=await catalog(env.VIDEOS);if(existing.version!==d.version)throw new Problem("其他页面已修改作品，请刷新后再保存",409);
        const oldIds=new Set(existing.items.map(v=>v.id));
        for(const v of items)if(!oldIds.has(v.id)) {
          if(!v.src.startsWith(MEDIA+"website-media/"))throw new Problem("请先上传视频");
          const o=await env.VIDEOS.head(v.src.slice(MEDIA.length));if(!o||o.httpMetadata?.contentType!=="video/mp4")throw new Problem("视频尚未完成上传");
        }
        const result=await env.VIDEOS.put(CATALOG,JSON.stringify(items),{httpMetadata:{contentType:"application/json"},onlyIf:d.version==="new"?{etagDoesNotMatch:"*"}:{etagMatches:d.version}});
        if(!result)throw new Problem("作品已被更新，请刷新后再保存",409);
        return json({items,version:result.etag});
      }
    }
    if(path==="/api/admin/images") {
      if(r.method==="GET")return json(await imageCatalog(env.VIDEOS));
      if(r.method==="PUT") {
        const d=await body(r),items=validateImages(d?.items);
        if(typeof d.version!=="string"||!d.version)throw new Problem("缺少版本信息");
        const existing=await imageCatalog(env.VIDEOS);if(existing.version!==d.version)throw new Problem("其他页面已修改图片，请刷新后再保存",409);
        for(const v of items){const o=await env.VIDEOS.head(v.src.slice(MEDIA.length));if(!o||!["image/jpeg","image/png","image/webp"].includes(o.httpMetadata?.contentType||""))throw new Problem("图片尚未上传完成");}
        const o=await env.VIDEOS.put(IMAGE_CATALOG,JSON.stringify(items),{httpMetadata:{contentType:"application/json"},onlyIf:d.version==="new"?{etagDoesNotMatch:"*"}:{etagMatches:d.version}});
        if(!o)throw new Problem("图片已被更新，请刷新后再保存",409);
        return json({items,version:o.etag});
      }
    }
    if(path==="/api/admin/image-upload"&&r.method==="POST") {
      const bytes=await readBody(r,20*1024*1024);
      let ext="",mime="";
      if(bytes[0]===255&&bytes[1]===216&&bytes[2]===255){ext="jpg";mime="image/jpeg";}
      else if([137,80,78,71,13,10,26,10].every((n,i)=>bytes[i]===n)){ext="png";mime="image/png";}
      else if(new TextDecoder().decode(bytes.slice(0,4))==="RIFF"&&new TextDecoder().decode(bytes.slice(8,12))==="WEBP"){ext="webp";mime="image/webp";}
      else throw new Problem("请选择 JPG、PNG 或 WebP 图片");
      const key=`website-media/${crypto.randomUUID()}.${ext}`;
      await env.VIDEOS.put(key,bytes,{httpMetadata:{contentType:mime}});return json({src:MEDIA+key});
    }
    if(path==="/api/admin/uploads"&&r.method==="POST") {
      const d=await body(r);if(!Number.isSafeInteger(d.size)||d.size<16||d.size>MAX)throw new Problem("请上传 2 GB 以内的 MP4 视频");
      const key=`website-media/${crypto.randomUUID()}.mp4`;
      const upload=await env.VIDEOS.createMultipartUpload(key,{httpMetadata:{contentType:"video/mp4"}});
      return json({token:await sign(authSecret,{kind:"upload",key,uploadId:upload.uploadId,size:d.size,exp:Date.now()+24*3600000}),chunkSize:CHUNK,src:MEDIA+key});
    }
    if(path==="/api/admin/poster"&&r.method==="POST") {
      const data=await readBody(r,2*1024*1024);if(data[0]!==255||data[1]!==216||data[2]!==255)throw new Problem("封面请使用 JPG 图片");
      const key=`website-media/${crypto.randomUUID()}.jpg`;await env.VIDEOS.put(key,data,{httpMetadata:{contentType:"image/jpeg"}});return json({poster:MEDIA+key});
    }
    if(path.startsWith("/api/admin/upload/")) {
      const cap=await verify(authSecret,r.headers.get("x-upload-token")||"");
      if(cap?.kind!=="upload"||typeof cap.key!=="string"||typeof cap.uploadId!=="string"||typeof cap.size!=="number")throw new Problem("上传凭证过期，请重新上传",403);
      const upload=env.VIDEOS.resumeMultipartUpload(cap.key,cap.uploadId),count=Math.ceil(cap.size/CHUNK);
      if(path==="/api/admin/upload/part"&&r.method==="PUT") {
        const n=Number(url.searchParams.get("part"));if(!Number.isInteger(n)||n<1||n>count)throw new Problem("分段编号无效");
        const bytes=await readBody(r,CHUNK),expected=n===count?cap.size-(count-1)*CHUNK:CHUNK;if(bytes.length!==expected)throw new Problem("分段不完整，请重试");
        if(n===1&&new TextDecoder().decode(bytes.slice(4,8))!=="ftyp")throw new Problem("文件不是有效的 MP4 视频");
        return json(await upload.uploadPart(n,bytes));
      }
      if(path==="/api/admin/upload/complete"&&r.method==="POST") {
        const d=await body(r);if(!Array.isArray(d.parts)||d.parts.length!==count||d.parts.some((p:{partNumber:number;etag:string},i:number)=>p.partNumber!==i+1||typeof p.etag!=="string"))throw new Problem("上传分段不完整");
        const already=await env.VIDEOS.head(cap.key);
        const o=already||await upload.complete(d.parts);if(o.size!==cap.size)throw new Problem("视频大小不匹配，请重新上传");return json({src:MEDIA+cap.key});
      }
      if(path==="/api/admin/upload/abort"&&r.method==="DELETE"){await upload.abort();return json({ok:true});}
    }
    return json({error:"不存在的操作"},404);
  }catch(e){if(e instanceof Problem)return json({error:e.message},e.status);console.error("Video admin request failed",e);return json({error:"保存或上传失败，请稍后重试。"},500);}
}
