import { loadState, saveState } from "../utils/storage.js";

export const SAVED_REPORTS_KEY = "fa-v3-interactive-investigator:savedReports";
export const REPORT_CENTER_GUARDRAIL = "Saved reports are fictional training artifacts. They preserve evidence context and lookup/report previews, but they do not reveal or decide the case outcome.";
const MAX_REPORTS = 80;

export function loadSavedReports() {
  const reports = loadState(SAVED_REPORTS_KEY, []);
  return Array.isArray(reports) ? reports : [];
}

export function saveReportPreview({ activeCase = {}, preview = null, source = "lookup", sourceRecord = null, query = "" } = {}) {
  if (!preview || !activeCase?.id) return null;

  const report = buildReportRecord({ activeCase, preview, source, sourceRecord, query });
  const existing = loadSavedReports();
  const nextReports = [report, ...existing.filter((item) => item.reportId !== report.reportId)].slice(0, MAX_REPORTS);
  saveState(SAVED_REPORTS_KEY, nextReports);
  return report;
}

export function deleteSavedReport(reportId) {
  const nextReports = loadSavedReports().filter((report) => report.reportId !== reportId);
  saveState(SAVED_REPORTS_KEY, nextReports);
  return nextReports;
}

export function reportsForCase(caseId, reports = loadSavedReports()) {
  if (!caseId) return [];
  return reports
    .filter((report) => report.caseId === caseId)
    .sort((a, b) => String(b.savedAt || "").localeCompare(String(a.savedAt || "")));
}

export function reportCenterStats(activeCase = {}, reports = loadSavedReports()) {
  const activeReports = reportsForCase(activeCase?.id, reports);
  const latest = reports[0] || null;

  return {
    activeCaseReports: activeReports.length,
    totalReports: reports.length,
    latestSavedAt: latest?.savedAt || "",
    latestTitle: latest?.title || "No saved report yet"
  };
}

function buildReportRecord({ activeCase = {}, preview = {}, source = "lookup", sourceRecord = null, query = "" }) {
  const savedAt = new Date().toISOString();
  const sourceSummary = sourceRecord
    ? {
        id: sourceRecord.id || "",
        type: sourceRecord.type || "Lookup record",
        label: sourceRecord.label || "Lookup result",
        primaryValue: sourceRecord.primaryValue || "",
        reportKind: sourceRecord.reportKind || "report"
      }
    : null;

  return {
    reportId: `${activeCase.id}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    caseId: activeCase.id,
    caseTitle: activeCase.title || "Fictional case",
    caseLane: activeCase.lane || "Training lane",
    caseSubtype: activeCase.subtype || "Subtype pending",
    exposure: activeCase.exposure || "Exposure pending",
    savedAt,
    source,
    sourceSummary,
    query: String(query || "").trim(),
    title: preview.title || "Saved report preview",
    subtitle: preview.subtitle || "Fictional training report preview",
    matchStatus: preview.matchStatus || "Report Saved",
    tone: preview.tone || "review",
    sections: normalizeSections(preview.sections),
    guardrail: REPORT_CENTER_GUARDRAIL
  };
}

function normalizeSections(sections = []) {
  return (Array.isArray(sections) ? sections : [])
    .map((section, index) => ({
      title: section?.title || `Report section ${index + 1}`,
      items: normalizeItems(section?.items)
    }))
    .filter((section) => section.items.length);
}

function normalizeItems(items = []) {
  if (!Array.isArray(items)) return [];
  return items.map((item) => String(item || "").trim()).filter(Boolean);
}
