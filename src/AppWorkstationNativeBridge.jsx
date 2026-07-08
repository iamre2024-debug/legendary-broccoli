import AppWorkstationMatrixBridge from "./AppWorkstationMatrixBridge.jsx";
import NativePanelRuntime from "./components/NativePanelRuntime.jsx";
import "./nativePanelRuntime.css";
import "./lookupReportLauncher.css";
import "./reportCenter.css";

export default function AppWorkstationNativeBridge() {
  return (
    <>
      <AppWorkstationMatrixBridge />
      <NativePanelRuntime />
    </>
  );
}
