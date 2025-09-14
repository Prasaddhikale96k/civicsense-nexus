-- Fix security definer view issue
-- Recreate analytics view without security definer properties

DROP VIEW IF EXISTS public.analytics_dashboard;

-- Create a regular view (not security definer)
CREATE VIEW public.analytics_dashboard WITH (security_barrier = false) AS
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
WHERE 
  -- Apply RLS manually in view since we're not using security definer
  (auth.uid() IS NOT NULL) -- Only authenticated users can access analytics
GROUP BY category, assigned_department, DATE_TRUNC('day', created_at);

-- Grant appropriate permissions
GRANT SELECT ON public.analytics_dashboard TO authenticated;