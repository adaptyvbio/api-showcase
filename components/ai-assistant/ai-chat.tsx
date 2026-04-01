"use client";

import { useState } from "react";
import { Send, Bot, User, Loader2, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ExampleBlock } from "@/components/shared/example-block";
import { cn } from "@/lib/utils";

function MessageContent({ text }: { text: string }) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return (
    <span>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={i}>{part.slice(2, -2)}</strong>;
        }
        return <span key={i}>{part}</span>;
      })}
    </span>
  );
}

function JsonBlock({ data, className }: { data: unknown; className?: string }) {
  return (
    <pre className={cn("font-mono whitespace-pre-wrap", className)}>
      {JSON.stringify(data, null, 2)}
    </pre>
  );
}

interface ToolCall {
  name: string;
  input: Record<string, unknown>;
  output: unknown;
  timing?: number;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  toolCalls?: ToolCall[];
}

// Mock AI responses with tool calls
const MOCK_RESPONSES: Record<string, { content: string; toolCalls: ToolCall[] }> = {
  default: {
    content:
      "I can help you explore the Adaptyv Foundry API. Try asking me to search for protein targets, estimate experiment costs, or check experiment status.",
    toolCalls: [],
  },
  her2: {
    content:
      "I found several HER2 targets available. The most popular is **Human Her2 / ErbB2 (498-648) Protein, His Tag** from Acro Biosystems, priced at $17.49 per sequence. Would you like me to estimate the cost for an affinity experiment with this target?",
    toolCalls: [
      {
        name: "search_targets",
        input: { query: "HER2" },
        output: {
          items: [
            {
              name: "Human Her2 / ErbB2 (498-648) Protein, His Tag",
              vendor_name: "Acro",
              pricing: { price_per_sequence_cents: 1749 },
            },
          ],
          total: 12,
        },
        timing: 342,
      },
    ],
  },
  cost: {
    content:
      "The estimated cost for a BLI affinity experiment with 2 sequences against HER2 is **$432.98**. This breaks down to $398.00 for the assay and $34.98 for materials.",
    toolCalls: [
      {
        name: "search_targets",
        input: { query: "HER2" },
        output: { items: [{ id: "her2-uuid", name: "Human Her2" }], total: 1 },
        timing: 298,
      },
      {
        name: "estimate_cost",
        input: {
          experiment_type: "affinity",
          method: "bli",
          target_id: "her2-uuid",
          sequence_count: 2,
        },
        output: {
          breakdown: {
            assay: { subtotal_cents: 39800 },
            materials: { subtotal_cents: 3498 },
            total_cents: 43298,
          },
        },
        timing: 156,
      },
    ],
  },
  experiment: {
    content:
      'I\'ve created a new experiment **ABS-001-042** for you. It\'s currently in "draft" status. You can view it in the Foundry portal to confirm and start the process.',
    toolCalls: [
      {
        name: "create_experiment",
        input: {
          experiment_type: "affinity",
          method: "bli",
          target_id: "her2-uuid",
          sequences: { seq_1: "EVQLVESGGGLVQPGG..." },
        },
        output: {
          experiment_id: "019d4a2b-3c5e-7890-abcd-1234567890ab",
          code: "ABS-001-042",
          status: "draft",
        },
        timing: 412,
      },
    ],
  },
};

function getMockResponse(text: string) {
  const lower = text.toLowerCase();
  if (lower.includes("cost") || lower.includes("price") || lower.includes("estimate"))
    return MOCK_RESPONSES.cost;
  if (lower.includes("experiment") || lower.includes("create") || lower.includes("submit"))
    return MOCK_RESPONSES.experiment;
  if (
    lower.includes("her2") ||
    lower.includes("search") ||
    lower.includes("target") ||
    lower.includes("find")
  )
    return MOCK_RESPONSES.her2;
  return MOCK_RESPONSES.default;
}

