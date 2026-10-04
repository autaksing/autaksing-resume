"use client";

import { useEffect, useRef, useState } from "react";
import "./language-switch.css";

type Language = "traditional" | "simplified";
type SavedText = { source:string; rendered:string };
const preferenceKey = "autaksing-language";
const skip = "script,style,code,pre,[translate='no'],[data-language-control]";

export default function LanguageSwitch() {
  const [language, setLanguage] = useState<Language>("traditional");
  const manualChoice = useRef(false);
  const texts = useRef(new WeakMap<Text, SavedText>());
  const attributes = useRef(new WeakMap<Element, Map<string, SavedText>>());

  useEffect(() => {
    const controller = new AbortController();
    const frame = requestAnimationFrame(() => {
      async function initialize() {
        try {
          const saved = localStorage.getItem(preferenceKey);
          if (saved === "simplified" || saved === "traditional") { setLanguage(saved); return; }
        } catch { /* Region defaults still work without browser storage. */ }
        try {
          const response = await fetch("/api/visitor-language", {cache:"no-store",signal:controller.signal});
          if (!response.ok) return;
          const result = await response.json();
          if (!controller.signal.aborted && !manualChoice.current && (result.language === "simplified" || result.language === "traditional")) setLanguage(result.language);
        } catch { /* Keep Traditional Chinese when region detection is unavailable. */ }
      }
      void initialize();
    });
    const sync = (event:StorageEvent) => {
      if (event.key === preferenceKey) { manualChoice.current = true; setLanguage(event.newValue === "simplified" ? "simplified" : "traditional"); }
    };
    window.addEventListener("storage", sync);
    return () => { cancelAnimationFrame(frame); controller.abort(); window.removeEventListener("storage", sync); };
  }, []);

  useEffect(() => {
    let stopped = false;
    let observer:MutationObserver | undefined;
    async function start() {
      const convert = language === "simplified" ? (await import("opencc-js/t2cn")).Converter({from:"hk",to:"cn"}) : (value:string) => value;
      if (stopped) return;
      const options:MutationObserverInit = {subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:["aria-label","alt","title","placeholder"]};
      const apply = () => {
        observer?.disconnect();
        document.documentElement.lang = language === "simplified" ? "zh-Hans" : "zh-Hant";
        const walker = document.createTreeWalker(document.documentElement, NodeFilter.SHOW_TEXT);
        while (walker.nextNode()) {
          const node = walker.currentNode as Text;
          if (node.parentElement?.closest(skip)) continue;
          const value = node.data;
          const previous = texts.current.get(node);
          if (!previous && !/[\u3400-\u9fff]/u.test(value)) continue;
          const source = previous && previous.rendered === value ? previous.source : value;
          const rendered = convert(source);
          texts.current.set(node, {source,rendered});
          if (value !== rendered) node.data = rendered;
        }
        document.querySelectorAll("[aria-label],[alt],[title],[placeholder]").forEach(element => {
          if (element.closest(skip)) return;
          const saved = attributes.current.get(element) ?? new Map<string,SavedText>();
          for (const name of ["aria-label","alt","title","placeholder"]) {
            const value = element.getAttribute(name);
            if (value === null) continue;
            const previous = saved.get(name);
            const source = previous && previous.rendered === value ? previous.source : value;
            const rendered = convert(source);
            saved.set(name,{source,rendered});
            if (value !== rendered) element.setAttribute(name,rendered);
          }
          attributes.current.set(element,saved);
        });
        if (!stopped) observer?.observe(document.documentElement, options);
      };
      observer = new MutationObserver(apply);
      apply();
    }
    void start();
    return () => { stopped = true; observer?.disconnect(); };
  }, [language]);

  function choose(value:Language) {
    manualChoice.current = true;
    setLanguage(value);
    try { localStorage.setItem(preferenceKey,value); } catch { /* Continue without persisting the preference. */ }
  }

  return <div className="language-switch" role="group" aria-label="中文繁簡切換" data-language-control translate="no">
    <button type="button" lang="zh-Hant" aria-pressed={language === "traditional"} onClick={() => choose("traditional")}>繁體</button>
    <span aria-hidden="true">/</span>
    <button type="button" lang="zh-Hans" aria-pressed={language === "simplified"} onClick={() => choose("simplified")}>简体</button>
  </div>;
}
