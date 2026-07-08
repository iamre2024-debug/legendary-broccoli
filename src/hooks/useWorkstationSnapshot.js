import { useCallback, useEffect, useState } from "react";
import { readWorkstationSnapshot, WORKSTATION_STORAGE_EVENT } from "../data/workstationRuntimeState.js";

const NO_EXTRA_WORKSTATION_EVENTS = [];

export function useWorkstationSnapshot({ intervalMs = 650, events = NO_EXTRA_WORKSTATION_EVENTS } = {}) {
  const [snapshot, setSnapshot] = useState(() => readWorkstationSnapshot());
  const refresh = useCallback(() => setSnapshot(readWorkstationSnapshot()), []);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    refresh();
    const interval = window.setInterval(refresh, intervalMs);
    window.addEventListener("click", refresh, true);
    window.addEventListener("storage", refresh);
    window.addEventListener(WORKSTATION_STORAGE_EVENT, refresh);
    events.forEach((eventName) => window.addEventListener(eventName, refresh));

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("click", refresh, true);
      window.removeEventListener("storage", refresh);
      window.removeEventListener(WORKSTATION_STORAGE_EVENT, refresh);
      events.forEach((eventName) => window.removeEventListener(eventName, refresh));
    };
  }, [events, intervalMs, refresh]);

  return { snapshot, refresh };
}
