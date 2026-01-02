// WordPress REST API client
const WORDPRESS_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://lawngreen-mallard-558077.hostingersite.com';

// Test WordPress connection
export async function testWordPressConnection() {
  try {
    const response = await fetch(`${WORDPRESS_URL}/wp-json/wp/v2`, {
      cache: 'no-store',
    });
    return response.ok;
  } catch (error) {
    console.error('WordPress connection test failed:', error);
    return false;
  }
}

// Fetch all blog posts
export async function getPosts(page = 1, perPage = 10) {
  try {
    const url = `${WORDPRESS_URL}/wp-json/wp/v2/posts?_embed&per_page=${perPage}&page=${page}`;
    
    const response = await fetch(url, {
      next: { 
        revalidate: 300, // Cache for 5 minutes, then revalidate (60-80% faster repeat visits)
        tags: ['wordpress-posts']
      },
      headers: {
        'User-Agent': 'Next.js WordPress Client',
        'Accept': 'application/json',
        'Referer': WORDPRESS_URL,
      },
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unable to read error response');
      console.error(`WordPress API error: ${response.status} - ${response.statusText}`);
      console.error(`URL: ${url}`);
      console.error(`Response: ${errorText.substring(0, 200)}`);
      
      // Try without _embed if 403
      if (response.status === 403) {
        console.warn('Attempting fetch without _embed parameter...');
        const fallbackResponse = await fetch(
          `${WORDPRESS_URL}/wp-json/wp/v2/posts?per_page=${perPage}&page=${page}`,
          {
            next: { 
              revalidate: 300,
              tags: ['wordpress-posts']
            },
            headers: {
              'User-Agent': 'Next.js WordPress Client',
              'Accept': 'application/json',
              'Referer': WORDPRESS_URL,
            },
          }
        );
        
        if (fallbackResponse.ok) {
          return await fallbackResponse.json();
        }
      }
      
      return [];
    }

    const data = await response.json();
    
    // Validate response is an array
    if (!Array.isArray(data)) {
      console.error('WordPress API returned non-array response:', typeof data);
      return [];
    }
    
    console.log(`✅ Successfully fetched ${data.length} posts from WordPress`);
    
    // Debug: Log first post structure if available
    if (data.length > 0) {
      console.log('📝 Sample post structure:', {
        id: data[0].id,
        title: data[0].title?.rendered || data[0].title,
        slug: data[0].slug,
        hasExcerpt: !!(data[0].excerpt?.rendered || data[0].excerpt),
        hasEmbedded: !!data[0]._embedded,
        hasFeaturedImage: !!getFeaturedImage(data[0]),
        date: data[0].date,
      });
    } else {
      console.warn('⚠️ WordPress API returned empty array. Check:');
      console.warn('   - Are there published posts in WordPress?');
      console.warn('   - Is the REST API enabled?');
      console.warn('   - Are posts publicly accessible?');
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching WordPress posts:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    return [];
  }
}

// Fetch a single post by slug
export async function getPostBySlug(slug) {
  try {
    const url = `${WORDPRESS_URL}/wp-json/wp/v2/posts?slug=${slug}&_embed`;
    
    const response = await fetch(url, {
      next: { 
        revalidate: 300, // Cache for 5 minutes, then revalidate
        tags: ['wordpress-posts']
      },
      headers: {
        'User-Agent': 'Next.js WordPress Client',
        'Accept': 'application/json',
        'Referer': WORDPRESS_URL,
      },
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unable to read error response');
      console.error(`WordPress API error: ${response.status} - ${response.statusText}`);
      console.error(`URL: ${url}`);
      console.error(`Response: ${errorText.substring(0, 200)}`);
      
      // Try without _embed if 403
      if (response.status === 403) {
        console.warn('Attempting fetch without _embed parameter...');
        const fallbackResponse = await fetch(
          `${WORDPRESS_URL}/wp-json/wp/v2/posts?slug=${slug}`,
          {
            next: { 
              revalidate: 300,
              tags: ['wordpress-posts']
            },
            headers: {
              'User-Agent': 'Next.js WordPress Client',
              'Accept': 'application/json',
              'Referer': WORDPRESS_URL,
            },
          }
        );
        
        if (fallbackResponse.ok) {
          const posts = await fallbackResponse.json();
          return posts.length > 0 ? posts[0] : null;
        }
      }
      
      return null;
    }

    const posts = await response.json();
    return posts.length > 0 ? posts[0] : null;
  } catch (error) {
    console.error('Error fetching WordPress post:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
    }
    return null;
  }
}

// Get featured image URL
export function getFeaturedImage(post) {
  if (post._embedded?.['wp:featuredmedia']?.[0]?.source_url) {
    return post._embedded['wp:featuredmedia'][0].source_url;
  }
  return null;
}

// Format date
export function formatDate(dateString) {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
}

