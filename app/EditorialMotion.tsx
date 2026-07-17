"use client";

import { useEffect } from "react";

const revealSelector = [
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

    const nav = document.querySelector<HTMLElement>(".nav, .case-page-nav");
    const progress = document.querySelector<HTMLElement>(".scroll-progress");
    const navLinks = Array.from(
      document.querySelectorAll<HTMLAnchorElement>(".nav-links a[href^='#']"),
    );
    const sections = navLinks
      .map((link) => {
        const id = link.getAttribute("href")?.slice(1);
        return id ? document.getElementById(id) : null;
      })
      .filter((section): section is HTMLElement => Boolean(section));

    let ticking = false;
    const updateScrollState = () => {
      const scrollTop = window.scrollY;
      const scrollRange = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = scrollRange > 0 ? Math.min(scrollTop / scrollRange, 1) : 0;

      nav?.classList.toggle("is-scrolled", scrollTop > 24);
      progress?.style.setProperty("--scroll-progress", String(ratio));

      let activeId = sections[0]?.id;
      sections.forEach((section) => {
        if (section.getBoundingClientRect().top <= window.innerHeight * 0.34) {
          activeId = section.id;
        }
      });
      navLinks.forEach((link) => {
        link.classList.toggle("is-active", link.getAttribute("href") === `#${activeId}`);
      });

      ticking = false;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(updateScrollState);
    };

    updateScrollState();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      root.classList.remove("motion-ready");
    };
  }, []);

  return <div className="scroll-progress" aria-hidden="true" />;
}
