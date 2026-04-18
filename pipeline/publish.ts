#!/usr/bin/env tsx
import * as fs from "fs";
import * as path from "path";
import { execSync } from "child_process";
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

    if (!fs.existsSync(filepath)) {
      console.warn(`  ⚠ File not found: content/articles/${article.slug}.md — skipping`);
      continue;
    }

    const existing = fs.readFileSync(filepath, "utf-8");
    if (!existing.includes("draft: true")) {
      console.log(`  ℹ Already published: ${article.slug} — marking Posted in Notion`);
      await markAsPosted(article.notionId);
      continue;
    }

    // Read edited content back from Notion
    console.log(`  ↓ Fetching edited content from Notion...`);
    const { title, subheadline, body, image } = await getArticleFromNotion(article.notionId);

    // Preserve frontmatter from local file, sync all edited fields, flip draft
    let updatedFile = existing
      .replace(/^title:.*$/m, `title: "${title.replace(/"/g, '\\"')}"`)
      .replace(/^subheadline:.*$/m, `subheadline: "${subheadline.replace(/"/g, '\\"')}"`)
      .replace("draft: true", "draft: false")
      .replace(/^# .+\n\n.+\n\n[\s\S]*/m, `# ${title}\n\n${subheadline}\n\n${body}`);

    if (image) {
      updatedFile = updatedFile.replace(/^image:.*$/m, `image: "${image}"`);
    }

    fs.writeFileSync(filepath, updatedFile, "utf-8");
    console.log(`  ✓ Updated with Notion edits: content/articles/${article.slug}.md`);

    await markAsPosted(article.notionId);
    console.log(`  ✓ Marked as Posted in Notion`);

    published.push(article.slug);
  }

  if (published.length === 0) {
    console.log("\nNothing new to push.");
    return;
  }

  console.log("\n🚀 Committing and pushing to GitHub...");
  if (process.env.CI) {
    execSync(`git config user.name "Pipeline Bot"`, { stdio: "inherit" });
    execSync(`git config user.email "pipeline@the-pattern.xyz"`, { stdio: "inherit" });
  }
  const files = published.map((s) => `content/articles/${s}.md`).join(" ");
  execSync(`cd ${process.cwd()} && git add ${files}`, { stdio: "inherit" });
  const msg = `content: publish ${published.length} approved article(s) [${new Date().toISOString().split("T")[0]}]`;
  execSync(`cd ${process.cwd()} && git commit -m "${msg}"`, { stdio: "inherit" });
  execSync(`cd ${process.cwd()} && git push origin main`, { stdio: "inherit" });

  console.log(`\n✅ Published ${published.length} article(s) — Vercel auto-deploying.`);
}

run().catch((err) => {
  console.error("Publish failed:", err);
  process.exit(1);
});
