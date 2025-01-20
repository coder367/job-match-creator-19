import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { query, location, url } = await req.json()
    console.log('Received request:', { query, location, url })

    const GOOGLE_JOBS_API_KEY = Deno.env.get('GOOGLE_JOBS_API_KEY')
    const GOOGLE_JOBS_CREDENTIALS = Deno.env.get('GOOGLE_JOBS_CREDENTIALS')
    const SCRAPER_API_KEY = Deno.env.get('SCRAPER_API_KEY')

    // Validate required API keys
    if (!SCRAPER_API_KEY) {
      throw new Error('ScraperAPI key not configured')
    }

    // If URL is provided, use ScraperAPI to extract job details
    if (url) {
      console.log('Extracting job details from URL:', url)
      
      const encodedUrl = encodeURIComponent(url)
      const scraperUrl = `http://api.scraperapi.com?api_key=${SCRAPER_API_KEY}&url=${encodedUrl}&render=true`
      
      console.log('Calling ScraperAPI for URL extraction...')
      const response = await fetch(scraperUrl)
      
      if (!response.ok) {
        console.error('ScraperAPI response error:', response.status, response.statusText)
        throw new Error(`Failed to fetch job details: ${response.statusText}`)
      }

      const html = await response.text()
      console.log('Successfully received HTML from ScraperAPI')
      
      const job = parseJobFromHtml(html, url)
      console.log('Successfully extracted job details:', job)

      return new Response(
        JSON.stringify({ job }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // For job search, try Google Jobs API first
    if (query) {
      let jobs = []

      if (GOOGLE_JOBS_API_KEY && GOOGLE_JOBS_CREDENTIALS) {
        try {
          console.log('Attempting to use Google Jobs API...')
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

          if (!response.ok) {
            console.error('Google Jobs API error:', response.status, response.statusText)
            throw new Error(`Google Jobs API error: ${response.statusText}`)
          }

          const data = await response.json()
          jobs = data.jobs || []
          console.log('Successfully retrieved jobs from Google Jobs API:', jobs.length)
        } catch (error) {
          console.error('Google Jobs API error:', error)
          // Continue to fallback method if Google Jobs API fails
        }
      }

      // If no jobs found or Google Jobs API failed, try ScraperAPI with Indeed
      if (jobs.length === 0) {
        console.log('Falling back to ScraperAPI with Indeed...')
        const encodedQuery = encodeURIComponent(query)
        const encodedLocation = encodeURIComponent(location || '')
        const scraperUrl = `http://api.scraperapi.com?api_key=${SCRAPER_API_KEY}&url=https://www.indeed.com/jobs?q=${encodedQuery}&l=${encodedLocation}&render=true`
        
        console.log('Calling ScraperAPI...')
        const response = await fetch(scraperUrl)
        
        if (!response.ok) {
          console.error('ScraperAPI response error:', response.status, response.statusText)
          throw new Error(`Failed to fetch jobs: ${response.statusText}`)
        }

        const html = await response.text()
        console.log('Successfully received HTML from ScraperAPI')
        
        jobs = parseJobsFromIndeed(html)
        console.log('Successfully parsed jobs from Indeed:', jobs.length)
      }

      return new Response(
        JSON.stringify({ jobs }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    throw new Error('Invalid request parameters')

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

function parseJobsFromIndeed(html: string) {
  console.log('Parsing Indeed HTML...')
  const jobs = []
  
  try {
    const jobCards = html.match(/<div class="job_seen_beacon".*?<\/div>/gs) || []
    console.log('Found job cards:', jobCards.length)

    jobCards.forEach((card, index) => {
      try {
        const titleMatch = card.match(/<h2[^>]*>(.*?)<\/h2>/s)
        const companyMatch = card.match(/class="companyName"[^>]*>(.*?)<\/a>/s)
        const locationMatch = card.match(/class="companyLocation"[^>]*>(.*?)<\/div>/s)
        const descriptionMatch = card.match(/class="job-snippet"[^>]*>(.*?)<\/div>/s)

        if (titleMatch && companyMatch) {
          const job = {
            title: cleanHtml(titleMatch[1]),
            company: {
              name: cleanHtml(companyMatch[1]),
              logoUrl: extractLogoUrl(card)
            },
            location: locationMatch ? cleanHtml(locationMatch[1]) : "Remote",
            description: descriptionMatch ? cleanHtml(descriptionMatch[1]) : "",
            requirements: extractRequirements(card),
            skills: extractSkills(card)
          }
          jobs.push(job)
          console.log(`Parsed job ${index + 1}:`, job.title)
        }
      } catch (error) {
        console.error('Error parsing job card:', error)
      }
    })
  } catch (error) {
    console.error('Error parsing Indeed HTML:', error)
  }

  return jobs
}

function parseJobFromHtml(html: string, url: string) {
  console.log('Parsing single job HTML...')
  try {
    // Enhanced parsing logic with better error handling
    const titleMatch = html.match(/<h1[^>]*>(.*?)<\/h1>/s) || html.match(/<title[^>]*>(.*?)<\/title>/s)
    const companyMatch = html.match(/class="company"[^>]*>(.*?)<\/div>/s) || 
                        html.match(/class="companyName"[^>]*>(.*?)<\/[^>]*>/s)
    const descriptionMatch = html.match(/class="description"[^>]*>(.*?)<\/div>/s) ||
                            html.match(/class="job-description"[^>]*>(.*?)<\/div>/s)

    if (!titleMatch) {
      throw new Error('Could not parse job title')
    }

    const job = {
      title: cleanHtml(titleMatch[1]),
      company: {
        name: companyMatch ? cleanHtml(companyMatch[1]) : "Company Name Not Found",
        logoUrl: extractLogoUrl(html)
      },
      location: extractLocation(html),
      description: descriptionMatch ? cleanHtml(descriptionMatch[1]) : "",
      requirements: extractRequirements(html),
      skills: extractSkills(html),
      url: url
    }

    console.log('Successfully parsed job:', job.title)
    return job
  } catch (error) {
    console.error('Error parsing job HTML:', error)
    throw new Error('Failed to parse job details from HTML')
  }
}

function cleanHtml(str: string) {
  return str.replace(/<[^>]*>/g, '').trim()
}

function extractLogoUrl(html: string) {
  const logoMatches = [
    html.match(/class="company-logo".*?src="([^"]*)"/) || [],
    html.match(/class="logo".*?src="([^"]*)"/) || [],
    html.match(/<img[^>]*alt="[^"]*logo[^"]*"[^>]*src="([^"]*)"/) || []
  ]
  
  for (const match of logoMatches) {
    if (match[1]) {
      return match[1]
    }
  }
  return "/placeholder.svg"
}

function extractLocation(html: string) {
  const locationMatches = [
    html.match(/class="location"[^>]*>(.*?)<\/[^>]*>/s),
    html.match(/class="companyLocation"[^>]*>(.*?)<\/[^>]*>/s),
    html.match(/data-test="job-location"[^>]*>(.*?)<\/[^>]*>/s)
  ]
  
  for (const match of locationMatches) {
    if (match && match[1]) {
      return cleanHtml(match[1])
    }
  }
  return "Remote"
}

function extractRequirements(html: string) {
  const requirements = []
  const reqSections = [
    html.match(/Requirements:(.*?)<\/ul>/s),
    html.match(/Qualifications:(.*?)<\/ul>/s),
    html.match(/What you'll need:(.*?)<\/ul>/s)
  ]
  
  for (const section of reqSections) {
    if (section && section[1]) {
      const items = section[1].match(/<li>(.*?)<\/li>/g) || []
      items.forEach(item => {
        requirements.push(cleanHtml(item))
      })
      if (requirements.length > 0) break
    }
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