import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export const AISummary = ({ formData, setFormData }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateSummary = async () => {
    setIsGenerating(true);
    try {
      // TODO: Implement AI summary generation
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const summary =
        "Experienced software engineer with a proven track record in developing scalable web applications...";
      setFormData({ ...formData, summary });
      toast({
        title: "Summary Generated",
        description: "Your professional summary has been created.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate summary. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Professional Summary</h2>
      <p className="text-muted-foreground">
        Let AI generate a professional summary based on your experience and skills.
      </p>

      <div className="space-y-4">
        <Button
          onClick={generateSummary}
          disabled={isGenerating}
          className="w-full"
        >
          {isGenerating ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="mr-2 h-4 w-4" />
          )}
          Generate Summary
        </Button>

        <Textarea
          value={formData.summary || ""}
          onChange={(e) =>
            setFormData({ ...formData, summary: e.target.value })
          }
          placeholder="Your professional summary will appear here..."
          className="h-48"
        />
      </div>
    </div>
  );
};