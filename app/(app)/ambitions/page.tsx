"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  Target,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check, X } from "lucide-react";

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
      color: "bg-blue-500",
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
      color: "bg-green-500",
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
      color: "bg-purple-500",
    },
  ];

  // Filter states
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    category: null,
    priority: null,
  });

  // Sort states
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    key: "lastUpdate", // Default sort by last update
    direction: "desc", // Default direction (newest first)
  });

  const [searchQuery, setSearchQuery] = useState("");

  // Extract unique categories and priorities for filter options
  const categories = [...new Set(ambitions.map(ambition => ambition.category))];
  const priorities = [...new Set(ambitions.map(ambition => ambition.priority))];

  // Filter ambitions based on selected filters
  const filteredAmbitions = ambitions.filter(ambition => {
    // First check search query
    if (searchQuery && !ambition.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !ambition.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // If no filters are applied, show all ambitions (that match search)
    if (!filters.category && !filters.priority) return true;

    // Apply category filter
    if (filters.category && ambition.category !== filters.category) {
      return false;
    }

    // Apply priority filter
    if (filters.priority && ambition.priority !== filters.priority) {
      return false;
    }

    return true;
  });

  // Apply sorting to ambitions
  const sortedAndFilteredAmbitions = [...filteredAmbitions].sort((a, b) => {
    // Handle nested properties like tasks.completed
    if (sortConfig.key === "tasks.completed") {
      const valueA = a.tasks.completed;
      const valueB = b.tasks.completed;
      return sortConfig.direction === "asc" ? valueA - valueB : valueB - valueA;
    }
    
    // Handle date strings for due date and last update
    if (sortConfig.key === "dueDate" || sortConfig.key === "lastUpdate") {
      // Simple string comparison for demo purposes
      // In a real app, you'd want to parse these into actual Date objects
      const valueA = a[sortConfig.key];
      const valueB = b[sortConfig.key];
      return sortConfig.direction === "asc" 
        ? valueA.localeCompare(valueB) 
        : valueB.localeCompare(valueA);
    }

    // Handle numeric values
    if (typeof a[sortConfig.key] === 'number') {
      return sortConfig.direction === "asc" 
        ? a[sortConfig.key] - b[sortConfig.key] 
        : b[sortConfig.key] - a[sortConfig.key];
    }
    
    // Default string comparison
    return sortConfig.direction === "asc" 
      ? String(a[sortConfig.key]).localeCompare(String(b[sortConfig.key])) 
      : String(b[sortConfig.key]).localeCompare(String(a[sortConfig.key]));
  });

  // Handle setting sort configuration
  const handleSort = (key) => {
    // If already sorting by this key, toggle direction
    if (sortConfig.key === key) {
      setSortConfig({
        key,
        direction: sortConfig.direction === "asc" ? "desc" : "asc",
      });
    } else {
      // Otherwise, set new key with default direction
      setSortConfig({
        key,
        direction: "asc",
      });
    }
    setIsSortOpen(false);
  };

  // Get sort option display name
  const getSortOptionName = () => {
    const options = {
      title: "Title",
      progress: "Progress",
      priority: "Priority",
      dueDate: "Due Date",
      "tasks.completed": "Tasks Completed",
      lastUpdate: "Last Updated",
    };
    
    return options[sortConfig.key] || "Sort";
  };

  // Handle applying a filter
  const applyFilter = (type, value) => {
    setFilters(prev => ({
      ...prev,
      [type]: prev[type] === value ? null : value
    }));
    setIsFilterOpen(false);
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({ category: null, priority: null });
    setIsFilterOpen(false);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 },
  };

  // Helper function to highlight search terms
  const highlightText = (text, searchTerm) => {
    if (!searchTerm || searchTerm.trim() === "") return text;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <span key={index} className="bg-yellow-200 text-black rounded px-0.5">{part}</span>
      ) : (
        part
      )
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-2"
      >
        <h1 className="text-3xl font-bold tracking-tight">Your Ambitions</h1>
        <p className="text-muted-foreground">
          View and manage all your ambitions in one place
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center"
      >
        <div className="relative w-full md:w-[350px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search ambitions..." 
            className="pl-10" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button 
              className="absolute right-3 top-1/2 -translate-y-1/2"
              onClick={() => setSearchQuery("")}
            >
              <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
            </button>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="flex gap-2 w-full md:w-auto"
        >
          <DropdownMenu open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                <Filter className="h-4 w-4" />
                Filter
                {(filters.category || filters.priority) && (
                  <Badge variant="secondary" className="ml-1 h-5 px-1">
                    {Object.values(filters).filter(Boolean).length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Filter Ambitions</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                  By Category
                </DropdownMenuLabel>
                {categories.map(category => (
                  <DropdownMenuItem
                    key={category}
                    onClick={() => applyFilter('category', category)}
                    className="flex justify-between"
                  >
                    {category}
                    {filters.category === category && <Check className="h-4 w-4" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                  By Priority
                </DropdownMenuLabel>
                {priorities.map(priority => (
                  <DropdownMenuItem
                    key={priority}
                    onClick={() => applyFilter('priority', priority)}
                    className="flex justify-between"
                  >
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                    {filters.priority === priority && <Check className="h-4 w-4" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              {(filters.category || filters.priority) && (
                <DropdownMenuItem onClick={clearFilters} className="text-red-500 flex gap-2">
                  <X className="h-4 w-4" />
                  Clear filters
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu open={isSortOpen} onOpenChange={setIsSortOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                <Settings2 className="h-4 w-4" />
                Sort{sortConfig.key && `: ${getSortOptionName()}`}
                {sortConfig.direction === "asc" ? ": Ascending" : ": Descending"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Sort Ambitions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <DropdownMenuItem 
                onClick={() => handleSort("title")}
                className="flex justify-between"
              >
                By Title
                {sortConfig.key === "title" && (
                  <Badge variant="secondary" className="ml-1">
                    {sortConfig.direction === "asc" ? "A-Z" : "Z-A"}
                  </Badge>
                )}
              </DropdownMenuItem>
              
              <DropdownMenuItem 
                onClick={() => handleSort("progress")}
                className="flex justify-between"
              >
                By Progress
                {sortConfig.key === "progress" && (
                  <Badge variant="secondary" className="ml-1">
                    {sortConfig.direction === "asc" ? "Low-High" : "High-Low"}
                  </Badge>
                )}
              </DropdownMenuItem>
              
              <DropdownMenuItem 
                onClick={() => handleSort("priority")}
                className="flex justify-between"
              >
                By Priority
                {sortConfig.key === "priority" && (
                  <Badge variant="secondary" className="ml-1">
                    {sortConfig.direction === "asc" ? "Low-High" : "High-Low"}
                  </Badge>
                )}
              </DropdownMenuItem>
              
              <DropdownMenuItem 
                onClick={() => handleSort("dueDate")}
                className="flex justify-between"
              >
                By Due Date
                {sortConfig.key === "dueDate" && (
                  <Badge variant="secondary" className="ml-1">
                    {sortConfig.direction === "asc" ? "Oldest" : "Newest"}
                  </Badge>
                )}
              </DropdownMenuItem>
              
              <DropdownMenuItem 
                onClick={() => handleSort("tasks.completed")}
                className="flex justify-between"
              >
                By Tasks Completed
                {sortConfig.key === "tasks.completed" && (
                  <Badge variant="secondary" className="ml-1">
                    {sortConfig.direction === "asc" ? "Low-High" : "High-Low"}
                  </Badge>
                )}
              </DropdownMenuItem>
              
              <DropdownMenuItem 
                onClick={() => handleSort("lastUpdate")}
                className="flex justify-between"
              >
                By Last Updated
                {sortConfig.key === "lastUpdate" && (
                  <Badge variant="secondary" className="ml-1">
                    {sortConfig.direction === "asc" ? "Oldest" : "Newest"}
                  </Badge>
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button asChild size="sm">
            <Link
              href={`/ambitions/new`}
              className="ml-auto md:ml-0 flex justify-center items-center gap-1"
            >
              <PlusCircle className="h-4 w-4" />
              New Ambition
            </Link>
          </Button>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
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
              {sortedAndFilteredAmbitions.length > 0 ? (
                sortedAndFilteredAmbitions.map((ambition, index) => (
                  <motion.div
                    key={ambition.id}
                    variants={item}
                    transition={{ duration: 0.3, delay: 0.05 * index }}
                  >
                    <Link href={`/ambitions/${ambition.id}`}>
                      <Card className="cursor-pointer hover:shadow-md transition-all hover:translate-y-[-2px] duration-300">
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <motion.div
                                className={`w-3 h-3 rounded-full ${ambition.color}`}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{
                                  duration: 0.3,
                                  delay: 0.2 + 0.1 * index,
                                }}
                              ></motion.div>
                              <Badge variant="outline">{ambition.category}</Badge>
                            </div>
                            <Badge
                              variant={
                                ambition.priority === "high"
                                  ? "destructive"
                                  : ambition.priority === "medium"
                                  ? "default"
                                  : "secondary"
                              }
                              className="text-xs"
                            >
                              {ambition.priority}
                            </Badge>
                          </div>
                          <CardTitle className="mt-2">
                            {searchQuery ? highlightText(ambition.title, searchQuery) : ambition.title}
                          </CardTitle>
                          <CardDescription className="line-clamp-2">
                            {searchQuery ? highlightText(ambition.description, searchQuery) : ambition.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <div className="space-y-4">
                            <div>
                              <div className="flex justify-between mb-1 text-sm">
                                <span>Progress</span>
                                <span>{ambition.progress}%</span>
                              </div>
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: "100%" }}
                                transition={{
                                  duration: 0.5,
                                  delay: 0.3 + 0.1 * index,
                                }}
                              >
                                <Progress
                                  value={ambition.progress}
                                  className="h-2"
                                />
                              </motion.div>
                            </div>
                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <CheckCircleIcon className="h-3.5 w-3.5" />
                                <span>
                                  {ambition.tasks.completed}/
                                  {ambition.tasks.total} tasks
                                </span>
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
                            <motion.div
                              whileHover={{ x: 3 }}
                              transition={{ duration: 0.2 }}
                            >
                              <ChevronRight className="h-4 w-4" />
                            </motion.div>
                          </div>
                        </CardFooter>
                      </Card>
                    </Link>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  className="col-span-full text-center py-10 text-muted-foreground"
                  variants={item}
                >
                  <Filter className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p>No ambitions match your filters</p>
                  <Button onClick={clearFilters} variant="ghost" size="sm" className="mt-2">
                    Clear filters
                  </Button>
                </motion.div>
              )}
            </motion.div>
          </TabsContent>

          <TabsContent value="active">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-10 text-muted-foreground"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <Target className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>Active ambitions will appear here</p>
              </motion.div>
            </motion.div>
          </TabsContent>

          <TabsContent value="completed">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-10 text-muted-foreground"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <CheckCircleIcon className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>Completed ambitions will appear here</p>
              </motion.div>
            </motion.div>
          </TabsContent>

          <TabsContent value="archive">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-10 text-muted-foreground"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <Folder className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>Archived ambitions will appear here</p>
              </motion.div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
