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
    const { query, location } = await req.json()
    console.log('Received search request:', { query, location })

    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
    const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')

    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      throw new Error('Missing Supabase environment variables')
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

    let supabaseQuery = supabase
      .from('job_listings')
      .select('*')

    if (query) {
      supabaseQuery = supabaseQuery.ilike('job_title', `%${query}%`)
    }

    if (location) {
      supabaseQuery = supabaseQuery.ilike('location', `%${location}%`)
    }

    const { data: jobs, error } = await supabaseQuery

    if (error) {
      console.error('Error fetching jobs:', error)
      throw error
    }

    console.log(`Found ${jobs?.length || 0} jobs matching criteria`)

    return new Response(
      JSON.stringify({ jobs: jobs || [] }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )

  } catch (error) {
    console.error('Error in search-jobs function:', error)
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