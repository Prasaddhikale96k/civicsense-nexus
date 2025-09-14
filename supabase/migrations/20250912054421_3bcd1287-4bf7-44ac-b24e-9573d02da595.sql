-- Enhanced backend for CivicSense Nexus (Fixed enum values)
-- Complete authentication, issues, gamification, and analytics system

-- Update profiles table with gamification fields
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS issues_reported_count INTEGER DEFAULT 0,
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

-- Enhance issues table with location coordinates
ALTER TABLE public.issues 
ADD COLUMN IF NOT EXISTS location_lat DECIMAL(10, 8),
ADD COLUMN IF NOT EXISTS location_lng DECIMAL(11, 8),
ADD COLUMN IF NOT EXISTS resolution_notes TEXT;

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

-- Enable RLS on new tables
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.issue_translations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for departments (public read)
CREATE POLICY "Departments are publicly readable" 
ON public.departments FOR SELECT USING (true);

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

-- Function to auto-assign department based on category
CREATE OR REPLACE FUNCTION public.assign_department_to_issue()
RETURNS TRIGGER AS $$
BEGIN
  -- Auto-assign department based on issue category
  SELECT department_name INTO NEW.assigned_department
  FROM public.departments 
  WHERE issue_type = NEW.category::text;
  
  -- If no department found, assign to general
  IF NEW.assigned_department IS NULL THEN
    NEW.assigned_department := 'General Services';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Trigger to assign department automatically
DROP TRIGGER IF EXISTS assign_department_trigger ON public.issues;
CREATE TRIGGER assign_department_trigger
  BEFORE INSERT OR UPDATE OF category ON public.issues
  FOR EACH ROW EXECUTE FUNCTION public.assign_department_to_issue();

-- Function to update user gamification
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

-- Function to create notification on status change
CREATE OR REPLACE FUNCTION public.create_status_notification()
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
      'Your issue "' || NEW.title || '" status changed to: ' || NEW.status::text,
      'status_update',
      NEW.id
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Trigger for status notifications
DROP TRIGGER IF EXISTS status_notification_trigger ON public.issues;
CREATE TRIGGER status_notification_trigger
  AFTER UPDATE OF status ON public.issues
  FOR EACH ROW EXECUTE FUNCTION public.create_status_notification();

-- Performance indexes
CREATE INDEX IF NOT EXISTS idx_issues_category ON public.issues(category);
CREATE INDEX IF NOT EXISTS idx_issues_location ON public.issues(location_lat, location_lng);
CREATE INDEX IF NOT EXISTS idx_issue_translations_issue_id ON public.issue_translations(issue_id);
CREATE INDEX IF NOT EXISTS idx_issue_translations_lang ON public.issue_translations(language_code);

-- Analytics view with correct enum values
CREATE OR REPLACE VIEW public.analytics_dashboard AS
SELECT 
  COUNT(*) as total_issues,
  COUNT(*) FILTER (WHERE status = 'resolved') as resolved_issues,
  COUNT(*) FILTER (WHERE status = 'reported') as reported_issues,
  COUNT(*) FILTER (WHERE status = 'in_progress') as in_progress_issues,
  COUNT(*) FILTER (WHERE status = 'verified') as verified_issues,
  AVG(EXTRACT(EPOCH FROM (resolved_at - created_at))/3600) FILTER (WHERE status = 'resolved') as avg_resolution_hours,
  COUNT(DISTINCT user_id) as active_users,
  category::text as issue_type,
  assigned_department as department,
  DATE_TRUNC('day', created_at) as report_date
FROM public.issues 
GROUP BY category, assigned_department, DATE_TRUNC('day', created_at);

-- Grant permissions
GRANT SELECT ON public.analytics_dashboard TO authenticated;
GRANT SELECT ON public.departments TO anon, authenticated;
GRANT ALL ON public.issue_translations TO authenticated;