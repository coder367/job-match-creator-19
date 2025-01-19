import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    features: [
      "Basic resume builder",
      "3 templates",
      "Export to PDF",
      "Basic job matching",
    ],
  },
  {
    name: "Pro",
    price: "$9.99",
    period: "per month",
    features: [
      "Everything in Free",
      "Unlimited templates",
      "AI optimization",
      "Advanced job matching",
      "Priority support",
    ],
    popular: true,
  },
  {
    name: "Ultimate",
    price: "$19.99",
    period: "per month",
    features: [
      "Everything in Pro",
      "ATS optimization reports",
      "Unlimited resumes",
      "Custom branding",
      "API access",
      "Dedicated support",
    ],
  },
];

const features = [
  "Resume Builder",
  "Templates",
  "PDF Export",
  "Job Matching",
  "AI Optimization",
  "ATS Reports",
  "Priority Support",
  "API Access",
  "Custom Branding",
];

export const Upgrade = () => {
  const handleUpgrade = (plan: string) => {
    toast({
      title: "Upgrade Initiated",
      description: `You selected the ${plan} plan. This feature will be available soon.`,
    });
  };

  return (
    <div className="space-y-12 pb-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Upgrade to Pro</h1>
        <p className="text-muted-foreground max-w-2xl">
          Unlock premium features and take your resume to the next level with our
          Pro and Ultimate plans.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className={`p-6 rounded-xl border ${
              plan.popular
                ? "border-primary shadow-lg relative"
                : "border-border"
            }`}
          >
            {plan.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-sm rounded-full">
                Most Popular
              </span>
            )}
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
              <div className="mb-2">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground">/{plan.period}</span>
              </div>
            </div>
            <ul className="space-y-3 mb-6">
              {plan.features.map((feature, featureIndex) => (
                <li key={featureIndex} className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-primary" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Button
              className={`w-full ${
                plan.popular ? "" : "variant-outline"
              }`}
              onClick={() => handleUpgrade(plan.name)}
            >
              {plan.name === "Free" ? "Current Plan" : "Upgrade Now"}
            </Button>
          </motion.div>
        ))}
      </div>

      {/* Comparison Table */}
      <div className="mt-16 space-y-4">
        <h2 className="text-2xl font-bold mb-6">Feature Comparison</h2>
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Feature</TableHead>
                <TableHead className="text-center">Free</TableHead>
                <TableHead className="text-center">Pro</TableHead>
                <TableHead className="text-center">Ultimate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {features.map((feature) => (
                <TableRow key={feature}>
                  <TableCell className="font-medium">{feature}</TableCell>
                  <TableCell className="text-center">
                    {feature === "Resume Builder" ||
                    feature === "Templates" ||
                    feature === "PDF Export" ? (
                      <Check className="w-5 h-5 text-primary mx-auto" />
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {feature !== "ATS Reports" &&
                    feature !== "API Access" &&
                    feature !== "Custom Branding" ? (
                      <Check className="w-5 h-5 text-primary mx-auto" />
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <Check className="w-5 h-5 text-primary mx-auto" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="mt-16 space-y-4">
        <h2 className="text-2xl font-bold mb-6">Why Upgrade?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-2">Priority AI Processing</h3>
            <p className="text-muted-foreground">
              Get faster AI-powered resume optimization and suggestions with
              priority processing.
            </p>
          </div>
          <div className="p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-2">Premium Templates</h3>
            <p className="text-muted-foreground">
              Access our full library of professional templates designed for
              specific industries.
            </p>
          </div>
          <div className="p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-2">ATS Optimization</h3>
            <p className="text-muted-foreground">
              Ensure your resume passes ATS systems with detailed reports and
              suggestions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};