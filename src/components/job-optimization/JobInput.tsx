import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

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
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

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
      {isLoading && <Progress value={progress} className="w-full" />}
    </Card>
  );
};