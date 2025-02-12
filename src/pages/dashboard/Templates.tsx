import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Eye, Check } from "lucide-react";

export const Templates = () => {
  const [category, setCategory] = useState("all");
  const { toast } = useToast();

  const templates = [
    {
      id: 1,
      name: "Modern Minimal",
      category: "modern",
      preview: "/placeholder.svg",
      description: "Clean and contemporary design with plenty of white space",
    },
    {
      id: 2,
      name: "Professional Classic",
      category: "professional",
      preview: "/placeholder.svg",
      description: "Traditional layout perfect for corporate positions",
    },
    {
      id: 3,
      name: "Creative Portfolio",
      category: "creative",
      preview: "/placeholder.svg",
      description: "Stand out with a unique and artistic design",
    },
    {
      id: 4,
      name: "Simple Elegant",
      category: "simple",
      preview: "/placeholder.svg",
      description: "Minimalist design focusing on content",
    },
  ];

  const handlePreview = (templateId: number) => {
    toast({
      title: "Template Preview",
      description: "Opening template preview...",
    });
  };

  const handleApply = (templateId: number) => {
    toast({
      title: "Template Applied",
      description: "Your resume has been updated with the new template.",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col gap-6 mb-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Resume Templates</h1>
          <p className="text-muted-foreground">
            Choose from our collection of professional templates designed to make your resume stand out.
          </p>
        </div>

        <div className="flex items-center justify-between flex-wrap gap-4">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Templates</SelectItem>
              <SelectItem value="modern">Modern</SelectItem>
              <SelectItem value="professional">Professional</SelectItem>
              <SelectItem value="creative">Creative</SelectItem>
              <SelectItem value="simple">Simple</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-8">
        {templates.map((template) => (
          <Card key={template.id} className="flex flex-col h-full hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl">{template.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="aspect-[3/4] relative rounded-md overflow-hidden bg-muted mb-4">
                <img
                  src={template.preview}
                  alt={template.name}
                  className="object-cover w-full h-full transition-transform duration-200 hover:scale-105"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                {template.description}
              </p>
            </CardContent>
            <CardFooter className="flex gap-3 pt-4">
              <Button 
                variant="outline" 
                className="flex-1" 
                onClick={() => handlePreview(template.id)}
              >
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </Button>
              <Button 
                className="flex-1" 
                onClick={() => handleApply(template.id)}
              >
                <Check className="mr-2 h-4 w-4" />
                Apply
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};