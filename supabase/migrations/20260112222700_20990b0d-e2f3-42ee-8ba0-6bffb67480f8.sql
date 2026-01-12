-- Drop the overly permissive public SELECT policy that exposes all user emails
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;

-- Create owner-only SELECT policy - users can only view their own profile
CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = user_id);

-- Create admin policy - admins can view all profiles for management purposes
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));