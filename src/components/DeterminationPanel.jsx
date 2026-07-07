import { getDeterminationOptions } from "../data/fraudAcademyEngine.js";
import {
  buildCreditDecisionRail,
  getCreditDeterminationOptions,
  isCreditDecisionRailCase
} from "../data/creditDecisionRail.js";

export default function DeterminationPanel({
  activeCase,
  determination,
  justification,
  setDetermination,
  setJustification,
  completeCase
}) {
  const creditRail = buildCreditDecisionRail(activeCase);
  const options = isCreditDecisionRailCase(activeCase)
    ? getCreditDeterminationOptions(activeCase)
    : getDeterminationOptions(activeCase?.lane);
  const canComplete = Boolean(determination && justification.trim().length > 15);

  return (
    <div className="faStack">
      <PageTitle
        eyebrow="Determination"
        title={creditRail ? "Choose the credit-specific outcome" : "Choose the lane-specific outcome"}
        subtitle={creditRail ? "Credit options use support / do not support / more info language, not fraud reimbursement wording." : "Options change by claim type. Evidence tools never make the decision."}
      />
      {creditRail && <CreditDecisionNotice rail={creditRail} />}
      <section className="faGlass">
        <div className={creditRail ? "faOptionGrid faCreditDecisionGrid" : "faOptionGrid"}>
          {options.map((option) => {
            const guide = creditRail?.outcomeGuide?.find((item) => item.label === option);
            return (
              <button
                key={option}
                className={classNames("faDecisionOption", creditRail && "faCreditDecisionOption", determination === option && "selected")}
                onClick={() => setDetermination(option)}
                aria-label={creditRail ? `${option}. Credit-safe determination option.` : option}
              >
                <strong>{option}</strong>
                {guide && <small>{guide.useWhen}</small>}
              </button>
            );
          })}
        </div>
      </section>
      <section className="faGlass">
        <span className="faEyebrow">Decision narrative</span>
        {creditRail && <p className="faMuted">{creditRail.reasonNarrativePrompt}</p>}
        <textarea
          value={justification}
          onChange={(event) => setJustification(event.target.value)}
          placeholder={creditRail ? "Explain the credit evidence, missing documents, reason-code support, and why the selected credit outcome fits..." : "Explain the evidence you relied on, missing info, and why your decision fits this claim lane..."}
        />
        <button className="faPrimary" disabled={!canComplete} onClick={completeCase}>Submit determination</button>
        {!canComplete && <p className="faMuted">Select an outcome and write at least a short evidence-based justification.</p>}
      </section>
    </div>
  );
}

function CreditDecisionNotice({ rail }) {
  return (
    <aside className="faCreditDecisionNotice">
      <span>Credit decision rail</span>
      <strong>{rail.decisionQuestion}</strong>
      <p>{rail.reasonNarrativePrompt}</p>
      <div className="faCreditRailPills">
        <span>{rail.applicationStatus}</span>
        <span>{rail.evidenceProgress}% evidence mapped</span>
        <span>{rail.evidenceStatusLabel}</span>
      </div>
    </aside>
  );
}

function PageTitle({ eyebrow, title, subtitle }) {
  return <div className="faPageTitle"><span className="faEyebrow">{eyebrow}</span><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div>;
}

function classNames(...items) {
  return items.filter(Boolean).join(" ");
}
