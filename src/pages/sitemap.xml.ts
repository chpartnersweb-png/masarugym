import type { APIRoute } from 'astro';

export const prerender = true;

// 現在の公開ページはトップページのみ。実際の記事ページ追加時にURLを追加します。
// 更新日を偽らないよう、ビルド日時を lastmod として出力しません。
export const GET: APIRoute = ({ site }) => new Response(
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${new URL('/', site).href}</loc></url>\n</urlset>\n`,
  { headers: { 'Content-Type': 'application/xml; charset=utf-8' } },
);
