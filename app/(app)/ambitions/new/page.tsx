"use client";

import { useState } from "react";
import { motion } from "framer-motion"; // Add this import for animations
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import {
  CalendarIcon,
  CheckIcon,
  ChevronLeftIcon,
  ListBulletIcon,
  MixerHorizontalIcon,
  PlusCircledIcon,
  Cross1Icon,
} from "@radix-ui/react-icons";
// Import any missing icons from Lucide as fallback
import { Milestone, Tag as TagIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function CreateNewAmbition() {
  const [date, setDate] = useState<Date>();
  const [progress, setProgress] = useState(0);
  const [milestones, setMilestones] = useState<string[]>([]);
  const [newMilestone, setNewMilestone] = useState("");
  const [selectedColor, setSelectedColor] = useState("blue");

  const addMilestone = () => {
    if (newMilestone.trim()) {
      setMilestones([...milestones, newMilestone]);
      setNewMilestone("");
    }
  };

  const removeMilestone = (index: number) => {
    setMilestones(milestones.filter((_, i) => i !== index));
  };

  const colorOptions = [
    { name: "Blue", value: "blue", class: "bg-blue-500" },
    { name: "Green", value: "green", class: "bg-green-500" },
    { name: "Purple", value: "purple", class: "bg-purple-500" },
    { name: "Amber", value: "amber", class: "bg-amber-500" },
    { name: "Red", value: "red", class: "bg-red-500" },
    { name: "Pink", value: "pink", class: "bg-pink-500" },
    { name: "Indigo", value: "indigo", class: "bg-indigo-500" },
    { name: "Teal", value: "teal", class: "bg-teal-500" },
  ];

  return (
    <div className="container max-w-4xl space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold">Create New Ambition</h1>
          <p className="text-muted-foreground">Define your goal and set up tracking parameters</p>
        </div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Button asChild variant="ghost" size="sm">
            <Link href="/ambitions" className="gap-1 flex justify-center items-center">
            <ChevronLeftIcon className="h-4 w-4" />
            Back to Ambitions
            </Link>
          </Button>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Tabs defaultValue="basics" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basics">Basic Details</TabsTrigger>
            <TabsTrigger value="tracking">Progress Tracking</TabsTrigger>
            <TabsTrigger value="tasks">Tasks & Milestones</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basics" className="space-y-6 mt-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Ambition Details</CardTitle>
                  <CardDescription>Define what you want to accomplish</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" placeholder="E.g. Learn Spanish, Run a Marathon..." />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                      id="description" 
                      placeholder="Describe your ambition in detail..."
                      className="min-h-[120px]"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select>
                        <SelectTrigger id="category">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="learning">Learning</SelectItem>
                          <SelectItem value="fitness">Fitness</SelectItem>
                          <SelectItem value="career">Career</SelectItem>
                          <SelectItem value="finance">Finance</SelectItem>
                          <SelectItem value="personal">Personal</SelectItem>
                          <SelectItem value="health">Health</SelectItem>
                          <SelectItem value="creative">Creative</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Priority Level</Label>
                      <RadioGroup defaultValue="medium" className="flex gap-4">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="high" id="high" />
                          <Label htmlFor="high" className="text-red-500 font-medium">High</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="medium" id="medium" />
                          <Label htmlFor="medium" className="text-amber-500 font-medium">Medium</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="low" id="low" />
                          <Label htmlFor="low" className="text-blue-500 font-medium">Low</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Due Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, "PPP") : <span>Select a due date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Color</Label>
                      <div className="grid grid-cols-4 gap-2">
                        {colorOptions.map((color, index) => (
                          <motion.div 
                            key={color.value}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.2, delay: 0.1 + (index * 0.05) }}
                            className={cn(
                              "w-full h-10 rounded-md cursor-pointer flex items-center justify-center",
                              color.class,
                              selectedColor === color.value ? "ring-2 ring-offset-2" : ""
                            )}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedColor(color.value)}
                          >
                            {selectedColor === color.value && 
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.2 }}
                              >
                                <CheckIcon className="h-4 w-4 text-white" />
                              </motion.div>
                            }
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Additional Settings</CardTitle>
                  <CardDescription>Configure additional options for your ambition</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between space-x-2">
                    <div>
                      <p className="font-medium">Make this ambition public</p>
                      <p className="text-sm text-muted-foreground">Share your progress with followers</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between space-x-2">
                    <div>
                      <p className="font-medium">Send regular reminders</p>
                      <p className="text-sm text-muted-foreground">Get notifications to keep you on track</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between space-x-2">
                    <div>
                      <p className="font-medium">Add to focus dashboard</p>
                      <p className="text-sm text-muted-foreground">Display this ambition on your dashboard</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
          
          <TabsContent value="tracking" className="space-y-6 mt-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Progress Settings</CardTitle>
                  <CardDescription>Define how you&apos;ll track progress for this ambition</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <Label>Current Progress</Label>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>0%</span>
                        <span className="font-medium">{progress}%</span>
                        <span>100%</span>
                      </div>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                      >
                        <Slider
                          value={[progress]}
                          onValueChange={(value) => setProgress(value[0])}
                          max={100}
                          step={5}
                        />
                      </motion.div>
                      <p className="text-sm text-muted-foreground">
                        Set the initial progress if you&apos;ve already started working on this ambition
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Tracking Method</Label>
                    <RadioGroup defaultValue="percentage" className="space-y-3">
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                        className="flex items-start space-x-3"
                      >
                        <RadioGroupItem value="percentage" id="percentage" className="mt-1" />
                        <div>
                          <Label htmlFor="percentage" className="font-medium">Percentage Based</Label>
                          <p className="text-sm text-muted-foreground">Track overall completion as a percentage</p>
                        </div>
                      </motion.div>
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                        className="flex items-start space-x-3"
                      >
                        <RadioGroupItem value="milestone" id="milestone" className="mt-1" />
                        <div>
                          <Label htmlFor="milestone" className="font-medium">Milestone Based</Label>
                          <p className="text-sm text-muted-foreground">Track progress through specific milestones</p>
                        </div>
                      </motion.div>
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.3 }}
                        className="flex items-start space-x-3"
                      >
                        <RadioGroupItem value="task" id="task" className="mt-1" />
                        <div>
                          <Label htmlFor="task" className="font-medium">Task Based</Label>
                          <p className="text-sm text-muted-foreground">Track progress by completing tasks</p>
                        </div>
                      </motion.div>
                    </RadioGroup>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Measurement & Analytics</CardTitle>
                  <CardDescription>How do you want to measure success?</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="success-metric">Success Metric</Label>
                    <Input id="success-metric" placeholder="E.g. 5 kilometers, Conversational proficiency, etc." />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Track Time Spent</Label>
                    <Select defaultValue="yes">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes, track time spent</SelectItem>
                        <SelectItem value="no">No, don&apos;t track time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center justify-between space-x-2">
                    <div>
                      <p className="font-medium">Use AI insights</p>
                      <p className="text-sm text-muted-foreground">Get AI-powered suggestions to improve your progress</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
          
          <TabsContent value="tasks" className="space-y-6 mt-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Milestones</CardTitle>
                  <CardDescription>Define key checkpoints for your ambition</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <Input 
                        placeholder="Add a milestone..." 
                        value={newMilestone}
                        onChange={(e) => setNewMilestone(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addMilestone()}
                      />
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button onClick={addMilestone} type="button" size="sm">
                          <PlusCircledIcon className="h-4 w-4 mr-1" /> Add
                        </Button>
                      </motion.div>
                    </div>
                    
                    <div className="space-y-2">
                      {milestones.length === 0 ? (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5 }}
                          className="text-center py-4 text-muted-foreground"
                        >
                          <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.3, delay: 0.2 }}
                          >
                            <Milestone className="h-12 w-12 mx-auto mb-2 opacity-20" />
                            <p>No milestones added yet</p>
                          </motion.div>
                        </motion.div>
                      ) : (
                        <div className="space-y-2">
                          {milestones.map((milestone, index) => (
                            <motion.div 
                              key={index} 
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: 0.1 * index }}
                              className="flex items-center justify-between p-3 border rounded-md"
                            >
                              <div className="flex items-center gap-2">
                                <MixerHorizontalIcon className="h-4 w-4 text-primary" />
                                <span>{milestone}</span>
                              </div>
                              <motion.div
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => removeMilestone(index)}
                                >
                                  <Cross1Icon className="h-4 w-4" />
                                </Button>
                              </motion.div>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Initial Tasks</CardTitle>
                  <CardDescription>Create a few initial tasks to get started</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <Input placeholder="Add a task..." />
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button type="button" size="sm">
                          <PlusCircledIcon className="h-4 w-4 mr-1" /> Add
                        </Button>
                      </motion.div>
                    </div>
                    
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      className="text-center py-4 text-muted-foreground"
                    >
                      <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                      >
                        <ListBulletIcon className="h-16 w-16 mx-auto mb-2 opacity-20" />
                        <p>No tasks added yet</p>
                        <p className="text-sm">Add some tasks to get started</p>
                      </motion.div>
                    </motion.div>
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
                  <CardTitle>Tags & Labels</CardTitle>
                  <CardDescription>Organize your ambition with tags</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <Input placeholder="Add a tag..." />
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button type="button" size="sm">
                          <TagIcon className="h-4 w-4 mr-1" /> Add
                        </Button>
                      </motion.div>
                    </div>
                    
                    <div className="flex gap-2 flex-wrap">
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                      >
                        <Badge variant="secondary" className="flex items-center gap-1 py-1 px-3">
                          self-improvement
                          <Cross1Icon className="h-3 w-3 ml-1 cursor-pointer" />
                        </Badge>
                      </motion.div>
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                      >
                        <Badge variant="secondary" className="flex items-center gap-1 py-1 px-3">
                          personal-growth
                          <Cross1Icon className="h-3 w-3 ml-1 cursor-pointer" />
                        </Badge>
                      </motion.div>
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.3 }}
                        whileHover={{ scale: 1.05 }}
                      >
                        <Badge variant="outline" className="border-dashed">
                          Add tag...
                        </Badge>
                      </motion.div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="flex justify-end gap-2"
      >
        <Button variant="outline">Cancel</Button>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button>Create Ambition</Button>
        </motion.div>
      </motion.div>
    </div>
  );
}