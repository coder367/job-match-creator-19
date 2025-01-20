import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const FIGMA_ACCESS_TOKEN = Deno.env.get('FIGMA_ACCESS_TOKEN')
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
    const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')

    if (!FIGMA_ACCESS_TOKEN || !SUPABASE_URL || !SUPABASE_ANON_KEY) {
      throw new Error('Missing required environment variables')
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

    // Fetch templates from Figma
    const fileId = 'YOUR_FIGMA_FILE_ID' // Replace with your actual Figma file ID
    const response = await fetch(
      `https://api.figma.com/v1/files/${fileId}`,
      {
        headers: {
          'X-Figma-Token': FIGMA_ACCESS_TOKEN
        }
      }
    )

    if (!response.ok) {
      throw new Error(`Figma API error: ${response.statusText}`)
    }

    const data = await response.json()
    console.log('Received Figma data:', data)

    // Process and store templates
    const templates = data.document.children
      .filter(node => node.type === 'FRAME' && node.name.toLowerCase().includes('template'))
      .map(node => ({
        figma_file_id: fileId,
        figma_node_id: node.id,
        name: node.name,
        preview_url: null, // You'll need to implement image rendering
        template_data: {
          description: node.description || 'A professional resume template',
          styles: node.styles || {},
        }
      }))

    console.log('Processing templates:', templates.length)

    // Store templates in Supabase
    if (templates.length > 0) {
      const { error: insertError } = await supabase
        .from('resume_templates')
        .upsert(templates)

      if (insertError) {
        throw insertError
      }
    }

    return new Response(
      JSON.stringify({ success: true, templates }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )

  } catch (error) {
    console.error('Error in figma-templates function:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An unexpected error occurred',
        details: error.stack 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})