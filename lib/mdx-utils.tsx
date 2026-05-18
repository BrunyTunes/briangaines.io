import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDir = path.join(process.cwd(), 'content/blog');

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  readTime: string;
  excerpt: string;
  category: string;
}

export function getAllPosts(): PostMeta[] {
  const posts: PostMeta[] = [];

  function walk(dir: string, category: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        walk(path.join(dir, entry.name), entry.name);
      } else if (entry.name.endsWith('.mdx')) {
        const fullPath = path.join(dir, entry.name);
        const raw = fs.readFileSync(fullPath, 'utf-8');
        const { data } = matter(raw);
        const slug = entry.name.replace('.mdx', '');
        posts.push({
          slug,
          category,
          title: data.title || slug,
          date: data.date || '',
          tags: data.tags || [],
          readTime: data.readTime || '5 min read',
          excerpt: data.excerpt || '',
        });
      }
    }
  }

  walk(contentDir, 'general');
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): { meta: PostMeta; content: string } | null {
  function walk(dir: string, category: string): { meta: PostMeta; content: string } | null {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        const result = walk(path.join(dir, entry.name), entry.name);
        if (result) return result;
      } else if (entry.name === `${slug}.mdx`) {
        const fullPath = path.join(dir, entry.name);
        const raw = fs.readFileSync(fullPath, 'utf-8');
        const { data, content } = matter(raw);
        return {
          meta: {
            slug,
            category,
            title: data.title || slug,
            date: data.date || '',
            tags: data.tags || [],
            readTime: data.readTime || '5 min read',
            excerpt: data.excerpt || '',
          },
          content,
        };
      }
    }
    return null;
  }
  return walk(contentDir, 'general');
}
      }
    }