import "./data/phase2AStabilizedUpgrades.js";
import "./data/phase2ALinkNavPatch.js";
import AppWorkstationV3 from "./AppWorkstationV3.jsx";
import MatrixGenerateRuntime from "./components/MatrixGenerateRuntime.jsx";
import NativePanelRuntime from "./components/NativePanelRuntime.jsx";
import Customer360DirectoryRuntime from "./components/Customer360DirectoryRuntime.jsx";
import ToolReportSaveRuntime from "./components/ToolReportSaveRuntime.jsx";
import SavedReportCenterRuntime from "./components/SavedReportCenterRuntime.jsx";
import TimelineActionImpactRuntime from "./components/TimelineActionImpactRuntime.jsx";
import CaseReportBuilderRuntime from "./components/CaseReportBuilderRuntime.jsx";
import EvidenceDebriefRuntime from "./components/EvidenceDebriefRuntime.jsx";
import ToolFocusPolishRuntime from "./components/ToolFocusPolishRuntime.jsx";
import LaneIndicatorFilterRuntime from "./components/LaneIndicatorFilterRuntime.jsx";
import "./nativePanelRuntime.css";
import "./lookupReportLauncher.css";
import "./reportCenter.css";
import "./customer360Directory.css";
import "./mobileNativePolish.css";
import "./toolReportSaveDock.css";
import "./timelineActionImpactRuntime.css";
import "./documentRequestNotes.css";
import "./caseReportBuilder.css";
import "./evidenceDebrief.css";
import "./toolFocusPolish.css";
import "./laneIndicatorFilter.css";

export default function AppWorkstationNativeBridge() {
  return (
    <>
      <AppWorkstationV3 />
      <MatrixGenerateRuntime />
      <NativePanelRuntime />
      <Customer360DirectoryRuntime />
      <ToolReportSaveRuntime />
      <SavedReportCenterRuntime />
      <TimelineActionImpactRuntime />
      <CaseReportBuilderRuntime />
      <EvidenceDebriefRuntime />
      <ToolFocusPolishRuntime />
      <LaneIndicatorFilterRuntime />
    </>
  );
}
