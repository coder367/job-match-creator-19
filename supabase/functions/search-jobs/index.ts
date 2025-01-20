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
    const { query, location, url } = await req.json()
    console.log('Received request:', { query, location, url })

    const GOOGLE_JOBS_API_KEY = Deno.env.get('GOOGLE_JOBS_API_KEY')
    const GOOGLE_JOBS_CREDENTIALS = Deno.env.get('GOOGLE_JOBS_CREDENTIALS')
    const SCRAPER_API_KEY = Deno.env.get('SCRAPER_API_KEY')

    // If URL is provided, use ScraperAPI to extract job details
    if (url) {
      console.log('Extracting job details from URL:', url)
      if (!SCRAPER_API_KEY) {
        throw new Error('ScraperAPI key not configured')
      }

      const encodedUrl = encodeURIComponent(url)
      const scraperUrl = `http://api.scraperapi.com?api_key=${SCRAPER_API_KEY}&url=${encodedUrl}&render=true`
      
      const response = await fetch(scraperUrl)
      if (!response.ok) {
        throw new Error('Failed to fetch job details from URL')
      }

      const html = await response.text()
      const job = parseJobFromHtml(html, url)

      return new Response(
        JSON.stringify({ job }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // For job search, try Google Jobs API first
    if (query) {
      try {
        if (GOOGLE_JOBS_API_KEY && GOOGLE_JOBS_CREDENTIALS) {
          console.log('Using Google Jobs API for search')
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
              JSON.stringify({ jobs: data.jobs || [] }),
              { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
          }
        }
      } catch (error) {
        console.error('Google Jobs API error:', error)
      }

      // Fallback to ScraperAPI with Indeed
      if (SCRAPER_API_KEY) {
        console.log('Falling back to ScraperAPI with Indeed')
        const encodedQuery = encodeURIComponent(query)
        const encodedLocation = encodeURIComponent(location || '')
        const scraperUrl = `http://api.scraperapi.com?api_key=${SCRAPER_API_KEY}&url=https://www.indeed.com/jobs?q=${encodedQuery}&l=${encodedLocation}&render=true`
        
        const response = await fetch(scraperUrl)
        if (!response.ok) {
          throw new Error('Failed to fetch jobs from Indeed')
        }

        const html = await response.text()
        const jobs = parseJobsFromIndeed(html)

        return new Response(
          JSON.stringify({ jobs }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    throw new Error('Invalid request or no job search APIs configured')

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

function parseJobsFromIndeed(html: string) {
  const jobs = []
  const jobCards = html.match(/<div class="job_seen_beacon".*?<\/div>/gs) || []

  jobCards.forEach(card => {
    const titleMatch = card.match(/<h2[^>]*>(.*?)<\/h2>/s)
    const companyMatch = card.match(/class="companyName"[^>]*>(.*?)<\/a>/s)
    const locationMatch = card.match(/class="companyLocation"[^>]*>(.*?)<\/div>/s)
    const descriptionMatch = card.match(/class="job-snippet"[^>]*>(.*?)<\/div>/s)

    if (titleMatch && companyMatch) {
      jobs.push({
        title: cleanHtml(titleMatch[1]),
        company: {
          name: cleanHtml(companyMatch[1]),
          logoUrl: extractLogoUrl(card)
        },
        location: locationMatch ? cleanHtml(locationMatch[1]) : "Remote",
        description: descriptionMatch ? cleanHtml(descriptionMatch[1]) : "",
        requirements: [],
        skills: extractSkills(card)
      })
    }
  })

  return jobs
}

function parseJobFromHtml(html: string, url: string) {
  // Extract job details from the HTML
  const titleMatch = html.match(/<h1[^>]*>(.*?)<\/h1>/s)
  const companyMatch = html.match(/class="company"[^>]*>(.*?)<\/div>/s)
  const descriptionMatch = html.match(/class="description"[^>]*>(.*?)<\/div>/s)

  if (!titleMatch || !companyMatch) {
    throw new Error('Could not parse job details from URL')
  }

  return {
    title: cleanHtml(titleMatch[1]),
    company: {
      name: cleanHtml(companyMatch[1]),
      logoUrl: extractLogoUrl(html)
    },
    location: extractLocation(html),
    description: descriptionMatch ? cleanHtml(descriptionMatch[1]) : "",
    requirements: extractRequirements(html),
    skills: extractSkills(html),
    url: url
  }
}

function cleanHtml(str: string) {
  return str.replace(/<[^>]*>/g, '').trim()
}

function extractLogoUrl(html: string) {
  const match = html.match(/class="company-logo".*?src="([^"]*)"/)
  return match ? match[1] : "/placeholder.svg"
}

function extractLocation(html: string) {
  const match = html.match(/class="location"[^>]*>(.*?)<\/div>/s)
  return match ? cleanHtml(match[1]) : "Remote"
}

function extractRequirements(html: string) {
  const requirements = []
  const reqSection = html.match(/Requirements:(.*?)<\/ul>/s)
  if (reqSection) {
    const items = reqSection[1].match(/<li>(.*?)<\/li>/g) || []
    items.forEach(item => {
      requirements.push(cleanHtml(item))
    })
  }
  return requirements
}

function extractSkills(html: string) {
  const skills = new Set<string>()
  const commonSkills = [
    "JavaScript", "Python", "Java", "C++", "React", "Angular", "Vue",
    "Node.js", "TypeScript", "SQL", "AWS", "Docker", "Kubernetes",
    "Git", "Agile", "Scrum", "Communication", "Problem Solving"
  ]

  commonSkills.forEach(skill => {
    if (html.toLowerCase().includes(skill.toLowerCase())) {
      skills.add(skill)
    }
  })

  return Array.from(skills)
}