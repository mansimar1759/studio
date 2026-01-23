"use client";

import { useState } from "react";
import { getStressReductionSuggestions } from "@/lib/actions";
import { mockTasks } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Zap, BrainCircuit } from "lucide-react";
import { type ReduceStressOutput } from "@/ai/flows/reduce-stress";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

export function StressReducer() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ReduceStressOutput | null>(null);

  const handleAnalysis = async () => {
    setLoading(true);
    setResult(null);
    try {
      const deadlines = mockTasks.map(task => ({
        taskName: task.name,
        deadline: new Date(task.deadline).toISOString(),
        subjectWeightage: task.weightage / 100,
        difficultyLevel: task.difficulty === 'Hard' ? 5 : task.difficulty === 'Medium' ? 3 : 1
      }));
      const aiResult = await getStressReductionSuggestions({ deadlines, batchLoad: 70 });
      setResult(aiResult);
    } catch (error) {
      console.error("Failed to get stress reduction suggestions:", error);
    } finally {
      setLoading(false);
    }
  };

  const getProgressColor = (value: number) => {
    if (value > 75) return "bg-red-500";
    if (value > 50) return "bg-yellow-500";
    return "bg-green-500";
  }

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BrainCircuit className="h-6 w-6 text-primary" />
          <span className="font-headline">AI Stress Reducer</span>
        </CardTitle>
        <CardDescription>
          Analyze your workload to identify stress points and get smart suggestions for a better balance.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col">
        <div className="text-center mt-auto pt-4">
          <Button onClick={handleAnalysis} disabled={loading} className="w-full max-w-xs mx-auto">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Calculating...
              </>
            ) : (
              "Analyze My Stress Level"
            )}
          </Button>
        </div>
        
        {result && (
          <div className="mt-6 space-y-4 animate-in fade-in-50">
            <Separator />
            <div>
              <h3 className="font-semibold mb-2">Stress Score: {result.stressScore}/100</h3>
              <Progress value={result.stressScore} indicatorClassName={getProgressColor(result.stressScore)} />
              <p className="text-xs text-muted-foreground mt-1">Based on deadlines, difficulty, and overall workload.</p>
            </div>
            
            {result.suggestions && result.suggestions.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">AI Suggestions</h3>
                <ul className="space-y-2">
                  {result.suggestions.map((suggestion, index) => (
                    <li key={index} className="p-3 bg-card rounded-lg border">
                      <p className="font-semibold">{suggestion.taskName}</p>
                      <p className="text-sm">Suggested New Deadline: <span className="font-medium text-primary">{new Date(suggestion.newDeadline).toLocaleDateString()}</span></p>
                      <p className="text-xs text-muted-foreground mt-1">Reason: {suggestion.reason}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {result.suggestions && result.suggestions.length === 0 && (
                <div className="p-3 bg-card rounded-lg border text-center">
                    <p className="font-semibold">Looking Good!</p>
                    <p className="text-sm text-muted-foreground">Your workload seems balanced. No deadline adjustments are recommended at this time.</p>
                </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
