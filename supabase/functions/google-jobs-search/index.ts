import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface GoogleJobsResponse {
  jobs: Array<{
    name: string;
    title: string;
    company: {
      name: string;
      imageUri?: string;
    };
    description: string;
    locations: string[];
    qualifications: string[];
    skills?: string[];
    applicationInfo?: {
      uris: string[];
    };
  }>;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { query, location } = await req.json()
    console.log('Received request with query:', query, 'location:', location)
    
    // Parse the credentials from environment variable
    const credentials = JSON.parse(Deno.env.get('GOOGLE_JOBS_CREDENTIALS') || '{}')
    console.log('Using project ID:', credentials.project_id)

    if (!credentials.project_id) {
      throw new Error('Missing or invalid Google Jobs API credentials')
    }

    // Get access token
    const accessToken = Deno.env.get('GOOGLE_JOBS_API_KEY')
    if (!accessToken) {
      throw new Error('Missing Google Jobs API key')
    }

    // Construct the request URL
    const baseUrl = 'https://jobs.googleapis.com/v4/projects'
    const projectId = credentials.project_id
    const endpoint = `${baseUrl}/${projectId}/jobs:search`
    
    console.log('Making request to endpoint:', endpoint)

    // Prepare the request body
    const searchBody = {
      searchMode: "JOB_SEARCH",
      requestMetadata: {
        domain: "www.google.com"
      },
      jobQuery: {
        query: query,
        location: location || undefined
      }
    }

    // Make the request to Google Jobs API
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(searchBody)
    })

    console.log('Google Jobs API response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Google Jobs API error response:', errorText)
      throw new Error(`Google Jobs API error: ${response.statusText}`)
    }

    const data: GoogleJobsResponse = await response.json()
    console.log('Successfully received jobs data:', data.jobs?.length || 0, 'jobs found')

    // Transform the response to match our job_listings schema
    const jobs = (data.jobs || []).map(job => ({
      job_title: job.title,
      company_name: job.company.name,
      company_logo: job.company.imageUri || null,
      location: job.locations?.[0] || null,
      job_description: job.description,
      requirements: JSON.stringify(job.qualifications || []),
      skills: job.skills || [],
      url: job.applicationInfo?.uris?.[0] || '',
      source: 'google_jobs'
    }))

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Store jobs in the database
    if (jobs.length > 0) {
      const { error: insertError } = await supabaseClient
        .from('job_listings')
        .upsert(
          jobs.map(job => ({
            ...job,
            user_id: (req.headers.get('Authorization') || '').split('Bearer ')[1]
          })),
          { onConflict: 'job_title,company_name' }
        )

      if (insertError) {
        console.error('Error storing jobs:', insertError)
      }
    }

    return new Response(
      JSON.stringify({ jobs }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )

  } catch (error) {
    console.error('Error in google-jobs-search function:', error)
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