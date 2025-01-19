import { useState } from "react";
import { Card } from "@/components/ui/card";
import { JobInput } from "@/components/job-optimization/JobInput";
import { ResumeOptimizer } from "@/components/job-optimization/ResumeOptimizer";

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

export const DashboardHome = () => {
  const [selectedJob, setSelectedJob] = useState<JobDetails | null>(null);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      <div className="space-y-6">
        <JobInput onJobSelected={setSelectedJob} />
        
        {selectedJob && <ResumeOptimizer jobDetails={selectedJob} />}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-2">Resume Optimization</h3>
            <p className="text-muted-foreground">
              Optimize your resume for specific job positions using AI
            </p>
          </Card>
          {/* Add more dashboard cards here */}
        </div>
      </div>
    </div>
  );
};
