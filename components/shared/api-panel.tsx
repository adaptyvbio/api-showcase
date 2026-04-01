"use client";

import { useState } from "react";
import { ChevronRight, Loader2 } from "lucide-react";
import { HttpMethodBadge } from "./http-method-badge";
import { CodeBlock, jsonToString } from "./code-block";
import { CopyButton } from "./copy-button";

interface ApiPanelProps {
  method: "GET" | "POST";
  endpoint: string;
  requestBody?: unknown;
  response?: unknown;
  responseStatus?: number | null;
  isLoading?: boolean;
  activeTab: "request" | "response";
  onTabChange?: (tab: "request" | "response") => void;
  baseUrl?: string;
  autoScroll?: boolean;
}

const STATUS_STYLES: Record<string, string> = {
  "2": "text-[#22C55E] bg-[rgba(34,197,94,0.10)]",
  "4": "text-[#F59E0B] bg-[rgba(245,158,11,0.10)]",
  "5": "text-[#EF4444] bg-[rgba(239,68,68,0.10)]",
};

const STATUS_LABELS: Record<number, string> = {
  200: "200 OK",
  201: "201 Created",
  400: "400 Bad Request",
  401: "401 Unauthorized",
  404: "404 Not Found",
  500: "500 Error",
};

function getStatusStyle(status: number) {
  return STATUS_STYLES[String(status)[0]] ?? STATUS_STYLES["5"];
}

export function ApiPanel({
  method,
  endpoint,
  requestBody,
  response,
  responseStatus,
  isLoading = false,
  activeTab,
  onTabChange,
  baseUrl = "https://api.adaptyvbio.com/v1",
  autoScroll = false,
}: ApiPanelProps) {
  const [headersOpen, setHeadersOpen] = useState(false);

  const hasResponse = response !== undefined && response !== null;
  const responseDisabled = !hasResponse && !isLoading;

  return (
    <div className="flex flex-col h-full min-h-[400px] bg-[#13161B] text-[#E4E4E7]">
      {/* Tab bar */}
      <div className="flex items-center gap-1 px-4 h-11 bg-[#1C2027] border-b border-white/[0.15] shrink-0">
        <button
          onClick={() => onTabChange?.("request")}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors duration-150 ${
            activeTab === "request"
              ? "bg-[#13161B] text-[#E4E4E7]"
              : "text-[#9CA3B0] hover:text-[#E4E4E7]/70"
          }`}
        >
          Request
        </button>
        <button
          onClick={() => !responseDisabled && onTabChange?.("response")}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors duration-150 ${
            responseDisabled
              ? "text-[#9CA3B0]/50 cursor-not-allowed"
              : activeTab === "response"
                ? "bg-[#13161B] text-[#E4E4E7]"
                : "text-[#9CA3B0] hover:text-[#E4E4E7]/70"
          }`}
        >
          Response
          {isLoading && (
            <Loader2 className="inline-block w-3 h-3 ml-1.5 animate-spin" />
          )}
        </button>

        {responseStatus != null && (
          <span
            className={`ml-auto px-2 py-0.5 rounded text-[11px] font-mono font-semibold ${getStatusStyle(responseStatus)}`}
          >
            {STATUS_LABELS[responseStatus] ?? responseStatus}
          </span>
        )}
      </div>

      {/* URL bar */}
      <div className="flex items-center gap-2 px-4 py-2 bg-[#1C2027] border-b border-white/[0.08] shrink-0">
        <HttpMethodBadge method={method} />
        <span className="font-mono text-xs truncate">
          <span className="text-[#5C6370]">{baseUrl}</span>
          <span className="text-[#ABB2BF]">{endpoint}</span>
        </span>
      </div>

      {/* Headers (collapsible) */}
      {activeTab === "request" && (
        <div className="border-b border-white/[0.08] shrink-0">
          <button
            onClick={() => setHeadersOpen(!headersOpen)}
            className="flex items-center gap-2 w-full px-4 py-2 text-left hover:bg-[#242A35] transition-colors"
          >
            <ChevronRight
              className={`w-3 h-3 text-[#9CA3B0] transition-transform duration-200 ${headersOpen ? "rotate-90" : ""}`}
            />
            <span className="font-mono text-xs text-[#9CA3B0]">Headers</span>
            <span className="font-mono text-[10px] text-[#9CA3B0] bg-white/[0.06] px-1.5 py-0.5 rounded">
              2
            </span>
          </button>
          {headersOpen && (
            <div className="px-4 pb-2 font-mono text-xs space-y-1">
              <div>
                <span className="text-[#C678DD]">Authorization</span>
                <span className="text-[#636D83]">: </span>
                <span className="text-[#98C379]">
                  Bearer ••••••••f3a4
                </span>
              </div>
              <div>
                <span className="text-[#C678DD]">Content-Type</span>
                <span className="text-[#636D83]">: </span>
                <span className="text-[#98C379]">application/json</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Content area */}
      <div className="relative flex-1 min-h-0 overflow-hidden">
        {isLoading && activeTab === "response" ? (
          <div className="p-4 space-y-3">
            {[70, 45, 60, 80, 50, 35].map((w, i) => (
              <div
                key={i}
                className="h-4 rounded bg-white/[0.06] shimmer"
                style={{ width: `${w}%` }}
              />
            ))}
          </div>
        ) : activeTab === "request" ? (
          requestBody ? (
            <>
              <CodeBlock data={requestBody} />
              <CopyButton
                text={jsonToString(requestBody)}
                className="absolute top-2 right-2"
              />
            </>
          ) : (
            <div className="p-4 text-xs font-mono text-[#5C6370] italic">
              No request body
            </div>
          )
        ) : response ? (
          <>
            <CodeBlock data={response} autoScroll={autoScroll} />
            <CopyButton
              text={jsonToString(response)}
              className="absolute top-2 right-2"
            />
          </>
        ) : (
          <div className="p-4 text-xs font-mono text-[#5C6370] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#5C6370]/50" />
            Waiting for request...
          </div>
        )}
      </div>
    </div>
  );
}
