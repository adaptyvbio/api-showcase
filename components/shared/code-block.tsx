"use client";

import { useMemo, Fragment } from "react";

interface CodeBlockProps {
  data: unknown;
  maxHeight?: string;
}

function esc(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n").replace(/\t/g, "\\t");
}

function renderJson(value: unknown, indent = 0): React.ReactNode[] {
  const pad = "  ".repeat(indent);
  const inner = "  ".repeat(indent + 1);

  if (value === null) return [<span className="text-[#56B6C2]">null</span>];
  if (typeof value === "boolean")
    return [<span className="text-[#56B6C2]">{String(value)}</span>];
  if (typeof value === "number")
    return [<span className="text-[#D19A66]">{String(value)}</span>];
  if (typeof value === "string") {
    const display = value.length > 120 ? value.slice(0, 117) + "..." : value;
    return [
      <span className="text-[#98C379]">
        &quot;{esc(display)}&quot;
      </span>,
    ];
  }

  if (Array.isArray(value)) {
    if (value.length === 0)
      return [<span className="text-[#636D83]">[]</span>];
    const nodes: React.ReactNode[] = [];
    nodes.push(<span className="text-[#636D83]">[</span>, "\n");
    value.forEach((item, i) => {
      nodes.push(inner, ...renderJson(item, indent + 1));
      if (i < value.length - 1)
        nodes.push(<span className="text-[#636D83]">,</span>);
      nodes.push("\n");
    });
    nodes.push(pad, <span className="text-[#636D83]">]</span>);
    return nodes;
  }

  if (typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>);
    if (entries.length === 0)
      return [<span className="text-[#636D83]">{"{}"}</span>];
    const nodes: React.ReactNode[] = [];
    nodes.push(<span className="text-[#636D83]">{"{"}</span>, "\n");
    entries.forEach(([key, val], i) => {
      nodes.push(
        inner,
        <span className="text-[#E06C75]">&quot;{key}&quot;</span>,
        <span className="text-[#636D83]">: </span>,
        ...renderJson(val, indent + 1)
      );
      if (i < entries.length - 1)
        nodes.push(<span className="text-[#636D83]">,</span>);
      nodes.push("\n");
    });
    nodes.push(pad, <span className="text-[#636D83]">{"}"}</span>);
    return nodes;
  }

  return [String(value)];
}

export function CodeBlock({ data, maxHeight = "400px" }: CodeBlockProps) {
  const elements = useMemo(() => {
    const nodes = renderJson(data);
    return nodes.map((node, i) => <Fragment key={i}>{node}</Fragment>);
  }, [data]);

  return (
    <div className="relative">
      <pre
        className="font-mono text-[12px] leading-[1.7] p-4 overflow-auto code-scroll text-[#ABB2BF] select-text"
        style={{ maxHeight }}
      >
        <code>{elements}</code>
      </pre>
    </div>
  );
}

export function jsonToString(data: unknown): string {
  return JSON.stringify(data, null, 2);
}
