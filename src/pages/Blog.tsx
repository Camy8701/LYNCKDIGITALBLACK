import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { useBlogPosts } from "@/hooks/useBlog";
import { format } from "date-fns";

const Blog = () => {
  const { data: posts = [], isLoading } = useBlogPosts();

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Blog - LYNCK DIGITAL"
        description="Tips, insights, and resources to help you succeed with digital products. Discover strategies for building, growing, and scaling your online business."
        type="website"
        url={window.location.href}
      />
      <Header />

      <main className="px-5 md:px-20 py-12 md:py-20">
        <h1 className="text-5xl md:text-7xl font-extrabold uppercase mb-8 font-sans tracking-tighter">
          BLOG
        </h1>
        <p className="text-lg md:text-xl text-foreground/70 font-serif max-w-2xl mb-12">
          Tips, insights, and resources to help you succeed with digital products.
        </p>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-lg font-serif text-foreground/60">Loading posts...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 bg-vibrant-lavender rounded-3xl">
            <h2 className="text-2xl font-extrabold uppercase mb-4 font-sans">Coming Soon</h2>
            <p className="font-serif text-foreground/70">Check back soon for our latest articles.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link key={post.id} to={`/blog/${post.slug}`} className="group">
                <article className="bg-card rounded-3xl overflow-hidden border border-foreground/10 hover:border-foreground/30 transition-all duration-300">
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={post.image_url || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=450&fit=crop"}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    {post.published_at && (
                      <span className="text-xs font-bold uppercase text-foreground/50 mb-2 block font-sans tracking-wider">
                        {format(new Date(post.published_at), "MMM d, yyyy")}
                      </span>
                    )}
                    <h2 className="text-xl font-extrabold font-sans mb-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-foreground/70 font-serif line-clamp-2">
                      {post.excerpt}
                    </p>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Blog;
