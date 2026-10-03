"use client";

import { useEffect } from "react";
import { getPublishedBusinesses, toDirectoryBusiness, type PublishedBusiness } from "@/lib/businesses";

declare global {
  interface Window { __PUBLISHED_BUSINESSES__?: ReturnType<typeof toDirectoryBusiness>[]; }
}

export function DirectoryBootstrap({ initialBusinesses }: { initialBusinesses: PublishedBusiness[] }) {
  useEffect(() => {
    let active = true;
    let script: HTMLScriptElement | null = null;

    const load = async () => {
      const liveBusinesses = await getPublishedBusinesses();
      if (!active) return;
      const businesses = liveBusinesses.length ? liveBusinesses : initialBusinesses;
      window.__PUBLISHED_BUSINESSES__ = businesses.map(toDirectoryBusiness);
      script = document.createElement("script");
      script.type = "module";
      script.src = `/legacy/directory.js?route=${Date.now()}`;
      document.body.appendChild(script);
    };

    load();
    return () => { active = false; script?.remove(); };
  }, [initialBusinesses]);

  return null;
}
