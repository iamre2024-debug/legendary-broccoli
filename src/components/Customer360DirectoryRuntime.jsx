import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import Customer360DirectoryPanel from "./Customer360DirectoryPanel.jsx";
import { loadState } from "../utils/storage.js";

const STORE = "fa-v3-interactive-investigator";
const key = (name) => `${STORE}:${name}`;

export default function Customer360DirectoryRuntime() {
  const [snapshot, setSnapshot] = useState(() => readSnapshot());
  const [target, setTarget] = useState(() => findTarget());

  const shouldShow = Boolean(target && snapshot.page === "customer360" && snapshot.activeCase);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const refresh = () => {
      setSnapshot(readSnapshot());
      setTarget(findTarget());
    };

    refresh();
    const interval = window.setInterval(refresh, 600);
    window.addEventListener("click", refresh, true);
    window.addEventListener("storage", refresh);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("click", refresh, true);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return undefined;
    document.body.classList.toggle("faCustomer360DirectoryReady", shouldShow);
    return () => document.body.classList.remove("faCustomer360DirectoryReady");
  }, [shouldShow]);

  const panel = useMemo(() => {
    if (!shouldShow) return null;
    return <Customer360DirectoryPanel activeCase={snapshot.activeCase} />;
  }, [shouldShow, snapshot.activeCase]);

  return shouldShow ? createPortal(panel, target) : null;
}

function readSnapshot() {
  const cases = loadState(key("cases"), []);
  const completed = loadState(key("completed"), []);
  const activeCaseId = loadState(key("activeCaseId"), cases[0]?.id);
  const activeCase = cases.find((item) => item.id === activeCaseId) || cases.find((item) => !completed.includes(item.id)) || cases[0] || null;

  return {
    cases,
    completed,
    activeCase,
    page: loadState(key("page"), "dashboard")
  };
}

function findTarget() {
  if (typeof document === "undefined") return null;
  return document.querySelector(".faPagePanel .faStack") || document.querySelector(".faPagePanel");
}
