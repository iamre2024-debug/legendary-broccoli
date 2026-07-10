import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { toolNavByLane } from "../data/fraudAcademyEngine.js";
import { loadSavedReports, reportsForCase } from "../data/savedReportCenter.js";
import { readWorkstationSnapshot } from "../data/workstationRuntimeState.js";
import { loadState } from "../utils/storage.js";

const STORE = "fa-v3-interactive-investigator";
const key = (name) => `${STORE}:${name}`;

export default function EvidenceDebriefRuntime() {
  const [snapshot, setSnapshot] = useState(() => readWorkstationSnapshot());
  const [target, setTarget] = useState(() => findTarget());
  const activeCase = snapshot.activeCase;
  const completed = Boolean(activeCase && snapshot.completed?.includes(activeCase.id));
  const notesMap = loadState(key("notes"), {});
  const notes = activeCase ? notesMap[activeCase.id] || "" : "";
  const reports = useMemo(() => reportsForCase(activeCase?.id, loadSavedReports()), [activeCase?.id, snapshot.page]);
  const review = useMemo(() => buildDebriefReview({ snapshot, notes, reports, completed }), [snapshot, notes, reports, completed]);
  const shouldShow = Boolean(target && snapshot.page === "debrief" && activeCase);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const refresh = () => { setSnapshot(readWorkstationSnapshot()); setTarget(findTarget()); };
    refresh();
    const interval = window.setInterval(refresh, 700);
    window.addEventListener("click", refresh, true);
    window.addEventListener("storage", refresh);
    return () => { window.clearInterval(interval); window.removeEventListener("click", refresh, true); window.removeEventListener("storage", refresh); };
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return undefined;
    document.body.classList.toggle("faEvidenceDebriefReady", shouldShow);
    return () => document.body.classList.remove("faEvidenceDebriefReady");
  }, [shouldShow]);

  if (!shouldShow) return null;

  return createPortal(
    <section className="faGlass faEvidenceDebrief" aria-label="Evidence based senior debrief">
      <div className="faEvidenceDebriefHeader"><div><span className="faEyebrow">Senior Evidence Debrief</span><h3>{completed ? review.heading : "Debrief locked"}</h3><p>{completed ? review.summary : "Submit the determination and written justification first. No answer leaks before the learner finishes the investigation."}</p></div><strong>{completed ? review.qaScore : "Locked"}</strong></div>
      {completed ? <>
        <div className="faEvidenceDebriefStats"><span><b>{review.reviewedCount}</b>tools reviewed</span><span><b>{reports.length}</b>saved reports</span><span><b>{review.actionCount}</b>actions logged</span></div>
        <div className="faEvidenceDebriefGrid"><DebriefSection title="Decision comparison" items={review.decisionItems} /><DebriefSection title="Evidence support" items={review.supportItems} /><DebriefSection title="Documentation quality" items={review.documentationItems} /><DebriefSection title="Open coaching points" items={review.coachingItems} /></div>
        <section className="faEvidenceDebriefSection"><h4>Eight-category QA scorecard</h4><div className="faQaCategoryGrid">{review.categories.map((item) => <article key={item.label}><span>{item.label}</span><strong>{item.score}%</strong><small>{item.note}</small></article>)}</div></section>
      </> : <p className="faEvidenceDebriefGuardrail">Evidence First rule active. Senior reference, QA score, and coaching stay hidden until the case is completed.</p>}
    </section>, target
  );
}

function DebriefSection({ title, items = [] }) { return <section className="faEvidenceDebriefSection"><h4>{title}</h4><ul>{items.map((item) => <li key={item}>{item}</li>)}</ul></section>; }

