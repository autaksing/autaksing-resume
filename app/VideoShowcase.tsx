"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { videoWorks, type VideoWork } from "./video-works";

function VideoCard({work}: {work:VideoWork}) {
  const player = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (started) {
      player.current?.focus({preventScroll:true});
      void player.current?.play().catch(() => { /* Native controls remain available if autoplay is blocked. */ });
    }
  }, [started]);

  return <article className={`video-card${work.orientation === "portrait" ? " video-card-portrait" : ""}`}>
    {work.src ? started ? <div className="video-cover video-inline">
      <video ref={player} src={work.src} controls autoPlay playsInline preload="metadata" poster={work.poster} aria-label={work.title} tabIndex={0} onError={() => setFailed(true)} onPlaying={() => setFailed(false)}>
        你的瀏覽器不支援影片播放。
      </video>
    </div> : <button className="video-cover" onClick={() => setStarted(true)} aria-label={`播放影片：${work.title}`}>
      {work.poster ? <Image src={work.poster} alt="" width={work.orientation === "portrait" ? 540 : 1280} height={work.orientation === "portrait" ? 960 : 720} unoptimized sizes={work.orientation === "portrait" ? "(max-width: 820px) 280px, 28vw" : "(max-width: 820px) 90vw, 45vw"} /> : <span className="video-cover-title" aria-hidden="true">新興<br />馬拉松<small>{work.category}</small></span>}
      <span className="video-play" aria-hidden="true">▶</span>
    </button> : <div className="video-cover video-pending">
      {work.poster && <Image src={work.poster} alt={`${work.title}項目封面`} width={1280} height={720} unoptimized />}
      <span className="video-badge">影片即將上線</span>
    </div>}
    {failed && <div className="video-inline-error"><p role="alert">影片暫時無法播放，請稍後再試。</p><button type="button" onClick={() => {
      setFailed(false);
      player.current?.load();
      void player.current?.play().catch(() => setFailed(true));
    }}>重新播放</button></div>}
    <div className="video-meta"><span>{work.category}</span></div>
    <h3>{work.title}</h3>
    <p className="video-description">{work.description}</p>
    {work.caseHref && <Link className="video-case-link" href={work.caseHref}>了解項目 <span aria-hidden="true">↗</span></Link>}
  </article>;
}

export default function VideoShowcase() {
  const gallery = useRef<HTMLElement>(null);
  return <section ref={gallery} className="video-showcase" id="videos" aria-labelledby="videos-heading" onPlayCapture={(event) => {
    if (!(event.target instanceof HTMLVideoElement)) return;
    gallery.current?.querySelectorAll("video").forEach((video) => { if (video !== event.target) video.pause(); });
  }}>
    <header className="video-heading"><h3 id="videos-heading">影像作品</h3><p className="video-intro">活動記錄、展會與產品宣傳，以及探店影像。</p></header>
    <div className="video-grid">{videoWorks.filter(work => work.orientation !== "portrait").map(work => <VideoCard key={work.id} work={work} />)}</div>
    <div className="video-grid video-grid-portrait">{videoWorks.filter(work => work.orientation === "portrait").map(work => <VideoCard key={work.id} work={work} />)}</div>
  </section>;
}
