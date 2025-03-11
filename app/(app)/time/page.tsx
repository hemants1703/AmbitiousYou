"use client";

import { useState } from "react";
import { motion } from "framer-motion"; // Added motion import
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, addHours, addDays, subDays } from "date-fns";
import {
  CalendarIcon,
  ClockIcon,
  PlusCircledIcon,
  ReloadIcon,
  BarChartIcon,
  GearIcon,
} from "@radix-ui/react-icons";
// For icons not available in Radix UI
import { Pause, Play, LineChart, Hourglass, Tag } from "lucide-react";

export default function Time() {
  const [activeTimer, setActiveTimer] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  // Example data - in a real app this would come from your backend
  const ambitions = [
    { id: "1", name: "Learn Spanish", color: "bg-blue-500", progress: 65 },
    { id: "2", name: "Marathon Training", color: "bg-green-500", progress: 40 },
    { id: "3", name: "Work Promotion", color: "bg-purple-500", progress: 25 },
    { id: "4", name: "Financial Planning", color: "bg-amber-500", progress: 50 }
  ];
  
  const timeEntries = [
    { 
      id: "1", 
      ambitionId: "1", 
      activity: "Vocabulary practice", 
      duration: "45:00", 
      date: new Date(), 
      start: "09:15", 
      end: "10:00",
      tags: ["study", "vocabulary"]
    },
    { 
      id: "2", 
      ambitionId: "2", 
      activity: "5K training run", 
      duration: "32:15", 
      date: new Date(), 
      start: "07:00", 
      end: "07:32",
      tags: ["cardio", "morning"]
    },
    { 
      id: "3", 
      ambitionId: "3", 
      activity: "Project planning", 
      duration: "1:20:00", 
      date: subDays(new Date(), 1), 
      start: "14:30", 
      end: "15:50",
      tags: ["planning", "focus"]
    },
    { 
      id: "4", 
      ambitionId: "1", 
      activity: "Grammar exercises", 
      duration: "25:00", 
      date: subDays(new Date(), 1), 
      start: "19:00", 
      end: "19:25",
      tags: ["study", "grammar"]
    }
  ];
  
  const weeklyData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      { name: "Learn Spanish", data: [30, 45, 0, 25, 45, 60, 0] },
      { name: "Marathon Training", data: [45, 30, 35, 0, 25, 60, 45] },
      { name: "Work Promotion", data: [80, 65, 45, 70, 60, 0, 0] },
      { name: "Financial Planning", data: [15, 0, 20, 25, 15, 0, 30] }
    ]
  };
  
  const toggleTimer = (ambitionId: string) => {
    if (activeTimer === ambitionId) {
      setActiveTimer(null);
    } else {
      setActiveTimer(ambitionId);
    }
  };
  
  return (
    <div className="container mx-auto space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold">Time Tracking</h1>
          <p className="text-muted-foreground">Track time spent on your ambitions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <CalendarIcon className="h-4 w-4" />
            {format(new Date(), "MMM d, yyyy")}
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <GearIcon className="h-4 w-4" />
            Settings
          </Button>
        </div>
      </motion.div>
      
      <Tabs defaultValue="tracking" className="w-full">
        <TabsList className="grid w-full md:w-[400px] grid-cols-3">
          <TabsTrigger value="tracking">Tracking</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="tracking" className="space-y-6 mt-4">
          {/* Active Timer Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Active Timers</CardTitle>
                <CardDescription>Start and track time for your ambitions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  {ambitions.map((ambition, index) => (
                    <motion.div
                      key={ambition.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 * index }}
                    >
                      <Card className={`border-l-4 ${ambition.color}`}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <h3 className="font-medium">{ambition.name}</h3>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                <ClockIcon className="h-4 w-4" />
                                {activeTimer === ambition.id ? (
                                  <span className="text-primary animate-pulse">00:12:34</span>
                                ) : (
                                  <span>Not tracking</span>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex gap-2">
                              <Button 
                                variant={activeTimer === ambition.id ? "destructive" : "outline"} 
                                size="sm"
                                className="w-10 h-9 p-0"
                                onClick={() => toggleTimer(ambition.id)}
                              >
                                {activeTimer === ambition.id ? (
                                  <Pause className="h-4 w-4" />
                                ) : (
                                  <Play className="h-4 w-4" />
                                )}
                              </Button>
                              <Button variant="ghost" size="sm" className="w-10 h-9 p-0">
                                <ReloadIcon className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          
                          {activeTimer === ambition.id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-4 space-y-2"
                            >
                              <Label htmlFor={`activity-${ambition.id}`}>What are you working on?</Label>
                              <div className="flex gap-2">
                                <Input id={`activity-${ambition.id}`} placeholder="Describe your activity..." className="flex-1" />
                                <Button>Save</Button>
                              </div>
                            </motion.div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
                
                <div className="flex justify-center mt-6">
                  <Button variant="outline" className="flex items-center gap-1">
                    <PlusCircledIcon className="h-4 w-4" />
                    Add Custom Timer
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Today's Entries */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Today's Time Entries</CardTitle>
                <CardDescription>Time tracked for {format(new Date(), "MMMM d, yyyy")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {timeEntries.filter(entry => 
                    entry.date.toDateString() === new Date().toDateString()
                  ).map((entry, index) => {
                    const ambition = ambitions.find(a => a.id === entry.ambitionId);
                    return (
                      <motion.div
                        key={entry.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 * index }}
                        className="flex items-center justify-between p-3 border rounded-md"
                      >
                        <div className="flex gap-3 items-center">
                          <div className={`h-6 w-1 rounded-full ${ambition?.color}`} />
                          <div>
                            <p className="font-medium">{entry.activity}</p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span>{entry.start} - {entry.end}</span>
                              <div className="w-1 h-1 rounded-full bg-muted-foreground" />
                              <span>{ambition?.name}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex gap-1">
                            {entry.tags.map((tag, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <span className="font-medium tabular-nums">{entry.duration}</span>
                        </div>
                      </motion.div>
                    );
                  })}
                  
                  {timeEntries.filter(entry => 
                    entry.date.toDateString() === new Date().toDateString()
                  ).length === 0 && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      className="text-center py-8"
                    >
                      <Hourglass className="h-12 w-12 mx-auto text-muted-foreground opacity-20" />
                      <h3 className="mt-4 font-medium">No time entries for today</h3>
                      <p className="text-muted-foreground mt-1">Start a timer to track your progress</p>
                    </motion.div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <p className="text-sm text-muted-foreground">
                  Total time today: <span className="font-medium">1:17:15</span>
                </p>
                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                  <PlusCircledIcon className="h-4 w-4" />
                  Add Entry
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </TabsContent>
        
        <TabsContent value="history" className="space-y-6 mt-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle>Time History</CardTitle>
                    <CardDescription>View and manage your time entries</CardDescription>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm" className="flex items-center gap-1">
                          <CalendarIcon className="h-4 w-4" />
                          {selectedDate ? format(selectedDate, "MMM d, yyyy") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[180px] h-9">
                        <SelectValue placeholder="Filter by ambition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Ambitions</SelectItem>
                        {ambitions.map(ambition => (
                          <SelectItem key={ambition.id} value={ambition.id}>{ambition.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Activity</TableHead>
                        <TableHead>Ambition</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Tags</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {timeEntries.map((entry, index) => {
                        const ambition = ambitions.find(a => a.id === entry.ambitionId);
                        return (
                          <motion.tr
                            key={entry.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2, delay: 0.05 * index }}
                          >
                            <TableCell>{entry.activity}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className={`h-3 w-3 rounded-full ${ambition?.color}`} />
                                {ambition?.name}
                              </div>
                            </TableCell>
                            <TableCell>{format(entry.date, "MMM d, yyyy")}</TableCell>
                            <TableCell>{entry.start} - {entry.end}</TableCell>
                            <TableCell className="font-medium">{entry.duration}</TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                {entry.tags.map((tag, i) => (
                                  <Badge key={i} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm">Edit</Button>
                            </TableCell>
                          </motion.tr>
                        );
                      })}
                    </TableBody>
                  </Table>
                </motion.div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-6">
                <div className="text-sm text-muted-foreground">
                  Showing <span className="font-medium">4</span> entries
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled>Previous</Button>
                  <Button variant="outline" size="sm" disabled>Next</Button>
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-6 mt-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Time This Week</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12:45:30</div>
                  <p className="text-xs text-muted-foreground mt-1">+2:30:15 from last week</p>
                  <Progress value={65} className="mt-3" />
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Most Time Spent On</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded-full bg-purple-500" />
                    <div className="text-2xl font-bold">Work Promotion</div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">4:35:00 this week</p>
                  <Progress value={85} className="mt-3" />
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Daily Average</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1:49:21</div>
                  <p className="text-xs text-muted-foreground mt-1">-0:15:45 from last week</p>
                  <Progress value={40} className="mt-3" />
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Most Productive Day</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Monday</div>
                  <p className="text-xs text-muted-foreground mt-1">3:15:45 tracked</p>
                  <Progress value={90} className="mt-3" />
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle>Weekly Overview</CardTitle>
                    <CardDescription>Time spent on ambitions this week</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      This Week
                    </Button>
                    <Select defaultValue="bar">
                      <SelectTrigger className="h-9 w-[140px]">
                        <SelectValue placeholder="Chart type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bar">
                          <div className="flex items-center gap-2">
                            <BarChartIcon className="h-4 w-4" />
                            <span>Bar Chart</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="line">
                          <div className="flex items-center gap-2">
                            <LineChart className="h-4 w-4" />
                            <span>Line Chart</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {/* Chart would go here */}
                <div className="h-80 p-6">
                  <div className="flex h-full items-end gap-2">
                    {weeklyData.labels.map((day, dayIndex) => (
                      <div key={day} className="flex-1 flex flex-col items-center gap-1">
                        <div className="w-full flex-1 flex flex-col-reverse gap-1">
                          {weeklyData.datasets.map((dataset, i) => {
                            const height = (dataset.data[dayIndex] / 120) * 100;
                            return (
                              <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: `${height}%` }}
                                transition={{ duration: 0.5, delay: 0.2 + (i * 0.1) }}
                                key={dataset.name} 
                                className={`w-full rounded-t ${ambitions[i]?.color}`} 
                                title={`${dataset.name}: ${dataset.data[dayIndex]} mins`}
                              ></motion.div>
                            );
                          })}
                        </div>
                        <span className="text-xs text-muted-foreground">{day}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Time Distribution</CardTitle>
                <CardDescription>How your time is distributed across ambitions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {ambitions.map((ambition, i) => (
                  <motion.div 
                    key={ambition.id} 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * i }}
                    className="space-y-2"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className={`h-3 w-3 rounded-full ${ambition.color}`}></div>
                        <span className="font-medium">{ambition.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          {Math.round(weeklyData.datasets[i].data.reduce((a, b) => a + b, 0) / 60 * 10) / 10}h
                        </span>
                        <span className="text-sm">
                          {Math.round(weeklyData.datasets[i].data.reduce((a, b) => a + b, 0) / weeklyData.datasets.flatMap(d => d.data).reduce((a, b) => a + b, 0) * 100)}%
                        </span>
                      </div>
                    </div>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 0.5, delay: 0.2 + (i * 0.1) }}
                    >
                      <Progress value={ambition.progress} />
                    </motion.div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Time Tags Analysis</CardTitle>
                <CardDescription>Most used tags in your time tracking</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {[
                    { tag: "study", minutes: 70 },
                    { tag: "planning", minutes: 80 },
                    { tag: "focus", minutes: 80 },
                    { tag: "cardio", minutes: 32 },
                    { tag: "morning", minutes: 32 },
                    { tag: "grammar", minutes: 25 },
                    { tag: "vocabulary", minutes: 45 }
                  ].map((item, index) => (
                    <motion.div
                      key={item.tag}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.05 * index }}
                    >
                      <Badge className="py-2 px-4 flex items-center gap-2">
                        <Tag className="h-4 w-4" />
                        <span>{item.tag}</span>
                        <span className="bg-primary/20 px-2 py-0.5 rounded-full text-xs">{item.minutes}m</span>
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}