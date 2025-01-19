import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();
    console.log('Scraping job URL:', url);

    // TODO: Implement actual scraping logic
    // For now, return mock data
    const mockJobData = {
      jobTitle: "Senior Frontend Developer",
      companyName: "Tech Corp",
      companyLogo: "https://example.com/logo.png",
      location: "San Francisco, CA",
      jobDescription: "We are looking for a Senior Frontend Developer...",
      requirements: "5+ years of experience with React...",
      skills: ["React", "TypeScript", "Node.js"],
      source: url.includes('linkedin.com') ? 'linkedin' : 
             url.includes('indeed.com') ? 'indeed' : 'internshala'
    };

    return new Response(JSON.stringify(mockJobData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in scrape-job function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});