import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const templates = [
  { id: "modern", name: "Modern", description: "Clean and professional design" },
  { id: "creative", name: "Creative", description: "Stand out with style" },
  { id: "minimal", name: "Minimal", description: "Simple and elegant" },
  {
    id: "professional",
    name: "Professional",
    description: "Traditional corporate style",
  },
];

export const SelectTemplate = ({ formData, setFormData }) => {
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
        {templates.map((template) => (
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
              <Card className="w-full h-40 mb-4 bg-muted" />
              <h3 className="font-semibold">{template.name}</h3>
              <p className="text-sm text-muted-foreground">
                {template.description}
              </p>
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};