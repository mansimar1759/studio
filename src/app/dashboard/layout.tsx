import { DashboardHeader } from "@/components/dashboard/header";
import { TasksProvider } from "@/context/TasksContext";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <TasksProvider>
      <div className="flex min-h-screen flex-col space-y-6">
        <DashboardHeader />
        <div className="container grid flex-1 gap-12">
          <main className="flex w-full flex-1 flex-col overflow-hidden">
            {children}
          </main>
        </div>
      </div>
    </TasksProvider>
  );
}