function buildDebriefReview({ snapshot, notes, reports, completed }) {
  const activeCase = snapshot.activeCase || {};
  const determination = snapshot.determinations?.[activeCase.id] || "";
  const justification = snapshot.justifications?.[activeCase.id] || "";
  const reviewed = snapshot.reviewedTools?.[activeCase.id] || [];
  const indicators = snapshot.indicators?.[activeCase.id] || { suspicious: [], normal: [] };
  const actions = snapshot.actionLog?.[activeCase.id] || [];
  const laneTools = toolNavByLane[activeCase.lane] || [];
  const matched = completed && determination === activeCase.correctDetermination;
  const missingTools = laneTools.filter((tool) => !reviewed.includes(tool.id));
  const notesLines = notes.split("\n").map((line) => line.trim()).filter(Boolean);
  const docActions = actions.filter((action) => ["ReportSaved", "ReportDeleted", "RequestDocs"].includes(action.actionType));
  const categories = buildCategoryScores({ matched, reviewed, laneTools, reports, justification, indicators, missingTools, notesLines, actions, activeCase });
  const qaScore = Math.round(categories.reduce((sum, item) => sum + item.score, 0) / categories.length);

  return {
    heading: matched ? "Determination aligned with evidence" : "Reasoning needs review",
    summary: matched ? "The selected outcome matches the senior reference. Review why the evidence and documentation support that result." : "The selected outcome differs from the senior reference. Review the evidence gaps, sequence, and documentation before retrying similar cases.",
    qaScore: `${Math.max(70, Math.min(98, qaScore))}%`,
    reviewedCount: reviewed.length,
    actionCount: actions.length,
    categories,
    decisionItems: [`Learner outcome: ${determination || "No outcome selected"}`, `Senior reference: ${activeCase.correctDetermination || "Reference pending"}`, `Justification length: ${justification.trim().length} characters`, matched ? "Decision match: aligned" : "Decision match: not aligned"],
    supportItems: [`${reviewed.length} of ${laneTools.length} lane tools marked reviewed.`, reports.length ? `${reports.length} saved report(s) available in Report Center.` : "No saved report was attached to the case.", `${(indicators.suspicious || []).length} suspicious and ${(indicators.normal || []).length} normal indicators selected.`, missingTools.length ? `Unreviewed tool gap: ${missingTools.slice(0, 3).map((tool) => tool.label || tool.id).join(", ")}` : "All lane tools were marked reviewed."],
    documentationItems: [notesLines.length ? `${notesLines.length} investigator note line(s) saved.` : "No investigator notes saved before determination.", docActions.length ? `${docActions.length} report/document action(s) logged to the timeline.` : "No report or document request actions were logged.", justification.trim().length >= 80 ? "Justification gives enough room for evidence reasoning." : "Justification may be too thin for audit defensibility.", activeCase.debrief || "Senior debrief narrative pending."],
    coachingItems: buildCoachingItems({ matched, missingTools, reports, notesLines, indicators, justification })
  };
}

function buildCategoryScores({ matched, reviewed, laneTools, reports, justification, indicators, missingTools, notesLines, actions, activeCase }) {
  const coverage = laneTools.length ? reviewed.length / laneTools.length : 0;
  const suspiciousCount = (indicators.suspicious || []).length;
  const normalCount = (indicators.normal || []).length;
  const timelineActions = actions.filter((action) => ["ReviewTransaction", "OpenTool", "MarkToolReviewed", "ReportSaved", "RequestDocs"].includes(action.actionType)).length;
  const escalationAligned = /Escalate|Refer|Hold|Support|Approve|Maintain|Reduce|Insufficient|Request/i.test(activeCase.correctDetermination || "") ? matched : true;
  return [
    category("Evidence reviewed", clamp(60 + coverage * 40 - (missingTools.length > 2 ? 8 : 0)), `${reviewed.length}/${laneTools.length} lane tools reviewed`),
    category("Indicator selection", clamp(60 + Math.min(20, (suspiciousCount + normalCount) * 5) + (suspiciousCount && normalCount ? 15 : 0)), `${suspiciousCount} suspicious, ${normalCount} normal`),
    category("Timeline understanding", clamp(65 + Math.min(30, timelineActions * 4)), `${timelineActions} sequence-relevant actions logged`),
    category("Quality of notes", clamp(60 + Math.min(35, notesLines.length * 8)), `${notesLines.length} note lines saved`),
    category("Strength of justification", clamp(55 + Math.min(40, justification.trim().length / 3)), `${justification.trim().length} justification characters`),
    category("Correct escalation path", escalationAligned ? 92 : 68, escalationAligned ? "Outcome/escalation aligned" : "Review escalation path"),
    category("Consideration of normal activity", normalCount ? clamp(75 + normalCount * 5) : 60, normalCount ? "Normal evidence documented" : "No normal indicators selected"),
    category("Consideration of suspicious activity", suspiciousCount ? clamp(75 + suspiciousCount * 5) : 60, suspiciousCount ? "Suspicious evidence documented" : "No suspicious indicators selected")
  ];
}

function category(label, score, note) { return { label, score: Math.round(score), note }; }
function clamp(value) { return Math.max(60, Math.min(98, value)); }

function buildCoachingItems({ matched, missingTools, reports, notesLines, indicators, justification }) {
  const items = [];
  if (!matched) items.push("Compare the customer story, timeline sequence, and tool records before changing outcomes.");
  if (missingTools.length) items.push("Mark all lane-critical tools reviewed before submitting on a similar case.");
  if (!reports.length) items.push("Save at least one relevant report preview when a search-heavy tool supports the decision.");
  if (!notesLines.length) items.push("Use notes to explain contradictions, missing evidence, and why the decision is defensible.");
  if (!((indicators.suspicious || []).length + (indicators.normal || []).length)) items.push("Select both suspicious and normal indicators when the evidence supports them.");
  if (justification.trim().length < 80) items.push("Write a fuller justification with evidence, open gaps, and timeline fit.");
  if (!items.length) items.push("Strong workflow. Keep tying every conclusion back to evidence, not instinct.");
  return items;
}

function findTarget() { if (typeof document === "undefined") return null; return document.querySelector(".faPagePanel"); }
