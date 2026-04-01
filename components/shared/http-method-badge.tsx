const METHOD_COLORS: Record<string, string> = {
  GET: "text-[#4BCA2E]",
  POST: "text-[#61AFEF]",
  PUT: "text-[#D19A66]",
  DELETE: "text-[#E06C75]",
};

export function HttpMethodBadge({ method }: { method: string }) {
  return (
    <span
      className={`font-mono text-[11px] font-semibold tracking-[0.02em] ${METHOD_COLORS[method] ?? "text-[#ABB2BF]"}`}
    >
      {method}
    </span>
  );
}
