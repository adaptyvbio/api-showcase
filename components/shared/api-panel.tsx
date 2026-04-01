"use client";

import { cn, syntaxHighlightJson } from "@/lib/utils";
import { Copy, Check } from "lucide-react";
import { useState, useCallback } from "react";

interface ApiPanelProps {
  method: "GET" | "POST";
  endpoint: string;
  requestBody?: unknown;
  response?: unknown;
  responseStatus?: number | null;
  isLoading?: boolean;
  activeTab?: "request" | "response";
  onTabChange?: (tab: "request" | "response") => void;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = useCallback(() => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [text]);

  return (
    <button
      onClick={copy}
      className="absolute top-3 right-3 p-1.5 rounded-md hover:bg-code-hover text-[#9CA3B0] hover:text-[#E4E4E7] transition-colors"
    >
      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

function StatusBadge({ status }: { status: number }) {
  const color =
    status < 300
      ? "text-success bg-success-muted"
      : status < 500
        ? "text-warning bg-warning-muted"
        : "text-error bg-error-muted";

  return (
    <span
      className={cn(
        "px-1.5 py-0.5 rounded text-[10px] font-mono font-medium",
        color
      )}
    >
      {status}
    </span>
  );
}

function MethodBadge({ method }: { method: "GET" | "POST" }) {
  return (
    <span
      className={cn(
        "px-1.5 py-0.5 rounded text-[10px] font-mono font-bold",
        method === "GET"
          ? "text-success bg-success-muted"
          : "text-accent-blue bg-accent-blue-muted"
      )}
    >
      {method}
    </span>
  );
}

export function ApiPanel({
  method,
  endpoint,
  requestBody,
  response,
  responseStatus,
  isLoading,
  activeTab = "request",
  onTabChange,
}: ApiPanelProps) {
  const [tab, setTab] = useState(activeTab);
  const currentTab = onTabChange ? activeTab : tab;
  const handleTab = (t: "request" | "response") => {
    onTabChange ? onTabChange(t) : setTab(t);
  };

  const requestJson = requestBody ? JSON.stringify(requestBody, null, 2) : null;
  const responseJson = response ? JSON.stringify(response, null, 2) : null;

  return (
    <div className="flex flex-col h-full">
      {/* Tab bar */}
      <div className="bg-code-header flex items-center gap-1 px-4 py-2 border-b border-white/[0.08]">
        <button
          onClick={() => handleTab("request")}
          className={cn(
            "px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
            currentTab === "request"
              ? "bg-code-bg text-[#E4E4E7]"
              : "text-[#9CA3B0] hover:text-[#E4E4E7]"
          )}
        >
          Request
        </button>
        <button
          onClick={() => handleTab("response")}
          className={cn(
            "px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
            currentTab === "response"
              ? "bg-code-bg text-[#E4E4E7]"
              : "text-[#9CA3B0] hover:text-[#E4E4E7]"
          )}
        >
          Response
        </button>
        {responseStatus != null && (
          <div className="ml-auto">
            <StatusBadge status={responseStatus} />
          </div>
        )}
      </div>

      {/* URL bar */}
      <div className="px-4 py-2.5 border-b border-white/[0.08] flex items-center gap-2">
        <MethodBadge method={method} />
        <span className="font-mono text-xs text-[#9CA3B0] truncate">
          <span className="text-[#6B7280]">/api/v1</span>
          <span className="text-[#E4E4E7]">{endpoint}</span>
        </span>
      </div>

      {/* Headers */}
      <div className="px-4 py-2 border-b border-white/[0.08]">
        <div className="text-[10px] font-mono text-[#6B7280] uppercase tracking-wider mb-1">
          Headers
        </div>
        <div className="font-mono text-[11px] text-[#9CA3B0] space-y-0.5">
          <div>
            <span className="syntax-key">Authorization</span>:{" "}
            <span className="syntax-string">Bearer abs0_****</span>
          </div>
          <div>
            <span className="syntax-key">Content-Type</span>:{" "}
            <span className="syntax-string">application/json</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 relative overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 bg-code-bg/80 flex items-center justify-center z-10">
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-accent-blue animate-bounce"
                  style={{ animationDelay: `${i * 150}ms` }}
                />
              ))}
            </div>
          </div>
        )}

        {currentTab === "request" && requestJson && (
          <div className="p-4 overflow-auto code-scroll max-h-[350px] relative">
            <CopyButton text={requestJson} />
            <pre
              className="font-mono text-[13px] leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: syntaxHighlightJson(requestBody),
              }}
            />
          </div>
        )}

        {currentTab === "request" && !requestJson && (
          <div className="p-4 text-[13px] font-mono text-[#6B7280]">
            No request body
          </div>
        )}

        {currentTab === "response" && responseJson && (
          <div className="p-4 overflow-auto code-scroll max-h-[350px] relative">
            <CopyButton text={responseJson} />
            <pre
              className="font-mono text-[13px] leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: syntaxHighlightJson(response),
              }}
            />
          </div>
        )}

        {currentTab === "response" && !responseJson && (
          <div className="p-4 text-[13px] font-mono text-[#6B7280] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#6B7280]/50" />
            Waiting for request...
          </div>
        )}
      </div>
    </div>
  );
}
