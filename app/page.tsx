import Link from "next/link";
import "./portfolio-directions.css";

const directions = [
  { title: "內容運營", english: "CONTENT OPERATIONS", description: "內容定位 · 創作者孵化 · 帳號增長", href: "/ip-operations" },
  { title: "影像製作", english: "FILM PRODUCTION", description: "拍攝剪輯 · 後期製作 · AI生成影像", href: "/film-production" },
  { title: "AI應用", english: "AI APPLICATIONS", description: "自動化工作流 · AI工具使用", href: "/ai-creation" },
  { title: "視覺設計", english: "VISUAL DESIGN", description: "品牌視覺 · 宣傳版面 · 內容包裝", href: "/graphic-design" },
];

const experiences = [
  {year:"2013—2014",company:"賽鉑互動",note:"廣東省廣告集團子公司 · 本土4A",role:"新媒體策劃",detail:"負責新媒體內容策劃、品牌傳播創意策劃、全案項目執行與落地。"},
  {year:"2014—2016",company:"歐氏兄弟影視工作室",note:"聯合創辦",role:"聯合創始人",detail:"負責企業宣傳片拍攝、創意短片策劃與製作、活動影片拍攝與製作、客戶項目溝通與執行。"},
  {year:"2016–2026",company:"聲輝傳媒",note:"影視工作室 2.0",role:"聯合創始人 · 內容負責人",detail:"聚焦原創內容、創作者IP孵化及品牌內容營銷；負責內容與創意方向、導演與拍攝、後期包裝、帳號孵化、短影片與直播營運、項目統籌及客戶溝通。"},
];

function ArrowIcon(){return <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 15 15 5M7 5h8v8"/></svg>}
function MailIcon(){return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="1"/><path d="m4 7 8 6 8-6"/></svg>}
function PhoneIcon(){return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.3 3.8 4.7 6.4c-.8.8.1 4.1 3.5 7.5s6.7 4.3 7.5 3.5l2.6-2.6-3.4-2.2-1.6 1.6c-1.3-.5-3-2.2-3.5-3.5l1.6-1.6-2.1-3.3Z"/></svg>}

export default function Home() {
  return <main>
    <nav className="nav" aria-label="主導航"><a className="brand" href="#top" aria-label="返回頂部">AUTAKSING<span>.</span></a><div className="nav-links"><a href="#about">關於</a><a href="#experience">經歷</a><Link href="/ip-operations">內容運營</Link><Link href="/film-production">影像製作</Link><a className="nav-contact" href="mailto:autaksing0117@gmail.com">聯繫我 <ArrowIcon/></a></div></nav>

    <section className="hero" id="top"><div className="hero-index" aria-hidden="true">01</div><div className="hero-orbit" aria-hidden="true"><span>CONTENT</span><span>CREATOR</span><span>GROWTH</span></div><div className="hero-name"><p className="eyebrow light hero-discipline">Content Strategy · Production<br/>Creator Growth</p><h1>歐德星</h1><p className="roman">AU TAK SING</p></div><div className="hero-copy"><p className="hero-lead">把創意變成真正<br/>有傳播力的內容</p><p className="hero-roles">內容策略 <i/> 內容製作 <i/> 創作者孵化</p><div className="hero-actions"><Link href="/ip-operations">查看代表案例 <span>↗</span></Link><div className="hero-contacts"><a href="mailto:autaksing0117@gmail.com"><MailIcon/><span>autaksing0117@gmail.com</span></a><a href="tel:+85256607600"><PhoneIcon/><span>+852 56607600</span></a></div></div></div></section>

    <section className="about" id="about"><div className="section-heading"><p className="eyebrow">02 / About</p><h2>不止製作內容<br/>更懂內容</h2><p className="heading-translation">Beyond content production<br/>I understand what makes content work</p></div><figure className="about-portrait"><img src="/images/profile-about.jpg" alt="歐德星個人形象照"/><figcaption>AU TAK SING · CONTENT CREATOR</figcaption></figure><div className="about-copy"><div className="about-paragraph"><span aria-hidden="true">1</span><p>擁有10年以上內容創作及影視製作經驗，長期參與原創IP打造、創作者帳號孵化及短影片內容營運，具備從內容定位、創意策劃、拍攝製作到帳號營運的完整經驗。</p></div><div className="about-paragraph"><span aria-hidden="true">2</span><p>曾參與打造多個具有代表性的原創人物IP及創作者帳號，覆蓋原創內容、劇情、音樂、直播等不同賽道，成功打造多個高傳播、高互動內容案例，並建立持續營運的內容體系。</p></div><div className="about-paragraph"><span aria-hidden="true">3</span><p>熟悉抖音、小紅書、微信視頻號、B站等內容生態，具備數據驅動的內容優化能力，同時持續關注AI在內容創作、營運效率及產品創新中的應用。</p></div></div></section>

    <nav id="directions" className="metrics portfolio-directions" aria-label="四個創作方面">{directions.map((item,index)=><Link className="metric direction-link" key={item.href} href={item.href}><span className="metric-no">0{index+1}</span><strong>{item.title}</strong><span className="direction-english" lang="en">{item.english}</span><p><span>{item.description.split(" · ").slice(0,item.href === "/ai-creation" ? 1 : 2).join(" · ")}</span><span>{item.description.split(" · ").slice(item.href === "/ai-creation" ? 1 : 2).join(" · ")}</span></p><span className="direction-arrow" aria-hidden="true">↗</span></Link>)}</nav>
    <div className="marquee" aria-hidden="true"><div>BUILD CREATOR BRANDS · BUILD CREATOR BRANDS · BUILD CREATOR BRANDS ·</div></div>

    <section className="experience" id="experience"><div className="experience-head"><p className="eyebrow light-on-dark">03 / Experience</p><h2>十餘年持續拓展<br/>內容工作的邊界</h2><p className="experience-intro">從廣告策劃到獨立製作再到內容負責人<br/>角色在變化但始終圍繞內容的傳播價值</p></div><div className="timeline">{experiences.map((item,index)=><article className="timeline-item" key={item.year}><span className="timeline-index">0{index+1}</span><p className="timeline-year">{item.year}</p><div><h3>{item.company}</h3><p className="timeline-note">{item.note}</p><p className="timeline-role">{item.role}</p><p className="timeline-detail">{item.detail}</p></div></article>)}</div></section>

    <section className="profile-details"><article><p className="eyebrow">Education</p><h3>暨南大學</h3><p>廣告學本科</p></article><article><p className="eyebrow">Language & Culture</p><h3>粵語 · 普通話 · 英語</h3><p>粵語（母語）｜普通話（流利）｜英語（工作交流）<br/>香港永久居民，在內地工作多年，熟悉香港及內地互聯網內容生態。</p></article><article><p className="eyebrow">AI & Tools</p><h3>全流程創作工具</h3><p>ChatGPT｜OpenAI Codex｜CapCut｜Premiere Pro｜After Effects｜DaVinci Resolve｜Photoshop｜Lightroom｜DJI航拍系統</p></article></section>

    <footer className="contact" id="contact"><p className="contact-kicker">LET&apos;S MAKE CONTENT MATTER</p><h2>讓創意真正<br/>產生傳播</h2><div className="contact-links"><a href="mailto:autaksing0117@gmail.com"><MailIcon/><span>autaksing0117@gmail.com</span></a><a href="tel:+85256607600"><PhoneIcon/><span>+852 56607600</span></a></div><div className="contact-foot"><span>歐德星 · AU TAK SING</span><span>香港永久居民</span><span>© 2026</span></div></footer>
  </main>;
}
