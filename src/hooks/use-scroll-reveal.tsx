import * as React from "react";

const SELECTOR = ".rise, .scroll-reveal > *, .blur-text";

// Adds `is-visible` to every animated element once it scrolls into view, including
// elements rendered after mount (watched with a MutationObserver).
export function useScrollReveal() {
  React.useEffect(() => {
    const reveal = (el: Element) => el.classList.add("is-visible");
    if (!("IntersectionObserver" in window)) {
      document.querySelectorAll(SELECTOR).forEach(reveal);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          reveal(entry.target);
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.12 },
    );
    const watch = (el: Element) => {
      if (el.matches(SELECTOR) && !el.classList.contains("is-visible")) io.observe(el);
    };
    document.querySelectorAll(SELECTOR).forEach(watch);
    const mo = new MutationObserver((records) => {
      records.forEach((record) =>
        record.addedNodes.forEach((node) => {
          if (!(node instanceof Element)) return;
          watch(node);
          node.querySelectorAll(SELECTOR).forEach(watch);
        }),
      );
    });
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);
}
