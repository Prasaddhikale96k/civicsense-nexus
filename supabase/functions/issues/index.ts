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

    const url = new URL(req.url)
    const issueId = url.pathname.split('/').pop()
    
    switch (req.method) {
      case 'GET':
        if (issueId && issueId !== 'issues') {
          return await getIssue(issueId)
        } else {
          return await getIssues(url.searchParams)
        }
      case 'POST':
        return await createIssue(req)
      case 'PUT':
        if (issueId) {
          return await updateIssue(issueId, req)
        }
        break
      case 'DELETE':
        if (issueId) {
          return await deleteIssue(issueId)
        }
        break
    }
    
    return new Response('Method not allowed', { status: 405, headers: corsHeaders })
  } catch (error) {
    console.error('Issues API error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

async function getIssues(searchParams: URLSearchParams) {
  let query = supabase
    .from('issues')
    .select(`
      *,
      profiles!user_id(full_name, avatar_url),
      votes(vote_type),
      comments(count)
    `)

  // Apply filters
  const status = searchParams.get('status')
  const category = searchParams.get('category')
  const lat = searchParams.get('lat')
  const lng = searchParams.get('lng')
  const radius = searchParams.get('radius')

  if (status) {
    query = query.eq('status', status)
  }
  
  if (category) {
    query = query.eq('category', category)
  }

  // Location radius filtering (simplified)
  if (lat && lng && radius) {
    const latNum = parseFloat(lat)
    const lngNum = parseFloat(lng)
    const radiusNum = parseFloat(radius)
    
    query = query
      .gte('latitude', latNum - radiusNum * 0.01) // Rough conversion
      .lte('latitude', latNum + radiusNum * 0.01)
      .gte('longitude', lngNum - radiusNum * 0.01)
      .lte('longitude', lngNum + radiusNum * 0.01)
  }

  const { data, error } = await query.order('created_at', { ascending: false })

  if (error) {
    throw error
  }

  return new Response(
    JSON.stringify({ issues: data }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function getIssue(issueId: string) {
  const { data, error } = await supabase
    .from('issues')
    .select(`
      *,
      profiles!user_id(full_name, avatar_url),
      votes(vote_type, user_id),
      comments(*, profiles!user_id(full_name, avatar_url))
    `)
    .eq('id', issueId)
    .single()

  if (error) {
    throw error
  }

  return new Response(
    JSON.stringify({ issue: data }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function createIssue(req: Request) {
  const {
    title,
    description,
    category,
    latitude,
    longitude,
    address,
    imageUrls = [],
    videoUrls = [],
    voiceTranscript,
    language = 'en'
  } = await req.json()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized' }),
      { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  // Create the main issue
  const { data: issue, error: issueError } = await supabase
    .from('issues')
    .insert({
      user_id: user.id,
      title,
      description,
      category,
      latitude,
      longitude,
      address,
      image_urls: imageUrls,
      video_urls: videoUrls,
      voice_transcript: voiceTranscript
    })
    .select()
    .single()

  if (issueError) {
    throw issueError
  }

  // Add translation if language is not English
  if (language !== 'en') {
    await supabase
      .from('issue_translations')
      .insert({
        issue_id: issue.id,
        language_code: language,
        title,
        description
      })
  }

  return new Response(
    JSON.stringify({ issue, message: 'Issue created successfully' }),
    { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function updateIssue(issueId: string, req: Request) {
  const updates = await req.json()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized' }),
      { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  const { data, error } = await supabase
    .from('issues')
    .update(updates)
    .eq('id', issueId)
    .select()
    .single()

  if (error) {
    throw error
  }

  return new Response(
    JSON.stringify({ issue: data, message: 'Issue updated successfully' }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function deleteIssue(issueId: string) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized' }),
      { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  // Check if user is admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('user_id', user.id)
    .single()

  if (!profile || profile.role !== 'admin') {
    return new Response(
      JSON.stringify({ error: 'Admin access required' }),
      { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  const { error } = await supabase
    .from('issues')
    .delete()
    .eq('id', issueId)

  if (error) {
    throw error
  }

  return new Response(
    JSON.stringify({ message: 'Issue deleted successfully' }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}