import type { Metadata } from "next";
import PortfolioShell from "../PortfolioShell";
export const metadata: Metadata = { title: "視覺設計｜歐德星" };
export default function Page(){return <PortfolioShell title="視覺設計" english="VISUAL DESIGN">
    <section className="portfolio-area portfolio-area-design" id="graphic-design" aria-labelledby="graphic-design-title"><header><p className="eyebrow">Visual Design</p><h2 id="graphic-design-title">視覺設計</h2><p>把內容轉化為清楚、有辨識度的視覺，連接品牌與觀眾。</p></header><div className="portfolio-area-details"><article><h3>品牌與內容視覺</h3><p>字體、配色與版面規劃，建立一致的視覺表達。</p></article><article><h3>宣傳物料</h3><p>活動宣傳、海報與社交媒體版面，整理訊息與視覺層次。</p></article><article><h3>影像包裝</h3><p>影片封面、標題與圖文排版，讓內容更容易被看見。</p></article></div></section>
</PortfolioShell>;}
