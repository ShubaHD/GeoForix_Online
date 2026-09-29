"use client";

import { useEffect } from "react";

/** Unregister leftover service workers that can break fetch during local dev. */
export function ServiceWorkerCleanup() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    void navigator.serviceWorker.getRegistrations().then((regs) => {
      for (const reg of regs) void reg.unregister();
    });
  }, []);
  return null;
}
