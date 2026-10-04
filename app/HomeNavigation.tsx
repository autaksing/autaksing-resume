"use client";

import { useState } from "react";

const links = [
  ["#operations", "運營"],
  ["#production", "拍攝剪輯"],
  ["#ai", "AI"],
  ["#design", "設計"],
  ["#about", "關於"],
];

export default function HomeNavigation() {
  const [expanded, setExpanded] = useState(false);

  return (
    <nav className="home-nav" aria-label="主導航" onKeyDown={(event) => {
      if (event.key === "Escape") {
        setExpanded(false);
        event.currentTarget.querySelector<HTMLButtonElement>(".home-menu-toggle")?.focus();
      }
    }}>
      <a className="brand" href="#top" aria-label="AUTAKSING，返回頂部" onClick={() => setExpanded(false)}>AUTAKSING<span>.</span></a>
      <button className="home-menu-toggle" type="button" aria-expanded={expanded} aria-controls="home-nav-links" onClick={() => setExpanded(!expanded)}>{expanded ? "關閉" : "目錄"}</button>
      <div className={`home-nav-links${expanded ? " is-open" : ""}`} id="home-nav-links">
        {links.map(([href, label]) => <a key={href} href={href} onClick={() => setExpanded(false)}>{label}</a>)}
        <a className="home-contact-button" href="mailto:autaksing0117@gmail.com" onClick={() => setExpanded(false)}>聯繫我 <span aria-hidden="true">↗</span></a>
      </div>
    </nav>
  );
}
