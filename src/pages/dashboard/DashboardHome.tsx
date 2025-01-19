import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const DashboardHome = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Resume Optimization</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Optimize your resume for specific job positions using AI
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};