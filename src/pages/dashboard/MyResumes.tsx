import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  FileEdit,
  Download,
  Copy,
  Trash2,
  Search,
  FileText,
} from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";

// Types for our resume data
interface Resume {
  id: string;
  jobTitle: string;
  createdAt: Date;
  status: "draft" | "final";
}

export const MyResumes = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [isLoading, setIsLoading] = useState(false);

  // Temporary mock data - replace with actual data fetching
  const mockResumes: Resume[] = [
    {
      id: "1",
      jobTitle: "Frontend Developer",
      createdAt: new Date("2024-03-15"),
      status: "final",
    },
    {
      id: "2",
      jobTitle: "UX Designer",
      createdAt: new Date("2024-03-10"),
      status: "draft",
    },
    {
      id: "3",
      jobTitle: "Product Manager",
      createdAt: new Date("2024-03-05"),
      status: "final",
    },
  ];

  // Handle actions
  const handleEdit = (id: string) => {
    navigate(`/dashboard/create?resumeId=${id}`);
    toast({
      title: "Editing resume",
      description: "Opening resume editor...",
    });
  };

  const handlePreview = (id: string) => {
    // Open in a new tab or modal
    window.open(`/dashboard/resumes/preview/${id}`, '_blank');
    toast({
      title: "Preview mode",
      description: "Opening resume preview in a new tab...",
    });
  };

  const handleDownload = async (id: string) => {
    setIsLoading(true);
    try {
      // Here you would typically fetch the resume data and generate PDF
      // For now, we'll just show a toast
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate loading
      
      toast({
        title: "Download started",
        description: "Your resume is being downloaded...",
      });
    } catch (error) {
      toast({
        title: "Download failed",
        description: "There was an error downloading your resume.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDuplicate = async (id: string) => {
    setIsLoading(true);
    try {
      // Here you would typically duplicate the resume in the database
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate loading
      
      toast({
        title: "Resume duplicated",
        description: "A copy of your resume has been created.",
      });
    } catch (error) {
      toast({
        title: "Duplication failed",
        description: "There was an error duplicating your resume.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this resume?")) return;
    
    setIsLoading(true);
    try {
      // Here you would typically delete the resume from the database
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate loading
      
      toast({
        title: "Resume deleted",
        description: "Your resume has been permanently deleted.",
      });
    } catch (error) {
      toast({
        title: "Deletion failed",
        description: "There was an error deleting your resume.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Filter and sort resumes
  const filteredResumes = mockResumes
    .filter((resume) =>
      resume.jobTitle.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "date":
          return b.createdAt.getTime() - a.createdAt.getTime();
        case "title":
          return a.jobTitle.localeCompare(b.jobTitle);
        case "status":
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <FileText className="h-8 w-8" />
          My Resumes
        </h1>
        <Button onClick={() => navigate("/dashboard/create")}>
          Create New Resume
        </Button>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search resumes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Date Created</SelectItem>
            <SelectItem value="title">Job Title</SelectItem>
            <SelectItem value="status">Status</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Job Title</TableHead>
              <TableHead>Date Created</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredResumes.map((resume) => (
              <TableRow key={resume.id}>
                <TableCell className="font-medium">{resume.jobTitle}</TableCell>
                <TableCell>
                  {format(resume.createdAt, "MMM dd, yyyy")}
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                      resume.status === "final"
                        ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100"
                        : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-100"
                    }`}
                  >
                    {resume.status.charAt(0).toUpperCase() + resume.status.slice(1)}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(resume.id)}
                      title="Edit"
                      disabled={isLoading}
                    >
                      <FileEdit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handlePreview(resume.id)}
                      title="Preview"
                      disabled={isLoading}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDownload(resume.id)}
                      title="Download"
                      disabled={isLoading}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDuplicate(resume.id)}
                      title="Duplicate"
                      disabled={isLoading}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(resume.id)}
                      title="Delete"
                      disabled={isLoading}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};