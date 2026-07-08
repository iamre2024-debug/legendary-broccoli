import { useEffect, useState } from "react";

export const NATIVE_PORTAL_REFRESH_EVENT = "fa-native-portal-refresh";

export const DEFAULT_NATIVE_TARGET_SELECTORS = {
  grid: [".faContentGrid"],
  pagePanel: [".faPagePanel"],
  pageStack: [".faPagePanel .faStack", ".faPagePanel"]
};

export function readNativePortalTargets(selectors = DEFAULT_NATIVE_TARGET_SELECTORS) {
  if (typeof document === "undefined") return emptyTargets(selectors);

  return Object.fromEntries(
    Object.entries(selectors).map(([name, selectorList]) => [name, firstMatch(selectorList)])
  );
}

export function useNativePortalTargets({ selectors = DEFAULT_NATIVE_TARGET_SELECTORS, intervalMs = 650, events = [] } = {}) {
  const [targets, setTargets] = useState(() => readNativePortalTargets(selectors));

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const refresh = () => setTargets(readNativePortalTargets(selectors));

    refresh();
    const interval = window.setInterval(refresh, intervalMs);
    window.addEventListener("click", refresh, true);
    window.addEventListener("storage", refresh);
    window.addEventListener(NATIVE_PORTAL_REFRESH_EVENT, refresh);
    events.forEach((eventName) => window.addEventListener(eventName, refresh));

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("click", refresh, true);
      window.removeEventListener("storage", refresh);
      window.removeEventListener(NATIVE_PORTAL_REFRESH_EVENT, refresh);
      events.forEach((eventName) => window.removeEventListener(eventName, refresh));
    };
  }, [events, intervalMs, selectors]);

  return targets;
}

export function useNativeBodyClasses(classMap = {}) {
  useEffect(() => {
    if (typeof document === "undefined") return undefined;

    Object.entries(classMap).forEach(([className, isActive]) => {
      document.body.classList.toggle(className, Boolean(isActive));
    });

    return () => {
      Object.keys(classMap).forEach((className) => document.body.classList.remove(className));
    };
  }, [classMap]);
}

function firstMatch(selectorList = []) {
  return selectorList.reduce((match, selector) => match || document.querySelector(selector), null);
}

function emptyTargets(selectors) {
  return Object.fromEntries(Object.keys(selectors).map((name) => [name, null]));
}
