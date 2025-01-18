import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export const HeroSection = () => {
  return (
    <section className="hero-section relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background patterns */}
      <div className="absolute inset-0 hero-pattern" />
      <div className="absolute inset-0 hero-grid opacity-40" />
      <div className="absolute inset-0 hero-glow" />
      
      {/* Floating orbs */}
      <div className="absolute inset-0">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-32 h-32 rounded-full"
            style={{
              background: `radial-gradient(circle at center, rgba(99, 102, 241, ${0.1 - i * 0.02}) 0%, transparent 70%)`,
              left: `${20 + i * 25}%`,
              top: `${30 + i * 10}%`,
            }}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.5, 0.7, 0.5],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              delay: i * 1.5,
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
            <Button 
              className="px-8 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity backdrop-blur-sm"
            >
              Get Started Free
            </Button>
          </motion.div>
        </div>
      </div>
      <div className="absolute -bottom-48 left-0 right-0 h-48 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};