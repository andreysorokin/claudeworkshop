#!/usr/bin/env -S npx tsx

import fs from "node:fs";

type HookInput = {
  tool_name?: string;
  tool_input?: {
    file_path?: string;
  };
};

const STANDARD_H2 = ["Approved Work Items", "Proposed Additions", "Pending Decisions"];

const input = JSON.parse(fs.readFileSync(0, "utf8")) as HookInput;
const filePath = input.tool_input?.file_path ?? "";
const isMarkdown = filePath.endsWith(".md") || filePath.endsWith(".mdx");
const normalized = filePath.replace(/\\/g, "/");
const inDraft = /(?:^|\/)docs\/draft\//.test(normalized);

if (!isMarkdown || !inDraft || !fs.existsSync(filePath)) {
  process.exit(0);
}

const content = fs.readFileSync(filePath, "utf8");

const updated = content
  .split("\n")
  .map((line) => {
    const match = line.match(/^(##) (.+)$/);
    if (!match) return line;

    const hashes = match[1];
    const title = match[2];

    if (title.includes("[NON-STANDARD SECTION]")) return line;

    const isStandard = STANDARD_H2.some(
      (h) => title.toLowerCase() === h.toLowerCase()
    );

    return isStandard ? line : `${hashes} ${title} [NON-STANDARD SECTION]`;
  })
  .join("\n");

if (updated !== content) {
  fs.writeFileSync(filePath, updated, "utf8");
}

process.exit(0);
