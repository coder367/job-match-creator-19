import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, Printer } from "lucide-react";

export const Preview = ({ formData }) => {
  const handleDownload = () => {
    // TODO: Implement PDF download
    console.log("Downloading resume...");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Preview Your Resume</h2>
        <div className="flex gap-2">
          <Button onClick={handlePrint} variant="outline">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </div>

      <Card className="p-8 min-h-[800px] bg-white dark:bg-gray-900">
        {/* Personal Information */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">
            {formData.personalInfo?.fullName || "Your Name"}
          </h1>
          <div className="text-muted-foreground">
            <p>{formData.personalInfo?.email}</p>
            <p>{formData.personalInfo?.phone}</p>
            <p>{formData.personalInfo?.location}</p>
          </div>
        </div>

        {/* Professional Summary */}
        {formData.summary && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-2">Professional Summary</h2>
            <p className="text-muted-foreground">{formData.summary}</p>
          </div>
        )}

        {/* Work Experience */}
        {formData.workExperience?.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Work Experience</h2>
            {formData.workExperience.map((exp, index) => (
              <div key={index} className="mb-4">
                <h3 className="font-semibold">{exp.position}</h3>
                <p className="text-muted-foreground">{exp.company}</p>
                <p className="text-sm text-muted-foreground">
                  {exp.startDate} - {exp.endDate || "Present"}
                </p>
                <p className="mt-2">{exp.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {formData.education?.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Education</h2>
            {formData.education.map((edu, index) => (
              <div key={index} className="mb-4">
                <h3 className="font-semibold">{edu.school}</h3>
                <p className="text-muted-foreground">
                  {edu.degree} in {edu.field}
                </p>
                <p className="text-sm text-muted-foreground">
                  {edu.startDate} - {edu.endDate || "Present"}
                </p>
                {edu.gpa && <p className="text-sm">GPA: {edu.gpa}</p>}
              </div>
            ))}
          </div>
        )}

        {/* Skills */}
        {formData.skills?.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Skills</h2>
            {formData.skills.map((skill, index) => (
              <div key={index} className="mb-2">
                <h3 className="font-semibold">{skill.category}</h3>
                <p className="text-muted-foreground">{skill.items}</p>
              </div>
            ))}
          </div>
        )}

        {/* Certifications */}
        {formData.certifications?.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Certifications</h2>
            {formData.certifications.map((cert, index) => (
              <div key={index} className="mb-2">
                <h3 className="font-semibold">{cert.name}</h3>
                <p className="text-muted-foreground">
                  {cert.issuer} - {cert.date}
                </p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};