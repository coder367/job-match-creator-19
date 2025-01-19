import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wand2, Edit, FileText, Undo2, ExternalLink } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

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

interface ResumeOptimizerProps {
  jobData: JobData;
}

export const ResumeOptimizer = ({ jobData }: ResumeOptimizerProps) => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const { toast } = useToast();

  const handleAutoOptimize = async () => {
    setIsOptimizing(true);
    try {
      // TODO: Implement actual AI optimization
      await new Promise(resolve => setTimeout(resolve, 2000));
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
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Resume Optimization</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Undo2 className="mr-2 h-4 w-4" />
            Undo Changes
          </Button>
          <Button size="sm">
            <ExternalLink className="mr-2 h-4 w-4" />
            Apply Now
          </Button>
        </div>
      </div>

      <Tabs defaultValue="auto" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="auto">Auto-Optimize</TabsTrigger>
          <TabsTrigger value="manual">Manual Edit</TabsTrigger>
          <TabsTrigger value="cover">Cover Letter</TabsTrigger>
        </TabsList>

        <TabsContent value="auto">
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Let AI optimize your resume automatically based on the job requirements.
            </p>
            <Button 
              onClick={handleAutoOptimize} 
              disabled={isOptimizing}
              className="w-full"
            >
              <Wand2 className="mr-2 h-4 w-4" />
              {isOptimizing ? "Optimizing..." : "Auto-Optimize Resume"}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="manual">
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Make manual adjustments to your resume with AI suggestions.
            </p>
            <Button className="w-full">
              <Edit className="mr-2 h-4 w-4" />
              Edit Resume
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="cover">
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Generate a customized cover letter for this job application.
            </p>
            <Button className="w-full">
              <FileText className="mr-2 h-4 w-4" />
              Generate Cover Letter
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};