// Run only against Wrangler's local R2 emulator. Never runs against production.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const base='http://localhost:8787';
const password=readFileSync('.dev.vars','utf8').match(/^ADMIN_PASSWORD=(.+)$/m)?.[1];
assert(password,'Set ADMIN_PASSWORD in .dev.vars');
const username=readFileSync('.dev.vars','utf8').match(/^ADMIN_USERNAME=(.+)$/m)?.[1];
assert(username,'Set ADMIN_USERNAME in .dev.vars');
let cookie='';
async function req(path,method='GET',data,opts={}){
 const headers={...(method!=='GET'?{Origin:base}:{}),...(cookie?{Cookie:cookie}:{}),...opts.headers};
 let body=data;if(data&&!ArrayBuffer.isView(data)){body=JSON.stringify(data);headers['Content-Type']='application/json';}
 const r=await fetch(base+path,{method,headers,body});return {r,data:await r.json()};
}
let result=await req('/api/admin/videos');assert.equal(result.r.status,401);
result=await req('/api/admin/uploads','POST',{size:30});assert.equal(result.r.status,401);
result=await req('/api/admin/session','POST',{username,password},{headers:{Origin:'https://other.example'}});assert.equal(result.r.status,403);
result=await req('/api/admin/session','POST',{username:'wrong-user',password});assert.equal(result.r.status,401);
result=await req('/api/admin/session','POST',{username,password:'wrong-password'});assert.equal(result.r.status,401);
result=await req('/api/admin/session','POST',{username,password});assert.equal(result.r.status,200);cookie=result.r.headers.get('set-cookie').split(';')[0];assert.match(result.r.headers.get('set-cookie'),/HttpOnly; SameSite=Strict/);
const original=(await req('/api/admin/videos')).data;
result=await req('/api/admin/uploads','POST',{size:3*1024**3});assert.equal(result.r.status,400);
const size=8*1024*1024+1024;
const upload=(await req('/api/admin/uploads','POST',{size})).data;
assert(upload.token);const first=new Uint8Array(8*1024*1024);first.set(new TextEncoder().encode('ftyp'),4);
const headers={'x-upload-token':upload.token};
result=await req('/api/admin/upload/part?part=1','PUT',first.slice(0,8),{headers});assert.equal(result.r.status,400);
const p1=(await req('/api/admin/upload/part?part=1','PUT',first,{headers}));assert.equal(p1.r.status,200);
const p2=(await req('/api/admin/upload/part?part=2','PUT',new Uint8Array(1024),{headers}));assert.equal(p2.r.status,200);
result=await req('/api/admin/upload/complete','POST',{parts:[p1.data]},{headers});assert.equal(result.r.status,400);
result=await req('/api/admin/upload/complete','POST',{parts:[p1.data,p2.data]},{headers});assert.equal(result.r.status,200);
result=await req('/api/admin/upload/complete','POST',{parts:[p1.data,p2.data]},{headers});assert.equal(result.r.status,200,'completion can be retried');
const src=result.data.src;
result=await req('/api/admin/poster','POST',new Uint8Array([1,2,3]));assert.equal(result.r.status,400);
const work={id:'integration-test',title:'测试作品',category:'测试分类',description:'测试说明',orientation:'landscape',src,visible:true};
result=await req('/api/admin/videos','PUT',{version:original.version,items:[work,...original.items]});assert.equal(result.r.status,200);
let version=result.data.version;
result=await req('/api/videos');assert.equal(result.data.items[0].title,work.title);
const media=await fetch(base+result.data.items[0].src,{headers:{Range:'bytes=0-15'}});assert.equal(media.status,206);assert.equal((await media.arrayBuffer()).byteLength,16);
result=await req('/api/admin/videos','PUT',{version:original.version,items:original.items});assert.equal(result.r.status,409,'stale saves rejected');
result=await req('/api/admin/videos','PUT',{version,items:[{...work,visible:false},...original.items]});assert.equal(result.r.status,200);version=result.data.version;
result=await req('/api/videos');assert(!result.data.items.some(v=>v.id===work.id));
result=await req('/api/admin/videos','PUT',{version,items:original.items});assert.equal(result.r.status,200);
await req('/api/admin/session','DELETE');cookie='';assert.equal((await req('/api/admin/videos')).r.status,401);
const statuses=[];for(let i=0;i<6;i++)statuses.push((await req('/api/admin/session','POST',{username,password:'incorrect'})).r.status);assert(statuses.includes(429),'login attempts rate limited');
console.log('PASS: authentication, origin protection, upload limits, multipart upload and retry, range playback, metadata save, concurrent edit protection, visibility, logout.');
