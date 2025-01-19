import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export const HeroSection = () => {
  return (
    <section className="hero-section relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background patterns */}
      <div className="absolute inset-0 hero-pattern" />
      <div className="absolute inset-0 hero-grid opacity-40" />
      <div className="absolute inset-0 hero-glow" />
      
      {/* Floating elements */}
      <div className="absolute inset-0">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-32 h-32 rounded-full"
            style={{
              background: `radial-gradient(circle at center, rgba(219, 39, 119, ${0.1 - i * 0.02}) 0%, transparent 70%)`,
              left: `${15 + i * 20}%`,
              top: `${20 + i * 15}%`,
            }}
            animate={{
              y: [0, 30, 0],
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: i * 0.8,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4">
        <div className="relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500 dark:from-purple-400 dark:to-pink-600">
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
            <Button 
              size="lg"
              className="px-8 py-6 rounded-lg bg-gradient-to-r from-pink-500 to-violet-500 dark:from-purple-600 dark:to-pink-600 text-white font-semibold hover:opacity-90 transition-opacity backdrop-blur-sm"
            >
              Get Started Free
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Dark mode specific decorative elements */}
      <div className="hidden dark:block">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={`star-${i}`}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
      
      <div className="absolute -bottom-48 left-0 right-0 h-48 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};