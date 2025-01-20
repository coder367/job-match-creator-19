import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from "../_shared/cors.ts"

const GOOGLE_JOBS_API_KEY = Deno.env.get('GOOGLE_JOBS_API_KEY')
const GOOGLE_JOBS_CREDENTIALS = Deno.env.get('GOOGLE_JOBS_CREDENTIALS')

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { query, location } = await req.json()
    
    const searchQuery = `${query}${location ? ` in ${location}` : ''}`
    const url = `https://jobs.googleapis.com/v4/jobs:search?key=${GOOGLE_JOBS_API_KEY}`
    
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
    
    return new Response(
      JSON.stringify(data),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})