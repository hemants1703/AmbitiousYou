"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon, Medal, Search, Trophy } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Achievements() {
  const router = useRouter();

  return router.push("/dashboard");

  // State for search and filter
  const [searchQuery, setSearchQuery] = useState("");

  // Container animation variants for staggered children
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.2,
      },
    },
  };

  // Item animation variants
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  // Mock achievement data - in a real app, this would come from an API or database
  const achievements = [
    {
      title: "Consistency Master",
      description: "Complete tasks for 14 consecutive days",
      icon: "medal",
      date: "July 15, 2023",
      category: "Habits",
      rarity: "common",
    },
    {
      title: "Early Bird",
      description: "Complete 20 tasks before 9 AM",
      icon: "medal",
      date: "August 3, 2023",
      category: "Productivity",
      rarity: "common",
    },
    {
      title: "Focus Champion",
      description: "Maintain 100% focus score for an entire week",
      icon: "trophy",
      date: "September 22, 2023",
      category: "Focus",
      rarity: "rare",
    },
    {
      title: "Milestone Maker",
      description: "Reach 10 milestones across all ambitions",
      icon: "trophy",
      date: "October 10, 2023",
      category: "Progress",
      rarity: "rare",
    },
    {
      title: "Goal Getter",
      description: "Complete 5 major ambitions",
      icon: "trophy",
      date: "November 28, 2023",
      category: "Completion",
      rarity: "epic",
    },
    {
      title: "Balanced Life",
      description: "Maintain active ambitions in 5 different categories",
      icon: "medal",
      date: "January 5, 2024",
      category: "Balance",
      rarity: "rare",
    },
    {
      title: "Quick Learner",
      description: "Complete 3 learning ambitions within their target timeframes",
      icon: "medal",
      date: "February 12, 2024",
      category: "Learning",
      rarity: "common",
    },
    {
      title: "Streak Sensation",
      description: "Maintain a 30-day streak on any ambition",
      icon: "trophy",
      date: "March 3, 2024",
      category: "Habits",
      rarity: "epic",
    },
    {
      title: "Perfect Week",
      description: "Complete all scheduled tasks for an entire week",
      icon: "medal",
      date: "March 21, 2024",
      category: "Productivity",
      rarity: "rare",
    },
    {
      title: "Ambition Explorer",
      description: "Create ambitions in 7 different categories",
      icon: "trophy",
      date: "April 5, 2024",
      category: "Exploration",
      rarity: "rare",
    },
    {
      title: "Rising Star",
      description: "Achieve your first major milestone",
      icon: "medal",
      date: "April 18, 2024",
      category: "Progress",
      rarity: "common",
    },
    {
      title: "Master Planner",
      description: "Successfully plan and execute a complex ambition with over 20 tasks",
      icon: "trophy",
      date: "May 2, 2024",
      category: "Planning",
      rarity: "epic",
    },
  ];

  return (
    <div className="container mx-auto space-y-8">
      {/* Header Section with Animation */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-2"
      >
        <h1 className="text-3xl font-bold">Your Achievements</h1>
        <p className="text-muted-foreground">Track your progress and celebrate your milestones</p>
      </motion.div>

      {/* Achievement Stats Cards with Animation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid gap-4 md:grid-cols-4"
      >
        {/* Total Achievements Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                className="text-3xl font-bold"
              >
                {achievements.length}
              </motion.div>
              <p className="text-xs text-muted-foreground mt-1">Out of 50 possible achievements</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Common Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Common</CardTitle>
            </CardHeader>
            <CardContent>
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: 0.35 }}
                className="text-3xl font-bold"
              >
                {achievements.filter((a) => a.rarity === "common").length}
              </motion.div>
              <p className="text-xs text-muted-foreground mt-1">Foundation achievements</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Rare Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Rare</CardTitle>
            </CardHeader>
            <CardContent>
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: 0.4 }}
                className="text-3xl font-bold"
              >
                {achievements.filter((a) => a.rarity === "rare").length}
              </motion.div>
              <p className="text-xs text-muted-foreground mt-1">Advanced achievements</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Epic Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.25 }}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Epic</CardTitle>
            </CardHeader>
            <CardContent>
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: 0.45 }}
                className="text-3xl font-bold"
              >
                {achievements.filter((a) => a.rarity === "epic").length}
              </motion.div>
              <p className="text-xs text-muted-foreground mt-1">Expert level achievements</p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Filter and Search with Animation */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="flex-1">
          <Input
            placeholder="Search achievements..."
            className="w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            startIcon={<Search className="h-4 w-4 text-muted-foreground" />}
          />
        </div>
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="flex gap-2"
        >
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="habits">Habits</SelectItem>
              <SelectItem value="productivity">Productivity</SelectItem>
              <SelectItem value="focus">Focus</SelectItem>
              <SelectItem value="progress">Progress</SelectItem>
              <SelectItem value="completion">Completion</SelectItem>
              <SelectItem value="balance">Balance</SelectItem>
              <SelectItem value="learning">Learning</SelectItem>
              <SelectItem value="exploration">Exploration</SelectItem>
              <SelectItem value="planning">Planning</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="all">
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Rarity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Rarities</SelectItem>
              <SelectItem value="common">Common</SelectItem>
              <SelectItem value="rare">Rare</SelectItem>
              <SelectItem value="epic">Epic</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>
      </motion.div>

      {/* Achievements Tabs with Animation */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full sm:w-[400px] grid-cols-3">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unlocked">Unlocked</TabsTrigger>
            <TabsTrigger value="locked">Locked</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            >
              {achievements.map((achievement, i) => (
                <motion.div
                  key={i}
                  variants={item}
                  transition={{ duration: 0.3 }}
                  whileHover={{
                    y: -5,
                    boxShadow: "0 10px 30px -15px rgba(0, 0, 0, 0.2)",
                    transition: { duration: 0.2 },
                  }}
                >
                  <Card
                    className={`
                    border overflow-hidden transition-all duration-300
                    ${
                      achievement.rarity === "common"
                        ? "bg-gradient-to-br from-background to-muted/50"
                        : achievement.rarity === "rare"
                          ? "bg-gradient-to-br from-background to-blue-500/10"
                          : "bg-gradient-to-br from-background to-purple-500/10"
                    }
                  `}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <motion.div
                          className="p-2 rounded-full bg-background"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.2, delay: 0.2 + i * 0.05 }}
                        >
                          {achievement.icon === "medal" ? (
                            <Medal
                              className={`h-6 w-6 ${
                                achievement.rarity === "common"
                                  ? "text-zinc-400"
                                  : achievement.rarity === "rare"
                                    ? "text-blue-500"
                                    : "text-purple-500"
                              }`}
                            />
                          ) : (
                            <Trophy
                              className={`h-6 w-6 ${
                                achievement.rarity === "common"
                                  ? "text-zinc-400"
                                  : achievement.rarity === "rare"
                                    ? "text-blue-500"
                                    : "text-purple-500"
                              }`}
                            />
                          )}
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.2 + i * 0.05 }}
                        >
                          <Badge
                            className={`
                            ${
                              achievement.rarity === "common"
                                ? "bg-zinc-200 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-200"
                                : achievement.rarity === "rare"
                                  ? "bg-blue-500/20 text-blue-600 dark:text-blue-400"
                                  : "bg-purple-500/20 text-purple-600 dark:text-purple-400"
                            }
                          `}
                          >
                            {achievement.rarity.charAt(0).toUpperCase() +
                              achievement.rarity.slice(1)}
                          </Badge>
                        </motion.div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <h3 className="font-medium text-lg mb-1">{achievement.title}</h3>
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>
                      <motion.div
                        className="mt-3 flex flex-wrap gap-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.3 + i * 0.05 }}
                      >
                        <Badge variant="outline" className="text-xs">
                          {achievement.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <CalendarIcon className="h-3 w-3" /> {achievement.date}
                        </span>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </TabsContent>

          <TabsContent value="unlocked" className="mt-6">
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            >
              {/* Same cards as above but with filtered achievements */}
              {achievements.map((achievement, i) => (
                <motion.div
                  key={i}
                  variants={item}
                  transition={{ duration: 0.3 }}
                  whileHover={{
                    y: -5,
                    boxShadow: "0 10px 30px -15px rgba(0, 0, 0, 0.2)",
                    transition: { duration: 0.2 },
                  }}
                >
                  <Card
                    className={`
                    border overflow-hidden transition-all duration-300
                    ${
                      achievement.rarity === "common"
                        ? "bg-gradient-to-br from-background to-muted/50"
                        : achievement.rarity === "rare"
                          ? "bg-gradient-to-br from-background to-blue-500/10"
                          : "bg-gradient-to-br from-background to-purple-500/10"
                    }
                  `}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <motion.div
                          className="p-2 rounded-full bg-background"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.2, delay: 0.2 + i * 0.05 }}
                        >
                          {achievement.icon === "medal" ? (
                            <Medal
                              className={`h-6 w-6 ${
                                achievement.rarity === "common"
                                  ? "text-zinc-400"
                                  : achievement.rarity === "rare"
                                    ? "text-blue-500"
                                    : "text-purple-500"
                              }`}
                            />
                          ) : (
                            <Trophy
                              className={`h-6 w-6 ${
                                achievement.rarity === "common"
                                  ? "text-zinc-400"
                                  : achievement.rarity === "rare"
                                    ? "text-blue-500"
                                    : "text-purple-500"
                              }`}
                            />
                          )}
                        </motion.div>
                        <Badge
                          className={`
                          ${
                            achievement.rarity === "common"
                              ? "bg-zinc-200 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-200"
                              : achievement.rarity === "rare"
                                ? "bg-blue-500/20 text-blue-600 dark:text-blue-400"
                                : "bg-purple-500/20 text-purple-600 dark:text-purple-400"
                          }
                        `}
                        >
                          {achievement.rarity.charAt(0).toUpperCase() + achievement.rarity.slice(1)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <h3 className="font-medium text-lg mb-1">{achievement.title}</h3>
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Badge variant="outline" className="text-xs">
                          {achievement.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <CalendarIcon className="h-3 w-3" /> {achievement.date}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </TabsContent>

          <TabsContent value="locked" className="mt-6">
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            >
              {/* Locked achievements */}
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  variants={item}
                  transition={{ duration: 0.3 }}
                  whileHover={{
                    y: -5,
                    boxShadow: "0 10px 30px -15px rgba(0, 0, 0, 0.2)",
                    transition: { duration: 0.2 },
                  }}
                >
                  <Card className="border border-dashed bg-muted/20">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <motion.div
                          className="p-2 rounded-full bg-background"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.2, delay: 0.2 + i * 0.1 }}
                        >
                          {i % 2 === 0 ? (
                            <Trophy className="h-6 w-6 text-muted-foreground/50" />
                          ) : (
                            <Medal className="h-6 w-6 text-muted-foreground/50" />
                          )}
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.3 + i * 0.1 }}
                        >
                          <Badge variant="outline" className="bg-transparent">
                            {i === 1 ? "???" : i === 2 ? "Rare" : "Epic"}
                          </Badge>
                        </motion.div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                      >
                        <h3 className="font-medium text-lg mb-1">
                          {i === 1
                            ? "Secret Achievement"
                            : i === 2
                              ? "Marathon Finisher"
                              : "Grand Master"}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {i === 1
                            ? "Continue your journey to unlock this achievement"
                            : i === 2
                              ? "Complete your first marathon ambition"
                              : "Complete 100 tasks with perfect focus"}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <Badge variant="outline" className="text-xs">
                            {i === 1 ? "Hidden" : i === 2 ? "Endurance" : "Mastery"}
                          </Badge>
                        </div>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
