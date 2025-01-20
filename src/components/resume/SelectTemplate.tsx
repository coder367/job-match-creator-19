import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";

interface Template {
  id: string;
  name: string;
  preview_url: string | null;
  template_data: Json;
  figma_file_id: string;
  figma_node_id: string;
}

interface TemplateData {
  description?: string;
  name?: string;
  styles?: Record<string, any>;
  componentProperties?: Record<string, any>;
}

export const SelectTemplate = ({ formData, setFormData }) => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        console.log('Fetching resume templates');
        
        // First, try to fetch templates from Supabase
        const { data: existingTemplates, error: fetchError } = await supabase
          .from("resume_templates")
          .select("*")
          .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;

        if (!existingTemplates || existingTemplates.length === 0) {
          // If no templates exist, trigger the Figma sync
          const { error: syncError } = await supabase.functions.invoke('figma-templates');
          if (syncError) throw syncError;

          // Fetch templates again after sync
          const { data: newTemplates, error: refetchError } = await supabase
            .from("resume_templates")
            .select("*")
            .order('created_at', { ascending: false });

          if (refetchError) throw refetchError;
          
          console.log('Received templates after sync:', newTemplates);
          setTemplates(newTemplates || []);
        } else {
          console.log('Received existing templates:', existingTemplates);
          setTemplates(existingTemplates);
        }
      } catch (error) {
        console.error("Error fetching templates:", error);
        toast({
          title: "Error",
          description: "Failed to load resume templates. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, [toast]);

  const getTemplateDescription = (templateData: Json | null): string => {
    if (!templateData) return "No description available";
    
    const data = templateData as TemplateData;
    return data.description || "No description available";
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold mb-4">Choose a Template</h2>
      <RadioGroup
        defaultValue={formData.template}
        onValueChange={(value) =>
          setFormData({ ...formData, template: value })
        }
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {loading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="space-y-3">
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          ))
        ) : templates.length === 0 ? (
          <div className="col-span-2 text-center py-8 text-muted-foreground">
            No templates available. Please check back later.
          </div>
        ) : (
          templates.map((template) => (
            <div key={template.id}>
              <RadioGroupItem
                value={template.id}
                id={template.id}
                className="peer sr-only"
              />
              <Label
                htmlFor={template.id}
                className="flex flex-col items-center justify-center rounded-lg border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <Card className="w-full h-40 mb-4 bg-muted overflow-hidden">
                  {template.preview_url ? (
                    <img
                      src={template.preview_url}
                      alt={template.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      No preview available
                    </div>
                  )}
                </Card>
                <h3 className="font-semibold">{template.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {getTemplateDescription(template.template_data)}
                </p>
              </Label>
            </div>
          ))
        )}
      </RadioGroup>
    </div>
  );
};