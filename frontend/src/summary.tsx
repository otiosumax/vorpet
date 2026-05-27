import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import "./styles/summary.css";

type Summary = {
  summary: string;
  sourceText: string;
  pageTitle?: string;
  pageUrl?: string;
  createdAt: number;
};

type SummaryStorageData = {
  vorpetSummary?: Summary;
};

type ChromeApi = {
  storage: {
    local: {
      get: (keys: string[]) => Promise<SummaryStorageData>;
    };
  };
};

declare const chrome: ChromeApi;

export function SummaryWindow() {
  const [summary, setSummary] = useState<Summary | null>(null);

  useEffect(() => {
    async function loadSummary() {
      const data = await chrome.storage.local.get(["vorpetSummary"]);
      setSummary(data.vorpetSummary ?? null);
    }

    void loadSummary();
  }, []);

  useEffect(() => {
    if (!summary) {
      return;
    }

    window.requestAnimationFrame(() => {
      const contentHeight = document.documentElement.scrollHeight;
      const maxHeight = Math.min(window.screen.availHeight, 520);
      const height = Math.min(Math.max(contentHeight + 32, 180), maxHeight);

      window.resizeTo(400, height);
    });
  }, [summary]);

  return (
    <main id="summary-window">
      <header>
        <h1>Vorpet summary</h1>
        {summary?.pageTitle && <p>{summary.pageTitle}</p>}
      </header>

      <section>
        <h2>Quick retelling</h2>
        <p>{summary?.summary ?? "Loading summary..."}</p>
      </section>

      {summary?.sourceText && (
        <details>
          <summary>Selected text</summary>
          <p>{summary.sourceText}</p>
        </details>
      )}
    </main>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SummaryWindow />
  </StrictMode>,
);
