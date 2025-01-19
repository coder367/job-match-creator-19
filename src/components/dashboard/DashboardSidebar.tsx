import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
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
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    onClick={() => navigate(item.path)}
                    isActive={location.pathname === item.path}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 space-y-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="w-full flex items-center justify-center"
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};