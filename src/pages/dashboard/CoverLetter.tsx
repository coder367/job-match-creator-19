import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Download, FileDown, Wand2 } from "lucide-react";
import { toast } from "sonner";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  jobTitle: z.string().min(2, "Job title must be at least 2 characters"),
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  jobDescription: z.string().min(10, "Please paste a longer job description"),
  tone: z.enum(["professional", "casual", "enthusiastic"]),
});

export const CoverLetter = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLetter, setGeneratedLetter] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jobTitle: "",
      companyName: "",
      jobDescription: "",
      tone: "professional",
    },
  });

  const editor = useEditor({
    extensions: [StarterKit],
    content: generatedLetter,
    editorProps: {
      attributes: {
        class: "prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none",
      },
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsGenerating(true);
    try {
      // TODO: Replace with actual AI generation
      console.log("Generating cover letter with:", values);
      const mockLetter = `Dear Hiring Manager at ${values.companyName},\n\nI am writing to express my strong interest in the ${values.jobTitle} position at ${values.companyName}. With my background in relevant technologies and passion for innovation, I believe I would be a valuable addition to your team.\n\nThank you for considering my application.\n\nBest regards,\n[Your Name]`;
      
      setGeneratedLetter(mockLetter);
      if (editor) {
        editor.commands.setContent(mockLetter);
      }
      toast.success("Cover letter generated successfully!");
    } catch (error) {
      console.error("Error generating cover letter:", error);
      toast.error("Failed to generate cover letter. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = (format: "pdf" | "docx") => {
    // TODO: Implement actual download functionality
    console.log(`Downloading as ${format}...`);
    toast.success(`Cover letter downloaded as ${format.toUpperCase()}`);
  };

  return (
    <div className="container mx-auto py-6 space-y-8">
      <h1 className="text-3xl font-bold">Cover Letter Generator</h1>
      
      <Card className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="jobTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Senior Software Engineer" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Tech Corp" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Writing Tone</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a tone" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="casual">Casual</SelectItem>
                      <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="jobDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Paste the job description here..." 
                      className="h-32"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full"
              disabled={isGenerating}
            >
              <Wand2 className="mr-2 h-4 w-4" />
              {isGenerating ? "Generating..." : "Generate Cover Letter"}
            </Button>
          </form>
        </Form>
      </Card>

      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Your Cover Letter</h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => handleDownload("docx")}
              disabled={!generatedLetter}
            >
              <FileDown className="mr-2 h-4 w-4" />
              DOCX
            </Button>
            <Button
              variant="outline"
              onClick={() => handleDownload("pdf")}
              disabled={!generatedLetter}
            >
              <Download className="mr-2 h-4 w-4" />
              PDF
            </Button>
          </div>
        </div>
        
        <div className="min-h-[500px] border rounded-md p-4">
          <EditorContent editor={editor} />
        </div>
      </Card>
    </div>
  );
};