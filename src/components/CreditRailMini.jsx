import { buildCreditDecisionRail } from "../data/creditDecisionRail.js";

export default function CreditRailMini({ activeCase }) {
  const rail = buildCreditDecisionRail(activeCase);
  if (!rail) return null;

  const previewOutcomes = (rail.outcomeGuide?.length
    ? rail.outcomeGuide
    : rail.outcomes.map((label) => ({ label, useWhen: "Use only if the evidence and reason-code narrative support it." })))
    .slice(0, 4);

  return (
    <section className="faCreditRailMini" aria-label="Credit decision rail">
      <div className="faCreditRailHeader">
        <span className="faEyebrow">Credit rail</span>
        <strong>{rail.title}</strong>
        <small>{rail.caseFamily} · {rail.subtype}</small>
      </div>
      <p className="faCreditRailQuestion">
        <strong>Decision question</strong>
        {rail.decisionQuestion}
      </p>
      <div className="faCreditRailPills">
        <span>{rail.applicationStatus}</span>
        <span>{rail.evidenceProgress}% evidence mapped</span>
        <span>{rail.evidenceStatusLabel}</span>
      </div>
      <p>{rail.sla}</p>
      <div className="faCreditRailList">
        <small>Missing / needs review</small>
        {rail.missingDocs.slice(0, 3).map((item) => <em key={item}>{item}</em>)}
      </div>
      <div className="faCreditOutcomePreview" aria-label="Credit-safe outcome preview">
        <small>Credit-safe outcomes, not pay / deny claim labels</small>
        {previewOutcomes.map((item) => (
          <span key={item.label}>
            <b>{item.label}</b>
            <small>{item.useWhen}</small>
          </span>
        ))}
      </div>
      <p className="faCreditRailPrompt">{rail.reasonNarrativePrompt}</p>
      <details>
        <summary>Reason-code guardrails</summary>
        {rail.reasonCodeDrafts.map((item) => <p key={item}>{item}</p>)}
        {rail.guardrails.map((item) => <p key={item}>{item}</p>)}
      </details>
    </section>
  );
}
