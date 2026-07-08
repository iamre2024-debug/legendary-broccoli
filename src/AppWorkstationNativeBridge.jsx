import AppWorkstationV3 from "./AppWorkstationV3.jsx";
import MatrixGenerateRuntime from "./components/MatrixGenerateRuntime.jsx";
import NativePanelRuntime from "./components/NativePanelRuntime.jsx";
import "./nativePanelRuntime.css";
import "./lookupReportLauncher.css";
import "./reportCenter.css";

export default function AppWorkstationNativeBridge() {
  return (
    <>
      <AppWorkstationV3 />
      <MatrixGenerateRuntime />
      <NativePanelRuntime />
    </>
  );
}
