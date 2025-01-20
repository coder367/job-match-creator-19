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
    const SCRAPER_API_KEY = Deno.env.get('SCRAPER_API_KEY')

    // Try Google Jobs API first
    try {
      if (GOOGLE_JOBS_API_KEY && GOOGLE_JOBS_CREDENTIALS) {
        console.log('Attempting to use Google Jobs API')
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

        if (response.ok) {
          const data = await response.json()
          console.log('Successfully retrieved jobs from Google Jobs API')
          return new Response(
            JSON.stringify(data),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
        throw new Error('Google Jobs API request failed')
      }
    } catch (error) {
      console.error('Google Jobs API error:', error)
    }

    // Fallback to ScraperAPI
    if (SCRAPER_API_KEY) {
      console.log('Falling back to ScraperAPI')
      const scraperUrl = `http://api.scraperapi.com?api_key=${SCRAPER_API_KEY}&url=https://www.indeed.com/jobs?q=${encodeURIComponent(query)}&l=${encodeURIComponent(location || '')}`
      
      const response = await fetch(scraperUrl)
      if (!response.ok) {
        throw new Error('Failed to fetch jobs from ScraperAPI')
      }

      const html = await response.text()
      // Basic parsing of Indeed's HTML response
      const jobs = parseIndeedJobs(html)

      return new Response(
        JSON.stringify({ jobs }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    throw new Error('No job search APIs are configured')

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

// Basic HTML parsing function for Indeed results
function parseIndeedJobs(html: string) {
  const jobs = []
  // Basic regex pattern to extract job cards
  const jobPattern = /<div class="job_seen_beacon">(.*?)<\/div>/gs
  const matches = html.match(jobPattern)

  if (matches) {
    matches.forEach(match => {
      const titleMatch = match.match(/<h2[^>]*>(.*?)<\/h2>/s)
      const companyMatch = match.match(/class="companyName"[^>]*>(.*?)<\/a>/s)
      const locationMatch = match.match(/class="companyLocation"[^>]*>(.*?)<\/div>/s)

      if (titleMatch && companyMatch && locationMatch) {
        jobs.push({
          title: titleMatch[1].replace(/<[^>]*>/g, '').trim(),
          company: {
            name: companyMatch[1].replace(/<[^>]*>/g, '').trim(),
          },
          locations: [{
            text: locationMatch[1].replace(/<[^>]*>/g, '').trim()
          }],
          description: '',
          requirements: [],
          skills: []
        })
      }
    })
  }

  return jobs
}