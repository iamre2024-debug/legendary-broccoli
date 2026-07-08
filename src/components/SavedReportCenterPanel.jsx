import { useEffect, useMemo, useState } from "react";
import {
  REPORT_CENTER_GUARDRAIL,
  deleteSavedReport,
  loadSavedReports,
  reportCenterStats,
  reportsForCase
} from "../data/savedReportCenter.js";

export default function SavedReportCenterPanel({ activeCase }) {
  const [reports, setReports] = useState(() => loadSavedReports());
  const [selectedId, setSelectedId] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const refresh = () => setReports(loadSavedReports());
    refresh();
    const interval = window.setInterval(refresh, 900);
    window.addEventListener("storage", refresh);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("storage", refresh);
    };
  }, [activeCase?.id]);

  const activeCaseReports = useMemo(() => reportsForCase(activeCase?.id, reports), [activeCase?.id, reports]);
  const recentOtherReports = useMemo(
    () => reports.filter((report) => report.caseId !== activeCase?.id).slice(0, 6),
    [activeCase?.id, reports]
  );
  const stats = reportCenterStats(activeCase, reports);
  const listReports = activeCaseReports.length ? activeCaseReports : reports.slice(0, 8);
  const selectedReport = reports.find((report) => report.reportId === selectedId) || listReports[0] || null;

  function removeReport(reportId) {
    const nextReports = deleteSavedReport(reportId);
    setReports(nextReports);
    if (selectedId === reportId) setSelectedId("");
    if (typeof window !== "undefined") window.dispatchEvent(new Event("storage"));
  }

  return (
    <section className="faGlass faSavedReportCenter" aria-label="Saved Report Center">
      <div className="faReportCenterHeader">
        <div>
          <span className="faEyebrow">Report Center</span>
          <h3>Saved report history</h3>
          <p>
            Save lookup previews and reopen them from the investigation summary. Reports stay local, fictional, and evidence-only until Determination and Debrief.
          </p>
        </div>
        <strong>▤</strong>
      </div>

      <div className="faReportCenterStats">
        <span><b>{stats.activeCaseReports}</b> active case reports</span>
        <span><b>{stats.totalReports}</b> total saved</span>
        <span><b>{formatSavedTime(stats.latestSavedAt)}</b> latest save</span>
      </div>

      {!reports.length && (
        <article className="faReportCenterEmpty">
          <strong>No reports saved yet</strong>
          <p>Generate a Customer 360 lookup report preview, then save it here. Future tool report previews can use the same Report Center spine.</p>
        </article>
      )}

      {!!reports.length && (
        <div className="faReportCenterLayout">
          <div className="faReportCenterList" aria-label="Saved report list">
            <span className="faReportCenterSubhead">
              {activeCaseReports.length ? "Active case reports" : "Recent reports"}
            </span>
            {listReports.map((report) => (
              <article className="faSavedReportCard" data-tone={report.tone} key={report.reportId}>
                <button type="button" onClick={() => setSelectedId(report.reportId)}>
                  <span>{report.matchStatus}</span>
                  <strong>{report.title}</strong>
                  <small>{report.caseId} · {formatSavedTime(report.savedAt)} · {report.source}</small>
                </button>
                <button className="faReportDelete" type="button" onClick={() => removeReport(report.reportId)} aria-label={`Delete ${report.title}`}>
                  Delete
                </button>
              </article>
            ))}

            {!!recentOtherReports.length && !!activeCaseReports.length && (
              <div className="faRecentOtherReports">
                <span className="faReportCenterSubhead">Other recent reports</span>
                {recentOtherReports.map((report) => (
                  <button type="button" key={report.reportId} onClick={() => setSelectedId(report.reportId)}>
                    {report.caseId} · {report.title}
                  </button>
                ))}
              </div>
            )}
          </div>

          <ReportCenterPreview report={selectedReport} />
        </div>
      )}

      <p className="faReportCenterGuardrail">{REPORT_CENTER_GUARDRAIL}</p>
    </section>
  );
}

function ReportCenterPreview({ report }) {
  if (!report) return null;

  return (
    <article className="faReportCenterPreview" data-tone={report.tone}>
      <div className="faReportCenterPreviewTop">
        <div>
          <span className="faEyebrow">Saved preview</span>
          <h4>{report.title}</h4>
          <p>{report.subtitle}</p>
        </div>
        <strong>{report.matchStatus}</strong>
      </div>

      <div className="faReportCenterMeta">
        <span>{report.caseTitle}</span>
        <span>{report.caseSubtype}</span>
        <span>{report.exposure}</span>
        <span>{formatSavedTime(report.savedAt)}</span>
      </div>

      {report.sourceSummary && (
        <section className="faReportSourceSummary">
          <span className="faEyebrow">Source record</span>
          <strong>{report.sourceSummary.type}</strong>
          <p>{report.sourceSummary.label} · {report.sourceSummary.primaryValue}</p>
        </section>
      )}

      <div className="faReportCenterSections">
        {(report.sections || []).map((section) => (
          <section key={`${report.reportId}-${section.title}`}>
            <h5>{section.title}</h5>
            <ul>
              {(section.items || []).map((item) => <li key={item}>{item}</li>)}
            </ul>
          </section>
        ))}
      </div>
    </article>
  );
}

function formatSavedTime(value) {
  if (!value) return "Not yet";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Saved";
  return date.toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}
