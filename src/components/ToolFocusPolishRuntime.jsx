import { createPortal } from "react-dom";
import { useNativePortalTargets } from "../hooks/useNativePortalTargets.js";
import { useWorkstationSnapshot } from "../hooks/useWorkstationSnapshot.js";

const FOCUS_PAGE_IDS = new Set(["identity", "login"]);

const TOOL_FOCUS_COPY = {
  identity: {
    eyebrow: "Identity Intel focus",
    title: "Verify the person, not the outcome",
    glyph: "◎",
    subtitle:
      "Compare Customer 360, masked identity fields, contact history, and lookup reports. A consistency check supports documentation, not a verdict.",
    prompts: [
      "Compare Training ID, DOB/profile age, address tenure, phone, and email against Customer 360.",
      "Separate full matches, partial matches, and missing records in your notes.",
      "Use report previews as internal evidence artifacts, not final recommendations."
    ],
    questions: [
      "Does the identity profile align with the customer record?",
      "Which mismatch needs a document request or deeper lookup?",
      "What exact source would you cite in the case report?"
    ]
  },
  login: {
    eyebrow: "Login History focus",
    title: "Rebuild the access story",
    glyph: "⌁",
    subtitle:
      "Walk the sign-in sequence against normal behavior, device/session evidence, IP intelligence, MFA events, and profile changes before deciding what the facts support.",
    prompts: [
      "Start with timing: normal access, reported issue start, and suspicious session window.",
      "Compare device, IP, MFA, browser, and profile-change events without calling them red flags early.",
      "Use Timeline and Link Analysis to decide what needs corroboration."
    ],
    questions: [
      "Does the access pattern fit the customer story?",
      "Which session detail should be searched in another tool?",
      "What event belongs in the final timeline?"
    ]
  }
};

export default function ToolFocusPolishRuntime() {
  const { snapshot } = useWorkstationSnapshot({ intervalMs: 700 });
  const targets = useNativePortalTargets({ intervalMs: 700 });
  const activeCase = snapshot.activeCase;
  const page = snapshot.page;

  if (!activeCase || !FOCUS_PAGE_IDS.has(page) || !targets.pageStack) return null;

  const copy = TOOL_FOCUS_COPY[page];
  const facts = buildFocusFacts(activeCase, page);

  return createPortal(
    <section className="faGlass faToolFocusPolish" aria-label={`${copy.eyebrow} investigator focus panel`}>
      <div className="faToolFocusHero">
        <div>
          <span className="faEyebrow">{copy.eyebrow}</span>
          <h3>{copy.title}</h3>
          <p>{copy.subtitle}</p>
        </div>
        <strong>{copy.glyph}</strong>
      </div>

      <div className="faToolFocusGrid">
        <section className="faToolFocusCard">
          <span className="faEyebrow">Anchor facts</span>
          <div className="faToolFocusFacts">
            {facts.map((fact) => (
              <span key={fact.label}>
                <small>{fact.label}</small>
                <b>{fact.value || "Not provided"}</b>
              </span>
            ))}
          </div>
        </section>

        <section className="faToolFocusCard">
          <span className="faEyebrow">Investigator prompts</span>
          <ul>
            {copy.prompts.map((prompt) => <li key={prompt}>{prompt}</li>)}
          </ul>
        </section>

        <section className="faToolFocusCard">
          <span className="faEyebrow">Questions this tool answers</span>
          <ul>
            {copy.questions.map((question) => <li key={question}>{question}</li>)}
          </ul>
        </section>
      </div>

      <p className="faToolFocusGuardrail">
        Evidence-first guardrail: this panel improves review flow only. It does not reveal fraud/non-fraud, risk scores, hidden answers, or Luna recommendations before Determination.
      </p>
    </section>,
    targets.pageStack
  );
}

function buildFocusFacts(activeCase, page) {
  const profile = activeCase.profile || {};
  const normalBehavior = profile.normalBehavior || {};

  if (page === "login") {
    return [
      { label: "Normal login", value: normalBehavior.loginLocation },
      { label: "Normal device", value: normalBehavior.device },
      { label: "Issue start", value: activeCase.issueStart },
      { label: "Reported", value: activeCase.reportedDate }
    ];
  }

  return [
    { label: "Customer ID", value: profile.customerId },
    { label: "Masked ID", value: profile.maskedId },
    { label: "DOB / profile", value: profile.dob },
    { label: "Primary state", value: profile.state }
  ];
}
