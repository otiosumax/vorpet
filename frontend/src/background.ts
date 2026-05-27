type ContextMenuClickData = {
  menuItemId: string | number;
  selectionText?: string;
};

type TabData = {
  title?: string;
  url?: string;
};

type SummaryStorageData = {
  vorpetSummary?: {
    summary: string;
    sourceText: string;
    pageTitle?: string;
    pageUrl?: string;
    createdAt: number;
  };
};

type ChromeApi = {
  contextMenus: {
    create: (properties: {
      id: string;
      title: string;
      contexts: string[];
    }) => void;
    onClicked: {
      addListener: (
        callback: (info: ContextMenuClickData, tab?: TabData) => void,
      ) => void;
    };
  };
  runtime: {
    getURL: (path: string) => string;
    onInstalled: {
      addListener: (callback: () => void) => void;
    };
  };
  storage: {
    local: {
      set: (items: SummaryStorageData) => Promise<void>;
    };
  };
  windows: {
    create: (createData: {
      focused?: boolean;
      height?: number;
      left?: number;
      top?: number;
      type?: "normal" | "popup" | "panel";
      url: string;
      width?: number;
    }) => Promise<unknown>;
  };
};

declare const chrome: ChromeApi;

const SELECTION_MENU_ID = "vorpet-new-selection";
const API_BASE_URL = (
  import.meta.env.VITE_API_LINK ?? "http://localhost:3000"
).replace(/\/$/, "");
const USER_ID = import.meta.env.VITE_USER_ID ?? "default";
const SELECTION_ENDPOINT = (
  import.meta.env.VITE_SELECTION_ENDPOINT ?? "/api/pet/:userId/summarize"
).replace(":userId", USER_ID);

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: SELECTION_MENU_ID,
    title: "Summarize with Vorpet",
    contexts: ["selection"],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId !== SELECTION_MENU_ID || !info.selectionText) {
    return;
  }

  void summarizeSelection(info.selectionText, tab);
});

async function summarizeSelection(text: string, tab?: TabData) {
  try {
    const summary = await requestSummary(text, tab);
    await saveAndOpenSummary(summary, text, tab);
  } catch (error) {
    console.error(error);
    await saveAndOpenSummary(
      "Could not summarize the selected text. Check that the Vorpet API is running.",
      text,
      tab,
    );
  }
}

async function requestSummary(text: string, tab?: TabData) {
  const response = await fetch(`${API_BASE_URL}${SELECTION_ENDPOINT}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text,
      pageUrl: tab?.url,
      pageTitle: tab?.title,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to summarize selected text: ${response.status}`);
  }

  return getSummaryFromResponse(await response.json());
}

function getSummaryFromResponse(data: unknown) {
  if (typeof data === "string") {
    return data;
  }

  if (isRecord(data)) {
    const summary = data.summary ?? data.text ?? data.result;

    if (typeof summary === "string") {
      return summary;
    }
  }

  return "The API returned a response, but Vorpet could not find summary text in it.";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

async function saveAndOpenSummary(
  summary: string,
  sourceText: string,
  tab?: TabData,
) {
  await chrome.storage.local.set({
    vorpetSummary: {
      summary,
      sourceText,
      pageTitle: tab?.title,
      pageUrl: tab?.url,
      createdAt: Date.now(),
    },
  });

  await chrome.windows.create({
    focused: true,
    height: 220,
    left: 0,
    top: 0,
    type: "popup",
    url: chrome.runtime.getURL("summary.html"),
    width: 400,
  });
}
