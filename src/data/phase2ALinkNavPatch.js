import { caseTemplates, toolNavByLane } from "./fraudAcademyEngine.js";

const LINK_TOOL = { id: "link", label: "Link Analysis", icon: "⌘" };
const RING_RISK_LANES = ["BUSINESS_BUSTOUT", "APPLICATION"];

function ensureLinkTool(lane) {
  const nav = toolNavByLane[lane];
  if (!nav || nav.some((tool) => tool.id === "link")) return;
  nav.push({ ...LINK_TOOL });
}

function ensureSuggestedTool(caseItem) {
  if (!RING_RISK_LANES.includes(caseItem.lane)) return;
  const suggested = caseItem.suggestedTools || [];
  if (!suggested.includes("Link Analysis")) {
    caseItem.suggestedTools = [...suggested, "Link Analysis"];
  }
}

for (const lane of RING_RISK_LANES) ensureLinkTool(lane);
for (const caseItem of caseTemplates) ensureSuggestedTool(caseItem);

export const phase2ALinkNavStatus = {
  label: "Link Analysis added to ring-risk lanes",
  lanes: RING_RISK_LANES
};
