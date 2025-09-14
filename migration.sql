-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create profiles table
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  is_admin boolean DEFAULT false,
  avatar_url text,
  created_at timestamptz DEFAULT now()
);

-- Create issues table
CREATE TABLE public.issues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'pending',
  user_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- Create comments table
CREATE TABLE public.comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_id uuid REFERENCES public.issues(id) ON DELETE CASCADE,
  user_id uuid REFERENCES public.profiles(id),
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Security definer function to check admin status (prevents infinite recursion)
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
RETURNS boolean AS $$
  SELECT COALESCE((SELECT is_admin FROM public.profiles WHERE id = user_id), false);
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- RLS Policies for profiles
CREATE POLICY "profiles_insert_own" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_select_all" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "profiles_update_own_or_admin" ON public.profiles
  FOR UPDATE USING (auth.uid() = id OR public.is_admin(auth.uid()));

-- RLS Policies for issues
CREATE POLICY "issues_insert_own" ON public.issues
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "issues_select_all" ON public.issues
  FOR SELECT USING (true);

CREATE POLICY "issues_update_own_or_admin" ON public.issues
  FOR UPDATE USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

CREATE POLICY "issues_delete_own_or_admin" ON public.issues
  FOR DELETE USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

-- RLS Policies for comments
CREATE POLICY "comments_insert_own" ON public.comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "comments_select_all" ON public.comments
  FOR SELECT USING (true);

CREATE POLICY "comments_update_own_or_admin" ON public.comments
  FOR UPDATE USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

CREATE POLICY "comments_delete_own_or_admin" ON public.comments
  FOR DELETE USING (auth.uid() = user_id OR public.is_admin(auth.uid()));