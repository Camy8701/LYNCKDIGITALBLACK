-- Drop the overly permissive SELECT policy that exposes all subscriber emails
DROP POLICY IF EXISTS "Users can view their own subscription" ON public.newsletter_subscribers;

-- Create admin-only SELECT policy for newsletter subscribers
CREATE POLICY "Admins can view all newsletter subscribers"
ON public.newsletter_subscribers
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));