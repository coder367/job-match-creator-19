import { motion } from "framer-motion";
import { FileText, Search, Zap } from "lucide-react";

const features = [
  {
    icon: <FileText className="w-6 h-6" />,
    title: "AI-Powered Resume Builder",
    description: "Create professional resumes in minutes with our intelligent builder that adapts to your experience.",
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Smart Optimization",
    description: "Get real-time suggestions to optimize your resume for specific job postings.",
  },
  {
    icon: <Search className="w-6 h-6" />,
    title: "Job Matching",
    description: "Find the perfect job opportunities that match your skills and experience.",
  },
];

export const FeaturesSection = () => {
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
            Powerful Features
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Everything you need to create the perfect resume and land your dream job.
          </p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="p-6 rounded-xl bg-card border hover:shadow-lg transition-shadow"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-primary">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};