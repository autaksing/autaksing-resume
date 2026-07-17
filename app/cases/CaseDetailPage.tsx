type Point = { no:string; title:string; copy:string };
type Metric = { value:string; label:string };
type DetailImage = { src:string; alt:string; caption:string; format?:"portrait"|"landscape" };
type CaseDetailProps = { no:string; name:string; category:string; heroLine:string; backgroundTitle:[string,string]; background:string[]; backgroundImages?:DetailImage[]; campaignTitle:[string,string]; campaignIntro:string; campaignLeadImages?:DetailImage[]; points:Point[]; campaignFooterImages?:DetailImage[]; resultTitle:[string,string]; resultCopy:string; metrics:Metric[]; images?:DetailImage[]; contribution:string[]; closing:[string,string]; closingSmall:[string,string] };

const caseSequence = [
  {no:"01",name:"「單身狗」安仔",href:"/cases/anzai"},
  {no:"02",name:"湯不唱",href:"/cases/tang"},
  {no:"03",name:"陳柏曦",href:"/cases/chen"},
  {no:"04",name:"王維鍇 Kai",href:"/cases/kai"},
  {no:"05",name:"福福是個戲精",href:"/cases/fufu"},
];

function ArrowIcon(){return <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 15 15 5M7 5h8v8"/></svg>}

function EditorialGallery({images,placement}:{images?:DetailImage[];placement:string}){
  if(!images?.length)return null;
  return <div className={`editorial-gallery count-${images.length} ${placement}`}>{images.map((image,index)=><figure className={image.format==="landscape"?"landscape":"portrait"} key={image.src}><img src={image.src} alt={image.alt}/><figcaption>{String(index+1).padStart(2,"0")} / {image.caption}</figcaption></figure>)}</div>
}

export default function CaseDetailPage(props:CaseDetailProps){
  const currentIndex=caseSequence.findIndex(item=>item.no===props.no);
  const previous=currentIndex>0?caseSequence[currentIndex-1]:null;
  const next=currentIndex<caseSequence.length-1?caseSequence[currentIndex+1]:null;
  return <main className={`case-page generic-case case-${props.no}`}>
  <nav className="case-page-nav"><a className="brand" href="/">AUTAKSING<span>.</span></a><a className="case-back" href="/#cases">返回案例 <ArrowIcon/></a></nav>
  <header className="case-hero generic-case-hero"><span className="case-hero-index">CASE {props.no}</span><div className="case-hero-copy"><p className="eyebrow light">{props.category}</p><h1>{props.name}</h1><p>{props.heroLine}</p></div></header>
  <section className="case-intro"><div><p className="eyebrow">Project Background</p><h2>{props.backgroundTitle[0]}<br/>{props.backgroundTitle[1]}</h2></div><div className="case-intro-copy">{props.background.map(p=><p key={p}>{p}</p>)}</div></section>
  <EditorialGallery images={props.backgroundImages} placement="after-background"/>
  <section className="case-campaign"><div className="case-section-heading"><p className="eyebrow">Strategy / Campaign</p><h2>{props.campaignTitle[0]}<br/>{props.campaignTitle[1]}</h2><p>{props.campaignIntro}</p></div><EditorialGallery images={props.campaignLeadImages} placement="campaign-lead"/><div className="campaign-grid">{props.points.map(point=><article key={point.no}><span>{point.no}</span><h3>{point.title}</h3><p>{point.copy}</p></article>)}</div><EditorialGallery images={props.campaignFooterImages} placement="campaign-footer"/></section>
  <section className={`generic-result ${props.images?.length?"has-gallery":"no-gallery"}`}><div className="generic-result-copy"><p className="eyebrow light-on-dark">Result / Growth</p><h2>{props.resultTitle[0]}<br/>{props.resultTitle[1]}</h2><p>{props.resultCopy}</p><div className="generic-metrics">{props.metrics.map(metric=><article key={metric.label}><strong>{metric.value}</strong><span>{metric.label}</span></article>)}</div></div>{props.images?.length?<div className={`generic-gallery count-${props.images.length} ${props.images.length===1?"single":""}`}>{props.images.map((image,index)=><figure className={image.format==="landscape"?"landscape":"portrait"} key={image.src}><img src={image.src} alt={image.alt}/><figcaption>{String(index+1).padStart(2,"0")} / {image.caption}</figcaption></figure>)}</div>:null}</section>
  <section className="case-contribution"><div><p className="eyebrow">My Contribution</p><h2>整個項目中<br/>我參與了</h2></div><div className="contribution-list">{props.contribution.map(item=><span key={item}>{item}</span>)}</div></section>
  <blockquote className="case-closing"><p><span>{props.closing[0]}</span><span>{props.closing[1]}</span></p><small><span>「{props.closingSmall[0]}</span><span>{props.closingSmall[1]}」</span></small></blockquote>
  <footer className="case-page-footer case-navigation">
    <div>{previous?<a className="case-nav-link previous" href={previous.href}><small>Previous / Case {previous.no}</small><strong>← {previous.name}</strong></a>:null}</div>
    <a className="all-cases-link" href="/#cases">返回所有案例</a>
    <div>{next?<a className="case-nav-link next" href={next.href}><small>Next / Case {next.no}</small><strong>{next.name} →</strong></a>:null}</div>
  </footer>
</main>}
