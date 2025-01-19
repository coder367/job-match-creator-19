import { useState } from "react";
import { JobInput } from "@/components/job-optimization/JobInput";

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

export const DashboardHome = () => {
  const [selectedJob, setSelectedJob] = useState<JobData | null>(null);

  const handleJobSelected = (job: JobData) => {
    setSelectedJob(job);
  };

  return (
    <div className="container mx-auto py-6">
      <JobInput onJobSelected={handleJobSelected} />
      {selectedJob && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Selected Job Details</h2>
          <div className="space-y-2">
            <p><strong>Title:</strong> {selectedJob.jobTitle}</p>
            <p><strong>Company:</strong> {selectedJob.companyName}</p>
            <p><strong>Location:</strong> {selectedJob.location}</p>
          </div>
        </div>
      )}
    </div>
  );
};