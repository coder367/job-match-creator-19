import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const skillsSchema = z.object({
  skills: z.array(
    z.object({
      category: z.string().min(2, "Category is required"),
      items: z.string().min(2, "At least one skill is required"),
    })
  ),
  certifications: z.array(
    z.object({
      name: z.string().min(2, "Certification name is required"),
      issuer: z.string().min(2, "Issuer is required"),
      date: z.string().min(2, "Date is required"),
    })
  ),
});

export const Skills = ({ formData, setFormData }) => {
  const form = useForm({
    resolver: zodResolver(skillsSchema),
    defaultValues: {
      skills: formData.skills?.length
        ? formData.skills
        : [{ category: "", items: "" }],
      certifications: formData.certifications?.length
        ? formData.certifications
        : [{ name: "", issuer: "", date: "" }],
    },
  });

  const {
    fields: skillFields,
    append: appendSkill,
    remove: removeSkill,
  } = useFieldArray({
    control: form.control,
    name: "skills",
  });

  const {
    fields: certFields,
    append: appendCert,
    remove: removeCert,
  } = useFieldArray({
    control: form.control,
    name: "certifications",
  });

  const onSubmit = (values) => {
    setFormData({
      ...formData,
      skills: values.skills,
      certifications: values.certifications,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">Skills</h2>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => appendSkill({ category: "", items: "" })}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Skill Category
            </Button>
          </div>

          <div className="space-y-4">
            {skillFields.map((field, index) => (
              <Card key={field.id} className="p-4">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-medium">Skill Category {index + 1}</h3>
                  {index > 0 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSkill(index)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name={`skills.${index}.category`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Programming Languages"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`skills.${index}.items`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Skills (comma-separated)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., JavaScript, Python, Java"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">Certifications</h2>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                appendCert({ name: "", issuer: "", date: "" })
              }
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Certification
            </Button>
          </div>

          <div className="space-y-4">
            {certFields.map((field, index) => (
              <Card key={field.id} className="p-4">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-medium">
                    Certification {index + 1}
                  </h3>
                  {index > 0 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCert(index)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`certifications.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Certification Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., AWS Solutions Architect"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`certifications.${index}.issuer`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Issuing Organization</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Amazon Web Services" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`certifications.${index}.date`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date Earned</FormLabel>
                        <FormControl>
                          <Input type="month" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </form>
    </Form>
  );
};