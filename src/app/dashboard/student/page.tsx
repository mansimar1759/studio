import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PrioritizationTool } from "@/components/dashboard/student/prioritization-tool";
import { StressReducer } from "@/components/dashboard/student/stress-reducer";
import { BookOpen, CalendarClock, Zap } from "lucide-react";

export default function StudentDashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">Student Dashboard</h1>
        <p className="text-muted-foreground">Here's your academic overview and AI-powered tools.</p>
      </div>

      <section>
        <h2 className="text-2xl font-semibold font-headline tracking-tight mb-4">Current Workload</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Assignments Due</CardTitle>
              <CalendarClock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4</div>
              <p className="text-xs text-muted-foreground">in the next 7 days</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Projects In-Progress</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground">major projects active</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-2">75%</div>
              <Progress value={75} aria-label="75% of semester completed" />
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-2">
        <PrioritizationTool />
        <StressReducer />
      </section>
    </div>
  );
}
