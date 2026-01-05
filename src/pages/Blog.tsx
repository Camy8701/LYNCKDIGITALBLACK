import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { useBlogPosts } from "@/hooks/useBlog";
import { format } from "date-fns";
import { Clock, ArrowRight } from "lucide-react";

// Calculate reading time based on content length
const calculateReadingTime = (content: string | null): number => {
  if (!content) return 1;
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
};

const Blog = () => {
  const { data: posts = [], isLoading } = useBlogPosts();

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Blog | LYNCK Digital - Tips & Insights for Digital Creators"
        description="Read the LYNCK Digital blog for expert tips, insights, and resources on digital products, online business, and creator success. Discover strategies from lynckdigital."
        type="website"
        url="https://lynckdigital.com/blog"
        keywords="lynck blog, lynckdigital blog, lynck digital tips, digital product insights, creator tips, online business resources"
      />
      <Header />

      <main className="px-5 md:px-20 py-12 md:py-20">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-extrabold uppercase mb-4 font-sans tracking-tighter">
            BLOG
          </h1>
          <p className="text-lg md:text-xl text-foreground/70 font-serif max-w-2xl mb-12">
            Tips, insights, and resources to help you succeed with digital products.
          </p>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-card rounded-3xl overflow-hidden border border-foreground/10 animate-pulse">
                  <div className="aspect-video bg-foreground/10" />
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-foreground/10 rounded w-1/4" />
                    <div className="h-6 bg-foreground/10 rounded w-3/4" />
                    <div className="h-4 bg-foreground/10 rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20 bg-muted rounded-3xl">
              <h2 className="text-2xl font-extrabold uppercase mb-4 font-sans">Coming Soon</h2>
              <p className="font-serif text-foreground/70">Check back soon for our latest articles.</p>
            </div>
          ) : (
            <>
              {/* Featured Post - First post gets special treatment */}
              {posts.length > 0 && (
                <Link to={`/blog/${posts[0].slug}`} className="group block mb-12">
                  <article className="bg-card rounded-3xl overflow-hidden border border-foreground/10 hover:border-foreground/30 transition-all duration-300 md:flex">
                    <div className="md:w-1/2 aspect-video md:aspect-auto overflow-hidden">
                      <img
                        src={posts[0].image_url || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=450&fit=crop"}
                        alt={posts[0].title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                      <div className="flex items-center gap-4 mb-4">
                        {posts[0].published_at && (
                          <span className="text-xs font-bold uppercase text-foreground/50 font-sans tracking-wider">
                            {format(new Date(posts[0].published_at), "MMM d, yyyy")}
                          </span>
                        )}
                        <span className="flex items-center gap-1 text-xs font-bold uppercase text-foreground/50 font-sans tracking-wider">
                          <Clock className="w-3 h-3" />
                          {calculateReadingTime(posts[0].content)} min read
                        </span>
                      </div>
                      <h2 className="text-2xl md:text-4xl font-extrabold font-sans mb-4 group-hover:text-primary transition-colors tracking-tight">
                        {posts[0].title}
                      </h2>
                      <p className="text-foreground/70 font-serif line-clamp-3 mb-6">
                        {posts[0].excerpt}
                      </p>
                      <span className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider group-hover:text-primary transition-colors">
                        Read Article <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </article>
                </Link>
              )}

              {/* Rest of posts */}
              {posts.length > 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {posts.slice(1).map((post) => (
                    <Link key={post.id} to={`/blog/${post.slug}`} className="group">
                      <article className="bg-card rounded-3xl overflow-hidden border border-foreground/10 hover:border-foreground/30 transition-all duration-300 h-full flex flex-col">
                        <div className="aspect-video overflow-hidden">
                          <img
                            src={post.image_url || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=450&fit=crop"}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <div className="p-6 flex-1 flex flex-col">
                          <div className="flex items-center gap-3 mb-2">
                            {post.published_at && (
                              <span className="text-xs font-bold uppercase text-foreground/50 font-sans tracking-wider">
                                {format(new Date(post.published_at), "MMM d, yyyy")}
                              </span>
                            )}
                            <span className="flex items-center gap-1 text-xs font-bold uppercase text-foreground/50 font-sans tracking-wider">
                              <Clock className="w-3 h-3" />
                              {calculateReadingTime(post.content)} min
                            </span>
                          </div>
                          <h2 className="text-xl font-extrabold font-sans mb-2 group-hover:text-primary transition-colors">
                            {post.title}
                          </h2>
                          <p className="text-foreground/70 font-serif line-clamp-2 flex-1">
                            {post.excerpt}
                          </p>
                          <span className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider mt-4 group-hover:text-primary transition-colors">
                            Read <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </span>
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Blog;
