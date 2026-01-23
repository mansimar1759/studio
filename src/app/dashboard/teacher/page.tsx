import { AdminPanel } from "@/components/dashboard/teacher/admin-panel";

export default function TeacherDashboardPage() {
  return (
    <div className="space-y-8">
       <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">Teacher Dashboard</h1>
        <p className="text-muted-foreground">Manage your batch, assessments, and deadlines.</p>
      </div>
      <AdminPanel />
    </div>
  );
}
