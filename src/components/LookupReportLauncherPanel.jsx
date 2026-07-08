import { useMemo, useState } from "react";
import {
  LOOKUP_REPORT_GUARDRAIL,
  buildLookupIndex,
  buildLookupReportPreview,
  runLookupReportSearch
} from "../data/lookupReportEngine.js";
import { saveReportPreview } from "../data/savedReportCenter.js";

export default function LookupReportLauncherPanel({ activeCase }) {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [saveMessage, setSaveMessage] = useState("");
  const lookupIndex = useMemo(() => buildLookupIndex(activeCase), [activeCase]);
  const search = useMemo(() => runLookupReportSearch(activeCase, query), [activeCase, query]);
  const selectedRecord = search.results.find((record) => record.id === selectedId) || null;
  const preview = buildLookupReportPreview(activeCase, selectedRecord);

  function runExample(example) {
    setQuery(example);
    setSelectedId("");
    setSaveMessage("");
  }

  function updateQuery(value) {
    setQuery(value);
    setSelectedId("");
    setSaveMessage("");
  }

  function savePreview() {
    const saved = saveReportPreview({
      activeCase,
      preview,
      source: "customer360-lookup",
      sourceRecord: selectedRecord,
      query
    });

    if (!saved) return;
    setSaveMessage(`Saved to Report Center · ${formatSavedAt(saved.savedAt)}`);
    if (typeof window !== "undefined") window.dispatchEvent(new Event("storage"));
  }

  return (
    <section className="faGlass faLookupReportLauncher" aria-label="Lookup report launcher">
      <div className="faLookupReportHeader">
        <div>
          <span className="faEyebrow">Report launcher</span>
          <h3>Identity, employee, and bank lookup reports</h3>
          <p>
            Search the active fictional profile by training SSN/EIN + DOB, employee ID, trusted contact, bank routing/account key, device, or IP. Results show Match, Partial Match, or No Match without solving the case.
          </p>
        </div>
        <strong>⌕</strong>
      </div>

      <div className="faLookupSearchBox">
        <label>
          <span>Lookup value</span>
          <input
            value={query}
            onChange={(event) => updateQuery(event.target.value)}
            placeholder="Search fictional SSN/EIN + DOB, bank key, employee ID, device ID, IP..."
          />
        </label>
        <div className="faLookupExamples" aria-label="Suggested lookup examples">
          {search.examples.map((example) => (
            <button type="button" key={example} onClick={() => runExample(example)}>
              {example}
            </button>
          ))}
        </div>
      </div>

      <div className="faLookupReportStats">
        <span><b>{lookupIndex.length}</b> searchable records</span>
        <span><b>{search.results.length}</b> current hits</span>
        <span><b>{search.status}</b> search status</span>
      </div>

      {query && search.noMatch && (
        <article className="faLookupNoMatch">
          <strong>No Match</strong>
          <p>No active Customer 360, employee, bank, device, or IP record matched that fictional lookup value. Try a Customer 360 lookup key or request more documents.</p>
        </article>
      )}

      {!!search.results.length && (
        <div className="faLookupResults">
          {search.results.map((record) => (
            <article className="faLookupResultCard" key={record.id} data-tone={record.match.tone}>
              <div>
                <span>{record.type}</span>
                <strong>{record.label}</strong>
                <p>{record.primaryValue}</p>
              </div>
              <div className="faLookupResultActions">
                <em data-tone={record.match.tone}>{record.match.status}</em>
                <button type="button" onClick={() => { setSelectedId(record.id); setSaveMessage(""); }}>
                  Generate report preview
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {preview && (
        <article className="faLookupReportPreview" data-tone={preview.tone}>
          <div className="faLookupReportPreviewTop">
            <div>
              <span className="faEyebrow">Generated preview</span>
              <h4>{preview.title}</h4>
              <p>{preview.subtitle}</p>
            </div>
            <div className="faLookupPreviewActions">
              <strong>{preview.matchStatus}</strong>
              <button type="button" onClick={savePreview}>Save to Report Center</button>
            </div>
          </div>
          <div className="faLookupReportSections">
            {preview.sections.map((section) => (
              <section key={section.title}>
                <h5>{section.title}</h5>
                <ul>
                  {section.items.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </section>
            ))}
          </div>
          {saveMessage && <p className="faLookupSaveStatus">{saveMessage}</p>}
        </article>
      )}

      <p className="faLookupGuardrail">{LOOKUP_REPORT_GUARDRAIL}</p>
    </section>
  );
}

function formatSavedAt(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "saved locally";
  return date.toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}
