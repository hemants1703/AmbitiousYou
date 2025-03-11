"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  BarChartIcon,
  CalendarIcon,
  ClockIcon,
  DownloadIcon,
  GearIcon,
  InfoCircledIcon,
  LightningBoltIcon,
  MagnifyingGlassIcon,
  MixerHorizontalIcon,
  StarFilledIcon,
  TargetIcon
} from "@radix-ui/react-icons";
// For icons not available in Radix UI
import { ArrowRight, ArrowUpRight, ArrowDownRight, LineChart, PieChart, TrendingUp } from "lucide-react";

export default function Analytics() {
  const [dateRange, setDateRange] = useState("month");
  const [ambitionFilter, setAmbitionFilter] = useState("all");
  
  // Example data - would come from your API in a real app
  const ambitions = [
    { id: "1", name: "Learn Spanish", color: "bg-blue-500", progress: 65 },
    { id: "2", name: "Marathon Training", color: "bg-green-500", progress: 40 },
    { id: "3", name: "Work Promotion", color: "bg-purple-500", progress: 25 },
    { id: "4", name: "Financial Planning", color: "bg-amber-500", progress: 50 }
  ];
  
  const summaryData = {
    completionRate: 78,
    averageProgress: 45,
    totalActiveAmbitions: 4,
    efficiency: 82,
    onTrackPercentage: 75,
    timeInvestment: 23.5, // hours
    weeklyChange: 15, // percent
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
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Insights and metrics for your ambitions</p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="month">
            <SelectTrigger className="w-[130px] h-9">
              <SelectValue placeholder="Date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <DownloadIcon className="h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <GearIcon className="h-4 w-4" />
            Settings
          </Button>
        </div>
      </motion.div>
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full md:w-[500px] grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="time">Time</TabsTrigger>
          <TabsTrigger value="forecasts">Forecasts</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6 mt-6">
          {/* Key Performance Metrics */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <Card>
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center">
                  <TargetIcon className="h-4 w-4 mr-1 text-primary" />
                  Completion Rate
                </CardDescription>
                <CardTitle className="text-2xl font-bold">{summaryData.completionRate}%</CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex items-center text-sm">
                  <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-green-500 font-medium">+12%</span>
                  <span className="text-muted-foreground ml-1">from last month</span>
                </div>
                <Progress value={summaryData.completionRate} className="h-1 mt-3" />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center">
                  <StarFilledIcon className="h-4 w-4 mr-1 text-amber-500" />
                  Average Progress
                </CardDescription>
                <CardTitle className="text-2xl font-bold">{summaryData.averageProgress}%</CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex items-center text-sm">
                  <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-green-500 font-medium">+5%</span>
                  <span className="text-muted-foreground ml-1">from last month</span>
                </div>
                <Progress value={summaryData.averageProgress} className="h-1 mt-3" />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center">
                  <LightningBoltIcon className="h-4 w-4 mr-1 text-blue-500" />
                  Efficiency Score
                </CardDescription>
                <CardTitle className="text-2xl font-bold">{summaryData.efficiency}</CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex items-center text-sm">
                  <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
                  <span className="text-red-500 font-medium">-3</span>
                  <span className="text-muted-foreground ml-1">from last month</span>
                </div>
                <Progress value={summaryData.efficiency} className="h-1 mt-3" />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center">
                  <ClockIcon className="h-4 w-4 mr-1 text-purple-500" />
                  Time Investment
                </CardDescription>
                <CardTitle className="text-2xl font-bold">{summaryData.timeInvestment}h</CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex items-center text-sm">
                  <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-green-500 font-medium">+{summaryData.weeklyChange}%</span>
                  <span className="text-muted-foreground ml-1">from last month</span>
                </div>
                <Progress value={75} className="h-1 mt-3" />
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Main Charts Section */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Progress Over Time Chart */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Progress Over Time</CardTitle>
                      <CardDescription>Monthly progress across all ambitions</CardDescription>
                    </div>
                    <Select defaultValue="6months">
                      <SelectTrigger className="w-[130px] h-8">
                        <SelectValue placeholder="Time period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3months">3 Months</SelectItem>
                        <SelectItem value="6months">6 Months</SelectItem>
                        <SelectItem value="year">1 Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Placeholder for chart - in a real app you'd use a chart library */}
                  <div className="h-[250px] flex items-end gap-2">
                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, i) => {
                      const heights = [45, 52, 48, 70, 66, 78];
                      return (
                        <div key={month} className="flex-1 flex flex-col items-center gap-2">
                          <div 
                            className="w-full rounded-t-md bg-gradient-to-t from-primary/80 to-primary/60 transition-all" 
                            style={{ height: `${heights[i]}%` }} 
                          />
                          <span className="text-xs text-muted-foreground">{month}</span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            {/* Distribution by Category */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Distribution by Category</CardTitle>
                  <CardDescription>How your ambitions are categorized</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Placeholder for pie chart */}
                  <div className="mt-4 space-y-4">
                    {[
                      { category: "Learning", percentage: 40, color: "bg-blue-500" },
                      { category: "Fitness", percentage: 25, color: "bg-green-500" },
                      { category: "Career", percentage: 20, color: "bg-purple-500" },
                      { category: "Finance", percentage: 15, color: "bg-amber-500" }
                    ].map((category) => (
                      <div key={category.category} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className={`h-3 w-3 rounded-full ${category.color} mr-2`}></div>
                            <span>{category.category}</span>
                          </div>
                          <span className="font-medium">{category.percentage}%</span>
                        </div>
                        <Progress value={category.percentage} className={`h-1 ${category.color}`} />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
          
          {/* Ambition Performance Comparison */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle>Ambition Performance</CardTitle>
                    <CardDescription>Compare progress across your ambitions</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[150px] h-9">
                        <SelectValue placeholder="Filter ambitions" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Ambitions</SelectItem>
                        <SelectItem value="active">Active Only</SelectItem>
                        <SelectItem value="top">Top Performing</SelectItem>
                        <SelectItem value="struggling">Needs Attention</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <MixerHorizontalIcon className="h-4 w-4" />
                      Sort
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {ambitions.map((ambition) => (
                    <div key={ambition.id} className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-lg border">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <div className={`h-4 w-4 rounded-full ${ambition.color}`}></div>
                          <h3 className="font-medium">{ambition.name}</h3>
                          {ambition.progress >= 60 && (
                            <Badge variant="outline" className="ml-2 bg-green-500/10 text-green-500 border-green-500/20">
                              On Track
                            </Badge>
                          )}
                          {ambition.progress < 30 && (
                            <Badge variant="outline" className="ml-2 bg-red-500/10 text-red-500 border-red-500/20">
                              Needs Focus
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center w-full gap-4">
                          <div className="flex-1">
                            <Progress value={ambition.progress} className="h-2" />
                          </div>
                          <div className="w-12 text-right font-medium">
                            {ambition.progress}%
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <div className="text-2xl font-bold">{Math.floor(Math.random() * 20) + 5}h</div>
                          <div className="text-xs text-muted-foreground">Time Spent</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold">{Math.floor(Math.random() * 15) + 3}</div>
                          <div className="text-xs text-muted-foreground">Tasks Done</div>
                        </div>
                        <Button variant="outline" size="sm">
                          Details <ArrowRight className="ml-1 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Insights & Recommendations */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <Card>
              <CardHeader>
                <CardTitle>Key Insights</CardTitle>
                <CardDescription>AI-powered analysis of your performance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-green-600">Strong Progress Pattern</h4>
                      <p className="text-sm mt-1">You've been consistently improving in "Learn Spanish" over the last 3 weeks.</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                      <InfoCircledIcon className="h-4 w-4 text-amber-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-amber-600">Time Optimization</h4>
                      <p className="text-sm mt-1">Your most productive hours are between 9-11am. Consider scheduling important tasks during this window.</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                      <LightningBoltIcon className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-blue-600">Efficiency Opportunity</h4>
                      <p className="text-sm mt-1">Breaking down "Work Promotion" into smaller tasks could improve your completion rate by 35%.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Recommendations</CardTitle>
                <CardDescription>Suggested actions to improve your progress</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    title: "Increase focus time on Marathon Training",
                    description: "Currently lagging 15% behind your target pace.",
                    action: "Allocate Time"
                  },
                  {
                    title: "Review Financial Planning milestones",
                    description: "2 milestones are approaching their deadlines.",
                    action: "Review"
                  },
                  {
                    title: "Create more specific tasks for Work Promotion",
                    description: "Current tasks are too broad which may reduce motivation.",
                    action: "Edit Tasks"
                  },
                ].map((recommendation, i) => (
                  <div key={i} className="flex items-center justify-between gap-4 p-4 rounded-lg border">
                    <div>
                      <h4 className="font-medium">{recommendation.title}</h4>
                      <p className="text-sm text-muted-foreground">{recommendation.description}</p>
                    </div>
                    <Button variant="outline" size="sm">{recommendation.action}</Button>
                  </div>
                ))}
              </CardContent>
              <CardFooter className="border-t pt-4">
                <Button variant="ghost" className="w-full text-primary">
                  See All Recommendations
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </TabsContent>
        
        <TabsContent value="progress" className="space-y-6 mt-6">
          {/* Progress-specific content */}
          <Card>
            <CardHeader>
              <CardTitle>Detailed Progress Analysis</CardTitle>
              <CardDescription>In-depth view of your ambition progress over time</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center text-muted-foreground">
              Progress analysis charts and graphs would appear here
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="time" className="space-y-6 mt-6">
          {/* Time-specific content */}
          <Card>
            <CardHeader>
              <CardTitle>Time Investment Analysis</CardTitle>
              <CardDescription>How you've been allocating your time across ambitions</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center text-muted-foreground">
              Time analysis charts and graphs would appear here
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="forecasts" className="space-y-6 mt-6">
          {/* Forecasts content */}
          <Card>
            <CardHeader>
              <CardTitle>Completion Forecasts</CardTitle>
              <CardDescription>AI-powered predictions for your ambition timelines</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center text-muted-foreground">
              Forecast data and projections would appear here
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}