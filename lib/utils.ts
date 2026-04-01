import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCents(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

export function formatKd(kd: number): string {
  if (kd < 1e-9) return `${(kd * 1e12).toFixed(1)} pM`;
  if (kd < 1e-6) return `${(kd * 1e9).toFixed(1)} nM`;
  if (kd < 1e-3) return `${(kd * 1e6).toFixed(1)} \u00B5M`;
  return `${(kd * 1e3).toFixed(1)} mM`;
}

export function formatScientific(n: number): string {
  return n.toExponential(2);
}

export function syntaxHighlightJson(json: unknown, indent = 2): string {
  const str = JSON.stringify(json, null, indent);
  return str
    .replace(
      /("(?:\\.|[^"\\])*")\s*:/g,
      '<span class="syntax-key">$1</span>:'
    )
    .replace(
      /:\s*("(?:\\.|[^"\\])*")/g,
      ': <span class="syntax-string">$1</span>'
    )
    .replace(
      /:\s*(-?\d+\.?\d*(?:e[+-]?\d+)?)/gi,
      ': <span class="syntax-number">$1</span>'
    )
    .replace(
      /:\s*(true|false)/g,
      ': <span class="syntax-boolean">$1</span>'
    )
    .replace(
      /:\s*(null)/g,
      ': <span class="syntax-null">$1</span>'
    );
}
