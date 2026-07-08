import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import SavedReportCenterPanel from "./SavedReportCenterPanel.jsx";
import { loadState } from "../utils/storage.js";

const STORE = "fa-v3-interactive-investigator";
const key = (name) => `${STORE}:${name}`;

export default function SavedReportCenterRuntime() {
  const [snapshot, setSnapshot] = useState(() => readSnapshot());
  const [target, setTarget] = useState(() => findTarget());

  const shouldShow = Boolean(target && snapshot.page === "evidence" && snapshot.activeCase);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const refresh = () => {
      setSnapshot(readSnapshot());
      setTarget(findTarget());
    };

    refresh();
    const interval = window.setInterval(refresh, 700);
    window.addEventListener("click", refresh, true);
    window.addEventListener("storage", refresh);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("click", refresh, true);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  return shouldShow ? createPortal(<SavedReportCenterPanel activeCase={snapshot.activeCase} />, target) : null;
}

function readSnapshot() {
  const cases = loadState(key("cases"), []);
  const completed = loadState(key("completed"), []);
  const activeCaseId = loadState(key("activeCaseId"), cases[0]?.id);
  const activeCase = cases.find((item) => item.id === activeCaseId) || cases.find((item) => !completed.includes(item.id)) || cases[0] || null;

  return {
    activeCase,
    page: loadState(key("page"), "dashboard")
  };
}

function findTarget() {
  if (typeof document === "undefined") return null;
  return document.querySelector(".faPagePanel .faStack") || document.querySelector(".faPagePanel");
}
