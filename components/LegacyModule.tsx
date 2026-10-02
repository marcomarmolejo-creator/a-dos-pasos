"use client";

import { useEffect } from "react";

export function LegacyModule({ src }: { src: string }) {
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "module";
    script.src = `${src}?route=${Date.now()}`;
    document.body.appendChild(script);
    return () => script.remove();
  }, [src]);
  return null;
}
