import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import HomeNavigation from "./HomeNavigation";
import HeroFilm from "./HeroFilm";
import VideoShowcase from "./VideoShowcase";
import "./home.css";

export const metadata: Metadata = {
  title: "歐德星｜內容運營、拍攝剪輯、AI 與設計",
  description: "歐德星的個人作品集。探索內容運營與創作者孵化、影片拍攝與後期剪輯、AI 創作工作流及視覺設計。",
};

const creatorProjects = [
  { href: "/cases/anzai", name: "「單身狗」安仔", category: "原創人物 IP", description: "從人物定位、原創作品到持續營運，建立具有辨識度的內容體系。", image: "/images/home-anzai.jpg", imageAlt: "單身狗安仔代表作品及傳播數據", result: "1120萬+", resultLabel: "單條最高播放量" },
  { href: "/cases/tang", name: "湯不唱", category: "音樂帳號孵化", description: "參與帳號從零孵化，以音樂內容與露台演唱會連接觀眾。", image: "/images/home-tang.jpg", imageAlt: "湯不唱露台演唱會現場", result: "0 → 70萬", resultLabel: "三個月粉絲增長" },
  { href: "/cases/chen", name: "陳柏曦", category: "藝人品牌打造", description: "統一港風影像、音樂內容與街頭直播，塑造藝人品牌。", image: "/images/home-chen.jpg", imageAlt: "陳柏曦舞台演出", result: "1萬+", resultLabel: "直播最高同時在線" },
];

const aiWorkflows = [
  { title: "創意與內容", body: "用 AI 輔助資料整理、內容構思、腳本發想與創作方向探索。" },
  { title: "影像與視覺", body: "探索生成式影像，結合拍攝、剪輯與設計，拓展視覺表達。" },
  { title: "工具與工作流", body: "運用 ChatGPT 與 Codex，嘗試把重複工作整理成可執行的流程。" },
];

