"use client";

import * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { batchWorkloadData, mockDeadlinesData, mockStudentData, subjectDistributionData } from "@/lib/data"
import { Edit2, MoreHorizontal, Save } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Bar, BarChart, CartesianGrid, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

const chartConfig: ChartConfig = {
  tasks: {
    label: "Tasks",
  },
  physics: {
    label: "Physics",
    color: "hsl(var(--chart-1))",
  },
  math: {
    label: "Math",
    color: "hsl(var(--chart-2))",
  },
  history: {
    label: "History",
    color: "hsl(var(--chart-3))",
  },
  chemistry: {
    label: "Chemistry",
    color: "hsl(var(--chart-4))",
  },
  english: {
    label: "English",
    color: "hsl(var(--chart-5))",
  },
  cs: {
    label: "CS",
    color: "hsl(var(--chart-1))",
  },
};

export function AdminPanel() {
  const [studentData, setStudentData] = useState(mockStudentData);
  const [deadlinesData, setDeadlinesData] = useState(mockDeadlinesData);
  const [editingMarksId, setEditingMarksId] = useState<string | null>(null);
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [openPopovers, setOpenPopovers] = useState<Record<string, boolean>>({});

  const handleMarkChange = (id: string, newMarks: number) => {
    setStudentData(studentData.map(s => s.id === id ? { ...s, marks: newMarks } : s));
  };
  
  const handleDateChange = (taskName: string, newDate: Date | undefined) => {
    if (newDate) {
        setDeadlinesData(deadlinesData.map(d => d.task === taskName ? { ...d, date: format(newDate, 'yyyy-MM-dd') } : d));
        setOpenPopovers(prev => ({ ...prev, [taskName]: false }));
    }
  };

  const deadlinesOnSelectedDate = deadlinesData.filter(
    (deadline) => selectedDate && format(new Date(deadline.date.replace(/-/g, "/")), "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")
  );

  const deadlineDates = React.useMemo(() => deadlinesData.map(d => new Date(d.date.replace(/-/g, "/"))), [deadlinesData]);

  return (
    <Tabs defaultValue="analytics" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="analytics">Batch Analytics</TabsTrigger>
        <TabsTrigger value="marks">Manage Marks</TabsTrigger>
        <TabsTrigger value="deadlines">Manage Deadlines</TabsTrigger>
      </TabsList>
      
      <TabsContent value="analytics" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Batch Analytics</CardTitle>
            <CardDescription>Overall statistics and visualizations for the current batch.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-8 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Monthly Workload</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={{}} className="h-[250px] w-full">
                  <BarChart data={batchWorkloadData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
                    <YAxis />
                    <Tooltip cursor={false} content={<ChartTooltipContent />} />
                    <Bar dataKey="workload" fill="hsl(var(--accent))" radius={8} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
            <Card>
               <CardHeader>
                <CardTitle className="text-lg font-semibold">Task Distribution by Subject</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[250px] w-full">
                    <PieChart>
                      <Tooltip content={<ChartTooltipContent nameKey="tasks" hideLabel />} />
                      <Pie data={subjectDistributionData} dataKey="tasks" nameKey="subject" innerRadius={60} />
                    </PieChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="marks" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Internal Assessment Marks</CardTitle>
            <CardDescription>Add or edit marks for students in your batch.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Marks</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {studentData.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>{student.id}</TableCell>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>
                      {editingMarksId === student.id ? (
                        <Input type="number" value={student.marks} onChange={(e) => handleMarkChange(student.id, parseInt(e.target.value))} className="w-24" />
                      ) : (
                        student.marks
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {editingMarksId === student.id ? (
                        <Button size="sm" onClick={() => setEditingMarksId(null)}><Save className="h-4 w-4 mr-2" />Save</Button>
                      ) : (
                        <Button variant="outline" size="sm" onClick={() => setEditingMarksId(student.id)}><Edit2 className="h-4 w-4 mr-2" />Edit</Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="deadlines" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Assignment Deadlines</CardTitle>
            <CardDescription>View and manage submission dates for assignments and projects.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
                modifiers={{ deadline: deadlineDates }}
                modifiersClassNames={{
                  deadline: 'relative after:content-[""] after:block after:h-1.5 after:w-1.5 after:rounded-full after:bg-primary after:absolute after:bottom-1.5 after:left-1/2 after:-translate-x-1/2'
                }}
              />
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">
                {selectedDate ? `Deadlines for ${format(selectedDate, 'PPP')}` : 'Select a date'}
              </h3>
              <div className="space-y-3">
                {(selectedDate && deadlinesOnSelectedDate.length > 0) ? (
                  deadlinesOnSelectedDate.map(deadline => (
                    <Card key={deadline.task} className="p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold">{deadline.task}</p>
                          <p className="text-sm text-muted-foreground">{deadline.subject}</p>
                          <p className="text-sm">Due: {format(new Date(deadline.date.replace(/-/g, '/')), "PPP")}</p>
                        </div>
                        <Popover open={openPopovers[deadline.task]} onOpenChange={(isOpen) => setOpenPopovers(prev => ({ ...prev, [deadline.task]: isOpen }))}>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="end">
                            <Calendar
                              mode="single"
                              selected={new Date(deadline.date.replace(/-/g, '/'))}
                              onSelect={(date) => handleDateChange(deadline.task, date)}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </Card>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center pt-8">
                    {selectedDate ? 'No deadlines for this date.' : 'Select a date to see deadlines.'}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
