import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";

export const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to sign out. Please try again.",
      });
    } else {
      toast({
        title: "Signed out successfully",
        description: "Come back soon!",
      });
      navigate("/");
    }
  };

  return (
    <nav className="fixed top-0 w-full z-50 border-b bg-background/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between">
        <a href="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          ResumeAI
        </a>
        
        <div className="flex items-center gap-4">
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
          
          {isAuthenticated ? (
            <>
              <Button onClick={() => navigate("/dashboard")}>Dashboard</Button>
              <Button variant="outline" onClick={handleSignOut}>Sign Out</Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => navigate("/signin")}>Sign In</Button>
              <Button onClick={() => navigate("/signup")}>Sign Up</Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};