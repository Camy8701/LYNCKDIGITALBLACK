-- Add new product categories
-- LYNCK DIGITAL - Additional Categories

INSERT INTO public.categories (name, slug, description, color_class) VALUES
  ('Productivity', 'productivity', 'Tools and resources to boost your productivity and efficiency', 'bg-vibrant-mint'),
  ('Content Creation', 'content-creation', 'Assets and templates for creating engaging content', 'bg-vibrant-coral'),
  ('A.I', 'ai', 'AI-powered tools, prompts, and automation resources', 'bg-vibrant-purple'),
  ('Self Development', 'self-development', 'Resources for personal growth and skill development', 'bg-vibrant-yellow')
ON CONFLICT (slug) DO NOTHING;
