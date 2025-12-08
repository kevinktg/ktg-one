// WordPress REST API client
const WORDPRESS_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://ktg.one';

export interface WordPressPost {
  id: number;
  date: string;
  slug: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  featured_media: number;
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
      alt_text: string;
    }>;
  };
}

export interface WordPressMedia {
  source_url: string;
  alt_text: string;
}

// Test WordPress connection
export async function testWordPressConnection(): Promise<boolean> {
  try {
    const response = await fetch(`${WORDPRESS_URL}/wp-json/wp/v2`, {
      next: { revalidate: 3600 },
    });
    return response.ok;
  } catch (error) {
    console.error('WordPress connection test failed:', error);
    return false;
  }
}

// Fetch all blog posts
export async function getPosts(page: number = 1, perPage: number = 10): Promise<WordPressPost[]> {
  try {
    const response = await fetch(
      `${WORDPRESS_URL}/wp-json/wp/v2/posts?_embed&per_page=${perPage}&page=${page}`,
      {
        next: { revalidate: 3600 }, // Revalidate every hour
      }
    );

    if (!response.ok) {
      console.error(`WordPress API error: ${response.status} - ${response.statusText}`);
      throw new Error(`WordPress API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching WordPress posts:', error);
    return [];
  }
}

// Fetch a single post by slug
export async function getPostBySlug(slug: string): Promise<WordPressPost | null> {
  try {
    const response = await fetch(
      `${WORDPRESS_URL}/wp-json/wp/v2/posts?slug=${slug}&_embed`,
      {
        next: { revalidate: 3600 },
      }
    );

    if (!response.ok) {
      console.error(`WordPress API error: ${response.status} - ${response.statusText}`);
      throw new Error(`WordPress API error: ${response.status}`);
    }

    const posts = await response.json();
    return posts.length > 0 ? posts[0] : null;
  } catch (error) {
    console.error('Error fetching WordPress post:', error);
    return null;
  }
}

// Get featured image URL
export function getFeaturedImage(post: WordPressPost): string | null {
  if (post._embedded?.['wp:featuredmedia']?.[0]?.source_url) {
    return post._embedded['wp:featuredmedia'][0].source_url;
  }
  return null;
}

// Format date
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}


