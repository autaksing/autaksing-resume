import Link from "next/link";
import type { ReactNode } from "react";
import "./portfolio-directions.css";

const pages = [["/ip-operations", "內容運營"], ["/film-production", "影像製作"], ["/ai-creation", "AI應用"], ["/graphic-design", "視覺設計"]];

export default function PortfolioShell({title, english, intro, children}: {title:string; english:string; intro?:string; children:ReactNode}) {
  return <main className="portfolio-page">
    <nav className="nav" aria-label="作品導航"><Link className="brand" href="/" aria-label="AUTAKSING，返回首頁">AUTAKSING<span>.</span></Link><Link className="portfolio-return" href="/#directions">返回首頁 ↗</Link></nav>
    <header className="portfolio-page-heading"><p className="eyebrow">{english}</p><h1>{title}</h1>{intro && <p>{intro}</p>}</header>
    <nav className="portfolio-page-tabs" aria-label="四個創作方面">{pages.map(([href,label])=><Link href={href} key={href} aria-current={label===title?"page":undefined}>{label}<span aria-hidden="true">↗</span></Link>)}</nav>
    {children}
    <footer className="portfolio-page-footer"><Link href="/#directions">返回四個創作入口 ↑</Link><a href="mailto:autaksing0117@gmail.com">聯繫我 ↗</a><span>© 2026 AUTAKSING</span></footer>
  </main>;
}
