"use client";

import { useTasks } from "@/context/TasksContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PrioritizationTool } from "@/components/dashboard/student/prioritization-tool";
import { StressReducer } from "@/components/dashboard/student/stress-reducer";
import { BookOpen, CalendarClock, Zap, Book } from "lucide-react";
import type { Task } from "@/lib/types";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

interface SubjectTasks {
  [key: string]: Task[];
}

export default function StudentDashboardPage() {
  const { tasks } = useTasks();

  const tasksBySubject = tasks.reduce((acc, task) => {
    if (!acc[task.subject]) {
      acc[task.subject] = [];
    }
    acc[task.subject].push(task);
    return acc;
  }, {} as SubjectTasks);


  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">Student Dashboard</h1>
        <p className="text-muted-foreground">Here's your academic overview and AI-powered tools.</p>
      </div>

      <section className="grid gap-8 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarClock className="h-5 w-5 text-primary" />
                Assignments Due
              </CardTitle>
              <CardDescription>
                You have {tasks.length} pending tasks. Click on a subject to see more.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {Object.entries(tasksBySubject).map(([subject, subjectTasks]) => (
                  <AccordionItem value={subject} key={subject}>
                    <AccordionTrigger>
                      <div className="flex items-center gap-4">
                         <Book className="h-5 w-5" />
                        <span className="font-semibold">{subject}</span>
                        <Badge>{subjectTasks.length} task(s)</Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-3 pl-4">
                        {subjectTasks.map(task => (
                          <li key={`${task.name}-${task.deadline}`} className="border-l-2 border-primary pl-4">
                            <p className="font-medium">{task.name}</p>
                            <p className="text-sm text-muted-foreground">Deadline: {task.deadline} | Difficulty: {task.difficulty}</p>
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          <div className="space-y-8">
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
