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

// Types for our resume data
interface Resume {
  id: string;
  jobTitle: string;
  createdAt: Date;
  status: "draft" | "final";
}

export const MyResumes = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date");

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
    toast({
      title: "Editing resume",
      description: "Redirecting to editor...",
    });
  };

  const handleDelete = (id: string) => {
    toast({
      title: "Resume deleted",
      description: "The resume has been successfully deleted.",
    });
  };

  const handleDuplicate = (id: string) => {
    toast({
      title: "Resume duplicated",
      description: "A copy of the resume has been created.",
    });
  };

  const handleDownload = (id: string) => {
    toast({
      title: "Downloading resume",
      description: "Your resume is being downloaded...",
    });
  };

  const handlePreview = (id: string) => {
    toast({
      title: "Preview mode",
      description: "Opening resume preview...",
    });
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
        <Button onClick={() => window.location.href = "/dashboard/create"}>
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
                    >
                      <FileEdit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handlePreview(resume.id)}
                      title="Preview"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDownload(resume.id)}
                      title="Download"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDuplicate(resume.id)}
                      title="Duplicate"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(resume.id)}
                      title="Delete"
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