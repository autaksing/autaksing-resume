"use client";

import { useEffect } from "react";

const revealSelector = [
  ".home-section-heading",
  ".home-project",
  ".home-ai-layout",
  ".home-design-layout",
  ".home-about",
  ".video-card",
  ".hero-name",
  ".hero-copy",
  ".section-heading",
  ".about-portrait",
  ".about-paragraph",
  ".metric",
  ".experience-head",
  ".timeline-item",
  ".cases-head",
  ".case",
  ".more-project-card",
  ".capabilities-title",
  ".capability-grid article",
  ".profile-details article",
  ".contact-kicker",
  ".contact h2",
  ".contact-links",
  ".case-hero-copy",
  ".case-intro > *",
  ".editorial-gallery figure",
  ".case-section-heading > *",
  ".campaign-grid article",
  ".case-spread-head > *",
  ".spread-grid figure",
  ".series-grid article",
  ".case-migration > *",
  ".generic-result-copy",
  ".generic-gallery figure",
  ".case-contribution > *",
  ".case-closing > *",
].join(",");

export default function EditorialMotion() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("motion-ready");

    const revealItems = Array.from(
      document.querySelectorAll<HTMLElement>(revealSelector),
    );

    revealItems.forEach((item, index) => {
      item.classList.add("reveal");
      item.style.setProperty("--reveal-delay", `${(index % 4) * 70}ms`);
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -8% 0px" },
    );

    revealItems.forEach((item) => observer.observe(item));

    const navLinks = Array.from(
      document.querySelectorAll<HTMLAnchorElement>(".home-nav-links a[href^='#'], .nav-links a[href^='#']"),
    );
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          const active = link.getAttribute("href") === `#${entry.target.id}`;
          link.classList.toggle("is-active", active);
          if (active) link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-15% 0px -65% 0px", threshold: 0 });
    navLinks.forEach((link) => {
      const id = link.getAttribute("href")?.slice(1);
      const section = id ? document.getElementById(id) : null;
      if (section) sectionObserver.observe(section);
    });

    return () => {
      observer.disconnect();
      sectionObserver.disconnect();
      root.classList.remove("motion-ready");
    };
  }, []);

  return <div className="scroll-progress" aria-hidden="true" />;
}
