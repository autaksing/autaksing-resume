"use client";

import { useRef, useState } from "react";
import { videoWorks, type VideoWork } from "./video-works";

export default function VideoShowcase() {
  const dialog = useRef<HTMLDialogElement>(null);
  const player = useRef<HTMLVideoElement>(null);
  const [selected, setSelected] = useState<VideoWork | null>(null);
  const [failed, setFailed] = useState(false);

  function open(work: VideoWork) {
    setSelected(work);
    setFailed(false);
    dialog.current?.showModal();
  }

  function close() {
    player.current?.pause();
    dialog.current?.close();
    setSelected(null);
    setFailed(false);
  }

  return (
    <section className="video-showcase" id="videos" aria-labelledby="videos-heading">
      <header className="video-heading">
        <p className="eyebrow light-on-dark">05 / Selected Films</p>
        <h2 id="videos-heading">讓作品<br />自己說話</h2>
        <p className="video-intro">新興馬拉松 · 活動影像<br />從宣傳到現場記錄，用影像呈現活動的不同面貌。</p>
      </header>
      <div className="video-grid">
        {videoWorks.map((work, index) => (
          <article className="video-card" key={work.id}>
            {work.src ? (
              <button className="video-cover" onClick={() => open(work)} aria-label={`播放影片：${work.title}`} aria-haspopup="dialog">
                {work.poster ? <img src={work.poster} alt="" loading="lazy" /> : <span className="video-cover-title" aria-hidden="true">新興<br />馬拉松<small>{work.category}</small></span>}
                <span className="video-play" aria-hidden="true">▶</span>
                <span className="video-badge">播放影片</span>
              </button>
            ) : (
              <div className="video-cover video-pending">
                {work.poster && <img src={work.poster} alt={`${work.title}項目封面`} loading="lazy" />}
                <span className="video-badge">影片即將上線</span>
              </div>
            )}
            <div className="video-meta"><span>FILM {String(index + 1).padStart(2, "0")}</span><span>{work.category}</span></div>
            <h3>{work.title}</h3>
            <p className="video-description">{work.description}</p>
            {work.caseHref ? <a className="video-case-link" href={work.caseHref}>了解項目 <span aria-hidden="true">↗</span></a> : <a className="video-case-link" href={work.src} target="_blank" rel="noopener noreferrer">在新視窗播放 <span aria-hidden="true">↗</span></a>}
          </article>
        ))}
      </div>
      <dialog ref={dialog} className="video-dialog" aria-labelledby="video-dialog-title" onCancel={close} onClose={close} onClick={(event) => { if (event.target === event.currentTarget) close(); }}>
        {selected && <div className="video-dialog-content">
          <header><div><p>{selected.category}</p><h3 id="video-dialog-title">{selected.title}</h3></div><button className="video-close" onClick={close} aria-label="關閉影片">✕</button></header>
          <video ref={player} key={selected.id} controls playsInline preload="metadata" poster={selected.poster} onError={() => setFailed(true)}>
            <source src={selected.src} type="video/mp4" />
            你的瀏覽器不支援影片播放。
          </video>
          {failed && <p role="alert">影片暫時無法播放，請稍後再試。<a href={selected.src} target="_blank" rel="noopener noreferrer">在新視窗開啟影片 ↗</a></p>}
        </div>}
      </dialog>
    </section>
  );
}
