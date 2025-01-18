import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Software Engineer",
    content: "The AI-powered optimization helped me land interviews at top tech companies. Highly recommended!",
    image: "https://i.pravatar.cc/150?img=1",
  },
  {
    name: "Michael Chen",
    role: "Marketing Manager",
    content: "This platform made updating my resume so much easier. The job matching feature is incredibly accurate.",
    image: "https://i.pravatar.cc/150?img=2",
  },
  {
    name: "Emily Brown",
    role: "UX Designer",
    content: "The templates are modern and professional. I love how easy it is to customize everything.",
    image: "https://i.pravatar.cc/150?img=3",
  },
  {
    name: "David Wilson",
    role: "Product Manager",
    content: "Game-changer for my job search. The AI suggestions really helped me highlight my achievements.",
    image: "https://i.pravatar.cc/150?img=4",
  },
];

export const TestimonialsSection = () => {
  return (
    <section className="py-24 overflow-hidden bg-muted/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            What Our Users Say
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Join thousands of satisfied professionals who've improved their job search
          </p>
        </motion.div>
        <div className="flex gap-6 animate-infinite-scroll">
          {[...testimonials, ...testimonials].map((testimonial, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-[300px] p-6 rounded-xl bg-card border"
            >
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-muted-foreground">{testimonial.content}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};