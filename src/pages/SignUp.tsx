import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import { Footer } from "@/components/Footer";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AuthError, AuthApiError } from "@supabase/supabase-js";

export default function SignUp() {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/dashboard");
      }
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") {
        navigate("/dashboard");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log("Attempting signup with:", { email: formData.email });
      
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.name,
          },
          emailRedirectTo: window.location.origin + '/signin',
        },
      });

      if (error) {
        console.error("Signup error:", error);
        throw error;
      }

      console.log("Signup response:", data);

      if (data.user) {
        toast({
          title: "Account created successfully!",
          description: "Please check your email to verify your account.",
        });
        navigate("/signin");
      }
    } catch (error) {
      console.error("Caught error:", error);
      const authError = error as AuthError;
      let errorMessage = "Failed to create account. Please try again.";

      if (authError instanceof AuthApiError) {
        switch (authError.status) {
          case 400:
            errorMessage = "Invalid email or password format.";
            break;
          case 401:
            errorMessage = "Invalid credentials.";
            break;
          case 422:
            errorMessage = "Email and password are required.";
            break;
          default:
            errorMessage = authError.message;
        }
      }

      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex items-center justify-between p-4 md:p-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="rounded-full"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>
      </div>

      <div className="flex-1 container max-w-screen-xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="w-full md:w-1/2 max-w-md">
          <h1 className="text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            Create Account
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Full Name
              </label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Sign Up"}
            </Button>
            
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Button
                variant="link"
                className="p-0 h-auto font-semibold"
                onClick={() => navigate("/signin")}
              >
                Sign In
              </Button>
            </p>
          </form>
        </div>
        
        <div className="w-full md:w-1/2 flex justify-center">
          <img
            src="/lovable-uploads/1a679130-5a4a-4f6b-ab54-284ed077df26.png"
            alt="Sign Up Illustration"
            className="max-w-md w-full h-auto animate-float"
          />
        </div>
      </div>
      
      <Footer />
    </div>
  );
}