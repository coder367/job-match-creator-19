import { Card } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2 } from "lucide-react";

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

interface AIRecommendationsProps {
  jobData: JobData;
}

export const AIRecommendations = ({ jobData }: AIRecommendationsProps) => {
  // Mock data - replace with actual AI analysis
  const missingSkills = ["Docker", "Kubernetes", "AWS"];
  const improvements = [
    "Add more quantifiable achievements",
    "Include relevant certifications",
    "Highlight leadership experience",
  ];

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">AI Recommendations</h2>
        
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Missing Skills</AlertTitle>
          <AlertDescription>
            <ul className="list-disc list-inside mt-2">
              {missingSkills.map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>

        <Alert>
          <CheckCircle2 className="h-4 w-4" />
          <AlertTitle>Suggested Improvements</AlertTitle>
          <AlertDescription>
            <ul className="list-disc list-inside mt-2">
              {improvements.map((improvement) => (
                <li key={improvement}>{improvement}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      </Card>
    </div>
  );
};