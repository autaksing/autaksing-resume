import type { Metadata } from "next";
import PortfolioShell from "../PortfolioShell";
import Link from "next/link";
const cases = [
  {no:"01",href:"/cases/anzai",name:"「單身狗」安仔",type:"原創人物 IP",claim:"「從一首傳播作品建立一套持續營運的人物內容體系」",detail:"參與原創人物IP創意策劃、拍攝及後期製作，打造原創人物IP並持續營運帳號；內容在多平台傳播，並成功完成從公眾號時代向短影片時代的遷移。",stats:[{value:"1120萬+",label:"單條最高播放量"}],images:[{src:"/images/anzai-account.jpg",alt:"梁景安安仔抖音帳號主頁及作品數據"},{src:"/images/anzai-hit.jpg",alt:"單身狗安仔爆款作品頁面及互動數據"},{src:"/images/anzai-history.jpg",alt:"單身狗作品在微信公眾號時代的傳播報道"}],tags:["IP規劃","內容策略","拍攝執行","後期製作"]},
  {no:"02",href:"/cases/tang",name:"湯不唱",type:"音樂帳號孵化",claim:"「用特點與熱點建立可持續的內容方向」",detail:"參與帳號從0開始孵化，負責內容定位、創意策劃、拍攝製作及營運；策劃疫情露台演唱會，以真實場景和情緒價值創造傳播熱點。",stats:[{value:"0 → 70萬",label:"三個月粉絲增長"}],images:[{src:"/images/tang-account.jpg",alt:"湯不唱抖音帳號主頁及88.6萬粉絲數據"},{src:"/images/tang-grid.jpg",alt:"湯不唱系列作品矩陣及點讚數據"},{src:"/images/tang-hit.jpg",alt:"湯不唱小區演唱會爆款作品互動數據"}],tags:["帳號營運","內容策劃","影片導演","拍攝剪輯"]},
  {no:"03",href:"/cases/chen",name:"陳柏曦",type:"藝人品牌打造",claim:"「以港風電影感與街頭 Live 形成長期品牌識別」",detail:"參與帳號孵化，負責內容策劃、拍攝製作及直播營運；統一港風電影感、音樂風格與人物氣質，打造復古港風戶外直播。",stats:[{value:"1萬+",label:"直播最高同時在線人數"},{value:"5萬+",label:"場均直播音浪"}],images:[{src:"/images/chen-stage.jpg",alt:"陳柏曦舞台演出形象照"},{src:"/images/chen-live.jpg",alt:"陳柏曦復古街頭直播及萬人在線畫面"},{src:"/images/chen-account.jpg",alt:"陳柏曦帳號主頁及代表作品數據"}],tags:["品牌定位","內容策略","直播營運","視覺統一"]},
];


function ArrowIcon(){return <span aria-hidden="true">↗</span>}
function TrendArrow(){return <span className="trend-arrow" aria-hidden="true">→</span>}
export const metadata: Metadata = { title: "內容運營｜歐德星", description: "原創IP、音樂帳號孵化與藝人品牌案例。" };
export default function Page(){return <PortfolioShell title="內容運營" english="CONTENT OPERATIONS" intro="從內容定位到創作者孵化，讓創意成為能持續經營的品牌。">
    <section className="cases" id="cases"><header className="cases-head"><p className="eyebrow">04 / Selected Cases</p><h2>把一次內容機會<br/>轉化為長期品牌資產</h2><p>代表項目覆蓋原創人物IP、音樂帳號和藝人品牌，驗證內容方法在不同賽道的可遷移性。</p></header><div className="case-list">{cases.map(item=><article className="case" key={item.no}><div className="case-top"><span className="case-no">CASE {item.no}</span><span className="case-type">{item.type}</span></div><div className="case-main"><div><h3>{item.name}</h3><p className="case-claim">{item.claim}</p><p className="case-detail">{item.detail}</p></div><div className={`case-stats ${item.no==="03"?"combined":""}`}>{item.stats.map(stat=><div className="case-stat" key={stat.value}><strong>{stat.value==="0 → 70萬"?<span className="stat-transition"><b>0</b><TrendArrow/><b>70萬</b></span>:stat.value}</strong><span>{stat.label}</span></div>)}</div></div><div className="case-gallery">{item.images.map((image,index)=><figure key={image.src}><img src={image.src} alt={image.alt}/><figcaption>{String(index+1).padStart(2,"0")}</figcaption></figure>)}</div><p className="case-role-intro">整個項目中，我參與了</p><div className="case-tags">{item.tags.map(tag=><span key={tag}>{tag}</span>)}</div><Link className="case-detail-link" href={item.href}>案例詳情 <ArrowIcon/></Link></article>)}</div>
      <div className="more-projects"><p className="eyebrow">More Creator Projects</p><div className="more-project-grid"><article className="more-project-card image-right"><div className="more-project-copy"><span>劇情帳號</span><h3>福福是個戲精</h3><p>負責帳號定位、內容策劃、影片拍攝、後期製作，最終9.3萬粉絲。</p><Link className="case-detail-link" href="/cases/fufu">案例詳情 <ArrowIcon/></Link></div><div className="more-project-image"><img src="/images/fuma-account.jpg" alt="福福是個戲精帳號主頁及9.3萬粉絲數據"/></div></article><article className="more-project-card image-left"><div className="more-project-image"><img src="/images/kai-first.jpg" alt="王維鍇 Kai 帳號發佈的第一個作品"/></div><div className="more-project-copy"><span>音樂人冷啟動</span><h3>王維鍇 Kai</h3><p>負責帳號冷啟動、內容定位、內容策劃及影片拍攝，粉絲達到階段目標後由藝人自主營運，帳號後續成長至120萬粉絲。</p><Link className="case-detail-link" href="/cases/kai">案例詳情 <ArrowIcon/></Link></div></article></div></div>
    </section>


</PortfolioShell>;}
