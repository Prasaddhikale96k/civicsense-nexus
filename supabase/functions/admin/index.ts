import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
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

    // Verify admin access
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

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

    const url = new URL(req.url)
    const path = url.pathname.split('/').slice(-2) // Get last two parts
    const resource = path[0]
    const action = path[1] || ''

    switch (resource) {
      case 'issues':
        return await handleAdminIssues(req, action, url.searchParams)
      case 'users':
        return await handleAdminUsers(req, action, url.searchParams)
      case 'departments':
        return await handleAdminDepartments(req, action)
      default:
        return new Response('Not found', { status: 404, headers: corsHeaders })
    }
  } catch (error) {
    console.error('Admin API error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

async function handleAdminIssues(req: Request, action: string, searchParams: URLSearchParams) {
  switch (req.method) {
    case 'GET':
      return await getAdminIssues(searchParams)
    case 'PUT':
      if (action) {
        return await updateIssueStatus(action, req)
      }
      break
    case 'DELETE':
      if (action) {
        return await deleteAdminIssue(action)
      }
      break
  }
  return new Response('Method not allowed', { status: 405, headers: corsHeaders })
}

async function getAdminIssues(searchParams: URLSearchParams) {
  const status = searchParams.get('status')
  const department = searchParams.get('department')
  const priority = searchParams.get('priority')
  const limit = parseInt(searchParams.get('limit') || '100')

  let query = supabase
    .from('issues')
    .select(`
      *,
      profiles!user_id(full_name, email, phone),
      votes(count),
      comments(count)
    `)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (status) query = query.eq('status', status)
  if (department) query = query.eq('assigned_department', department)
  if (priority) query = query.eq('priority', priority)

  const { data, error } = await query

  if (error) throw error

  return new Response(
    JSON.stringify({ issues: data }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function updateIssueStatus(issueId: string, req: Request) {
  const { status, priority, assignedTo, resolutionNotes } = await req.json()

  const updates: any = {}
  if (status) updates.status = status
  if (priority) updates.priority = priority
  if (assignedTo) updates.assigned_to = assignedTo
  if (resolutionNotes) updates.resolution_notes = resolutionNotes

  const { data, error } = await supabase
    .from('issues')
    .update(updates)
    .eq('id', issueId)
    .select()
    .single()

  if (error) throw error

  return new Response(
    JSON.stringify({ issue: data, message: 'Issue updated successfully' }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function deleteAdminIssue(issueId: string) {
  const { error } = await supabase
    .from('issues')
    .delete()
    .eq('id', issueId)

  if (error) throw error

  return new Response(
    JSON.stringify({ message: 'Issue deleted successfully' }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function handleAdminUsers(req: Request, action: string, searchParams: URLSearchParams) {
  switch (req.method) {
    case 'GET':
      return await getAdminUsers(searchParams)
    case 'PUT':
      if (action) {
        return await updateUserRole(action, req)
      }
      break
  }
  return new Response('Method not allowed', { status: 405, headers: corsHeaders })
}

async function getAdminUsers(searchParams: URLSearchParams) {
  const role = searchParams.get('role')
  const limit = parseInt(searchParams.get('limit') || '100')

  let query = supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (role) query = query.eq('role', role)

  const { data, error } = await query

  if (error) throw error

  return new Response(
    JSON.stringify({ users: data }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function updateUserRole(userId: string, req: Request) {
  const { role } = await req.json()

  const { data, error } = await supabase
    .from('profiles')
    .update({ role })
    .eq('user_id', userId)
    .select()
    .single()

  if (error) throw error

  return new Response(
    JSON.stringify({ user: data, message: 'User role updated successfully' }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function handleAdminDepartments(req: Request, action: string) {
  switch (req.method) {
    case 'GET':
      return await getDepartments()
    case 'POST':
      return await createDepartment(req)
    case 'PUT':
      if (action) {
        return await updateDepartment(action, req)
      }
      break
    case 'DELETE':
      if (action) {
        return await deleteDepartment(action)
      }
      break
  }
  return new Response('Method not allowed', { status: 405, headers: corsHeaders })
}

async function getDepartments() {
  const { data, error } = await supabase
    .from('departments')
    .select('*')
    .order('department_name')

  if (error) throw error

  return new Response(
    JSON.stringify({ departments: data }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function createDepartment(req: Request) {
  const { issueType, departmentName, contactEmail } = await req.json()

  const { data, error } = await supabase
    .from('departments')
    .insert({
      issue_type: issueType,
      department_name: departmentName,
      contact_email: contactEmail
    })
    .select()
    .single()

  if (error) throw error

  return new Response(
    JSON.stringify({ department: data, message: 'Department created successfully' }),
    { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function updateDepartment(departmentId: string, req: Request) {
  const updates = await req.json()

  const { data, error } = await supabase
    .from('departments')
    .update(updates)
    .eq('id', departmentId)
    .select()
    .single()

  if (error) throw error

  return new Response(
    JSON.stringify({ department: data, message: 'Department updated successfully' }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function deleteDepartment(departmentId: string) {
  const { error } = await supabase
    .from('departments')
    .delete()
    .eq('id', departmentId)

  if (error) throw error

  return new Response(
    JSON.stringify({ message: 'Department deleted successfully' }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}