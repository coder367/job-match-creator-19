import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  Briefcase,
  MapPin,
  DollarSign,
  Building2,
  ArrowUpRight,
  Search,
  Sparkles,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

interface JobType {
  id: string;
  job_title: string;
  company_name: string;
  location: string | null;
  job_description: string;
  requirements: string | null;
  skills: string[] | null;
  url: string;
  company_logo: string | null;
  source: string;
}

export const FindJob = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [salaryRange, setSalaryRange] = useState([0]);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const { toast } = useToast();

  // Fetch jobs from Supabase
  const { data: jobs, isLoading, error } = useQuery({
    queryKey: ['jobs', searchQuery, location],
    queryFn: async () => {
      let query = supabase
        .from('job_listings')
        .select('*');

      if (searchQuery) {
        query = query.ilike('job_title', `%${searchQuery}%`);
      }

      if (location) {
        query = query.ilike('location', `%${location}%`);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      return data as JobType[];
    },
  });

  // Industries data
  const industries = [
    { id: "tech", label: "Technology" },
    { id: "finance", label: "Finance" },
    { id: "healthcare", label: "Healthcare" },
    { id: "education", label: "Education" },
    { id: "marketing", label: "Marketing" },
  ];

  const handleSearch = async () => {
    // The search is handled automatically by the useQuery hook
    // when searchQuery or location changes
    toast({
      title: "Search Complete",
      description: "Found matching jobs based on your criteria.",
    });
  };

  const handleAutoApply = async (jobId: string) => {
    try {
      // Create a resume optimization entry
      const { data: currentUser } = await supabase.auth.getUser();
      
      if (!currentUser?.user?.id) {
        throw new Error("User not authenticated");
      }

      // First, get the user's most recent resume
      const { data: resumes, error: resumeError } = await supabase
        .from('resume_templates')
        .select('id')
        .eq('user_id', currentUser.user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (resumeError || !resumes?.length) {
        throw new Error("No resume found. Please create a resume first.");
      }

      const { error: optimizationError } = await supabase
        .from('resume_optimizations')
        .insert({
          user_id: currentUser.user.id,
          job_listing_id: jobId,
          original_resume_id: resumes[0].id,
          status: 'pending',
        });

      if (optimizationError) throw optimizationError;

      toast({
        title: "Application Started",
        description: "Your resume optimization has been initiated.",
      });
      
      navigate("/dashboard/resumes");
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to start application process. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleViewDetails = (jobId: string) => {
    navigate(`/dashboard/jobs/${jobId}`);
  };

  if (error) {
    toast({
      title: "Error",
      description: "Failed to fetch jobs. Please try again.",
      variant: "destructive",
    });
  }

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
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => {
              toast({
                title: "AI Match",
                description: "Finding the best matches based on your profile...",
              });
            }}
          >
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
              min={0}
              max={50}
              step={1}
              className="py-4"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>$0k</span>
              <span>${salaryRange}k</span>
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

          <Button 
            onClick={handleSearch} 
            className="w-full md:w-auto md:self-end"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Searching...
              </>
            ) : (
              "Find Jobs"
            )}
          </Button>
        </div>
      </Card>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : jobs && jobs.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2">
          {jobs.map((job) => (
            <Card key={job.id} className="relative">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{job.job_title}</CardTitle>
                    <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                      <Building2 className="h-4 w-4" />
                      <span>{job.company_name}</span>
                    </div>
                  </div>
                  {job.company_logo && (
                    <img 
                      src={job.company_logo} 
                      alt={`${job.company_name} logo`}
                      className="h-12 w-12 object-contain"
                    />
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{job.location || 'Remote'}</span>
                    </div>
                    {job.skills && job.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {job.skills.map((skill, index) => (
                          <Badge key={index} variant="outline">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {job.job_description}
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => handleAutoApply(job.id)}
                >
                  Quick Apply
                </Button>
                <Button onClick={() => handleViewDetails(job.id)}>
                  View Details
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No jobs found matching your criteria. Try adjusting your search.
          </p>
        </div>
      )}
    </div>
  );
};
