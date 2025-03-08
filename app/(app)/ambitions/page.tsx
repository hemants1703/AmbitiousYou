"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  CalendarIcon, 
  CheckCircleIcon, 
  ChevronRight, 
  Clock, 
  Filter, 
  Folder, 
  MoreHorizontal, 
  PlusCircle, 
  Search, 
  Settings2, 
  Tag, 
  Target
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function AllAmbitionsPage() {
  // Example data for ambitions
  const ambitions = [
    {
      id: 1,
      title: "Learn Spanish",
      description: "Become conversational in Spanish within 6 months",
      category: "Learning",
      progress: 65,
      tasks: { completed: 13, total: 20 },
      priority: "high",
      dueDate: "Dec 15, 2024",
      lastUpdate: "2 days ago",
      color: "bg-blue-500"
    },
    {
      id: 2,
      title: "Marathon Training",
      description: "Complete a full marathon in under 4 hours",
      category: "Fitness",
      progress: 40,
      tasks: { completed: 8, total: 25 },
      priority: "medium",
      dueDate: "Oct 10, 2024",
      lastUpdate: "1 day ago",
      color: "bg-green-500"
    },
    {
      id: 3,
      title: "Work Promotion",
      description: "Get promoted to senior position by year end",
      category: "Career",
      progress: 25,
      tasks: { completed: 5, total: 12 },
      priority: "high",
      dueDate: "Dec 31, 2024",
      lastUpdate: "5 days ago",
      color: "bg-purple-500"
    }
  ];
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Your Ambitions</h1>
        <p className="text-muted-foreground">View and manage all your ambitions in one place</p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="relative w-full md:w-[350px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search ambitions..." className="pl-10" />
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <Button variant="outline" size="sm" className="gap-1">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" size="sm" className="gap-1">
            <Settings2 className="h-4 w-4" />
            Sort
          </Button>
          <Button size="sm" className="gap-1 ml-auto md:ml-0">
            <PlusCircle className="h-4 w-4" />
            New Ambition
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Ambitions</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="archive">Archive</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {ambitions.map((ambition) => (
              <motion.div key={ambition.id} variants={item}>
                <Link href={`/ambitions/${ambition.id}`}>
                  <Card className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${ambition.color}`}></div>
                          <Badge variant="outline">{ambition.category}</Badge>
                        </div>
                        <Badge variant={ambition.priority === "high" ? "destructive" : ambition.priority === "medium" ? "default" : "secondary"} className="text-xs">
                          {ambition.priority}
                        </Badge>
                      </div>
                      <CardTitle className="mt-2">{ambition.title}</CardTitle>
                      <CardDescription className="line-clamp-2">{ambition.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-1 text-sm">
                            <span>Progress</span>
                            <span>{ambition.progress}%</span>
                          </div>
                          <Progress value={ambition.progress} className="h-2" />
                        </div>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <CheckCircleIcon className="h-3.5 w-3.5" />
                            <span>{ambition.tasks.completed}/{ambition.tasks.total} tasks</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <CalendarIcon className="h-3.5 w-3.5" />
                            <span>Due {ambition.dueDate}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <div className="flex justify-between items-center w-full text-xs text-muted-foreground">
                        <span>Updated {ambition.lastUpdate}</span>
                        <ChevronRight className="h-4 w-4" />
                      </div>
                    </CardFooter>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </TabsContent>
        
        <TabsContent value="active">
          <div className="text-center py-10 text-muted-foreground">
            <p>Active ambitions will appear here</p>
          </div>
        </TabsContent>
        
        <TabsContent value="completed">
          <div className="text-center py-10 text-muted-foreground">
            <p>Completed ambitions will appear here</p>
          </div>
        </TabsContent>
        
        <TabsContent value="archive">
          <div className="text-center py-10 text-muted-foreground">
            <p>Archived ambitions will appear here</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}