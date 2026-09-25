"use client";

import dynamic from "next/dynamic";
import type { SearchIndex } from "@/lib/search";

const AskAkshayAI = dynamic(
  () => import("@/components/AskAkshayAI").then((m) => ({ default: m.AskAkshayAI })),
  { ssr: false },
);

export function LazyAskAkshayAI({ index }: { index: SearchIndex }) {
  return <AskAkshayAI index={index} />;
}
