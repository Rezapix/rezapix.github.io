import { BLOG } from '@/data/content';
import { SITE } from '@/data/site';

export function generateRSS(): string {
  const items = BLOG.map(
    (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${SITE.url}/blog/${post.slug}</link>
      <guid isPermaLink="true">${SITE.url}/blog/${post.slug}</guid>
      <description><![CDATA[${post.excerpt ?? ''}]]></description>
      <pubDate>${new Date(post.publishedAt ?? post.createdAt).toUTCString()}</pubDate>
    </item>`,
  ).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${SITE.name} Journal</title>
    <link>${SITE.url}/blog</link>
    <description>${SITE.description}</description>
    <language>${SITE.locale}</language>
    <atom:link href="${SITE.url}/rss.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;
}
