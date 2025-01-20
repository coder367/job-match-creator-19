import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { query, location } = await req.json()
    console.log('Received search request:', { query, location })

    const GOOGLE_JOBS_API_KEY = Deno.env.get('GOOGLE_JOBS_API_KEY')
    const GOOGLE_JOBS_CREDENTIALS = Deno.env.get('GOOGLE_JOBS_CREDENTIALS')

    if (!GOOGLE_JOBS_API_KEY || !GOOGLE_JOBS_CREDENTIALS) {
      console.error('Missing required API credentials')
      throw new Error('Missing required API credentials')
    }

    const searchQuery = `${query}${location ? ` in ${location}` : ''}`
    const url = `https://jobs.googleapis.com/v4/jobs:search?key=${GOOGLE_JOBS_API_KEY}`
    
    console.log('Making request to Google Jobs API')
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GOOGLE_JOBS_CREDENTIALS}`
      },
      body: JSON.stringify({
        searchMode: "JOB_SEARCH",
        jobQuery: {
          query: searchQuery,
          locationFilters: location ? [{
            address: location
          }] : undefined
        }
      })
    })

    const data = await response.json()
    console.log('Received response from Google Jobs API:', data)

    // Store the job in Supabase if it doesn't exist
    if (data.jobs && data.jobs.length > 0) {
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      )

      const firstJob = data.jobs[0]
      const { error: insertError } = await supabase
        .from('job_listings')
        .upsert({
          user_id: req.headers.get('authorization')?.split(' ')[1], // Extract user ID from Bearer token
          job_title: firstJob.title,
          company_name: firstJob.company?.name || 'Unknown Company',
          company_logo: firstJob.company?.logoUrl,
          location: firstJob.locations?.[0]?.text || 'Remote',
          job_description: firstJob.description,
          requirements: firstJob.requirements?.join('\n'),
          skills: firstJob.skills || [],
          url: firstJob.applicationUrl,
          source: 'google_jobs'
        })

      if (insertError) {
        console.error('Error inserting job:', insertError)
      }
    }

    return new Response(
      JSON.stringify(data),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in search-jobs function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})