export default function Home() {
  return (
    <main className="home-page">
      <a className="home-skip-link" href="#areas">跳至作品板塊</a>
      <HomeNavigation />

      <section className="home-hero" id="top" aria-labelledby="hero-title">
        <div className="home-hero-topline"><p>歐德星 / AU TAK SING</p><p>FILM · OPERATIONS · AI · DESIGN</p></div>
        <h1 id="hero-title">REALITY IS<span>BEING EDITED.</span></h1>
        <HeroFilm />
        <div className="home-hero-bottom"><p>用影像、內容與設計，<br />讓想法成為值得被看見的作品。</p><a href="#areas">SCROLL TO EXPLORE <span aria-hidden="true">↓</span></a></div>
      </section>
      <header className="home-selected home-wrap"><p>作品與創作方向</p><h2>SELECTED<br />WORK.</h2></header>

      <nav className="home-directions home-wrap" id="areas" aria-label="四個創作板塊">
        <span id="capabilities" className="home-anchor" aria-hidden="true" />
        <a href="#operations"><strong>運營</strong><span>Creator Growth</span><i aria-hidden="true">↗</i></a>
        <a href="#production"><strong>拍攝剪輯</strong><span>Film & Editing</span><i aria-hidden="true">↗</i></a>
        <a href="#ai"><strong>AI</strong><span>Creative Workflow</span><i aria-hidden="true">↗</i></a>
        <a href="#design"><strong>設計</strong><span>Visual Design</span><i aria-hidden="true">↗</i></a>
      </nav>

      <section className="home-section home-production" id="production" aria-labelledby="production-title">
        <div className="home-wrap">
          <header className="home-section-heading">
            <h2 id="production-title">拍攝剪輯<span>Film & Editing</span></h2>
            <p>活動宣傳、現場記錄與內容影片，從拍攝執行到後期剪輯，完成影像製作。</p>
          </header>
          <ul className="home-production-skills" aria-label="影像製作能力"><li>創意策劃</li><li>導演與拍攝</li><li>剪輯與調色</li><li>後期包裝</li></ul>
          <VideoShowcase />
        </div>
      </section>

      <section className="home-section home-wrap home-operations" id="operations" aria-labelledby="operations-title">
        <span id="cases" className="home-anchor" aria-hidden="true" />
        <header className="home-section-heading">
          <h2 id="operations-title">運營<span>Creator Growth & Content</span></h2>
          <p>從內容定位到帳號孵化，讓一次創作機會，成為能持續經營的創作者品牌。</p>
        </header>
        <div className="home-operation-results" aria-label="內容運營成績">
          <div><strong>88.6萬</strong><span>孵化帳號最高粉絲規模</span></div>
          <div><strong>2000萬+</strong><span>單條作品最高播放量</span></div>
          <div><strong>1000萬+</strong><span>孵化帳號全平台累計點讚</span></div>
        </div>
        <div className="home-project-list">
          {creatorProjects.map((project) => (
            <Link className="home-project" key={project.href} href={project.href}>
              <div className="home-project-image"><Image src={project.image} alt={project.imageAlt} width={420} height={280} unoptimized sizes="(max-width: 767px) 40vw, 20vw" /></div>
              <div className="home-project-copy"><p>{project.category}</p><h3>{project.name}</h3><p>{project.description}</p></div>
              <div className="home-project-result"><strong>{project.result}</strong><span>{project.resultLabel}</span></div>
              <span className="home-project-arrow" aria-hidden="true">↗</span>
            </Link>
          ))}
        </div>
        <div className="home-more-projects"><p>更多創作者項目</p><Link href="/cases/fufu">福福是個戲精 <span aria-hidden="true">↗</span></Link><Link href="/cases/kai">王維鍇 Kai <span aria-hidden="true">↗</span></Link></div>
      </section>

      <section className="home-section home-wrap home-ai" id="ai" aria-labelledby="ai-title">
        <header className="home-section-heading"><h2 id="ai-title">AI<span>Creative Experiments</span></h2><p>把 AI 帶進內容、影像與工具製作，持續探索更有效率的創作方式。</p></header>
        <div className="home-ai-layout">
          <figure className="home-ai-image"><Image src="/images/ai-creative-concept.jpg" alt="玻璃、紙張與橙色膠片組成的 AI 創作概念圖" width={1536} height={1024} unoptimized sizes="(max-width: 767px) 90vw, 48vw" /><figcaption>AI 生成概念圖，作為創作方向示意。</figcaption></figure>
          <div className="home-ai-workflows">{aiWorkflows.map((item) => <article key={item.title}><h3>{item.title}</h3><p>{item.body}</p></article>)}<p className="home-tools">ChatGPT / OpenAI Codex / AI 輔助創作</p></div>
        </div>
      </section>

      <section className="home-section home-design" id="design" aria-labelledby="design-title">
        <div className="home-wrap">
          <header className="home-section-heading"><h2 id="design-title">設計<span>Visual & Digital Design</span></h2><p>把訊息整理成清楚的視覺，連接品牌、影像與數位介面。</p></header>
          <div className="home-design-layout">
            <div className="home-design-specimen" role="img" aria-label="AUTAKSING 本站視覺設計示例"><p>本站視覺系統</p><strong>AU TAK<br />SING<span>.</span></strong><div className="home-design-swatches" role="img" aria-label="橙色、深色及米白色的本站品牌配色"><span /><span /><span /></div></div>
            <div className="home-design-services"><article><h3>品牌與內容視覺</h3><p>整理字體、配色與版面，建立一致的內容識別。</p></article><article><h3>影像與宣傳物料</h3><p>封面、宣傳版面與影像包裝，讓訊息更清楚地呈現。</p></article><article><h3>網站與數位介面</h3><p>把內容結構與視覺表達整合，讓訪客更容易找到重點。</p></article><p className="home-tools">Photoshop / After Effects / 視覺排版</p></div>
          </div>
        </div>
      </section>

      <section className="home-section home-wrap home-about" id="about" aria-labelledby="about-title">
        <h2 id="about-title">關於我</h2>
        <div className="home-about-copy"><p>擁有 10 年以上內容創作及影視製作經驗，從廣告策劃、獨立製作到創作者孵化，持續拓展內容工作的邊界。</p><p>暨南大學廣告學本科，香港永久居民。粵語為母語，普通話流利，具備英語工作交流能力。</p>
          <details className="home-experience" id="experience"><summary>工作經歷 <span aria-hidden="true">＋</span></summary><div><article><span>2013-2014</span><h3>賽鉑互動</h3><p>新媒體策劃。廣東省廣告集團子公司，負責內容策劃、品牌傳播創意與項目執行。</p></article><article><span>2014-2016</span><h3>歐氏兄弟影視工作室</h3><p>聯合創始人。參與企業宣傳片、創意短片及活動影片策劃與製作。</p></article><article><span>2016 至今</span><h3>聲輝傳媒</h3><p>聯合創始人、內容負責人。聚焦原創 IP、創作者孵化與品牌內容，參與導演拍攝、後期製作及營運。</p></article></div></details>
        </div>
      </section>

      <footer className="home-footer" id="contact"><div className="home-wrap"><h2>一起做點<br />值得被看見的作品。</h2><a className="home-primary-link" href="mailto:autaksing0117@gmail.com">聯繫我 <span aria-hidden="true">↗</span></a><div className="home-footer-contacts"><a href="mailto:autaksing0117@gmail.com">autaksing0117@gmail.com</a><a href="tel:+85256607600">+852 56607600</a></div><div className="home-footer-bottom"><span>歐德星 / AU TAK SING</span><span>© 2026 AUTAKSING</span><a href="#top">返回頂部 ↑</a></div></div></footer>
    </main>
  );
}
