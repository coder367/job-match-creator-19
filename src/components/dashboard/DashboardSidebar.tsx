import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  Home,
  FileText,
  PenTool,
  FileEdit,
  Briefcase,
  Palette,
  Crown,
  LogOut,
  Sun,
  Moon,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

const menuItems = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: Home,
  },
  {
    title: "My Resumes",
    path: "/dashboard/resumes",
    icon: FileText,
  },
  {
    title: "Create Resume",
    path: "/dashboard/create",
    icon: PenTool,
  },
  {
    title: "Cover Letter",
    path: "/dashboard/cover-letter",
    icon: FileEdit,
  },
  {
    title: "Find Job",
    path: "/dashboard/jobs",
    icon: Briefcase,
  },
  {
    title: "Templates",
    path: "/dashboard/templates",
    icon: Palette,
  },
  {
    title: "Upgrade",
    path: "/dashboard/upgrade",
    icon: Crown,
  },
];

export const DashboardSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, setTheme } = useTheme();

  const handleLogout = () => {
    // Add logout logic here
    navigate('/');
  };

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarContent className="py-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.path} className="px-2">
                  <SidebarMenuButton
                    onClick={() => navigate(item.path)}
                    isActive={location.pathname === item.path}
                    tooltip={item.title}
                    className="h-9 px-2 flex items-center gap-2"
                  >
                    <item.icon className="w-5 h-5 min-w-5" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-2 flex gap-2 justify-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="w-10 h-10 flex items-center justify-center"
        >
          {theme === "dark" ? (
            <Sun className="h-6 w-6" />
          ) : (
            <Moon className="h-6 w-6" />
          )}
        </Button>
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-10 h-10 flex items-center justify-center"
        >
          <LogOut className="h-6 w-6" />
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};