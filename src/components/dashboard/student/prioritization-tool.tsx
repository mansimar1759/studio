"use client";

import { useState } from "react";
import { getTaskPriority } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Lightbulb, ListOrdered, Loader2, Sparkles, X } from "lucide-react";
import { type PrioritizationOutput } from "@/ai/flows/prioritize-tasks";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useTasks } from "@/context/TasksContext";

export function PrioritizationTool() {
  const { tasks } = useTasks();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PrioritizationOutput | null>(null);

  const handlePrioritize = async () => {
    setLoading(true);
    setResult(null);
    try {
      const aiResult = await getTaskPriority({ tasks });
      setResult(aiResult);
    } catch (error) {
      console.error("Failed to get prioritization:", error);
    } finally {
      setLoading(false);
    }
  };

  const getTaskByName = (name: string) => tasks.find(task => task.name === name);

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
          <span className="font-headline">AI Prioritization Tool</span>
        </CardTitle>
        <CardDescription>
          Let AI help you decide which tasks to tackle first based on your current workload.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col">
        <div className="space-y-2 mb-4">
            <h4 className="text-sm font-medium">Your Current Tasks:</h4>
            <div className="flex flex-wrap gap-2">
                {tasks.map((task) => (
                    <Badge variant="secondary" key={task.name}>{task.name}</Badge>
                ))}
            </div>
        </div>
        <div className="text-center mt-auto pt-4">
          <Button onClick={handlePrioritize} disabled={loading} className="w-full max-w-xs mx-auto">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              "Prioritize My Tasks"
            )}
          </Button>
        </div>
        
        {result && (
          <div className="mt-6 space-y-4 animate-in fade-in-50">
            <Separator />
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2"><ListOrdered className="h-5 w-5"/> Priority List</h3>
              <ul className="space-y-2">
                {result.prioritizedTasks.map((taskName, index) => {
                  const task = getTaskByName(taskName);
                  return (
                    <li key={index} className="p-3 bg-card rounded-lg border flex items-start gap-3">
                        <span className="font-bold text-primary">{index + 1}.</span>
                        <div>
                            <p className="font-semibold">{taskName}</p>
                            {task && <p className="text-xs text-muted-foreground">Deadline: {task.deadline} | Difficulty: {task.difficulty}</p>}
                        </div>
                    </li>
                  )
                })}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2"><Lightbulb className="h-5 w-5"/> AI Reasoning</h3>
              <p className="text-sm text-muted-foreground p-3 bg-card rounded-lg border">{result.reasoning}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
