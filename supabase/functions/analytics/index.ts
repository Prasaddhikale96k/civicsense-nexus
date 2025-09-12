import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_ANON_KEY') ?? ''
)

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (authHeader) {
      supabase.auth.setAuth(authHeader.replace('Bearer ', ''))
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const url = new URL(req.url)
    const endpoint = url.pathname.split('/').pop()

    switch (endpoint) {
      case 'dashboard':
        return await getDashboardAnalytics()
      case 'hotspots':
        return await getHotspots()
      case 'trends':
        return await getTrends(url.searchParams)
      default:
        return await getGeneralAnalytics()
    }
  } catch (error) {
    console.error('Analytics API error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

async function getDashboardAnalytics() {
  // Get overall statistics
  const { data: totalIssues } = await supabase
    .from('issues')
    .select('*', { count: 'exact', head: true })

  const { data: resolvedIssues } = await supabase
    .from('issues')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'resolved')

  const { data: activeUsers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .gt('issues_reported_count', 0)

  // Get category breakdown
  const { data: categoryStats } = await supabase
    .from('issues')
    .select('category')
    .then(result => {
      if (result.data) {
        const counts = result.data.reduce((acc: any, issue: any) => {
          acc[issue.category] = (acc[issue.category] || 0) + 1
          return acc
        }, {})
        return Object.entries(counts).map(([category, count]) => ({ category, count }))
      }
      return []
    })

  // Calculate average resolution time
  const { data: resolvedWithTime } = await supabase
    .from('issues')
    .select('created_at, resolved_at')
    .eq('status', 'resolved')
    .not('resolved_at', 'is', null)

  let avgResolutionHours = 0
  if (resolvedWithTime && resolvedWithTime.length > 0) {
    const totalHours = resolvedWithTime.reduce((sum: number, issue: any) => {
      const created = new Date(issue.created_at).getTime()
      const resolved = new Date(issue.resolved_at).getTime()
      return sum + ((resolved - created) / (1000 * 60 * 60))
    }, 0)
    avgResolutionHours = totalHours / resolvedWithTime.length
  }

  const analytics = {
    totalIssues: totalIssues?.count || 0,
    resolvedIssues: resolvedIssues?.count || 0,
    activeUsers: activeUsers?.count || 0,
    avgResolutionHours: Math.round(avgResolutionHours * 100) / 100,
    resolutionRate: totalIssues?.count ? 
      Math.round(((resolvedIssues?.count || 0) / totalIssues.count) * 100) : 0,
    categoryBreakdown: categoryStats
  }

  return new Response(
    JSON.stringify(analytics),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function getHotspots() {
  // Get issues grouped by location for hotspot analysis
  const { data: issues } = await supabase
    .from('issues')
    .select('latitude, longitude, category, status')
    .not('latitude', 'is', null)
    .not('longitude', 'is', null)

  if (!issues || issues.length === 0) {
    return new Response(
      JSON.stringify({ hotspots: [] }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  // Simple clustering by rounding coordinates (in production, use proper clustering)
  const clusters: Record<string, any> = {}
  
  issues.forEach(issue => {
    const lat = Math.round(issue.latitude * 100) / 100
    const lng = Math.round(issue.longitude * 100) / 100
    const key = `${lat},${lng}`
    
    if (!clusters[key]) {
      clusters[key] = {
        latitude: lat,
        longitude: lng,
        count: 0,
        categories: {},
        resolved: 0
      }
    }
    
    clusters[key].count++
    clusters[key].categories[issue.category] = 
      (clusters[key].categories[issue.category] || 0) + 1
    
    if (issue.status === 'resolved') {
      clusters[key].resolved++
    }
  })

  const hotspots = Object.values(clusters)
    .filter((cluster: any) => cluster.count >= 2) // Minimum 2 issues to be a hotspot
    .sort((a: any, b: any) => b.count - a.count)
    .slice(0, 20) // Top 20 hotspots

  return new Response(
    JSON.stringify({ hotspots }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function getTrends(searchParams: URLSearchParams) {
  const days = parseInt(searchParams.get('days') || '30')
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  const { data: trends } = await supabase
    .from('issues')
    .select('created_at, category, status')
    .gte('created_at', startDate.toISOString())
    .order('created_at')

  if (!trends) {
    return new Response(
      JSON.stringify({ trends: [] }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  // Group by date
  const dailyTrends: Record<string, any> = {}
  
  trends.forEach(issue => {
    const date = new Date(issue.created_at).toISOString().split('T')[0]
    
    if (!dailyTrends[date]) {
      dailyTrends[date] = {
        date,
        total: 0,
        categories: {},
        resolved: 0
      }
    }
    
    dailyTrends[date].total++
    dailyTrends[date].categories[issue.category] = 
      (dailyTrends[date].categories[issue.category] || 0) + 1
    
    if (issue.status === 'resolved') {
      dailyTrends[date].resolved++
    }
  })

  const trendData = Object.values(dailyTrends).sort((a: any, b: any) => 
    a.date.localeCompare(b.date)
  )

  return new Response(
    JSON.stringify({ trends: trendData }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function getGeneralAnalytics() {
  return getDashboardAnalytics()
}