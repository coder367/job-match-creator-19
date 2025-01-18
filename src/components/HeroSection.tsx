import { motion } from "framer-motion";

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 dots-pattern opacity-20" />
      <div className="container mx-auto px-4">
        <div className="relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
              Craft Your Perfect Resume with AI
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Optimize your resume for any job with our AI-powered platform. Get instant feedback and land your dream job faster.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button className="px-8 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity">
              Get Started Free
            </button>
            <button className="px-8 py-3 rounded-lg border border-primary text-primary hover:bg-primary/10 transition-colors">
              Learn More
            </button>
          </motion.div>
        </div>
      </div>
      <div className="absolute -bottom-48 left-0 right-0 h-48 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};