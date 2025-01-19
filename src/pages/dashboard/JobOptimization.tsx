import { JobInput } from "@/components/job-optimization/JobInput";
import { ResumeOptimizer } from "@/components/job-optimization/ResumeOptimizer";
import { AIRecommendations } from "@/components/job-optimization/AIRecommendations";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";

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

export const JobOptimization = () => {
  const [optimizationProgress, setOptimizationProgress] = useState(0);
  const [selectedJob, setSelectedJob] = useState<JobData | null>(null);

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Resume Optimization</h1>
        <Progress value={optimizationProgress} className="w-48" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <JobInput onJobSelected={setSelectedJob} />
          {selectedJob && <AIRecommendations jobData={selectedJob} />}
        </div>
        
        <div className="space-y-6">
          {selectedJob && <ResumeOptimizer jobData={selectedJob} />}
        </div>
      </div>
    </div>
  );
};