export function AiChat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [toolCallLog, setToolCallLog] = useState<ToolCall[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { role: "user", content: input };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setIsLoading(true);

    // Simulate AI thinking
    await new Promise((r) => setTimeout(r, 800));

    const response = getMockResponse(input);
    const assistantMsg: Message = {
      role: "assistant",
      content: response.content,
      toolCalls: response.toolCalls,
    };
    setMessages((m) => [...m, assistantMsg]);
    setToolCallLog((t) => [...t, ...response.toolCalls]);
    setIsLoading(false);
  };

  return (
    <ExampleBlock
      id="ai-assistant"
      number={6}
      title="AI Assistant"
      description='Chat with an AI that can search targets, estimate costs, and create experiments. Try "Search for HER2 targets" or "Estimate cost for a BLI experiment".'
      isLive={false}
      left={
        <div className="flex flex-col h-full min-h-[400px]">
          {/* Messages */}
          <div className="flex-1 overflow-auto space-y-4 mb-4">
            {messages.length === 0 && (
              <div className="py-8 space-y-2">
                <p className="text-sm text-muted-foreground mb-3">
                  Try these example prompts:
                </p>
                {[
                  "Search for HER2 targets",
                  "Estimate cost for a BLI experiment",
                  "Create an experiment",
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setInput(suggestion)}
                    className="block w-full text-left px-3 py-2.5 rounded-lg border border-border text-sm text-[#3C4257] hover:bg-muted hover:border-[#D4D4D8] transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={cn(
                  "flex gap-3",
                  msg.role === "user" ? "justify-end" : ""
                )}
              >
                {msg.role === "assistant" && (
                  <div className="w-7 h-7 rounded-full bg-accent-blue/10 flex items-center justify-center shrink-0">
                    <Bot className="w-3.5 h-3.5 text-accent-blue" />
                  </div>
                )}
                <div
                  className={cn(
                    "rounded-xl px-4 py-2.5 text-sm max-w-[85%]",
                    msg.role === "user"
                      ? "bg-accent-blue text-white"
                      : "bg-muted"
                  )}
                >
                  {msg.toolCalls && msg.toolCalls.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {msg.toolCalls.map((tc, j) => (
                        <Badge
                          key={j}
                          variant="outline"
                          className="text-[10px] font-mono bg-background/50"
                        >
                          <Wrench className="w-2.5 h-2.5 mr-0.5" />
                          {tc.name}
                          {tc.timing && (
                            <span className="ml-1 text-muted-foreground">
                              {tc.timing}ms
                            </span>
                          )}
                        </Badge>
                      ))}
                    </div>
                  )}
                  <MessageContent text={msg.content} />
                </div>
                {msg.role === "user" && (
                  <div className="w-7 h-7 rounded-full bg-foreground/5 flex items-center justify-center shrink-0">
                    <User className="w-3.5 h-3.5 text-foreground/60" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-accent-blue/10 flex items-center justify-center shrink-0">
                  <Bot className="w-3.5 h-3.5 text-accent-blue" />
                </div>
                <div className="rounded-xl px-4 py-2.5 bg-muted flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Thinking...
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about the API..."
              className="h-10"
            />
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-accent-blue hover:bg-accent-blue-hover text-white h-10 px-3"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      }
      right={
        <div className="flex flex-col h-full">
          <div className="bg-code-header px-4 py-2.5 border-b border-white/[0.08] flex items-center gap-2">
            <Wrench className="w-3.5 h-3.5 text-[#9CA3B0]" />
            <span className="text-xs font-medium text-[#E4E4E7]">
              Tool Calls
            </span>
            {toolCallLog.length > 0 && (
              <Badge
                variant="outline"
                className="text-[10px] font-mono ml-auto border-white/[0.08] text-[#9CA3B0]"
              >
                {toolCallLog.length}
              </Badge>
            )}
          </div>

          <div className="flex-1 overflow-auto code-scroll p-4 space-y-3">
            {toolCallLog.length === 0 ? (
              <div className="text-xs font-mono text-[#6B7280] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#6B7280]/50" />
                No tool calls yet...
              </div>
            ) : (
              toolCallLog.map((tc, i) => (
                <div
                  key={i}
                  className="rounded-md border border-white/[0.08] overflow-hidden"
                >
                  <div className="px-3 py-2 bg-code-header flex items-center gap-2">
                    <span className="text-[11px] font-mono font-medium text-accent-blue">
                      {tc.name}
                    </span>
                    {tc.timing && (
                      <span className="text-[10px] font-mono text-[#6B7280] ml-auto">
                        {tc.timing}ms
                      </span>
                    )}
                  </div>
                  <div className="p-3 space-y-2">
                    <div>
                      <div className="text-[10px] font-mono text-[#6B7280] uppercase tracking-wider mb-1">
                        Input
                      </div>
                      <JsonBlock data={tc.input} className="text-[11px] leading-relaxed text-[#E4E4E7]" />
                    </div>
                    <div>
                      <div className="text-[10px] font-mono text-[#6B7280] uppercase tracking-wider mb-1">
                        Output
                      </div>
                      <JsonBlock data={tc.output} className="text-[11px] leading-relaxed max-h-[120px] overflow-auto code-scroll text-[#E4E4E7]" />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      }
    />
  );
}
