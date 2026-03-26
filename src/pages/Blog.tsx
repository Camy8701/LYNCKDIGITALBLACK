import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackgroundLayers from "@/components/BackgroundLayers";
import { SEO } from "@/components/SEO";
import { useBlogPosts } from "@/hooks/useBlog";
import { format } from "date-fns";
import { Clock, ArrowRight } from "lucide-react";
import NewsletterForm from "@/components/NewsletterForm";

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
    <div className="min-h-screen bg-[#0a0a0a] relative">
      <BackgroundLayers />
      <div className="relative z-[200]">
      <SEO
        title="Blog | The DigitalHub - Tips & Insights for Digital Creators"
        description="Read the The DigitalHub blog for expert tips, insights, and resources on digital products, online business, and creator success. Discover strategies from thedigitalhub."
        type="website"
        url="https://thedigitalhub.com/blog"
        keywords="digitalhub blog, thedigitalhub blog, the digitalhub tips, digital product insights, creator tips, online business resources"
      />
      <Header />

      <main className="px-5 md:px-20 py-12 md:py-20">
        <div className="max-w-6xl mx-auto">
          <span className="mono-label mb-4 block">Latest Articles</span>
          <h1 className="text-5xl md:text-7xl font-extrabold uppercase mb-4 font-sans tracking-tighter text-white animate-fade-in">
            BLOG
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground font-serif max-w-2xl mb-0 animate-fade-in-delay-1">
            Tips, insights, and resources to help you succeed with digital products.
          </p>
          <div className="section-divider-lime" />

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="stat-card animate-pulse">
                  <div className="aspect-video bg-[#222] rounded-lg mb-4" />
                  <div className="space-y-3">
                    <div className="h-4 bg-[#222] rounded w-1/4" />
                    <div className="h-6 bg-[#222] rounded w-3/4" />
                    <div className="h-4 bg-[#222] rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20 stat-card">
              <h2 className="text-2xl font-extrabold uppercase mb-4 font-sans text-white">Coming Soon</h2>
              <p className="font-serif text-muted-foreground">Check back soon for our latest articles.</p>
            </div>
          ) : (
            <>
              {/* Featured Post - First post gets special treatment */}
              {posts.length > 0 && (
                <Link to={`/blog/${posts[0].slug}`} className="group block mb-12">
                  <article className="stat-card hover:border-[#e64a19]/50 transition-all duration-300 md:flex overflow-hidden">
                    <div className="md:w-1/2 aspect-video md:aspect-auto overflow-hidden rounded-lg">
                      <img
                        src={posts[0].image_url || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=450&fit=crop"}
                        alt={posts[0].title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-center">
                      <div className="flex items-center gap-4 mb-4">
                        {posts[0].published_at && (
                          <span className="text-xs font-bold uppercase text-muted-foreground font-sans tracking-wider">
                            {format(new Date(posts[0].published_at), "MMM d, yyyy")}
                          </span>
                        )}
                        <span className="flex items-center gap-1 text-xs font-bold uppercase text-muted-foreground font-sans tracking-wider">
                          <Clock className="w-3 h-3" />
                          {calculateReadingTime(posts[0].content)} min read
                        </span>
                      </div>
                      <h2 className="text-2xl md:text-4xl font-extrabold font-sans mb-4 group-hover:text-[#e64a19] transition-colors tracking-tight text-white">
                        {posts[0].title}
                      </h2>
                      <p className="text-muted-foreground font-serif line-clamp-3 mb-6">
                        {posts[0].excerpt}
                      </p>
                      <span className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider group-hover:text-[#e64a19] transition-colors text-white">
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
                      <article className="stat-card hover:border-[#e64a19]/50 transition-all duration-300 h-full flex flex-col">
                        <div className="aspect-video overflow-hidden rounded-lg mb-4">
                          <img
                            src={post.image_url || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=450&fit=crop"}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <div className="flex-1 flex flex-col">
                          <div className="flex items-center gap-3 mb-2">
                            {post.published_at && (
                              <span className="text-xs font-bold uppercase text-muted-foreground font-sans tracking-wider">
                                {format(new Date(post.published_at), "MMM d, yyyy")}
                              </span>
                            )}
                            <span className="flex items-center gap-1 text-xs font-bold uppercase text-muted-foreground font-sans tracking-wider">
                              <Clock className="w-3 h-3" />
                              {calculateReadingTime(post.content)} min
                            </span>
                          </div>
                          <h2 className="text-xl font-extrabold font-sans mb-2 group-hover:text-[#e64a19] transition-colors text-white">
                            {post.title}
                          </h2>
                          <p className="text-muted-foreground font-serif line-clamp-2 flex-1">
                            {post.excerpt}
                          </p>
                          <span className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider mt-4 group-hover:text-[#e64a19] transition-colors text-white">
                            Read <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </span>
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>
              )}

              {/* Newsletter Subscription Form */}
              <div className="mt-16">
                <NewsletterForm />
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
      </div>
    </div>
  );
};

export default Blog;
