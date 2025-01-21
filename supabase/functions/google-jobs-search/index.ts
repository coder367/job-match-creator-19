import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

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
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { query, location } = await req.json()
    
    const credentials = JSON.parse(Deno.env.get('GOOGLE_JOBS_CREDENTIALS') || '{}')
    const apiKey = Deno.env.get('GOOGLE_JOBS_API_KEY')

    if (!credentials || !apiKey) {
      throw new Error('Missing Google Jobs API credentials')
    }

    // Construct the request URL
    const baseUrl = 'https://jobs.googleapis.com/v4/projects'
    const projectId = credentials.project_id
    const endpoint = `${baseUrl}/${projectId}/jobs:search`

    // Prepare the request body
    const searchBody = {
      searchMode: "JOB_SEARCH",
      requestMetadata: {
        userId: "user123",
        sessionId: "session123",
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
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(searchBody)
    })

    if (!response.ok) {
      throw new Error(`Google Jobs API error: ${response.statusText}`)
    }

    const data: GoogleJobsResponse = await response.json()

    // Transform the response to match our job_listings schema
    const jobs = data.jobs.map(job => ({
      id: crypto.randomUUID(),
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

    // Store the jobs in our database for future reference
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { error: insertError } = await supabaseClient
      .from('job_listings')
      .upsert(jobs, { onConflict: 'url' })

    if (insertError) {
      console.error('Error storing jobs:', insertError)
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