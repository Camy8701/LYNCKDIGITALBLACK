import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { useBlogPost } from "@/hooks/useBlog";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading } = useBlogPost(slug || "");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="px-5 md:px-20 py-12 md:py-20">
          <div className="text-center py-12">
            <p className="text-lg font-serif text-foreground/60">Loading...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="px-5 md:px-20 py-12 md:py-20">
          <div className="text-center py-20">
            <h1 className="text-4xl font-extrabold uppercase mb-4 font-sans">Post Not Found</h1>
            <Link to="/blog" className="text-primary hover:underline font-serif">
              Back to Blog
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={`${post.title} - LYNCK DIGITAL Blog`}
        description={post.excerpt || post.content?.substring(0, 160) || `Read ${post.title} on LYNCK DIGITAL blog`}
        image={post.image_url || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&h=630&fit=crop"}
        type="article"
        url={window.location.href}
        publishedTime={post.published_at}
        modifiedTime={post.updated_at}
      />
      <Header />

      <main className="px-5 md:px-20 py-12 md:py-20">
        <Link 
          to="/blog" 
          className="inline-flex items-center gap-2 text-foreground/60 hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-bold uppercase tracking-wider">Back to Blog</span>
        </Link>

        <article className="max-w-3xl">
          {post.published_at && (
            <span className="text-sm font-bold uppercase text-foreground/50 mb-4 block font-sans tracking-wider">
              {format(new Date(post.published_at), "MMMM d, yyyy")}
            </span>
          )}
          
          <h1 className="text-4xl md:text-6xl font-extrabold font-sans tracking-tighter mb-8">
            {post.title}
          </h1>

          {post.image_url && (
            <div className="rounded-3xl overflow-hidden mb-8">
              <img
                src={post.image_url}
                alt={post.title}
                className="w-full aspect-video object-cover"
              />
            </div>
          )}

          <div className="prose prose-lg max-w-none font-serif">
            {post.content?.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4 text-foreground/80 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPost;
