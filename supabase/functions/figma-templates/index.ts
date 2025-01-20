import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase_supabase-js@2.38.0'

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

    // Using a default template file for now - you should replace this with your actual Figma file ID
    const fileId = 'FP7lqd1V00LUaT5CmbkEL1' // Example Figma file ID with resume templates
    console.log('Fetching Figma file:', fileId)

    const response = await fetch(
      `https://api.figma.com/v1/files/${fileId}`,
      {
        headers: {
          'X-Figma-Token': FIGMA_ACCESS_TOKEN
        }
      }
    )

    if (!response.ok) {
      console.error('Figma API response:', response.status, response.statusText)
      throw new Error(`Figma API error: ${response.statusText}`)
    }

    const data = await response.json()
    console.log('Received Figma data:', data)

    // For now, let's create some default templates if Figma integration fails
    const defaultTemplates = [
      {
        name: "Modern Professional",
        figma_file_id: fileId,
        figma_node_id: "template1",
        preview_url: "https://placehold.co/600x400?text=Modern+Professional",
        template_data: {
          description: "Clean and professional design perfect for corporate positions",
          styles: {},
        }
      },
      {
        name: "Creative Portfolio",
        figma_file_id: fileId,
        figma_node_id: "template2",
        preview_url: "https://placehold.co/600x400?text=Creative+Portfolio",
        template_data: {
          description: "Stand out with a unique and artistic layout",
          styles: {},
        }
      },
      {
        name: "Minimal Classic",
        figma_file_id: fileId,
        figma_node_id: "template3",
        preview_url: "https://placehold.co/600x400?text=Minimal+Classic",
        template_data: {
          description: "Simple and elegant design focusing on content",
          styles: {},
        }
      }
    ]

    console.log('Inserting default templates:', defaultTemplates.length)

    // Store templates in Supabase
    const { error: insertError } = await supabase
      .from('resume_templates')
      .upsert(defaultTemplates.map(template => ({
        ...template,
        user_id: null // Making templates available to all users
      })))

    if (insertError) {
      console.error('Error inserting templates:', insertError)
      throw insertError
    }

    return new Response(
      JSON.stringify({ success: true, templates: defaultTemplates }),
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