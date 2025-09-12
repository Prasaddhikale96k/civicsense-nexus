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
    const { text, targetLanguage, sourceLanguage = 'en' } = await req.json()
    
    // Simple translation logic - in production, you'd use Google Translate API
    const translations = await translateText(text, sourceLanguage, targetLanguage)

    return new Response(
      JSON.stringify({ 
        originalText: text,
        translatedText: translations.translatedText,
        sourceLanguage,
        targetLanguage 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Translation error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

async function translateText(text: string, sourceLang: string, targetLang: string) {
  // Mock translation for now - replace with Google Translate API
  const mockTranslations: Record<string, Record<string, string>> = {
    'hi': {
      'Pothole reported': 'गड्ढा रिपोर्ट किया गया',
      'Streetlight not working': 'स्ट्रीटलाइट काम नहीं कर रही',
      'Garbage collection': 'कचरा संग्रह',
      'Water leakage': 'पानी का रिसाव',
      'Traffic signal issue': 'ट्रैफिक सिग्नल समस्या'
    },
    'mr': {
      'Pothole reported': 'खड्डा नोंदवला',
      'Streetlight not working': 'रस्ता दिवा काम करत नाही',
      'Garbage collection': 'कचरा गोळा',
      'Water leakage': 'पाणी गळती',
      'Traffic signal issue': 'वाहतूक सिग्नल समस्या'
    }
  }

  const translatedText = mockTranslations[targetLang]?.[text] || text

  return {
    translatedText,
    confidence: 0.95
  }
}