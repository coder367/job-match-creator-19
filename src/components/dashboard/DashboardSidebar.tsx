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
      <SidebarContent className="py-1">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    onClick={() => navigate(item.path)}
                    isActive={location.pathname === item.path}
                    tooltip={item.title}
                    className="h-7 px-1.5"
                  >
                    <item.icon className="w-4 h-4" />
                    <span className="ml-1.5">{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-1 space-y-1 mt-auto">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="w-6 h-6 flex items-center justify-center"
        >
          {theme === "dark" ? (
            <Sun className="h-3 w-3" />
          ) : (
            <Moon className="h-3 w-3" />
          )}
        </Button>
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-6 h-6 flex items-center justify-center"
        >
          <LogOut className="h-3 w-3" />
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};