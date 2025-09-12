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
    const notificationId = url.pathname.split('/').pop()

    switch (req.method) {
      case 'GET':
        if (notificationId && notificationId !== 'notifications') {
          return await getNotification(notificationId, user.id)
        } else {
          return await getNotifications(user.id, url.searchParams)
        }
      case 'PUT':
        if (notificationId) {
          return await markAsRead(notificationId, user.id)
        }
        break
      case 'POST':
        return await createNotification(req, user.id)
    }

    return new Response('Method not allowed', { status: 405, headers: corsHeaders })
  } catch (error) {
    console.error('Notifications API error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

async function getNotifications(userId: string, searchParams: URLSearchParams) {
  const unreadOnly = searchParams.get('unread') === 'true'
  const limit = parseInt(searchParams.get('limit') || '50')
  
  let query = supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (unreadOnly) {
    query = query.eq('read', false)
  }

  const { data, error } = await query

  if (error) {
    throw error
  }

  return new Response(
    JSON.stringify({ notifications: data }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function getNotification(notificationId: string, userId: string) {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('id', notificationId)
    .eq('user_id', userId)
    .single()

  if (error) {
    throw error
  }

  return new Response(
    JSON.stringify({ notification: data }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function markAsRead(notificationId: string, userId: string) {
  const { data, error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', notificationId)
    .eq('user_id', userId)
    .select()
    .single()

  if (error) {
    throw error
  }

  return new Response(
    JSON.stringify({ notification: data, message: 'Notification marked as read' }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function createNotification(req: Request, userId: string) {
  const { title, message, type, relatedIssueId } = await req.json()

  const { data, error } = await supabase
    .from('notifications')
    .insert({
      user_id: userId,
      title,
      message,
      type,
      related_issue_id: relatedIssueId
    })
    .select()
    .single()

  if (error) {
    throw error
  }

  return new Response(
    JSON.stringify({ notification: data, message: 'Notification created' }),
    { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}