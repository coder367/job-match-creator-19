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

      console.log('Searching jobs with query:', query, 'location:', location);
      
      const { data, error } = await supabase.functions.invoke('search-jobs', {
        body: { query, location }
      });

      if (error) {
        console.error('Error from search-jobs function:', error);
        throw error;
      }

      setProgress(75);
      console.log('Received job search results:', data);

      if (data.jobs && data.jobs.length > 0) {
        const firstJob = data.jobs[0];
        const jobDetails: JobDetails = {
          jobTitle: firstJob.title,
          companyName: firstJob.company.name,
          companyLogo: firstJob.company.logoUrl || "/placeholder.svg",
          location: firstJob.locations?.[0]?.text || "Remote",
          description: firstJob.description || "",
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
      setProgress(0);
    }
  };

  const extractJobDetails = async () => {
    setIsLoading(true);
    setProgress(25);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error("You must be logged in to extract job details");
      }

      const { data, error } = await supabase.functions.invoke('search-jobs', {
        body: { url }
      });

      if (error) {
        throw error;
      }

      setProgress(75);

      if (data.job) {
        const jobDetails: JobDetails = {
          jobTitle: data.job.title,
          companyName: data.job.company.name,
          companyLogo: data.job.company.logoUrl || "/placeholder.svg",
          location: data.job.location || "Remote",
          description: data.job.description || "",
          requirements: data.job.requirements || [],
          skills: data.job.skills || [],
          url: url
        };

        setProgress(100);
        onJobSelected(jobDetails);
        toast({
          title: "Job Details Extracted",
          description: "Successfully extracted job details from URL",
        });
      } else {
        throw new Error("No job details found");
      }
    } catch (error) {
      console.error("Error extracting job details:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to extract job details. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setProgress(0);
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