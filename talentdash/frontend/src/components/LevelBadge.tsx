"use client";
import { levelColor } from "@/lib/api";

export function LevelBadge({ level }: { level: string }) {
  const color = levelColor(level);
  return (
    <span
      className="inline-flex items-center justify-center px-1.5 py-0.5 rounded text-[10px] font-bold font-mono tracking-tighter"
      style={{ background: `${color}20`, color, border: `1px solid ${color}40` }}
    >
      {level}
    </span>
  );
}
