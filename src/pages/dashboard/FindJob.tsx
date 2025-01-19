import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Briefcase,
  MapPin,
  DollarSign,
  Building2,
  ArrowUpRight,
  Search,
  Sparkles,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface JobType {
  id: number;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  match: string;
  description: string;
  requirements: string[];
}

export const FindJob = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [salaryRange, setSalaryRange] = useState([50]);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const { toast } = useToast();

  // Mock industries data
  const industries = [
    { id: "tech", label: "Technology" },
    { id: "finance", label: "Finance" },
    { id: "healthcare", label: "Healthcare" },
    { id: "education", label: "Education" },
    { id: "marketing", label: "Marketing" },
  ];

  // Mock jobs data with expanded information
  const jobs: JobType[] = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      company: "Tech Corp",
      location: "San Francisco, CA",
      salary: "$120k - $150k",
      type: "Remote",
      match: "95%",
      description: "Join our team to build modern web applications using React and TypeScript.",
      requirements: ["5+ years React experience", "TypeScript proficiency", "CI/CD experience"],
    },
    {
      id: 2,
      title: "Full Stack Engineer",
      company: "StartupX",
      location: "New York, NY",
      salary: "$100k - $130k",
      type: "Hybrid",
      match: "88%",
      description: "Looking for a full-stack developer to help scale our platform.",
      requirements: ["Node.js", "React", "PostgreSQL", "AWS"],
    },
  ];

  const handleSearch = () => {
    toast({
      title: "Searching jobs...",
      description: "Finding the best matches based on your criteria.",
    });
  };

  const handleAutoApply = (jobId: number) => {
    toast({
      title: "Application Submitted",
      description: "Your resume has been automatically submitted for this position.",
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Find Job</h1>
            <p className="text-muted-foreground mt-2">
              Discover opportunities matching your skills and experience
            </p>
          </div>
          <Button variant="outline" className="gap-2">
            <Sparkles className="h-4 w-4" />
            AI Match
          </Button>
        </div>
      </div>

      <Card className="p-6">
        <div className="grid gap-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Job Title / Keywords</label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="e.g. Frontend Developer"
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Location</label>
              <Input
                placeholder="City or Remote"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Experience Level</label>
              <Select value={experienceLevel} onValueChange={setExperienceLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="entry">Entry Level</SelectItem>
                  <SelectItem value="mid">Mid Level</SelectItem>
                  <SelectItem value="senior">Senior Level</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Salary Range (k/year)</label>
            <Slider
              value={salaryRange}
              onValueChange={setSalaryRange}
              max={200}
              step={10}
              className="py-4"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>$0k</span>
              <span>${salaryRange}k+</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Industries</label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {industries.map((industry) => (
                <div key={industry.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={industry.id}
                    checked={selectedIndustries.includes(industry.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedIndustries([...selectedIndustries, industry.id]);
                      } else {
                        setSelectedIndustries(
                          selectedIndustries.filter((id) => id !== industry.id)
                        );
                      }
                    }}
                  />
                  <label
                    htmlFor={industry.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {industry.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <Button onClick={handleSearch} className="w-full md:w-auto md:self-end">
            Find Jobs
          </Button>
        </div>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {jobs.map((job) => (
          <Card key={job.id} className="relative">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl">{job.title}</CardTitle>
                  <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                    <Building2 className="h-4 w-4" />
                    <span>{job.company}</span>
                  </div>
                </div>
                <Badge
                  variant="secondary"
                  className="absolute top-4 right-4 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                >
                  {job.match} Match
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <DollarSign className="h-4 w-4" />
                    <span>{job.salary}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Briefcase className="h-4 w-4" />
                    <span>{job.type}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{job.description}</p>
                <div className="flex flex-wrap gap-2">
                  {job.requirements.map((req, index) => (
                    <Badge key={index} variant="outline">
                      {req}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => handleAutoApply(job.id)}>
                Quick Apply
              </Button>
              <Button>
                View Details
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};