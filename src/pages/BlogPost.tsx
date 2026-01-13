import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { useBlogPost } from "@/hooks/useBlog";
import { format } from "date-fns";
import { ArrowLeft, Clock, Calendar, Twitter, Linkedin, Facebook, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";
import { RichContentRenderer } from "@/components/blog/RichContentRenderer";

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

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  const shareOnTwitter = () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(post?.title || '');
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
  };

  const shareOnLinkedIn = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
  };

  const shareOnFacebook = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="px-5 md:px-20 py-12 md:py-20">
          <div className="max-w-4xl mx-auto">
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
        <div className="max-w-4xl mx-auto">
          <Link 
            to="/blog" 
            className="inline-flex items-center gap-2 text-foreground/60 hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-bold uppercase tracking-wider">Back to Blog</span>
          </Link>

          <article>
            {/* Hero Section */}
            <header className="mb-12">
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
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold font-sans tracking-tighter mb-6 leading-[1.1]">
                {post.title}
              </h1>

              {post.excerpt && (
                <p className="text-xl md:text-2xl text-foreground/70 leading-relaxed max-w-3xl">
                  {post.excerpt}
                </p>
              )}
            </header>

            {post.image_url && (
              <div className="rounded-3xl overflow-hidden mb-12 shadow-2xl">
                <img
                  src={post.image_url}
                  alt={post.title}
                  className="w-full aspect-video object-cover"
                />
              </div>
            )}

            {/* Rich Content */}
            <div className="prose-lg max-w-none">
              {post.content && <RichContentRenderer content={post.content} />}
            </div>

            {/* Social sharing buttons */}
            <div className="mt-16 pt-8 border-t border-border">
              <p className="text-sm font-bold uppercase text-foreground/50 tracking-wider mb-4">
                Share this article
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={shareOnTwitter}
                  className="flex items-center justify-center w-12 h-12 rounded-full bg-card border border-border hover:border-primary/40 text-foreground/70 hover:text-primary transition-all"
                  aria-label="Share on Twitter"
                >
                  <Twitter className="w-5 h-5" />
                </button>
                <button
                  onClick={shareOnLinkedIn}
                  className="flex items-center justify-center w-12 h-12 rounded-full bg-card border border-border hover:border-primary/40 text-foreground/70 hover:text-primary transition-all"
                  aria-label="Share on LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </button>
                <button
                  onClick={shareOnFacebook}
                  className="flex items-center justify-center w-12 h-12 rounded-full bg-card border border-border hover:border-primary/40 text-foreground/70 hover:text-primary transition-all"
                  aria-label="Share on Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </button>
                <button
                  onClick={handleCopyLink}
                  className="flex items-center justify-center w-12 h-12 rounded-full bg-card border border-border hover:border-primary/40 text-foreground/70 hover:text-primary transition-all"
                  aria-label="Copy link"
                >
                  <LinkIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Author section */}
            <div className="mt-8 pt-8 border-t border-border">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-bold text-lg">L</span>
                </div>
                <div>
                  <p className="font-bold text-foreground">LYNCK Digital</p>
                  <p className="text-sm text-foreground/60">Empowering creators with digital products and resources</p>
                </div>
              </div>
            </div>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPost;
