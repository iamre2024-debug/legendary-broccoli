import { useEffect } from "react";

const CONFIRMATION_CLASS = "faDocumentRequestSaved";

export default function DocumentRequestSubmitFeedbackRuntime() {
  useEffect(() => {
    if (typeof document === "undefined") return undefined;

    function handleClick(event) {
      const button = event.target?.closest?.(".faDocumentRequestSubmit");
      if (!button) return;

      window.setTimeout(() => showSavedConfirmation(button), 60);
    }

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);

  return null;
}

function showSavedConfirmation(button) {
  const notePanel = button.closest?.(".faDocumentRequestNote") || button.parentElement;
  if (!notePanel) return;

  const existing = notePanel.querySelector(`.${CONFIRMATION_CLASS}`);
  const message = existing || document.createElement("p");
  message.className = CONFIRMATION_CLASS;
  message.textContent = `Saved to case notes ✓ Last saved ${formatTime(new Date())}`;

  if (!existing) notePanel.appendChild(message);
}

function formatTime(date) {
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}
