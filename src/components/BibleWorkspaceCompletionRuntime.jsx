import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useWorkstationSnapshot } from "../hooks/useWorkstationSnapshot.js";
import { appendAction, workstationKey, writeCaseMap } from "../data/workstationRuntimeState.js";
import { loadState } from "../utils/storage.js";

const INTERVIEW_JUDGMENTS = ["Consistent", "Inconsistent", "Missing important details", "Unverified"];

export default function BibleWorkspaceCompletionRuntime() {
  const { snapshot, refresh } = useWorkstationSnapshot({ intervalMs: 500 });
  const activeCase = snapshot.activeCase;
  const target = typeof document !== "undefined" ? document.querySelector(".faPagePanel") : null;

  useEffect(() => {
    if (typeof document === "undefined") return undefined;
    const transactionReady = Boolean(activeCase && snapshot.page === "transaction" && target);
    document.body.classList.toggle("faBibleTransactionReady", transactionReady);
    return () => document.body.classList.remove("faBibleTransactionReady");
  }, [activeCase, snapshot.page, target]);

  if (!activeCase || !target) return null;
  if (snapshot.page === "workspace") return createPortal(<InterviewWorkspace activeCase={activeCase} refresh={refresh} />, target);
  if (snapshot.page === "transaction") return createPortal(<TransactionHistoryWorkspace activeCase={activeCase} />, target);
  return null;
}

function InterviewWorkspace({ activeCase, refresh }) {
  const saved = loadState(workstationKey("interviews"), {})[activeCase.id] || {};
  const [judgment, setJudgment] = useState(saved.judgment || "Unverified");
  const [questions, setQuestions] = useState(saved.questions || "");
  const [crossReference, setCrossReference] = useState(saved.crossReference || "");
  const [note, setNote] = useState(saved.note || "");

  const saveInterview = () => {
    const value = { statement: activeCase.statement || activeCase.summary || "Statement pending", source: activeCase.statementSource || "Case Briefing intake statement", observations: "Behavior alone is not proof. Compare the statement with evidence.", judgment, questions, crossReference, note, evidenceQuality: crossReference.trim().length >= 20 ? "Documented" : "Evidence gap" };
    writeCaseMap("interviews", activeCase.id, value);
    appendAction(activeCase.id, { actionId: `${activeCase.id}-${Date.now()}-InterviewReview`, performedAt: new Date().toISOString(), actionType: "InterviewReview", outcome: `Statement marked ${judgment}`, xpDelta: 8, confidenceDelta: 0, notes: note || "Interview review saved", metadata: { judgment, crossReference } });
    refresh();
  };

  return <section className="faGlass faBibleWorkspacePanel" aria-label="Live interview tool"><span className="faEyebrow">Live Interview Tool</span><h3>Does the statement stay consistent with reviewed evidence?</h3><div className="faBibleGrid"><article><strong>Statement source</strong><p>{activeCase.statementSource || "Case Briefing intake statement"}</p></article><article><strong>Statement</strong><p>{activeCase.statement || activeCase.summary}</p></article><article><strong>Behavioral observation rule</strong><p>Tone, nervousness, and vibes are not proof. Cross-reference the story with records.</p></article></div><label>Investigator judgment<select value={judgment} onChange={(event) => setJudgment(event.target.value)}>{INTERVIEW_JUDGMENTS.map((item) => <option key={item}>{item}</option>)}</select></label><label>Follow-up questions<textarea value={questions} onChange={(event) => setQuestions(event.target.value)} placeholder="What still needs to be asked?" /></label><label>Evidence cross-reference<textarea value={crossReference} onChange={(event) => setCrossReference(event.target.value)} placeholder="Reference Customer 360, Timeline, Login, Device, Transaction, documents, or another reviewed tool..." /></label><label>Interview note<textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="Document contradictions, support, and unresolved details..." /></label><button className="faPrimary" onClick={saveInterview}>Save interview review</button></section>;
}

