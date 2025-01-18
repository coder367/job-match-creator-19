import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";

const faqs = [
  {
    question: "How does the AI optimization work?",
    answer:
      "Our AI analyzes your resume against job descriptions to suggest improvements in content, keywords, and formatting. It helps ensure your resume matches what employers are looking for.",
  },
  {
    question: "Can I export my resume in different formats?",
    answer:
      "Yes! You can export your resume in PDF, Word, and plain text formats. Premium users get access to additional export options and custom formatting.",
  },
  {
    question: "How accurate is the job matching feature?",
    answer:
      "Our job matching algorithm uses AI to analyze your skills and experience against job requirements, providing highly accurate matches and suggestions for improvement.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Yes, we take security seriously. All your data is encrypted and stored securely. We never share your personal information without your explicit consent.",
  },
];

export const FAQSection = () => {
  return (
    <section className="py-24 bg-muted/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Find answers to common questions about our platform
          </p>
        </motion.div>
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};