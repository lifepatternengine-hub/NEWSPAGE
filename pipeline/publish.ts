#!/usr/bin/env tsx
import * as fs from "fs";
import * as path from "path";
import { getApprovedArticles, getArticleFromNotion, markAsPosted } from "./notion";

const CONTENT_DIR = path.join(process.cwd(), "content", "articles");

async function run(): Promise<void> {
  console.log("📤 The Pattern — Publish Pipeline\n");

  if (!process.env.NOTION_API_KEY) throw new Error("NOTION_API_KEY required");

  const approved = await getApprovedArticles();

  if (approved.length === 0) {
    console.log("No approved articles in Notion. Nothing to publish.");
    return;
  }

  console.log(`Found ${approved.length} approved article(s):`);
  approved.forEach((a) => console.log(`  • "${a.title}" [${a.slug}]`));

  const published: string[] = [];

  for (const article of approved) {
    const filepath = path.join(CONTENT_DIR, `${article.slug}.md`);

    console.log(`  ↓ Fetching content from Notion...`);
    const { title, subheadline, body, image } = await getArticleFromNotion(article.notionId);

    if (fs.existsSync(filepath)) {
      const existing = fs.readFileSync(filepath, "utf-8");
      if (!existing.includes("draft: true")) {
        console.log(`  ℹ Already published: ${article.slug} — marking Posted in Notion`);
        await markAsPosted(article.notionId);
        continue;
      }
      // File exists — preserve frontmatter, sync edited fields
      let updatedFile = existing
        .replace(/^title:.*$/m, `title: "${title.replace(/"/g, '\\"')}"`)
        .replace(/^subheadline:.*$/m, `subheadline: "${subheadline.replace(/"/g, '\\"')}"`)
        .replace("draft: true", "draft: false")
        .replace(/^# .+\n\n.+\n\n[\s\S]*/m, `# ${title}\n\n${subheadline}\n\n${body}`);
      if (image) updatedFile = updatedFile.replace(/^image:.*$/m, `image: "${image}"`);
      fs.writeFileSync(filepath, updatedFile, "utf-8");
    } else {
      // File missing — build from scratch using Notion properties
      const finalImage = image || `https://picsum.photos/seed/${article.slug}/1200/630`;
      const frontmatter = `---
title: "${title.replace(/"/g, '\\"')}"
subheadline: "${subheadline.replace(/"/g, '\\"')}"
category: "${article.category}"
date: "${article.date}"
image: "${finalImage}"
query: "${article.query.replace(/"/g, '\\"')}"
draft: false
---

`;
      fs.writeFileSync(filepath, frontmatter + `# ${title}\n\n${subheadline}\n\n${body}`, "utf-8");
    }

    console.log(`  ✓ Written: content/articles/${article.slug}.md`);

    await markAsPosted(article.notionId);
    console.log(`  ✓ Marked as Posted in Notion`);

    published.push(article.slug);
  }

  if (published.length === 0) {
    console.log("\nNothing new to push.");
    return;
  }

  console.log(`\n✅ Written ${published.length} article(s) — workflow will commit and push.`);
}

run().catch((err) => {
  console.error("Publish failed:", err);
  process.exit(1);
});
