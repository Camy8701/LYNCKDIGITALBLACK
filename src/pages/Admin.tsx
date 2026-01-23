import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useAllProducts, useCategories, useCreateProduct, useUpdateProduct, useDeleteProduct, useCreateCategory, useDeleteCategory } from "@/hooks/useProducts";
import { useAllBlogPosts, useCreateBlogPost, useUpdateBlogPost, useDeleteBlogPost } from "@/hooks/useBlog";
import { supabase } from "@/integrations/supabase/client";
import Button from "@/components/Button";
import BackgroundLayers from "@/components/BackgroundLayers";
import { Product, Category } from "@/types/product";
import { BlogPost } from "@/types/blog";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, LogOut, X, Eye, EyeOff, BarChart3, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import AdminAnalytics from "@/components/admin/AdminAnalytics";
import NewsletterSubscribers from "@/components/admin/NewsletterSubscribers";

const Admin = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  
  const { data: products = [], isLoading: productsLoading } = useAllProducts();
  const { data: categories = [] } = useCategories();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  const createCategory = useCreateCategory();
  const deleteCategory = useDeleteCategory();

  const { data: blogPosts = [], isLoading: blogLoading } = useAllBlogPosts();
  const createBlogPost = useCreateBlogPost();
  const updateBlogPost = useUpdateBlogPost();
  const deleteBlogPost = useDeleteBlogPost();

  const [activeTab, setActiveTab] = useState<'analytics' | 'products' | 'categories' | 'blog' | 'newsletter'>('analytics');
  const [showProductModal, setShowProductModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showBlogModal, setShowBlogModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingBlogPost, setEditingBlogPost] = useState<BlogPost | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [productFile, setProductFile] = useState<File | null>(null);
  const [blogImageFile, setBlogImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const [productForm, setProductForm] = useState({
    name: '',
    slug: '',
    short_description: '',
    description: '',
    price: '',
    original_price: '',
    category_id: '',
    image_url: '',
    is_featured: false,
    is_active: true,
    card_color: ''
  });

  const [categoryForm, setCategoryForm] = useState({
    name: '',
    slug: '',
    description: '',
    color_class: 'bg-vibrant-purple'
  });

  const [blogForm, setBlogForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    image_url: '',
    is_published: false
  });

  const colorOptions = [
    { value: 'bg-vibrant-purple', label: 'Purple' },
    { value: 'bg-vibrant-yellow', label: 'Yellow' },
    { value: 'bg-vibrant-coral', label: 'Coral' },
    { value: 'bg-vibrant-mint', label: 'Mint' },
    { value: 'bg-vibrant-magenta', label: 'Magenta' },
    { value: 'bg-vibrant-blue', label: 'Blue' },
    { value: 'bg-vibrant-orange', label: 'Orange' },
    { value: 'bg-vibrant-lavender', label: 'Lavender' }
  ];

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `products/${fileName}`;

    const { error } = await supabase.storage
      .from('product-images')
      .upload(filePath, file);

    if (error) {
      toast.error('Failed to upload image');
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const uploadProductFile = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error } = await supabase.storage
      .from('product-files')
      .upload(filePath, file);

    if (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload product file');
      return null;
    }

    // Return the storage path (not public URL, since bucket is private)
    return filePath;
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      let imageUrl = productForm.image_url;
      let fileUrl = editingProduct?.file_url || null;

      if (imageFile) {
        const uploadedUrl = await uploadImage(imageFile);
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        }
      }

      if (productFile) {
        const uploadedFilePath = await uploadProductFile(productFile);
        if (uploadedFilePath) {
          fileUrl = uploadedFilePath;
        }
      }

      const productData = {
        name: productForm.name,
        slug: productForm.slug || generateSlug(productForm.name),
        short_description: productForm.short_description || null,
        description: productForm.description || null,
        price: parseFloat(productForm.price),
        original_price: productForm.original_price ? parseFloat(productForm.original_price) : null,
        category_id: productForm.category_id || null,
        image_url: imageUrl || null,
        file_url: fileUrl,
        is_featured: productForm.is_featured,
        is_active: productForm.is_active,
        card_color: productForm.card_color || null
      };

      if (editingProduct) {
        await updateProduct.mutateAsync({ id: editingProduct.id, ...productData });
      } else {
        await createProduct.mutateAsync(productData);
      }

      resetProductForm();
    } finally {
      setUploading(false);
    }
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await createCategory.mutateAsync({
      name: categoryForm.name,
      slug: categoryForm.slug || generateSlug(categoryForm.name),
      description: categoryForm.description || null,
      color_class: categoryForm.color_class
    });

    resetCategoryForm();
  };

  const resetProductForm = () => {
    setProductForm({
      name: '',
      slug: '',
      short_description: '',
      description: '',
      price: '',
      original_price: '',
      category_id: '',
      image_url: '',
      is_featured: false,
      is_active: true,
      card_color: ''
    });
    setEditingProduct(null);
    setImageFile(null);
    setProductFile(null);
    setShowProductModal(false);
  };

  const resetCategoryForm = () => {
    setCategoryForm({
      name: '',
      slug: '',
      description: '',
      color_class: 'bg-vibrant-purple'
    });
    setShowCategoryModal(false);
  };

  const resetBlogForm = () => {
    setBlogForm({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      image_url: '',
      is_published: false
    });
    setEditingBlogPost(null);
    setBlogImageFile(null);
    setShowBlogModal(false);
  };

  const handleBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      let imageUrl = blogForm.image_url;
      
      if (blogImageFile) {
        const fileExt = blogImageFile.name.split('.').pop();
        const fileName = `blog/${Date.now()}.${fileExt}`;
        
        const { error } = await supabase.storage
          .from('product-images')
          .upload(fileName, blogImageFile);

        if (error) {
          toast.error('Failed to upload image');
        } else {
          const { data: { publicUrl } } = supabase.storage
            .from('product-images')
            .getPublicUrl(fileName);
          imageUrl = publicUrl;
        }
      }

      const blogData = {
        title: blogForm.title,
        slug: blogForm.slug || generateSlug(blogForm.title),
        excerpt: blogForm.excerpt || null,
        content: blogForm.content || null,
        image_url: imageUrl || null,
        is_published: blogForm.is_published,
        published_at: blogForm.is_published ? new Date().toISOString() : null
      };

      if (editingBlogPost) {
        await updateBlogPost.mutateAsync({ id: editingBlogPost.id, ...blogData });
      } else {
        await createBlogPost.mutateAsync(blogData);
      }

      resetBlogForm();
    } finally {
      setUploading(false);
    }
  };

  const editBlogPost = (post: BlogPost) => {
    setEditingBlogPost(post);
    setBlogForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || '',
      content: post.content || '',
      image_url: post.image_url || '',
      is_published: post.is_published
    });
    setShowBlogModal(true);
  };

  const handleDeleteBlogPost = async (id: string) => {
    if (confirm('Are you sure you want to delete this blog post?')) {
      await deleteBlogPost.mutateAsync(id);
    }
  };

  const toggleBlogPublish = async (post: BlogPost) => {
    const newPublishedState = !post.is_published;
    await updateBlogPost.mutateAsync({
      id: post.id,
      is_published: newPublishedState,
      published_at: newPublishedState ? new Date().toISOString() : null
    });
  };

  const editProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      slug: product.slug,
      short_description: product.short_description || '',
      description: product.description || '',
      price: product.price.toString(),
      original_price: product.original_price?.toString() || '',
      category_id: product.category_id || '',
      image_url: product.image_url || '',
      is_featured: product.is_featured ?? false,
      is_active: product.is_active ?? true,
      card_color: product.card_color || ''
    });
    setShowProductModal(true);
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      await deleteProduct.mutateAsync(id);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      await deleteCategory.mutateAsync(id);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <p className="text-lg font-serif text-white">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] relative">
      <BackgroundLayers />
      <div className="relative z-[200]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-[#222]">
        <div className="px-5 md:px-20 py-5 md:py-6">
          <div className="flex items-center justify-between">
            <a href="/" className="font-serif text-2xl md:text-3xl font-bold italic text-white">
              LYNCK DIGITAL
            </a>
            <div className="flex items-center gap-4">
              <span className="text-sm font-sans text-muted-foreground">{user.email}</span>
              {isAdmin && (
                <span className="text-xs font-bold uppercase bg-[#ccff00] text-black px-3 py-1 rounded-full">
                  Admin
                </span>
              )}
              <button
                onClick={handleSignOut}
                className="p-2 hover:bg-white/10 rounded-full transition-colors text-white"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="px-5 md:px-20 py-8 md:py-12">
        <span className="mono-label mb-4 block">Administration</span>
        <h1 className="text-4xl md:text-5xl font-extrabold uppercase mb-0 font-sans tracking-tighter text-white animate-fade-in">
          ADMIN DASHBOARD
        </h1>
        <div className="section-divider-lime" />

        {!isAdmin ? (
          <div className="data-panel text-center">
            <h2 className="text-2xl font-extrabold uppercase mb-4 font-sans text-white">Access Denied</h2>
            <p className="font-serif text-muted-foreground">
              You don't have admin privileges. Contact the administrator to get access.
            </p>
          </div>
        ) : (
          <>
            {/* Tabs */}
            <div className="flex gap-4 mb-8 flex-wrap">
              <button
                onClick={() => setActiveTab('analytics')}
                className={cn(
                  "px-6 py-3 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-200 flex items-center gap-2",
                  activeTab === 'analytics'
                    ? "bg-[#e64a19] text-white border-2 border-[#e64a19]"
                    : "bg-transparent text-white border-2 border-[#262626] hover:border-[#ccff00]/50"
                )}
              >
                <BarChart3 className="w-4 h-4" />
                Analytics
              </button>
              <button
                onClick={() => setActiveTab('products')}
                className={cn(
                  "px-6 py-3 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-200",
                  activeTab === 'products'
                    ? "bg-[#e64a19] text-white border-2 border-[#e64a19]"
                    : "bg-transparent text-white border-2 border-[#262626] hover:border-[#ccff00]/50"
                )}
              >
                Products ({products.length})
              </button>
              <button
                onClick={() => setActiveTab('categories')}
                className={cn(
                  "px-6 py-3 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-200",
                  activeTab === 'categories'
                    ? "bg-[#e64a19] text-white border-2 border-[#e64a19]"
                    : "bg-transparent text-white border-2 border-[#262626] hover:border-[#ccff00]/50"
                )}
              >
                Categories ({categories.length})
              </button>
              <button
                onClick={() => setActiveTab('blog')}
                className={cn(
                  "px-6 py-3 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-200",
                  activeTab === 'blog'
                    ? "bg-[#e64a19] text-white border-2 border-[#e64a19]"
                    : "bg-transparent text-white border-2 border-[#262626] hover:border-[#ccff00]/50"
                )}
              >
                Blog ({blogPosts.length})
              </button>
              <button
                onClick={() => setActiveTab('newsletter')}
                className={cn(
                  "px-6 py-3 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-200 flex items-center gap-2",
                  activeTab === 'newsletter'
                    ? "bg-[#e64a19] text-white border-2 border-[#e64a19]"
                    : "bg-transparent text-white border-2 border-[#262626] hover:border-[#ccff00]/50"
                )}
              >
                <Mail className="w-4 h-4" />
                Newsletter
              </button>
            </div>

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <AdminAnalytics onEditProduct={editProduct} />
            )}

            {/* Newsletter Tab */}
            {activeTab === 'newsletter' && (
              <NewsletterSubscribers />
            )}

            {/* Products Tab */}
            {activeTab === 'products' && (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-extrabold uppercase font-sans text-white">Products</h2>
                  <Button
                    variant="filled"
                    onClick={() => setShowProductModal(true)}
                    className="text-sm"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    ADD PRODUCT
                  </Button>
                </div>

                {productsLoading ? (
                  <p className="text-center py-12 font-serif text-muted-foreground">Loading products...</p>
                ) : (
                  <div className="grid gap-4">
                    {products.map((product) => (
                      <div
                        key={product.id}
                        className="stat-card flex items-center gap-4"
                      >
                        <img
                          src={product.image_url || "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=100&h=100&fit=crop"}
                          alt={product.name}
                          className="w-16 h-16 md:w-20 md:h-20 rounded-xl object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold font-sans truncate text-white">{product.name}</h3>
                          <p className="text-sm text-muted-foreground truncate">{product.category?.name || 'No category'}</p>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span className="font-bold text-white">${product.price}</span>
                            {!product.is_active && (
                              <span className="text-xs bg-[#333] text-white px-2 py-0.5 rounded">Inactive</span>
                            )}
                            {product.is_featured && (
                              <span className="text-xs bg-[#ccff00] text-black px-2 py-0.5 rounded">Featured</span>
                            )}
                          </div>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(product.id);
                              toast.success('Product ID copied to clipboard!');
                            }}
                            className="text-xs text-muted-foreground hover:text-white mt-1 font-mono truncate max-w-full text-left transition-colors"
                            title="Click to copy ID"
                          >
                            ID: {product.id}
                          </button>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => editProduct(product)}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors text-white"
                          >
                            <Pencil className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="p-2 hover:bg-red-500/20 rounded-full transition-colors text-red-500"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Categories Tab */}
            {activeTab === 'categories' && (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-extrabold uppercase font-sans text-white">Categories</h2>
                  <Button
                    variant="filled"
                    onClick={() => setShowCategoryModal(true)}
                    className="text-sm"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    ADD CATEGORY
                  </Button>
                </div>

                <div className="grid gap-4">
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      className="stat-card flex items-center gap-4"
                    >
                      <div className={cn("w-4 h-full min-h-[60px] rounded-full", category.color_class)} />
                      <div className="flex-1">
                        <h3 className="font-bold font-sans text-white">{category.name}</h3>
                        <p className="text-sm text-muted-foreground">{category.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">Slug: {category.slug}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        className="p-2 hover:bg-red-500/20 rounded-full transition-colors text-red-500"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Blog Tab */}
            {activeTab === 'blog' && (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-extrabold uppercase font-sans text-white">Blog Posts</h2>
                  <Button
                    variant="filled"
                    onClick={() => setShowBlogModal(true)}
                    className="text-sm"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    ADD POST
                  </Button>
                </div>

                {blogLoading ? (
                  <p className="text-center py-12 font-serif text-muted-foreground">Loading blog posts...</p>
                ) : (
                  <div className="grid gap-4">
                    {blogPosts.map((post) => (
                      <div
                        key={post.id}
                        className="stat-card flex items-center gap-4"
                      >
                        {post.image_url && (
                          <img
                            src={post.image_url}
                            alt={post.title}
                            className="w-16 h-16 md:w-20 md:h-20 rounded-xl object-cover"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold font-sans truncate text-white">{post.title}</h3>
                          <p className="text-sm text-muted-foreground truncate">{post.excerpt || 'No excerpt'}</p>
                          <div className="flex items-center gap-2 mt-1">
                            {post.is_published ? (
                              <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded">Published</span>
                            ) : (
                              <span className="text-xs bg-[#333] text-white px-2 py-0.5 rounded">Draft</span>
                            )}
                            <span className="text-xs text-muted-foreground">
                              {new Date(post.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => toggleBlogPublish(post)}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors text-white"
                            title={post.is_published ? 'Unpublish' : 'Publish'}
                          >
                            {post.is_published ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                          <button
                            onClick={() => editBlogPost(post)}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors text-white"
                          >
                            <Pencil className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteBlogPost(post.id)}
                            className="p-2 hover:bg-red-500/20 rounded-full transition-colors text-red-500"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </main>

      {/* Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-5 z-50 overflow-y-auto">
          <div className="bg-[#0a0a0a] rounded-3xl p-6 md:p-8 w-full max-w-2xl my-8 max-h-[90vh] overflow-y-auto border border-[#262626]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-extrabold uppercase font-sans text-white">
                {editingProduct ? 'EDIT PRODUCT' : 'ADD PRODUCT'}
              </h2>
              <button onClick={resetProductForm} className="p-2 hover:bg-white/10 rounded-full text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleProductSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold uppercase mb-2 font-sans text-white">Name *</label>
                  <input
                    type="text"
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-xl border-2 border-[#262626] bg-[#0a0a0a] text-white focus:outline-none focus:border-[#e64a19]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold uppercase mb-2 font-sans text-white">Slug</label>
                  <input
                    type="text"
                    value={productForm.slug}
                    onChange={(e) => setProductForm({ ...productForm, slug: e.target.value })}
                    placeholder="auto-generated"
                    className="w-full px-4 py-3 rounded-xl border-2 border-[#262626] bg-[#0a0a0a] text-white focus:outline-none focus:border-[#e64a19] placeholder:text-gray-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold uppercase mb-2 font-sans text-white">Short Description</label>
                <input
                  type="text"
                  value={productForm.short_description}
                  onChange={(e) => setProductForm({ ...productForm, short_description: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#262626] bg-[#0a0a0a] text-white focus:outline-none focus:border-[#e64a19]"
                />
              </div>

              <div>
                <label className="block text-sm font-bold uppercase mb-2 font-sans text-white">Full Description</label>
                <textarea
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#262626] bg-[#0a0a0a] text-white focus:outline-none focus:border-[#e64a19] resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-bold uppercase mb-2 font-sans text-white">Price *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-xl border-2 border-[#262626] bg-[#0a0a0a] text-white focus:outline-none focus:border-[#e64a19]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold uppercase mb-2 font-sans text-white">Original Price</label>
                  <input
                    type="number"
                    step="0.01"
                    value={productForm.original_price}
                    onChange={(e) => setProductForm({ ...productForm, original_price: e.target.value })}
                    placeholder="For sale display"
                    className="w-full px-4 py-3 rounded-xl border-2 border-[#262626] bg-[#0a0a0a] text-white focus:outline-none focus:border-[#e64a19] placeholder:text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold uppercase mb-2 font-sans text-white">Category</label>
                  <select
                    value={productForm.category_id}
                    onChange={(e) => setProductForm({ ...productForm, category_id: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-[#262626] bg-[#0a0a0a] text-white focus:outline-none focus:border-[#e64a19]"
                  >
                    <option value="">No category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Card Color Picker */}
              <div>
                <label className="block text-sm font-bold uppercase mb-2 font-sans text-white">
                  Card Color (Override category color)
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setProductForm({ ...productForm, card_color: '' })}
                    className={cn(
                      "px-4 py-2 rounded-xl border-2 text-sm font-bold uppercase transition-all",
                      productForm.card_color === ''
                        ? "border-[#e64a19] bg-[#e64a19] text-white"
                        : "border-[#333] text-white hover:border-[#e64a19]/50"
                    )}
                  >
                    Use Category
                  </button>
                  {colorOptions.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setProductForm({ ...productForm, card_color: color.value })}
                      className={cn(
                        "w-10 h-10 rounded-xl border-2 transition-all",
                        color.value,
                        productForm.card_color === color.value
                          ? "border-white ring-2 ring-white ring-offset-2 ring-offset-[#1a1a1a]"
                          : "border-transparent hover:border-white/50"
                      )}
                      title={color.label}
                    />
                  ))}
                </div>
                {productForm.card_color && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Selected: {colorOptions.find(c => c.value === productForm.card_color)?.label}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold uppercase mb-2 font-sans text-white">Product Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#262626] bg-[#0a0a0a] text-white focus:outline-none"
                />
                {productForm.image_url && !imageFile && (
                  <p className="text-sm text-muted-foreground mt-2">Current: {productForm.image_url}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold uppercase mb-2 font-sans text-white">
                  Digital Product File (PDF, ZIP, etc.) *
                </label>
                <input
                  type="file"
                  accept=".pdf,.zip,.rar,.mp4,.mov,.epub,.txt,.docx,.xlsx"
                  onChange={(e) => setProductFile(e.target.files?.[0] || null)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#262626] bg-[#0a0a0a] text-white focus:outline-none"
                />
                {editingProduct?.file_url && !productFile && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Current file: {editingProduct.file_url.split('/').pop()}
                  </p>
                )}
                {productFile && (
                  <p className="text-sm text-[#ccff00] mt-2">
                    New file selected: {productFile.name}
                  </p>
                )}
              </div>

              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.is_featured}
                    onChange={(e) => setProductForm({ ...productForm, is_featured: e.target.checked })}
                    className="w-5 h-5"
                  />
                  <span className="text-sm font-bold uppercase font-sans text-white">Featured</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.is_active}
                    onChange={(e) => setProductForm({ ...productForm, is_active: e.target.checked })}
                    className="w-5 h-5"
                  />
                  <span className="text-sm font-bold uppercase font-sans text-white">Active</span>
                </label>
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" variant="filled" disabled={uploading} className="flex-1 justify-center">
                  {uploading ? 'SAVING...' : editingProduct ? 'UPDATE PRODUCT' : 'CREATE PRODUCT'}
                </Button>
                <Button type="button" variant="transparent" onClick={resetProductForm}>
                  CANCEL
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-5 z-50">
          <div className="bg-[#0a0a0a] rounded-3xl p-6 md:p-8 w-full max-w-md border border-[#262626]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-extrabold uppercase font-sans text-white">ADD CATEGORY</h2>
              <button onClick={resetCategoryForm} className="p-2 hover:bg-white/10 rounded-full text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCategorySubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold uppercase mb-2 font-sans text-white">Name *</label>
                <input
                  type="text"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#262626] bg-[#0a0a0a] text-white focus:outline-none focus:border-[#e64a19]"
                />
              </div>

              <div>
                <label className="block text-sm font-bold uppercase mb-2 font-sans text-white">Slug</label>
                <input
                  type="text"
                  value={categoryForm.slug}
                  onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
                  placeholder="auto-generated"
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#262626] bg-[#0a0a0a] text-white focus:outline-none focus:border-[#e64a19] placeholder:text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-bold uppercase mb-2 font-sans text-white">Description</label>
                <textarea
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#262626] bg-[#0a0a0a] text-white focus:outline-none focus:border-[#e64a19] resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold uppercase mb-2 font-sans text-white">Color</label>
                <select
                  value={categoryForm.color_class}
                  onChange={(e) => setCategoryForm({ ...categoryForm, color_class: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#262626] bg-[#0a0a0a] text-white focus:outline-none focus:border-[#e64a19]"
                >
                  {colorOptions.map((color) => (
                    <option key={color.value} value={color.value}>{color.label}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" variant="filled" className="flex-1 justify-center">
                  CREATE CATEGORY
                </Button>
                <Button type="button" variant="transparent" onClick={resetCategoryForm}>
                  CANCEL
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Blog Post Modal */}
      {showBlogModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-5 z-50 overflow-y-auto">
          <div className="bg-[#0a0a0a] rounded-3xl p-6 md:p-8 w-full max-w-2xl my-8 max-h-[90vh] overflow-y-auto border border-[#262626]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-extrabold uppercase font-sans text-white">
                {editingBlogPost ? 'EDIT POST' : 'ADD POST'}
              </h2>
              <button onClick={resetBlogForm} className="p-2 hover:bg-white/10 rounded-full text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBlogSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold uppercase mb-2 font-sans text-white">Title *</label>
                  <input
                    type="text"
                    value={blogForm.title}
                    onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-xl border-2 border-[#262626] bg-[#0a0a0a] text-white focus:outline-none focus:border-[#e64a19]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold uppercase mb-2 font-sans text-white">Slug</label>
                  <input
                    type="text"
                    value={blogForm.slug}
                    onChange={(e) => setBlogForm({ ...blogForm, slug: e.target.value })}
                    placeholder="auto-generated"
                    className="w-full px-4 py-3 rounded-xl border-2 border-[#262626] bg-[#0a0a0a] text-white focus:outline-none focus:border-[#e64a19] placeholder:text-gray-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold uppercase mb-2 font-sans text-white">Excerpt</label>
                <input
                  type="text"
                  value={blogForm.excerpt}
                  onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                  placeholder="Short description for listing"
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#262626] bg-[#0a0a0a] text-white focus:outline-none focus:border-[#e64a19] placeholder:text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-bold uppercase mb-2 font-sans text-white">Content</label>
                <textarea
                  value={blogForm.content}
                  onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                  rows={10}
                  placeholder="Write your blog post content here..."
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#262626] bg-[#0a0a0a] text-white focus:outline-none focus:border-[#e64a19] resize-none placeholder:text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-bold uppercase mb-2 font-sans text-white">Featured Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setBlogImageFile(e.target.files?.[0] || null)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#262626] bg-[#0a0a0a] text-white focus:outline-none"
                />
                {blogForm.image_url && !blogImageFile && (
                  <p className="text-sm text-muted-foreground mt-2">Current: {blogForm.image_url}</p>
                )}
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={blogForm.is_published}
                    onChange={(e) => setBlogForm({ ...blogForm, is_published: e.target.checked })}
                    className="w-5 h-5"
                  />
                  <span className="text-sm font-bold uppercase font-sans text-white">Publish immediately</span>
                </label>
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" variant="filled" disabled={uploading} className="flex-1 justify-center">
                  {uploading ? 'SAVING...' : editingBlogPost ? 'UPDATE POST' : 'CREATE POST'}
                </Button>
                <Button type="button" variant="transparent" onClick={resetBlogForm}>
                  CANCEL
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default Admin;
