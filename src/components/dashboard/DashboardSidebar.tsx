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
  LayoutDashboard,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useState } from "react";

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
  const [isExpanded, setIsExpanded] = useState(false);

  const handleLogout = () => {
    // Add logout logic here
    navigate('/');
  };

  return (
    <div 
      className="relative group"
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <Sidebar 
        variant="sidebar" 
        collapsible={isExpanded ? "none" : "icon"}
        className={`transition-all duration-300 ${isExpanded ? 'w-64' : 'w-16'}`}
      >
        <div className="p-4 flex items-center justify-center">
          <LayoutDashboard className="h-8 w-8 text-primary cursor-pointer" />
        </div>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton
                      onClick={() => navigate(item.path)}
                      isActive={location.pathname === item.path}
                      tooltip={item.title}
                      className={`transition-all duration-300 ${
                        isExpanded ? 'w-full px-4' : 'w-12 px-2'
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                      <span className={`transition-opacity duration-300 ${
                        isExpanded ? 'opacity-100' : 'opacity-0'
                      }`}>
                        {item.title}
                      </span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="p-2 space-y-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="w-full flex items-center justify-center"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            onClick={handleLogout}
            className={`w-full flex items-center gap-2 justify-center ${
              isExpanded ? '' : 'px-0'
            }`}
          >
            <LogOut className="h-4 w-4" />
            <span className={`transition-opacity duration-300 ${
              isExpanded ? 'opacity-100' : 'opacity-0 w-0'
            }`}>
              Logout
            </span>
          </Button>
        </SidebarFooter>
      </Sidebar>
    </div>
  );
};