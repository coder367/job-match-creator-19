import { Sidebar, SidebarContent, SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";

export const DashboardLayout = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <DashboardSidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="container py-6">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};