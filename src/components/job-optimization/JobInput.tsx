import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Search } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";

interface JobDetails {
  jobTitle: string;
  companyName: string;
  companyLogo: string;
  location: string;
  description: string;
  requirements: string[];
  skills: string[];
  url: string;
}

interface JobInputProps {
  onJobSelected: (job: JobDetails) => void;
}

export const JobInput = ({ onJobSelected }: JobInputProps) => {
  const [url, setUrl] = useState("");
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const searchJobs = async () => {
    setIsLoading(true);
    setProgress(25);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error("You must be logged in to search for jobs");
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/search-jobs`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ query, location })
        }
      );

      setProgress(50);
      
      if (!response.ok) {
        throw new Error("Failed to fetch jobs");
      }

      const data = await response.json();
      setProgress(75);

      if (data.jobs && data.jobs.length > 0) {
        const firstJob = data.jobs[0];
        const jobDetails: JobDetails = {
          jobTitle: firstJob.title,
          companyName: firstJob.company.name,
          companyLogo: firstJob.company.logoUrl || "/placeholder.svg",
          location: firstJob.locations?.[0]?.text || "Remote",
          description: firstJob.description,
          requirements: firstJob.requirements || [],
          skills: firstJob.skills || [],
          url: firstJob.applicationUrl || url
        };

        setProgress(100);
        onJobSelected(jobDetails);
        toast({
          title: "Job Details Found",
          description: "Successfully found job details",
        });
      } else {
        toast({
          title: "No Jobs Found",
          description: "No jobs matching your criteria were found",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error searching jobs:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to search jobs. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const extractJobDetails = async () => {
    setIsLoading(true);
    setProgress(25);

    try {
      // TODO: Implement actual job scraping logic
      // This is a mock implementation
      await new Promise(resolve => setTimeout(resolve, 2000));
      setProgress(75);

      const mockJobDetails: JobDetails = {
        jobTitle: "Software Engineer",
        companyName: "Tech Corp",
        companyLogo: "/placeholder.svg",
        location: "Remote",
        description: "We are looking for a talented software engineer...",
        requirements: ["3+ years experience", "React expertise"],
        skills: ["React", "TypeScript", "Node.js"],
        url: url
      };

      setProgress(100);
      onJobSelected(mockJobDetails);
      toast({
        title: "Job Details Extracted",
        description: "Successfully extracted job details from URL",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to extract job details. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6 space-y-4">
      <h2 className="text-2xl font-semibold">Optimize Resume for a Job</h2>
      
      <div className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Job title or keywords"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1"
          />
          <Input
            placeholder="Location (optional)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="flex-1"
          />
          <Button 
            onClick={searchJobs}
            disabled={!query || isLoading}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Search className="mr-2 h-4 w-4" />
            )}
            Search Jobs
          </Button>
        </div>

        <div className="flex items-center">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-4 text-sm text-gray-500">OR</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <div className="flex gap-2">
          <Input
            placeholder="Paste job URL from LinkedIn, Indeed, or Internshala"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1"
          />
          <Button 
            onClick={extractJobDetails}
            disabled={!url || isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Extract Details
          </Button>
        </div>
      </div>

      {isLoading && <Progress value={progress} className="w-full" />}
    </Card>
  );
};