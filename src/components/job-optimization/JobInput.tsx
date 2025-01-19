import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Link } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface JobData {
  jobTitle: string;
  companyName: string;
  companyLogo: string;
  location: string;
  jobDescription: string;
  requirements: string;
  skills: string[];
  source: string;
}

export const JobInput = () => {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [jobData, setJobData] = useState<JobData | null>(null);
  const { toast } = useToast();

  const handleExtract = async () => {
    if (!url) {
      toast({
        title: "Error",
        description: "Please enter a job URL",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data: jobData, error } = await supabase.functions.invoke("scrape-job", {
        body: { url },
      });

      if (error) throw error;

      // Save to database
      const { error: dbError } = await supabase
        .from("job_listings")
        .insert({
          job_title: jobData.jobTitle,
          company_name: jobData.companyName,
          company_logo: jobData.companyLogo,
          location: jobData.location,
          job_description: jobData.jobDescription,
          requirements: jobData.requirements,
          skills: jobData.skills,
          url: url,
          source: jobData.source,
        });

      if (dbError) throw dbError;

      setJobData(jobData);
      toast({
        title: "Success",
        description: "Job details extracted successfully",
      });
    } catch (error) {
      console.error("Error extracting job details:", error);
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
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Optimize Resume for Job</h2>
        <div className="space-y-4">
          <div className="flex gap-4">
            <Input
              placeholder="Paste job URL from LinkedIn, Indeed, or Internshala"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleExtract} disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Link className="mr-2 h-4 w-4" />
              )}
              Extract Details
            </Button>
          </div>

          {jobData && (
            <div className="space-y-4 mt-6">
              <div className="flex items-center gap-4">
                {jobData.companyLogo && (
                  <img
                    src={jobData.companyLogo}
                    alt={jobData.companyName}
                    className="w-12 h-12 object-contain"
                  />
                )}
                <div>
                  <h3 className="text-xl font-semibold">{jobData.jobTitle}</h3>
                  <p className="text-muted-foreground">
                    {jobData.companyName} • {jobData.location}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Job Description</h4>
                <p className="text-muted-foreground">{jobData.jobDescription}</p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Requirements</h4>
                <p className="text-muted-foreground">{jobData.requirements}</p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Required Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {jobData.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};