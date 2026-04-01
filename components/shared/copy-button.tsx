"use client";

import { useState, useCallback } from "react";
import { Copy, Check } from "lucide-react";

interface CopyButtonProps {
  text: string;
  className?: string;
}

export function CopyButton({ text, className = "" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [text]);

  return (
    <button
      onClick={handleCopy}
      className={`w-8 h-8 flex items-center justify-center rounded-md transition-colors duration-150 hover:bg-white/[0.06] ${className}`}
      aria-label={copied ? "Copied" : "Copy to clipboard"}
    >
      {copied ? (
        <Check className="w-4 h-4 text-[#22C55E]" />
      ) : (
        <Copy className="w-4 h-4 text-[#9CA3B0] hover:text-[#E4E4E7]" />
      )}
    </button>
  );
}
