import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, sessionId, context = [] } = await req.json();
    
    if (!query || typeof query !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Query is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get OpenAI API key
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    console.log('Processing query:', query);

    // Search knowledge base for relevant content
    const knowledgeResults = await searchKnowledgeBase(supabase, query);
    
    // Build context for AI
    const systemPrompt = buildSystemPrompt(knowledgeResults);
    const userContext = buildUserContext(context, query);

    // Call OpenAI API
    const startTime = performance.now();
    const aiResponse = await callOpenAI(openAIApiKey, systemPrompt, userContext, query);
    const endTime = performance.now();

    console.log('AI response received in', Math.round(endTime - startTime), 'ms');

    // Generate recommendations
    const recommendations = await generateRecommendations(supabase, query, knowledgeResults);

    // Log search analytics
    await logSearchAnalytics(supabase, query, knowledgeResults.length, aiResponse);

    return new Response(
      JSON.stringify({
        response: aiResponse.content,
        confidence: aiResponse.confidence,
        sources: knowledgeResults.map(kb => ({
          title: kb.title,
          url: kb.source_url || '#',
          category: kb.category
        })),
        recommendations,
        responseType: determineResponseType(query, aiResponse.content),
        responseData: extractResponseData(aiResponse.content)
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('AI Assistant error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'An error occurred processing your request',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

async function searchKnowledgeBase(supabase: any, query: string) {
  try {
    // Simple text search for now (can be enhanced with vector search later)
    const { data, error } = await supabase
      .from('knowledge_base')
      .select('*')
      .or(`title.ilike.%${query}%,content.ilike.%${query}%,tags.cs.{${query}}`)
      .eq('is_public', true)
      .order('priority_score', { ascending: false })
      .limit(5);

    if (error) {
      console.error('Knowledge base search error:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Failed to search knowledge base:', error);
    return [];
  }
}

function buildSystemPrompt(knowledgeResults: any[]) {
  const knowledgeContext = knowledgeResults.length > 0 
    ? `\n\nRelevant knowledge base articles:\n${knowledgeResults.map(kb => 
        `Title: ${kb.title}\nContent: ${kb.content.substring(0, 500)}...\nCategory: ${kb.category}`
      ).join('\n\n')}`
    : '';

  return `You are a helpful civic assistant AI for a city services platform. You help citizens with:

1. Reporting civic issues (potholes, streetlight outages, garbage collection, etc.)
2. Finding information about city services and departments
3. Understanding municipal processes and procedures
4. Getting updates on reported issues
5. General civic engagement and community information

Guidelines:
- Be helpful, accurate, and concise
- If you don't know something, say so and suggest who to contact
- For issue reporting, gather location, description, and urgency
- Provide specific department contact information when available
- Be empathetic to citizen concerns
- Suggest next steps or actions when appropriate

${knowledgeContext}

Always provide helpful, accurate information based on the knowledge available to you. If you're uncertain about specific policies or procedures, recommend contacting the appropriate city department directly.`;
}

function buildUserContext(context: any[], currentQuery: string) {
  if (context.length === 0) return currentQuery;
  
  const conversationHistory = context.map(msg => 
    `${msg.role}: ${msg.content}`
  ).join('\n');
  
  return `Previous conversation:\n${conversationHistory}\n\nCurrent question: ${currentQuery}`;
}

async function callOpenAI(apiKey: string, systemPrompt: string, userContext: string, query: string) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userContext }
      ],
      max_tokens: 1000,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API error: ${error}`);
  }

  const data = await response.json();
  const content = data.choices[0]?.message?.content || 'I apologize, but I was unable to generate a response.';
  
  // Calculate confidence based on response quality indicators
  const confidence = calculateConfidence(content, query);

  return { content, confidence };
}

function calculateConfidence(response: string, query: string): number {
  let confidence = 0.5; // Base confidence
  
  // Higher confidence for longer, more detailed responses
  if (response.length > 200) confidence += 0.2;
  if (response.length > 500) confidence += 0.1;
  
  // Higher confidence if response directly addresses the query
  const queryWords = query.toLowerCase().split(' ');
  const responseWords = response.toLowerCase();
  const matchedWords = queryWords.filter(word => responseWords.includes(word));
  confidence += (matchedWords.length / queryWords.length) * 0.2;
  
  // Lower confidence if response contains uncertainty indicators
  const uncertaintyIndicators = ['i don\'t know', 'i\'m not sure', 'might be', 'could be', 'possibly'];
  const hasUncertainty = uncertaintyIndicators.some(indicator => 
    response.toLowerCase().includes(indicator)
  );
  if (hasUncertainty) confidence -= 0.2;
  
  // Higher confidence if response includes specific information
  if (response.includes('contact') || response.includes('phone') || response.includes('email')) {
    confidence += 0.1;
  }
  
  return Math.max(0, Math.min(1, confidence));
}

async function generateRecommendations(supabase: any, query: string, knowledgeResults: any[]) {
  try {
    // Simple recommendation based on categories and related content
    const categories = [...new Set(knowledgeResults.map(kb => kb.category))];
    
    if (categories.length === 0) return [];
    
    const { data, error } = await supabase
      .from('knowledge_base')
      .select('id, title, summary, category')
      .in('category', categories)
      .neq('title', knowledgeResults.map(kb => kb.title))
      .eq('is_public', true)
      .limit(3);

    if (error) {
      console.error('Recommendations error:', error);
      return [];
    }

    return (data || []).map(item => ({
      id: item.id,
      title: item.title,
      summary: item.summary || item.title,
      category: item.category,
      similarity_score: Math.random() * 0.5 + 0.5 // Placeholder similarity
    }));
  } catch (error) {
    console.error('Failed to generate recommendations:', error);
    return [];
  }
}

function determineResponseType(query: string, response: string): string {
  const lowerQuery = query.toLowerCase();
  const lowerResponse = response.toLowerCase();
  
  if (lowerQuery.includes('map') || lowerQuery.includes('location') || lowerQuery.includes('where')) {
    return 'map';
  }
  
  if (lowerQuery.includes('chart') || lowerQuery.includes('graph') || lowerQuery.includes('statistics')) {
    return 'chart';
  }
  
  if (lowerQuery.includes('timeline') || lowerQuery.includes('history') || lowerQuery.includes('progress')) {
    return 'timeline';
  }
  
  return 'text';
}

function extractResponseData(response: string): any {
  // Extract structured data from response if possible
  // This is a placeholder for more sophisticated data extraction
  return {};
}

async function logSearchAnalytics(supabase: any, query: string, resultCount: number, aiResponse: any) {
  try {
    await supabase.from('search_analytics').insert({
      query_text: query,
      result_count: resultCount,
      has_results: resultCount > 0,
      response_quality_score: aiResponse.confidence,
      search_context: {
        response_type: determineResponseType(query, aiResponse.content),
        response_length: aiResponse.content.length
      }
    });
  } catch (error) {
    console.error('Failed to log search analytics:', error);
  }
}