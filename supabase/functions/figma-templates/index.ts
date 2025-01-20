import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Starting figma-templates function')
    
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Missing required environment variables')
    }

    // Create Supabase client with service role key
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    // Create default templates
    const defaultTemplates = [
      {
        name: "Modern Professional",
        figma_file_id: "template1",
        figma_node_id: "1",
        preview_url: "https://placehold.co/600x400?text=Modern+Professional",
        template_data: {
          description: "Clean and professional design perfect for corporate positions",
          styles: {},
        }
      },
      {
        name: "Creative Portfolio",
        figma_file_id: "template2",
        figma_node_id: "2",
        preview_url: "https://placehold.co/600x400?text=Creative+Portfolio",
        template_data: {
          description: "Stand out with a unique and artistic layout",
          styles: {},
        }
      },
      {
        name: "Minimal Classic",
        figma_file_id: "template3",
        figma_node_id: "3",
        preview_url: "https://placehold.co/600x400?text=Minimal+Classic",
        template_data: {
          description: "Simple and elegant design focusing on content",
          styles: {},
        }
      }
    ]

    console.log('Inserting default templates:', defaultTemplates.length)

    // First clear existing templates
    const { error: deleteError } = await supabase
      .from('resume_templates')
      .delete()
      .is('user_id', null)

    if (deleteError) {
      console.error('Error clearing templates:', deleteError)
      throw deleteError
    }

    // Insert new templates
    const { error: insertError } = await supabase
      .from('resume_templates')
      .insert(defaultTemplates.map(template => ({
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