import type { Metadata } from "next";
import PortfolioShell from "../PortfolioShell";
export const metadata: Metadata = { title: "AI應用｜歐德星", description: "自動化工作流、AI工具使用與效率優化。" };
export default function Page(){return <PortfolioShell title="AI應用" english="AI APPLICATIONS">
    <section className="portfolio-area" id="ai-creation" aria-labelledby="ai-creation-title"><span id="capabilities" className="portfolio-anchor" aria-hidden="true"/><header><p className="eyebrow">AI Applications</p><h2 id="ai-creation-title">AI應用</h2><p>把 AI 帶進日常工作，整理重複任務，探索更有效率的工具與流程。</p></header><div className="portfolio-area-details"><article><h3>自動化工作流</h3><p>梳理重複工作，把資料整理、內容處理與任務執行連接成可重用的流程。</p></article><article><h3>AI工具使用</h3><p>使用 Codex 輔助程式開發、工具製作與任務執行，結合 ChatGPT 進行資料整理及內容處理。</p></article><article><h3>效率優化</h3><p>結合實際需求，整理資訊、輔助執行，持續改善工作方式。</p></article></div></section>
</PortfolioShell>;}
