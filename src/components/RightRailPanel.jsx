import CreditRailMini from "./CreditRailMini.jsx";
import { categoryLabel, resolveToolDefinition } from "../data/toolRegistry.js";
import { toolNavByLane } from "../data/fraudAcademyEngine.js";

const toolPageIds = new Set(Object.values(toolNavByLane).flat().map((tool) => tool.id));

export default function RightRailPanel({
  activeCase,
  completed = [],
  reviewedTools = [],
  indicators = {},
  caseCount = 0,
  actions = [],
  page,
  progress = 0
}) {
  if (!activeCase) return null;

  const toolDefinition = toolPageIds.has(page) ? resolveToolDefinition(page) : null;
  const isCompleted = completed.includes(activeCase.id);

  return (
    <aside className="faRightRail">
      <section className="faRailCard">
        <span className="faEyebrow">Luna rail</span>
        <h3>Current focus</h3>
        <p>{activeCase.title}</p>
        <small>{activeCase.subtype}</small>
      </section>
      <CreditRailMini activeCase={activeCase} />
      {toolDefinition && (
        <section className="faRailCard">
          <span className="faEyebrow">Evidence Explorer</span>
          <h3>{toolDefinition.title}</h3>
          <p>{categoryLabel(toolDefinition.category)}</p>
        </section>
      )}
      <section className="faRailCard">
        <span className="faEyebrow">Action Impact</span>
        <h3>{actions.length}</h3>
        <p>events logged</p>
        {actions.slice(0, 3).map((action) => <small key={action.actionId}>{action.actionType}: {action.xpDelta > 0 ? `+${action.xpDelta} XP` : "0 XP"}</small>)}
      </section>
      <section className="faRailCard">
        <span className="faEyebrow">Reviewed evidence</span>
        <h3>{reviewedTools.length}</h3>
        <p>{progress}% case progress</p>
      </section>
      <section className="faRailCard">
        <span className="faEyebrow">Indicators chosen</span>
        <p>{(indicators.suspicious || []).length} suspicious</p>
        <p>{(indicators.normal || []).length} normal</p>
      </section>
      <section className="faRailCard">
        <span className="faEyebrow">Queue status</span>
        <p>{isCompleted ? "Completed" : "Active"}</p>
        <small>{caseCount} cases in browser storage</small>
      </section>
    </aside>
  );
}
