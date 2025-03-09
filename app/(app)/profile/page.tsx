import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { CalendarIcon, CheckCircleIcon, ClockIcon, LineChart, Medal, Share2, Target, Trophy, Zap } from "lucide-react";

export default function Profile() {
  return (
    <div className="container mx-auto space-y-8">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <div className="flex flex-col items-center md:items-start gap-4">
          <Avatar className="h-24 w-24 border-4 border-primary/20">
            <AvatarImage src="/avatar-placeholder.jpg" alt="John Doe" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
        </div>
        
        <div className="flex-1 space-y-3">
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
            <h1 className="text-3xl font-bold">John Doe</h1>
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-primary/10 hover:bg-primary/20 text-primary border-primary/20">PRO Member</Badge>
              <Badge variant="outline" className="border-amber-500/30 text-amber-500">Top Achiever</Badge>
            </div>
          </div>
          
          <p className="text-muted-foreground">Software developer with a passion for learning new technologies and building meaningful projects. Focused on personal growth and continuous improvement.</p>
          
          <div className="flex flex-wrap gap-4 pt-2">
            <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
              <CalendarIcon className="h-4 w-4" />
              <span>Member since June 2023</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
              <Target className="h-4 w-4" />
              <span>8 Active Ambitions</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
              <Trophy className="h-4 w-4" />
              <span>12 Achievements</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col gap-2 sm:flex-row md:flex-col">
          <Button variant="outline" className="flex gap-2">
            <Share2 className="h-4 w-4" />
            Share Profile
          </Button>
          <Button variant="outline" className="flex gap-2">
            <LineChart className="h-4 w-4" />
            View Stats
          </Button>
        </div>
      </div>
      
      {/* Profile Content */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full md:w-[400px] grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="ambitions">Ambitions</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Progress Overview */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Weekly Focus</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">87%</div>
                <p className="text-xs text-muted-foreground mt-1">+12% from last week</p>
                <Progress value={87} className="mt-3" />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Tasks Completed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">34</div>
                <p className="text-xs text-muted-foreground mt-1">+8 from last week</p>
                <Progress value={78} className="mt-3" />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Consistency</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">92%</div>
                <p className="text-xs text-muted-foreground mt-1">+5% from last month</p>
                <Progress value={92} className="mt-3" />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">14 days</div>
                <p className="text-xs text-muted-foreground mt-1">Personal best: 21 days</p>
                <Progress value={66} className="mt-3" />
              </CardContent>
            </Card>
          </div>
          
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest actions and progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-5">
                {[
                  {
                    title: "Completed task",
                    description: "Morning meditation routine",
                    ambition: "Mental Wellness",
                    time: "2 hours ago",
                    icon: CheckCircleIcon,
                    iconColor: "text-green-500"
                  },
                  {
                    title: "Reached milestone",
                    description: "50% progress on Spanish course",
                    ambition: "Learn Spanish",
                    time: "Yesterday",
                    icon: Target,
                    iconColor: "text-blue-500"
                  },
                  {
                    title: "Achievement unlocked",
                    description: "7-day streak maintained",
                    ambition: "Daily Learning",
                    time: "2 days ago",
                    icon: Zap,
                    iconColor: "text-purple-500"
                  }
                ].map((activity, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="rounded-full p-2 bg-muted">
                      <activity.icon className={`h-5 w-5 ${activity.iconColor}`} />
                    </div>
                    <div>
                      <p className="font-medium">{activity.title}</p>
                      <p className="text-sm">{activity.description}</p>
                      <div className="flex items-center gap-4 mt-1">
                        <Badge variant="outline" className="text-xs">{activity.ambition}</Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <ClockIcon className="h-3 w-3" /> {activity.time}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Stats Summary */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Focus Distribution</CardTitle>
                <CardDescription>Where you've been spending your time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Mental Wellness", percentage: 35 },
                    { name: "Learn Spanish", percentage: 25 },
                    { name: "Marathon Preparation", percentage: 20 },
                    { name: "Finance Knowledge", percentage: 15 },
                    { name: "Master Photography", percentage: 5 }
                  ].map((focus, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{focus.name}</p>
                        <p className="text-sm text-muted-foreground">{focus.percentage}%</p>
                      </div>
                      <Progress value={focus.percentage} 
                        className={i === 0 ? "bg-primary/20" : "bg-muted"} 
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Productivity Insights</CardTitle>
                <CardDescription>Your performance analytics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted rounded-lg p-3">
                      <p className="text-sm font-medium">Most Productive Day</p>
                      <p className="text-2xl font-bold mt-2">Wednesday</p>
                    </div>
                    <div className="bg-muted rounded-lg p-3">
                      <p className="text-sm font-medium">Best Time of Day</p>
                      <p className="text-2xl font-bold mt-2">9:00 AM</p>
                    </div>
                    <div className="bg-muted rounded-lg p-3">
                      <p className="text-sm font-medium">Weekly Completion Rate</p>
                      <p className="text-2xl font-bold mt-2">92%</p>
                    </div>
                    <div className="bg-muted rounded-lg p-3">
                      <p className="text-sm font-medium">Average Focus Time</p>
                      <p className="text-2xl font-bold mt-2">87 min</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Ambitions Tab */}
        <TabsContent value="ambitions" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Your Ambitions</CardTitle>
                  <CardDescription>Goals and aspirations you're actively pursuing</CardDescription>
                </div>
                <Button size="sm">New Ambition</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[
                  {
                    title: "Mental Wellness",
                    description: "Develop daily meditation habits and mindfulness practices",
                    progress: 75,
                    tasks: 12,
                    completed: 9,
                    priority: "high"
                  },
                  {
                    title: "Learn Spanish",
                    description: "Become conversationally fluent in Spanish within 12 months",
                    progress: 50,
                    tasks: 24,
                    completed: 12,
                    priority: "medium"
                  },
                  {
                    title: "Marathon Preparation",
                    description: "Complete a full marathon in under 4 hours",
                    progress: 65,
                    tasks: 18,
                    completed: 12,
                    priority: "high"
                  },
                  {
                    title: "Finance Knowledge",
                    description: "Master personal finance and investment strategies",
                    progress: 35,
                    tasks: 15,
                    completed: 5,
                    priority: "medium"
                  }
                ].map((ambition, i) => (
                  <div key={i} className="border rounded-lg p-4 shadow-sm">
                    <div className="flex flex-col md:flex-row gap-4 mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-medium">{ambition.title}</h3>
                          <Badge className={
                            ambition.priority === "high" ? "bg-red-500/10 text-red-500" :
                            ambition.priority === "medium" ? "bg-amber-500/10 text-amber-500" :
                            "bg-blue-500/10 text-blue-500"
                          }>
                            {ambition.priority.charAt(0).toUpperCase() + ambition.priority.slice(1)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{ambition.description}</p>
                      </div>
                      <div className="min-w-[120px] flex flex-col items-center justify-center">
                        <div className="text-3xl font-bold">{ambition.progress}%</div>
                        <p className="text-xs text-muted-foreground">Completed</p>
                      </div>
                    </div>
                    <div className="mt-2">
                      <Progress value={ambition.progress} className="h-2" />
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-muted-foreground">
                          {ambition.completed}/{ambition.tasks} tasks completed
                        </span>
                        <Button variant="ghost" size="sm">View Details</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button variant="outline">View All Ambitions</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Achievements Tab */}
        <TabsContent value="achievements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Achievements</CardTitle>
              <CardDescription>Milestones and accomplishments you've reached</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  {
                    title: "Consistency Master",
                    description: "Complete tasks for 14 consecutive days",
                    icon: <Medal className="h-8 w-8 text-amber-500" />,
                    date: "July 15, 2023"
                  },
                  {
                    title: "Early Bird",
                    description: "Complete 20 tasks before 9 AM",
                    icon: <Medal className="h-8 w-8 text-amber-500" />,
                    date: "August 3, 2023"
                  },
                  {
                    title: "Focus Champion",
                    description: "Maintain 100% focus score for an entire week",
                    icon: <Trophy className="h-8 w-8 text-amber-500" />,
                    date: "September 22, 2023"
                  },
                  {
                    title: "Milestone Maker",
                    description: "Reach 10 milestones across all ambitions",
                    icon: <Trophy className="h-8 w-8 text-amber-500" />,
                    date: "October 10, 2023"
                  },
                  {
                    title: "Goal Getter",
                    description: "Complete 5 major ambitions",
                    icon: <Trophy className="h-8 w-8 text-amber-500" />,
                    date: "November 28, 2023"
                  },
                  {
                    title: "Balanced Life",
                    description: "Maintain active ambitions in 5 different categories",
                    icon: <Medal className="h-8 w-8 text-amber-500" />,
                    date: "January 5, 2024"
                  }
                ].map((achievement, i) => (
                  <div key={i} className="border rounded-lg p-4 flex flex-col items-center text-center bg-muted/50 shadow-sm">
                    <div className="p-3 rounded-full bg-background mb-3">
                      {achievement.icon}
                    </div>
                    <h3 className="font-medium">{achievement.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{achievement.description}</p>
                    <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1">
                      <CalendarIcon className="h-3 w-3" /> Achieved on {achievement.date}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button variant="outline">View All Achievements</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}