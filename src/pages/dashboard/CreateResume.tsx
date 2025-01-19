import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { ChevronLeft, ChevronRight, Save } from "lucide-react";
import { SelectTemplate } from "@/components/resume/SelectTemplate";
import { PersonalInfo } from "@/components/resume/PersonalInfo";
import { WorkExperience } from "@/components/resume/WorkExperience";
import { Education } from "@/components/resume/Education";
import { Skills } from "@/components/resume/Skills";
import { AISummary } from "@/components/resume/AISummary";
import { Preview } from "@/components/resume/Preview";

const steps = [
  { id: 1, title: "Select Template" },
  { id: 2, title: "Personal Information" },
  { id: 3, title: "Work Experience" },
  { id: 4, title: "Education" },
  { id: 5, title: "Skills & Certifications" },
  { id: 6, title: "AI Summary" },
  { id: 7, title: "Preview & Download" },
];

export const CreateResume = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    template: "",
    personalInfo: {},
    workExperience: [],
    education: [],
    skills: [],
    summary: "",
  });

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSave = () => {
    // TODO: Implement save functionality
    toast({
      title: "Progress Saved",
      description: "Your resume has been saved as a draft.",
    });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <SelectTemplate formData={formData} setFormData={setFormData} />;
      case 2:
        return <PersonalInfo formData={formData} setFormData={setFormData} />;
      case 3:
        return <WorkExperience formData={formData} setFormData={setFormData} />;
      case 4:
        return <Education formData={formData} setFormData={setFormData} />;
      case 5:
        return <Skills formData={formData} setFormData={setFormData} />;
      case 6:
        return <AISummary formData={formData} setFormData={setFormData} />;
      case 7:
        return <Preview formData={formData} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Create Resume</h1>
        <Button variant="outline" onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          Save Draft
        </Button>
      </div>

      {/* Progress Steps */}
      <div className="flex justify-between mb-8">
        {steps.map((step) => (
          <div
            key={step.id}
            className={`flex flex-col items-center ${
              currentStep === step.id
                ? "text-primary"
                : currentStep > step.id
                ? "text-muted-foreground"
                : "text-muted"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                currentStep === step.id
                  ? "bg-primary text-primary-foreground"
                  : currentStep > step.id
                  ? "bg-muted-foreground text-background"
                  : "bg-muted"
              }`}
            >
              {step.id}
            </div>
            <span className="text-sm hidden md:block">{step.title}</span>
          </div>
        ))}
      </div>

      {/* Step Content */}
      <Card className="p-6">
        <div className="min-h-[400px]">{renderStep()}</div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          <Button onClick={handleNext} disabled={currentStep === steps.length}>
            {currentStep === steps.length ? "Download" : "Next"}
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
};