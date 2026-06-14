#!/usr/bin/env -S npx tsx

import fs from "node:fs";

type HookInput = {
  tool_name?: string;
  tool_input?: {
    file_path?: string;
  };
};

const input = JSON.parse(fs.readFileSync(0, "utf8")) as HookInput;
const filePath = input.tool_input?.file_path ?? "";
const isMarkdown = filePath.endsWith(".md") || filePath.endsWith(".mdx");

if (isMarkdown) {
  const normalized = filePath.replace(/\\/g, "/");
  const inDraft = /(?:^|\/)docs\/draft\//.test(normalized);

  if (!inDraft) {
    console.log(
      JSON.stringify({
        decision: "block",
        reason: `Markdown files may only be created inside docs/draft/. Attempted path: ${filePath}`,
      })
    );
    process.exit(0);
  }
}

console.log(JSON.stringify({ decision: "allow" }));
