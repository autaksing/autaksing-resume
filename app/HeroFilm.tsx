"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function HeroFilm() {
  const player = useRef<HTMLVideoElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [paused, setPaused] = useState(true);
  const manualPause = useRef(false);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    const update = () => setEnabled(!preference.matches && !connection?.saveData);
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const video = player.current;
    const container = frame.current;
    if (!enabled || !video || !container) return;
    let visible = true;
    const sync = () => {
      if (!visible || document.hidden || manualPause.current) video.pause();
      else void video.play().catch(() => setPaused(true));
    };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
    observer.observe(container);
    document.addEventListener("visibilitychange", sync);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", sync); video.pause(); };
  }, [enabled]);

  return <div className="home-hero-film" ref={frame}>
    <Image src="/images/xinxing-marathon-promo.jpg" alt="新興馬拉松宣傳片中的城市與山景" fill priority unoptimized sizes="100vw" />
    {enabled && <video ref={player} src="/images/marathon-hero.mp4" muted loop playsInline preload="metadata" aria-hidden="true" onPlay={() => setPaused(false)} onPause={() => setPaused(true)} />}
    <div className="home-film-caption"><span>新興馬拉松 / 宣傳片</span><button type="button" aria-label={paused ? "播放背景影片" : "暫停背景影片"} onClick={() => {
      if (!enabled) { manualPause.current = false; setEnabled(true); }
      else if (paused) { manualPause.current = false; void player.current?.play().catch(() => setPaused(true)); }
      else { manualPause.current = true; player.current?.pause(); }
    }}>{paused ? "播放 ↗" : "暫停 Ⅱ"}</button></div>
  </div>;
}
