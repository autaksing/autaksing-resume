// One-time migration from the local emulator to the owner's production website.
// Journal and credentials are kept exclusively in the ignored .wrangler directory.
import { readFileSync, writeFileSync, chmodSync } from 'node:fs';
import { Agent, fetch as httpFetch } from 'undici';
const dispatcher=new Agent({allowH2:false,connections:4});
const fetch=(url,options={})=>httpFetch(url,{...options,dispatcher});
const source='http://localhost:8787',target='https://www.autaksing.com';
const snapshot=JSON.parse(readFileSync('.wrangler/publish-snapshot.json','utf8'));
const secrets=JSON.parse(readFileSync('.wrangler/production-secrets.json','utf8'));
const journalPath='.wrangler/migration-state.json';
let state;try{state=JSON.parse(readFileSync(journalPath,'utf8'));}catch{state={media:{}};}
const persist=()=>{writeFileSync(journalPath,JSON.stringify(state,null,2));chmodSync(journalPath,0o600);};
let cookie='';
async function request(path,init={}) {
 const r=await fetch(target+path,{...init,headers:{Origin:target,...(cookie?{Cookie:cookie}:{}),...init.headers},signal:AbortSignal.timeout(120000)});
 if(!r.ok){const msg=await r.text();throw new Error(`${path}: ${r.status} ${msg.slice(0,200)}`);}return r;
}
const body=data=>({headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
const login=await request('/api/admin/session',{method:'POST',...body({username:secrets.ADMIN_USERNAME,password:secrets.ADMIN_PASSWORD})});
cookie=login.headers.get('set-cookie')?.split(';')[0];if(!cookie)throw new Error('Missing login session');
for(const kind of ['videos','images']){
 const remote=await(await request('/api/admin/'+kind)).json();
 if(state[kind+'Published'])continue;
 if(!state[kind+'Version']){state[kind+'Version']=remote.version;persist();}
 else if(state[kind+'Version']!==remote.version)throw new Error('Production catalog changed during migration; refusing overwrite');
}
const oldMedia='https://video.autaksing.com/';
for(const kind of ['videos','images'])for(const work of snapshot[kind].items){
 for(const field of ['src','poster']){
  const original=work[field];if(!original?.startsWith(oldMedia+'website-media/'))continue;
  const localURL=source+'/api/media/'+original.slice(oldMedia.length);
  const entry=state.media[original]||{};state.media[original]=entry;
  if(entry.done)continue;
  const head=await fetch(localURL,{method:'HEAD'});if(!head.ok)throw new Error('Missing local media: '+work.title);
  const size=Number(head.headers.get('content-length'));console.log(`Migrating ${work.title} ${field}: ${size} bytes`);
  if(original.endsWith('.mp4')){
   if(!entry.token){Object.assign(entry,await(await request('/api/admin/uploads',{method:'POST',...body({size})})).json(),{parts:[]});persist();}
   const count=Math.ceil(size/entry.chunkSize);
   const completed=new Map(entry.parts.filter(Boolean).map(p=>[p.partNumber,p]));let nextPart=1;
   async function sendParts(){
    while(true){
     const n=nextPart++;if(n>count)return;if(completed.has(n))continue;
     const start=(n-1)*entry.chunkSize,end=Math.min(size,start+entry.chunkSize)-1;
     const local=await fetch(localURL,{headers:{Range:`bytes=${start}-${end}`},signal:AbortSignal.timeout(120000)});
     if(!local.ok)throw new Error('Local range read failed');const bytes=await local.arrayBuffer();if(bytes.byteLength!==end-start+1)throw new Error('Invalid local chunk size');
     let part;
     for(let attempt=0;attempt<5;attempt++){
      try{part=await(await request(`/api/admin/upload/part?part=${n}`,{method:'PUT',headers:{'x-upload-token':entry.token},body:bytes})).json();break;}
      catch(e){if(attempt===4)throw e;console.log(`Retrying part ${n}: ${e.message}`);await new Promise(resolve=>setTimeout(resolve,(attempt+1)*1000));}
     }
     completed.set(n,part);entry.parts=[...completed.values()].sort((a,b)=>a.partNumber-b.partNumber);persist();
     if(completed.size===1||completed.size%5===0||completed.size===count)console.log(`Video upload ${Math.round(completed.size/count*100)}% (${completed.size}/${count})`);
    }
   }
   await Promise.all(Array.from({length:4},()=>sendParts()));
   const result=await(await request('/api/admin/upload/complete',{method:'POST',headers:{'Content-Type':'application/json','x-upload-token':entry.token},body:JSON.stringify({parts:entry.parts})})).json();entry.url=result.src;
  }else{
   const local=await fetch(localURL);if(!local.ok)throw new Error('Missing image');
   const endpoint=kind==='videos'?'/api/admin/poster':'/api/admin/image-upload';
   const result=await(await request(endpoint,{method:'POST',body:await local.arrayBuffer(),headers:{'Content-Type':local.headers.get('content-type')||'application/octet-stream'}})).json();entry.url=result.poster||result.src;
  }
  const published=await fetch(entry.url,{method:'HEAD',signal:AbortSignal.timeout(60000)});if(!published.ok||Number(published.headers.get('content-length'))!==size)throw new Error('Remote media verification failed');
  entry.done=true;persist();console.log('Verified media in production R2');
 }
}
for(const kind of ['videos','images']){
 if(state[kind+'Published'])continue;
 const items=snapshot[kind].items.map(item=>{const copy={...item};for(const field of ['src','poster'])if(state.media[copy[field]])copy[field]=state.media[copy[field]].url;return copy;});
 await request('/api/admin/'+kind,{method:'PUT',...body({items,version:state[kind+'Version']})});state[kind+'Published']=true;persist();console.log(`Published ${items.length} ${kind}`);
}
console.log('Migration complete. All referenced local media verified and catalogs published.');
