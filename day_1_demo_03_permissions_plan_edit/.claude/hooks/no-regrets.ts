#!/usr/bin/env -S npx tsx

import fs from "node:fs";

type HookInput = {
  tool_name?: string;
  tool_input?: {
    file_path?: string;
    content?: string;
    new_string?: string;
    edits?: Array<{
      new_string?: string;
    }>;
  };
};

const input = JSON.parse(fs.readFileSync(0, "utf8")) as HookInput;

const toolInput = input.tool_input ?? {};
const filePath = (toolInput.file_path ?? "").toLowerCase();

const isMarkdown =
  filePath.endsWith(".md") ||
  filePath.endsWith(".mdx");

const candidateText = [
  toolInput.content,
  toolInput.new_string,
  ...(toolInput.edits ?? []).map(edit => edit.new_string)
]
  .filter((value): value is string => Boolean(value))
  .join("\n");

const containsRegret = /regret/i.test(candidateText);

if (isMarkdown && containsRegret) {
  console.log(JSON.stringify({
    decision: "block",
    reason: "no regrets, they don't work"
  }));
  process.exit(0);
}

console.log(JSON.stringify({ decision: "allow" }));
