import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Home,
  FileText,
  PenTool,
  FileEdit,
  Briefcase,
  Palette,
  Crown,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const menuItems = [
  {
    title: "🏠 Dashboard",
    path: "/dashboard",
    icon: Home,
  },
  {
    title: "📄 My Resumes",
    path: "/dashboard/resumes",
    icon: FileText,
  },
  {
    title: "📝 Create Resume",
    path: "/dashboard/create",
    icon: PenTool,
  },
  {
    title: "📑 Cover Letter Generator",
    path: "/dashboard/cover-letter",
    icon: FileEdit,
  },
  {
    title: "💼 Find Job",
    path: "/dashboard/jobs",
    icon: Briefcase,
  },
  {
    title: "🎨 Templates",
    path: "/dashboard/templates",
    icon: Palette,
  },
  {
    title: "🛒 Upgrade to Pro",
    path: "/dashboard/upgrade",
    icon: Crown,
  },
];

export const DashboardSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

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
    </Sidebar>
  );
};