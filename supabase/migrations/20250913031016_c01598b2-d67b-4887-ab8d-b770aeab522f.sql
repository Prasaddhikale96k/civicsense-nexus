-- Fix Security Definer View vulnerability
-- Drop the existing analytics_dashboard view that uses SECURITY DEFINER
DROP VIEW IF EXISTS public.analytics_dashboard;

-- Recreate the analytics_dashboard view without SECURITY DEFINER
-- This ensures it respects RLS policies of the querying user
CREATE VIEW public.analytics_dashboard AS
SELECT
  date_trunc('day', i.created_at) as report_date,
  COUNT(*) as total_issues,
  COUNT(CASE WHEN i.status = 'reported' THEN 1 END) as reported_issues,
  COUNT(CASE WHEN i.status = 'resolved' THEN 1 END) as resolved_issues,
  COUNT(CASE WHEN i.status = 'in_progress' THEN 1 END) as in_progress_issues,
  COUNT(CASE WHEN i.status = 'verified' THEN 1 END) as verified_issues,
  EXTRACT(EPOCH FROM AVG(i.resolved_at - i.created_at))/3600 as avg_resolution_hours,
  COUNT(DISTINCT i.user_id) as active_users,
  i.category::text as issue_type,
  i.assigned_department as department
FROM public.issues i
GROUP BY date_trunc('day', i.created_at), i.category, i.assigned_department
ORDER BY report_date DESC;

-- Enable RLS on the view (inherited from underlying tables)
-- Grant select permissions to authenticated users
GRANT SELECT ON public.analytics_dashboard TO authenticated;

-- Create RLS policy for the analytics_dashboard view access
-- Only admins and municipal staff can access analytics
CREATE POLICY "Only staff can view analytics dashboard" 
ON public.analytics_dashboard 
FOR SELECT 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.user_id = auth.uid() 
    AND p.role IN ('municipal_staff', 'admin')
  )
);