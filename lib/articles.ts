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
      const { data } = matter(raw);
      return {
        slug,
        title: data.title ?? slug,
        subheadline: data.subheadline ?? "",
        category: data.category ?? "uncategorized",
        date: data.date ?? "",
        image: data.image ?? `https://picsum.photos/seed/${slug}/1200/630`,
        draft: data.draft ?? false,
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

  const processed = await remark().use(remarkHtml).process(content);
  const contentHtml = processed.toString();

  return {
    slug,
    title: data.title ?? slug,
    subheadline: data.subheadline ?? "",
    category: data.category ?? "uncategorized",
    date: data.date ?? "",
    image: data.image ?? `https://picsum.photos/seed/${slug}/1200/630`,
    draft: data.draft ?? false,
    contentHtml,
  };
}
