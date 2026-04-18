import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkHtml from "remark-html";

const ARTICLES_DIR = path.join(process.cwd(), "content", "articles");

export interface ArticleMeta {
  slug: string;
  title: string;
  subheadline: string;
  category: string;
  date: string;
  image: string;
  draft: boolean;
  readingTime: number; // minutes
}

function calcReadingTime(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

export interface Article extends ArticleMeta {
  contentHtml: string;
}

function ensureDir(): boolean {
  return fs.existsSync(ARTICLES_DIR);
}

export function getAllArticleSlugs(): string[] {
  if (!ensureDir()) return [];
  return fs
    .readdirSync(ARTICLES_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

export function getAllArticles(): ArticleMeta[] {
  if (!ensureDir()) return [];
  const slugs = getAllArticleSlugs();
  return slugs
    .map((slug) => {
      const filePath = path.join(ARTICLES_DIR, `${slug}.md`);
      const raw = fs.readFileSync(filePath, "utf-8");
      const { data, content } = matter(raw);
      return {
        slug,
        title: data.title ?? slug,
        subheadline: data.subheadline ?? "",
        category: data.category ?? "uncategorized",
        date: data.date ?? "",
        image: data.image ?? `https://picsum.photos/seed/${slug}/1200/630`,
        draft: data.draft ?? false,
        readingTime: calcReadingTime(content),
      } as ArticleMeta;
    })
    .filter((a) => !a.draft)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getArticlesByCategory(category: string): ArticleMeta[] {
  return getAllArticles().filter((a) => a.category === category);
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  if (!ensureDir()) return null;
  const filePath = path.join(ARTICLES_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  // Strip leading H1 and subheadline paragraph — both rendered from frontmatter
  const lines = content.trimStart().split("\n");
  let start = 0;
  if (lines[start]?.startsWith("# ")) {
    start++; // skip H1
    while (start < lines.length && lines[start].trim() === "") start++; // skip blank lines
    if (start < lines.length && !lines[start].startsWith("#")) {
      start++; // skip subheadline paragraph
      while (start < lines.length && lines[start].trim() === "") start++; // skip blank lines
    }
  }
  const body = lines.slice(start).join("\n");

  const processed = await remark().use(remarkHtml).process(body);
  const contentHtml = processed.toString();

  return {
    slug,
    title: data.title ?? slug,
    subheadline: data.subheadline ?? "",
    category: data.category ?? "uncategorized",
    date: data.date ?? "",
    image: data.image ?? `https://picsum.photos/seed/${slug}/1200/630`,
    draft: data.draft ?? false,
    readingTime: calcReadingTime(body),
    contentHtml,
  };
}
