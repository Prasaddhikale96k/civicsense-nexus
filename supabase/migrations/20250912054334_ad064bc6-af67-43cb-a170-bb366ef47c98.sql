-- Enhanced backend for CivicSense Nexus
-- Complete authentication, issues, gamification, and analytics system

-- Update profiles table with gamification fields
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS points INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS issues_reported_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
ADD COLUMN IF NOT EXISTS google_id TEXT,
ADD COLUMN IF NOT EXISTS profile_pic_url TEXT;

-- Department mapping table
CREATE TABLE IF NOT EXISTS public.departments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  issue_type TEXT NOT NULL UNIQUE,
  department_name TEXT NOT NULL,
  contact_email TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default department mappings
INSERT INTO public.departments (issue_type, department_name, contact_email) VALUES
('pothole', 'Roads Department', 'roads@city.gov'),
('streetlight', 'Electrical Department', 'electrical@city.gov'),
('garbage', 'Waste Management', 'waste@city.gov'),
('water_leak', 'Water Department', 'water@city.gov'),
('traffic_signal', 'Traffic Department', 'traffic@city.gov'),
('park_maintenance', 'Parks Department', 'parks@city.gov'),
('noise_complaint', 'Environment Department', 'environment@city.gov'),
('road_damage', 'Roads Department', 'roads@city.gov')
ON CONFLICT (issue_type) DO NOTHING;

-- Enhanced issues table
ALTER TABLE public.issues 
ADD COLUMN IF NOT EXISTS issue_type TEXT DEFAULT 'other',
ADD COLUMN IF NOT EXISTS department TEXT,
ADD COLUMN IF NOT EXISTS photo_urls TEXT[],
ADD COLUMN IF NOT EXISTS location_lat DECIMAL(10, 8),
ADD COLUMN IF NOT EXISTS location_lng DECIMAL(11, 8),
ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
ADD COLUMN IF NOT EXISTS resolution_notes TEXT,
ADD COLUMN IF NOT EXISTS resolved_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS assigned_to UUID REFERENCES public.profiles(user_id);

-- Multilingual content table for issues
CREATE TABLE IF NOT EXISTS public.issue_translations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  issue_id UUID NOT NULL REFERENCES public.issues(id) ON DELETE CASCADE,
  language_code TEXT NOT NULL,
  title TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(issue_id, language_code)
);

-- Enable RLS on all tables
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.issue_translations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for departments (public read)
CREATE POLICY "Departments are publicly readable" 
ON public.departments FOR SELECT USING (true);

CREATE POLICY "Only admins can modify departments" 
ON public.departments FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- RLS Policies for issue_translations
CREATE POLICY "Issue translations are publicly readable" 
ON public.issue_translations FOR SELECT USING (true);

CREATE POLICY "Users can create translations for their issues" 
ON public.issue_translations FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.issues 
    WHERE issues.id = issue_id 
    AND issues.user_id = auth.uid()
  )
);

-- Function to auto-assign department based on issue type
CREATE OR REPLACE FUNCTION public.assign_department_to_issue()
RETURNS TRIGGER AS $$
BEGIN
  -- Auto-assign department based on issue type
  SELECT department_name INTO NEW.department
  FROM public.departments 
  WHERE issue_type = NEW.issue_type;
  
  -- If no department found, assign to general
  IF NEW.department IS NULL THEN
    NEW.department := 'General Services';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Trigger to assign department automatically
DROP TRIGGER IF EXISTS assign_department_trigger ON public.issues;
CREATE TRIGGER assign_department_trigger
  BEFORE INSERT OR UPDATE OF issue_type ON public.issues
  FOR EACH ROW EXECUTE FUNCTION public.assign_department_to_issue();

-- Function to update user points and issue count
CREATE OR REPLACE FUNCTION public.update_user_gamification()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Award points for reporting issue
    UPDATE public.profiles 
    SET points = points + 10, 
        issues_reported_count = issues_reported_count + 1
    WHERE user_id = NEW.user_id;
    
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    -- Award bonus points for resolved issues
    IF OLD.status != 'resolved' AND NEW.status = 'resolved' THEN
      UPDATE public.profiles 
      SET points = points + 25
      WHERE user_id = NEW.user_id;
      
      NEW.resolved_at = now();
    END IF;
    
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Trigger for gamification
DROP TRIGGER IF EXISTS gamification_trigger ON public.issues;
CREATE TRIGGER gamification_trigger
  AFTER INSERT OR UPDATE OF status ON public.issues
  FOR EACH ROW EXECUTE FUNCTION public.update_user_gamification();

-- Function to create notification
CREATE OR REPLACE FUNCTION public.create_notification()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'UPDATE' AND OLD.status != NEW.status THEN
    INSERT INTO public.notifications (
      user_id, 
      title, 
      message, 
      type,
      related_issue_id
    ) VALUES (
      NEW.user_id,
      'Issue Status Updated',
      'Your issue "' || NEW.title || '" status changed to: ' || NEW.status,
      'status_update',
      NEW.id
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Trigger for notifications
DROP TRIGGER IF EXISTS notification_trigger ON public.issues;
CREATE TRIGGER notification_trigger
  AFTER UPDATE OF status ON public.issues
  FOR EACH ROW EXECUTE FUNCTION public.create_notification();

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_issues_user_id ON public.issues(user_id);
CREATE INDEX IF NOT EXISTS idx_issues_status ON public.issues(status);
CREATE INDEX IF NOT EXISTS idx_issues_type ON public.issues(issue_type);
CREATE INDEX IF NOT EXISTS idx_issues_location ON public.issues(location_lat, location_lng);
CREATE INDEX IF NOT EXISTS idx_issues_created_at ON public.issues(created_at);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_votes_issue_id ON public.votes(issue_id);

-- Analytics view for dashboard
CREATE OR REPLACE VIEW public.analytics_dashboard AS
SELECT 
  COUNT(*) as total_issues,
  COUNT(*) FILTER (WHERE status = 'resolved') as resolved_issues,
  COUNT(*) FILTER (WHERE status = 'open') as open_issues,
  COUNT(*) FILTER (WHERE status = 'in_progress') as in_progress_issues,
  AVG(EXTRACT(EPOCH FROM (resolved_at - created_at))/3600) FILTER (WHERE status = 'resolved') as avg_resolution_hours,
  COUNT(DISTINCT user_id) as active_users,
  issue_type,
  department,
  DATE_TRUNC('day', created_at) as report_date
FROM public.issues 
GROUP BY issue_type, department, DATE_TRUNC('day', created_at);

-- Grant permissions
GRANT SELECT ON public.analytics_dashboard TO authenticated;
GRANT SELECT ON public.departments TO anon, authenticated;
GRANT ALL ON public.issue_translations TO authenticated;