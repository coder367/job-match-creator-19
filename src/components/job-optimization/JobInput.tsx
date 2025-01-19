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

interface JobInputProps {
  onJobSelected: (job: JobData) => void;
}

export const JobInput = ({ onJobSelected }: JobInputProps) => {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to perform this action",
          variant: "destructive",
        });
        return;
      }

      const { data: jobData, error } = await supabase.functions.invoke("scrape-job", {
        body: { url },
      });

      if (error) throw error;

      // Save to database with user_id
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
          user_id: user.id,
        });

      if (dbError) throw dbError;

      onJobSelected(jobData);
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
      </div>
    </Card>
  );
};