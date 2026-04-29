import { getBlogPosts } from '@/lib/db'
import Link from 'next/link'
import Footer from '@/components/Footer'

export const dynamic = 'force-dynamic'

export default async function BlogPage() {
  let posts: any[] = []
  try {
    posts = await getBlogPosts(true)
  } catch {}

  return (
    <div>
      <section className="section">
        <div className="section-header">
          <span className="section-num">03</span>
          <h2 className="section-title">Blog</h2>
        </div>
        {posts.length === 0 ? (
          <div style={{ padding: '60px 0', textAlign: 'center', opacity: 0.5, fontSize: 14 }}>
            No posts yet. Check back soon.
          </div>
        ) : (
          <div className="blog-list">
            {posts.map((post: any) => (
              <Link href={`/blog/${post.slug}`} key={post.id} className="blog-card">
                {post.image_url && (
                  <div className="blog-card-image">
                    <img src={post.image_url} alt={post.title} />
                  </div>
                )}
                <div className="blog-card-content">
                  <div className="blog-card-date">
                    {new Date(post.published_at || post.created_at).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'long', day: 'numeric',
                    })}
                  </div>
                  <h3 className="blog-card-title">{post.title}</h3>
                  {post.excerpt && <p className="blog-card-excerpt">{post.excerpt}</p>}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
      <Footer />
    </div>
  )
}
