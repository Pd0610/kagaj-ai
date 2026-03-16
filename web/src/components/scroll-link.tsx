"use client";

import { type ComponentProps } from "react";

type ScrollLinkProps = Omit<ComponentProps<"a">, "href"> & {
  href: string;
};

export function ScrollLink({ href, onClick, children, ...props }: ScrollLinkProps) {
  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    if (href.startsWith("#")) {
      e.preventDefault();
      const el = document.getElementById(href.slice(1));
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        // Update URL without pushing history entry
        history.replaceState(null, "", href);
      }
    }
    onClick?.(e);
  }

  return (
    <a href={href} onClick={handleClick} {...props}>
      {children}
    </a>
  );
}
