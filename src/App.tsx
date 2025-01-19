import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import { DashboardLayout } from "./layouts/DashboardLayout";
import { DashboardHome } from "./pages/dashboard/DashboardHome";
import { MyResumes } from "./pages/dashboard/MyResumes";
import { CreateResume } from "./pages/dashboard/CreateResume";
import { CoverLetter } from "./pages/dashboard/CoverLetter";
import { FindJob } from "./pages/dashboard/FindJob";
import { Templates } from "./pages/dashboard/Templates";
import { Upgrade } from "./pages/dashboard/Upgrade";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark" attribute="class">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardHome />} />
              <Route path="resumes" element={<MyResumes />} />
              <Route path="create" element={<CreateResume />} />
              <Route path="cover-letter" element={<CoverLetter />} />
              <Route path="jobs" element={<FindJob />} />
              <Route path="templates" element={<Templates />} />
              <Route path="upgrade" element={<Upgrade />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;