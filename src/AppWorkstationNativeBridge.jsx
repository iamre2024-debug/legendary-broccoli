import AppWorkstationV3 from "./AppWorkstationV3.jsx";
import MatrixGenerateRuntime from "./components/MatrixGenerateRuntime.jsx";
import NativePanelRuntime from "./components/NativePanelRuntime.jsx";
import Customer360DirectoryRuntime from "./components/Customer360DirectoryRuntime.jsx";
import ToolReportSaveRuntime from "./components/ToolReportSaveRuntime.jsx";
import SavedReportCenterRuntime from "./components/SavedReportCenterRuntime.jsx";
import "./nativePanelRuntime.css";
import "./lookupReportLauncher.css";
import "./reportCenter.css";
import "./customer360Directory.css";
import "./mobileNativePolish.css";

export default function AppWorkstationNativeBridge() {
  return (
    <>
      <AppWorkstationV3 />
      <MatrixGenerateRuntime />
      <NativePanelRuntime />
      <Customer360DirectoryRuntime />
      <ToolReportSaveRuntime />
      <SavedReportCenterRuntime />
    </>
  );
}
