#!/usr/bin/env tsx
import Anthropic from "@anthropic-ai/sdk";
import * as fs from "fs";
import * as path from "path";
import {
  SYSTEM_PROMPT,
  QUERY_GENERATION_PROMPT,
  SCORING_PROMPT,
  ARTICLE_PROMPT,
} from "./prompts";
import { saveArticleToNotion } from "./notion";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const CONTENT_DIR = path.join(process.cwd(), "content", "articles");

interface Query {
  rank: number;
  query: string;
  category: string;
  intent: string;
  score?: number;
  why?: string;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
    .slice(0, 80);
}

function buildFrontmatter(
  title: string,
  subheadline: string,
  category: string,
  query: string,
  imageId: number
): string {
  const date = new Date().toISOString().split("T")[0];

  return `---
title: "${title.replace(/"/g, '\\"')}"
subheadline: "${subheadline.replace(/"/g, '\\"')}"
category: "${category}"
date: "${date}"
image: "https://picsum.photos/seed/${imageId}/1200/630"
query: "${query.replace(/"/g, '\\"')}"
draft: true
---

`;
}

function extractTitleAndSub(markdown: string): {
  title: string;
  subheadline: string;
  body: string;
} {
  const lines = markdown.trim().split("\n");
  let title = "";
  let subheadline = "";
  let bodyStart = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!title && line.startsWith("# ")) {
      title = line.replace(/^#+\s*/, "");
      bodyStart = i + 1;
    } else if (title && !subheadline && line && !line.startsWith("#")) {
      subheadline = line;
      bodyStart = i + 1;
      break;
    }
  }

  const body = lines.slice(bodyStart).join("\n").trim();
  return { title, subheadline, body };
}

function getExistingTitles(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const raw = fs.readFileSync(path.join(CONTENT_DIR, f), "utf-8");
      const match = raw.match(/^title:\s*"(.+)"/m);
      return match ? match[1] : f.replace(".md", "");
    });
}

async function generateQueries(): Promise<Query[]> {
  const existing = getExistingTitles();
  const avoidBlock =
    existing.length > 0
      ? `\n\nALREADY PUBLISHED — do NOT generate queries that would produce similar articles to these titles:\n${existing.map((t) => `- ${t}`).join("\n")}`
      : "";

  console.log(`📋 Generating 60 SEO queries (avoiding ${existing.length} existing articles)...`);

  const stream = client.messages.stream({
    model: "claude-opus-4-7",
    max_tokens: 4000,
    thinking: { type: "adaptive" },
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: QUERY_GENERATION_PROMPT + avoidBlock }],
  });

  const response = await stream.finalMessage();
  const text = response.content
    .filter((b) => b.type === "text")
    .map((b) => (b as Anthropic.TextBlock).text)
    .join("");

  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) throw new Error("Failed to extract query JSON");

  const queries: Query[] = JSON.parse(jsonMatch[0]);
  console.log(`✓ Generated ${queries.length} queries`);
  return queries;
}

async function scoreAndPick(queries: Query[]): Promise<Query[]> {
  console.log("🎯 Scoring queries and picking top 5...");

  const queriesJson = JSON.stringify(queries, null, 2);
  const prompt = SCORING_PROMPT.replace("{QUERIES}", queriesJson);

  const stream = client.messages.stream({
    model: "claude-opus-4-7",
    max_tokens: 2000,
    thinking: { type: "adaptive" },
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: prompt }],
  });

  const response = await stream.finalMessage();
  const text = response.content
    .filter((b) => b.type === "text")
    .map((b) => (b as Anthropic.TextBlock).text)
    .join("");

  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) throw new Error("Failed to extract scored queries JSON");

  const top5: Query[] = JSON.parse(jsonMatch[0]);
  console.log("✓ Top 5 selected:");
  top5.forEach((q, i) => console.log(`  ${i + 1}. [${q.category}] "${q.query}" (score: ${q.score})`));
  return top5;
}

async function writeArticle(q: Query): Promise<string> {
  console.log(`\n✍️  Writing: "${q.query}"`);

  const userPrompt = ARTICLE_PROMPT.replace("{QUERY}", q.query)
    .replace("{CATEGORY}", q.category)
    .replace("{INTENT}", q.intent);

  const stream = client.messages.stream({
    model: "claude-opus-4-7",
    max_tokens: 3000,
    thinking: { type: "adaptive" },
    system: SYSTEM_PROMPT,
    tools: [
      {
        type: "web_search_20250305" as const,
        name: "web_search",
        max_uses: 4,
      },
    ],
    messages: [{ role: "user", content: userPrompt }],
  });

  const response = await stream.finalMessage();
  const text = response.content
    .filter((b) => b.type === "text")
    .map((b) => (b as Anthropic.TextBlock).text)
    .join("");

  return text;
}

async function saveArticle(markdown: string, q: Query): Promise<string> {
  const { title, subheadline, body } = extractTitleAndSub(markdown);
  const slug = slugify(title || q.query);
  const date = new Date().toISOString().split("T")[0];
  const imageId = Math.floor(Math.random() * 900) + 100;
  const image = `https://picsum.photos/seed/${imageId}/1200/630`;

  // Save locally as draft: true (hidden from site until approved)
  const frontmatter = buildFrontmatter(title, subheadline, q.category, q.query, imageId);
  const full = frontmatter + `# ${title}\n\n${subheadline}\n\n${body}`;
  const filepath = path.join(CONTENT_DIR, `${slug}.md`);
  fs.writeFileSync(filepath, full, "utf-8");
  console.log(`  ✓ Saved locally (draft) → content/articles/${slug}.md`);

  // Push to Notion for review
  const notionId = await saveArticleToNotion({
    title,
    subheadline,
    category: q.category,
    date,
    image,
    slug,
    query: q.query,
    score: q.score ?? 0,
    body: `# ${title}\n\n${subheadline}\n\n${body}`,
  });
  console.log(`  ✓ Saved to Notion (Draft Ready) → ${notionId}`);

  return slug;
}


async function run(): Promise<void> {
  console.log("🔄 The Pattern — Article Pipeline\n");

  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY environment variable is required");
  }

  if (!fs.existsSync(CONTENT_DIR)) {
    fs.mkdirSync(CONTENT_DIR, { recursive: true });
  }

  const allQueries = await generateQueries();
  const top5 = await scoreAndPick(allQueries);

  const slugs: string[] = [];
  for (const q of top5) {
    const markdown = await writeArticle(q);
    const slug = await saveArticle(markdown, q);
    slugs.push(slug);
  }

  console.log(`\n✅ Done — ${slugs.length} articles saved as drafts.`);
  console.log(`👉 Review and approve in Notion, then run: npm run publish`);
}

run().catch((err) => {
  console.error("Pipeline failed:", err);
  process.exit(1);
});
