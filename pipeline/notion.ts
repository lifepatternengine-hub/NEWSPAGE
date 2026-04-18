import { Client } from "@notionhq/client";

// Database ID and its data source ID (collection)
const DATABASE_ID = "6c425d1840164cbe84951bf6482d5959";
const DATA_SOURCE_ID = "e71b52a5-ec8d-4b38-be91-a4d3aa76ea06";

function client(): Client {
  if (!process.env.NOTION_API_KEY) throw new Error("NOTION_API_KEY required");
  return new Client({ auth: process.env.NOTION_API_KEY });
}

export interface NotionArticle {
  title: string;
  subheadline: string;
  category: string;
  date: string;
  image: string;
  slug: string;
  query: string;
  score: number;
  body: string;
}

function toBlocks(markdown: string): object[] {
  const blocks: object[] = [];

  for (const line of markdown.split("\n")) {
    const t = line.trim();
    if (!t) continue;

    if (t.startsWith("### ")) {
      blocks.push({ object: "block", type: "heading_3", heading_3: { rich_text: [{ type: "text", text: { content: t.slice(4).slice(0, 2000) } }] } });
    } else if (t.startsWith("## ")) {
      blocks.push({ object: "block", type: "heading_2", heading_2: { rich_text: [{ type: "text", text: { content: t.slice(3).slice(0, 2000) } }] } });
    } else if (t.startsWith("# ")) {
      blocks.push({ object: "block", type: "heading_1", heading_1: { rich_text: [{ type: "text", text: { content: t.slice(2).slice(0, 2000) } }] } });
    } else if (t.startsWith("> ")) {
      blocks.push({ object: "block", type: "quote", quote: { rich_text: [{ type: "text", text: { content: t.slice(2).slice(0, 2000) } }] } });
    } else {
      let text = t;
      while (text.length > 0) {
        blocks.push({ object: "block", type: "paragraph", paragraph: { rich_text: [{ type: "text", text: { content: text.slice(0, 2000) } }] } });
        text = text.slice(2000);
      }
    }

    if (blocks.length >= 98) break; // Notion hard limit per request
  }

  return blocks;
}

export async function saveArticleToNotion(article: NotionArticle): Promise<string> {
  const notion = client();

  const page = await notion.pages.create({
    parent: { database_id: DATABASE_ID } as any,
    cover: { type: "external", external: { url: article.image } },
    properties: {
      Title: { title: [{ text: { content: article.title } }] },
      Status: { select: { name: "Draft Ready" } },
      Category: { select: { name: article.category } },
      Generated: { date: { start: article.date } },
      Slug: { rich_text: [{ text: { content: article.slug } }] },
      "SEO Query": { rich_text: [{ text: { content: article.query.slice(0, 2000) } }] },
      Score: { number: article.score },
    } as any,
    children: [
      {
        object: "block",
        type: "paragraph",
        paragraph: { rich_text: [{ type: "text", text: { content: article.subheadline }, annotations: { italic: true } }] },
      },
      { object: "block", type: "divider", divider: {} },
      ...toBlocks(article.body),
    ] as any,
  });

  return page.id;
}

function blockToMarkdown(block: any): string {
  const text = (richText: any[]) =>
    (richText ?? []).map((t: any) => t.text?.content ?? "").join("");

  switch (block.type) {
    case "heading_1": return `# ${text(block.heading_1.rich_text)}`;
    case "heading_2": return `## ${text(block.heading_2.rich_text)}`;
    case "heading_3": return `### ${text(block.heading_3.rich_text)}`;
    case "quote":     return `> ${text(block.quote.rich_text)}`;
    case "paragraph": return text(block.paragraph.rich_text);
    default:          return "";
  }
}

export interface ArticleContent {
  title: string;
  subheadline: string;
  body: string;
  image: string;
}

export async function getArticleFromNotion(notionId: string): Promise<ArticleContent> {
  const notion = client();

  const [page, blocksRes] = await Promise.all([
    notion.pages.retrieve({ page_id: notionId }),
    notion.blocks.children.list({ block_id: notionId, page_size: 100 }),
  ]);

  const title =
    (page as any).properties?.Title?.title?.[0]?.text?.content ?? "";

  const cover = (page as any).cover;
  const image =
    cover?.type === "external" ? cover.external.url :
    cover?.type === "file"     ? cover.file.url : "";

  // Page structure: [subheadline paragraph] [divider] [article blocks...]
  const blocks = blocksRes.results as any[];
  let subheadline = "";
  const bodyLines: string[] = [];
  let pastDivider = false;

  for (const block of blocks) {
    if (!pastDivider) {
      if (block.type === "divider") { pastDivider = true; continue; }
      if (block.type === "paragraph") {
        subheadline = (block.paragraph.rich_text ?? [])
          .map((t: any) => t.text?.content ?? "").join("");
      }
      continue;
    }
    const line = blockToMarkdown(block);
    if (line) bodyLines.push(line);
  }

  return { title, subheadline, body: bodyLines.join("\n\n"), image };
}

export interface ApprovedArticle {
  notionId: string;
  slug: string;
  title: string;
  category: string;
  date: string;
  query: string;
}

export async function getApprovedArticles(): Promise<ApprovedArticle[]> {
  const notion = client();

  const res = await notion.dataSources.query({
    data_source_id: DATA_SOURCE_ID,
  });

  return res.results
    .filter((page: any) => page.properties?.Status?.select?.name === "Approved")
    .map((page: any) => ({
    notionId: page.id,
    slug: page.properties.Slug?.rich_text?.[0]?.text?.content ?? "",
    title: page.properties.Title?.title?.[0]?.text?.content ?? "",
    category: page.properties.Category?.select?.name ?? "reinvention",
    date: page.properties.Generated?.date?.start ?? new Date().toISOString().split("T")[0],
    query: page.properties["SEO Query"]?.rich_text?.[0]?.text?.content ?? "",
  }));
}

export async function markAsPosted(notionId: string): Promise<void> {
  const notion = client();
  await notion.pages.update({
    page_id: notionId,
    properties: {
      Status: { select: { name: "Posted" } },
      Published: { date: { start: new Date().toISOString().split("T")[0] } },
    } as any,
  });
}