function TransactionHistoryWorkspace({ activeCase }) {
  const transactions = useMemo(() => buildTransactions(activeCase), [activeCase]);
  const [query, setQuery] = useState("");
  const [channel, setChannel] = useState("All");
  const [direction, setDirection] = useState("All");
  const [selected, setSelected] = useState(null);
  const filtered = transactions.filter((item) => { const text = `${item.id} ${item.merchant} ${item.descriptor} ${item.amount} ${item.date} ${item.channel}`.toLowerCase(); return (!query || text.includes(query.toLowerCase())) && (channel === "All" || item.channel === channel) && (direction === "All" || item.direction === direction); });
  const addToTimeline = (item) => appendAction(activeCase.id, { actionId: `${activeCase.id}-${Date.now()}-ReviewTransaction`, performedAt: new Date().toISOString(), actionType: "ReviewTransaction", outcome: `${item.id} reviewed and added to timeline`, xpDelta: 5, confidenceDelta: 0, notes: `${item.merchant} ${item.amount}`, metadata: item });

  return <section className="faGlass faBibleWorkspacePanel faTransactionWorkspace" aria-label="Transaction history workspace"><span className="faEyebrow">Transaction History</span><h3>What financial activity actually occurred?</h3><p className="faMuted">Thirty-day fictional banking activity. Filter the record, open details, document the item, and add relevant activity to the timeline.</p><div className="faTransactionFilters"><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search merchant, transaction ID, amount, descriptor, or date" /><select value={channel} onChange={(event) => setChannel(event.target.value)}>{["All", "Online", "In-store", "Wallet", "ATM", "ACH", "Wire", "Recurring"].map((item) => <option key={item}>{item}</option>)}</select><select value={direction} onChange={(event) => setDirection(event.target.value)}>{["All", "Debit", "Credit"].map((item) => <option key={item}>{item}</option>)}</select></div><div className="faTransactionList">{filtered.map((item) => <button key={item.id} className="faTransactionRow" onClick={() => setSelected(item)}><span>{item.date}</span><strong>{item.merchant}</strong><small>{item.channel} · {item.entryMode}</small><b>{item.amount}</b></button>)}</div>{selected && <div className="faTransactionDrawer"><button className="faTextButton" onClick={() => setSelected(null)}>Close</button><h4>{selected.merchant}</h4><div className="faBibleGrid"><article><strong>Transaction ID</strong><p>{selected.id}</p></article><article><strong>Descriptor</strong><p>{selected.descriptor}</p></article><article><strong>Account rail</strong><p>{selected.rail}</p></article><article><strong>Location</strong><p>{selected.location}</p></article><article><strong>Entry mode</strong><p>{selected.entryMode}</p></article><article><strong>Related evidence</strong><p>{selected.related}</p></article></div><button className="faPrimary" onClick={() => addToTimeline(selected)}>Add to timeline</button></div>}</section>;
}

function buildTransactions(activeCase) {
  const base = [["TXN-10421", "2026-07-08", "Northstar Market", "$84.22", "Debit", "In-store", "Chip", "DALLAS TX", "Checking ••4821", "NORTHSTAR MKT 0418", "Receipt / merchant history"], ["TXN-10422", "2026-07-07", "CloudBox Storage", "$12.99", "Debit", "Recurring", "Card-on-file", "Online", "Credit ••6630", "CLOUDBOX SUBSCRIPTION", "Terms / prior merchant use"], ["TXN-10423", "2026-07-06", "Payroll Deposit", "$2,184.16", "Credit", "ACH", "ACH credit", "Employer origin", "Checking ••4821", "NORTHSTAR PAYROLL", "Income / payroll profile"], ["TXN-10424", "2026-07-05", "Metro Fuel", "$46.08", "Debit", "Wallet", "Tokenized wallet", "DALLAS TX", "Debit ••2108", "METRO FUEL 882", "Wallet / device history"], ["TXN-10425", "2026-07-04", "ATM Withdrawal", "$200.00", "Debit", "ATM", "PIN", "ARLINGTON TX", "Checking ••4821", "ATM CASH 7701", "ATM / location history"], ["TXN-10426", "2026-07-03", "External Transfer", "$1,250.00", "Debit", "Wire", "Online banking", "Phoenix AZ beneficiary", "Checking ••4821", "OUTBOUND TRANSFER", "Beneficiary / IP / device / link analysis"]];
  return base.map(([id, date, merchant, amount, direction, channel, entryMode, location, rail, descriptor, related]) => ({ id, date, merchant, amount, direction, channel, entryMode, location, rail, descriptor, related, caseId: activeCase.id }));
}
