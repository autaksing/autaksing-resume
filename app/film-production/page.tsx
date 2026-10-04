import type { Metadata } from "next";
import PortfolioShell from "../PortfolioShell";
import VideoShowcase from "../VideoShowcase";
export const metadata: Metadata = { title: "影像製作｜歐德星", description: "活動宣傳與現場記錄，從拍攝到後期剪輯，以及AI生成影像。" };
export default function Page(){return <PortfolioShell title="影像製作" english="FILM PRODUCTION" intro="活動宣傳、現場記錄與內容影片，從創意策劃、拍攝執行到後期製作。"><VideoShowcase /><section className="portfolio-area" id="ai-imaging" aria-labelledby="ai-imaging-title"><header><p className="eyebrow">AI-generated Imagery</p><h2 id="ai-imaging-title">AI生成影像</h2><p>探索生成式影像，結合拍攝、剪輯與視覺設計，拓展影像表達。</p></header><div className="portfolio-area-details"><article><h3>創意與視覺探索</h3><p>用 AI 輔助構思畫面、風格與影像方向，為製作提供更多可能。</p></article><article><h3>影像製作整合</h3><p>探索生成素材與實拍、剪輯及後期包裝的結合方式。</p></article></div></section></PortfolioShell>;}
