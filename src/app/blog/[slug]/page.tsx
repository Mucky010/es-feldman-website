import { getBlogPost } from '@/lib/db'
import { notFound } from 'next/navigation'
import Footer from '@/components/Footer'

export const dynamic = 'force-dynamic'

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  let post: any = null
  try {
    post = await getBlogPost(slug)
  } catch {}

  if (!post) notFound()

  return (
    <div>
      <article className="blog-post">
        <div className="blog-post-header">
          <div className="blog-post-date">
            {new Date(post.published_at || post.created_at).toLocaleDateString('en-US', {
              year: 'numeric', month: 'long', day: 'numeric',
            })}
          </div>
          <h1 className="blog-post-title">{post.title}</h1>
        </div>
        {post.image_url && (
          <div className="blog-post-image">
            <img src={post.image_url} alt={post.title} />
          </div>
        )}
        <div className="blog-post-content" dangerouslySetInnerHTML={{ __html: post.content || '' }} />
      </article>
      <Footer />
    </div>
  )
}
