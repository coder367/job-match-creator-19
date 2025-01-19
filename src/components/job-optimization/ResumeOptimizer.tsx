import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { 
  FileText, 
  RefreshCw, 
  Edit, 
  FileEdit,
  Undo2,
  ExternalLink,
  Loader2
} from "lucide-react";
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

interface ResumeOptimizerProps {
  jobDetails: JobDetails;
}

export const ResumeOptimizer = ({ jobDetails }: ResumeOptimizerProps) => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationProgress, setOptimizationProgress] = useState(0);
  const { toast } = useToast();

  const handleAutoOptimize = async () => {
    setIsOptimizing(true);
    setOptimizationProgress(0);

    try {
      // Mock optimization process
      await new Promise(resolve => setTimeout(resolve, 1000));
      setOptimizationProgress(50);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setOptimizationProgress(100);

      toast({
        title: "Resume Optimized",
        description: "Your resume has been automatically optimized for this job.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to optimize resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsOptimizing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Job Details Card */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-4">
          <img 
            src={jobDetails.companyLogo} 
            alt={jobDetails.companyName}
            className="w-16 h-16 object-contain"
          />
          <div>
            <h3 className="text-xl font-semibold">{jobDetails.jobTitle}</h3>
            <p className="text-muted-foreground">{jobDetails.companyName}</p>
            <p className="text-sm text-muted-foreground">{jobDetails.location}</p>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-semibold">Required Skills</h4>
          <div className="flex flex-wrap gap-2">
            {jobDetails.skills.map((skill, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-primary/10 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-semibold">Requirements</h4>
          <ul className="list-disc list-inside space-y-1">
            {jobDetails.requirements.map((req, index) => (
              <li key={index} className="text-sm text-muted-foreground">{req}</li>
            ))}
          </ul>
        </div>

        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => window.open(jobDetails.url, '_blank')}
        >
          <ExternalLink className="mr-2 h-4 w-4" />
          View Original Job Posting
        </Button>
      </Card>

      {/* Resume Optimization Card */}
      <Card className="p-6 space-y-4">
        <h3 className="text-xl font-semibold">Resume Optimization</h3>
        
        <div className="space-y-4">
          <Button 
            className="w-full"
            onClick={handleAutoOptimize}
            disabled={isOptimizing}
          >
            {isOptimizing ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Auto-Optimize Resume
          </Button>

          <Button variant="outline" className="w-full">
            <Edit className="mr-2 h-4 w-4" />
            Manually Edit Resume
          </Button>

          <Button variant="outline" className="w-full">
            <FileText className="mr-2 h-4 w-4" />
            Generate Cover Letter
          </Button>

          {isOptimizing && (
            <Progress value={optimizationProgress} className="w-full" />
          )}

          <div className="pt-4 border-t space-y-2">
            <h4 className="font-semibold">AI Suggestions</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• Add experience with Docker to match job requirements</p>
              <p>• Highlight your team leadership experience</p>
              <p>• Include more specific metrics in your achievements</p>
            </div>
          </div>

          <Button variant="ghost" className="w-full" disabled={isOptimizing}>
            <Undo2 className="mr-2 h-4 w-4" />
            Undo Changes
          </Button>
        </div>
      </Card>
    </div>
  );
};