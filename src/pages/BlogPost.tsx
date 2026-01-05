import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { useBlogPost } from "@/hooks/useBlog";
import { format } from "date-fns";
import { ArrowLeft, Clock, Calendar, Share2 } from "lucide-react";
import { toast } from "sonner";

// Calculate reading time based on content length
const calculateReadingTime = (content: string | null): number => {
  if (!content) return 1;
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
};

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading } = useBlogPost(slug || "");

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: post?.title,
          text: post?.excerpt || '',
          url: url,
        });
      } catch {
        // User cancelled or share failed
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="px-5 md:px-20 py-12 md:py-20">
          <div className="max-w-3xl mx-auto">
            <div className="animate-pulse space-y-6">
              <div className="h-4 bg-foreground/10 rounded w-32" />
              <div className="h-12 bg-foreground/10 rounded w-3/4" />
              <div className="h-64 bg-foreground/10 rounded-3xl" />
              <div className="space-y-3">
                <div className="h-4 bg-foreground/10 rounded w-full" />
                <div className="h-4 bg-foreground/10 rounded w-full" />
                <div className="h-4 bg-foreground/10 rounded w-2/3" />
              </div>
            </div>
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

  const readingTime = calculateReadingTime(post.content);

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={`${post.title} | LYNCK Digital Blog`}
        description={post.excerpt || post.content?.substring(0, 160) || `Read ${post.title} on the LYNCK Digital blog - tips and insights for digital creators from lynckdigital.`}
        image={post.image_url || "https://lynckdigital.com/assets/logo.png"}
        type="article"
        url={`https://lynckdigital.com/blog/${post.slug}`}
        publishedTime={post.published_at}
        modifiedTime={post.updated_at}
        keywords={`lynck digital, lynckdigital, ${post.title.toLowerCase()}, digital products, creator tips`}
      />
      <Header />

      <main className="px-5 md:px-20 py-12 md:py-20">
        <div className="max-w-3xl mx-auto">
          <Link 
            to="/blog" 
            className="inline-flex items-center gap-2 text-foreground/60 hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-bold uppercase tracking-wider">Back to Blog</span>
          </Link>

          <article>
            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              {post.published_at && (
                <span className="flex items-center gap-2 text-sm font-bold uppercase text-foreground/50 font-sans tracking-wider">
                  <Calendar className="w-4 h-4" />
                  {format(new Date(post.published_at), "MMMM d, yyyy")}
                </span>
              )}
              <span className="flex items-center gap-2 text-sm font-bold uppercase text-foreground/50 font-sans tracking-wider">
                <Clock className="w-4 h-4" />
                {readingTime} min read
              </span>
              <button 
                onClick={handleShare}
                className="flex items-center gap-2 text-sm font-bold uppercase text-foreground/50 hover:text-foreground font-sans tracking-wider transition-colors ml-auto"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-extrabold font-sans tracking-tighter mb-8 leading-tight">
              {post.title}
            </h1>

            {post.image_url && (
              <div className="rounded-3xl overflow-hidden mb-10">
                <img
                  src={post.image_url}
                  alt={post.title}
                  className="w-full aspect-video object-cover"
                />
              </div>
            )}

            {/* Article content */}
            <div className="prose prose-lg max-w-none font-serif">
              {post.content?.split('\n\n').map((paragraph, index) => {
                // Check if it's a heading (starts with capital and is short)
                if (paragraph.length < 50 && /^[A-Z]/.test(paragraph) && !paragraph.includes('.')) {
                  return (
                    <h2 key={index} className="text-2xl font-extrabold font-sans mt-10 mb-4 tracking-tight">
                      {paragraph}
                    </h2>
                  );
                }
                
                // Check if it's a list (starts with bullet points)
                if (paragraph.includes('• ')) {
                  const items = paragraph.split('• ').filter(Boolean);
                  return (
                    <ul key={index} className="list-disc list-inside space-y-2 mb-6 text-foreground/80">
                      {items.map((item, i) => (
                        <li key={i}>{item.trim()}</li>
                      ))}
                    </ul>
                  );
                }
                
                return (
                  <p key={index} className="mb-6 text-foreground/80 leading-relaxed text-lg">
                    {paragraph}
                  </p>
                );
              })}
            </div>

            {/* Author section */}
            <div className="mt-12 pt-8 border-t border-foreground/10">
              <p className="text-sm font-bold uppercase text-foreground/50 tracking-wider">
                Published by LYNCK Digital
              </p>
            </div>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPost;
