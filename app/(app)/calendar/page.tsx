"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format, isSameDay, addDays } from "date-fns";
import { 
  CalendarIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  ClockIcon, 
  InfoCircledIcon, 
  ListBulletIcon, 
  MixerHorizontalIcon, 
  PlusIcon, 
  PlusCircledIcon, 
  TargetIcon 
} from "@radix-ui/react-icons";
// Keep Lucide icons that don't have good Radix alternatives
import { ListTodo } from "lucide-react";

export default function CalendarPage() {
  const [date, setDate] = useState<Date>(new Date());
  const [view, setView] = useState<"month" | "week" | "day">("month");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Example events data - in a real app, this would come from your backend
  const events = [
    {
      id: 1,
      title: "Complete project presentation",
      ambition: "Work Promotion",
      date: new Date(),
      time: "14:00",
      color: "bg-blue-500",
      type: "task"
    },
    {
      id: 2,
      title: "Language practice",
      ambition: "Learn Spanish",
      date: new Date(),
      time: "16:30",
      color: "bg-green-500",
      type: "task"
    },
    {
      id: 3,
      title: "5K training run",
      ambition: "Marathon Preparation",
      date: new Date(),
      time: "18:00",
      color: "bg-purple-500",
      type: "task"
    },
    {
      id: 4,
      title: "Read finance book",
      ambition: "Finance Knowledge",
      date: addDays(new Date(), 1),
      time: "20:00",
      color: "bg-amber-500",
      type: "task"
    },
    {
      id: 5,
      title: "Project Milestone",
      ambition: "Work Promotion",
      date: addDays(new Date(), 2),
      time: "11:00",
      color: "bg-blue-500",
      type: "milestone"
    },
    {
      id: 6,
      title: "Spanish lesson",
      ambition: "Learn Spanish",
      date: addDays(new Date(), 3),
      time: "17:00",
      color: "bg-green-500",
      type: "recurring"
    }
  ];

  const dayView = selectedDate ? events.filter(event => 
    selectedDate && isSameDay(event.date, selectedDate)
  ) : [];

  function getEventsByDate(date: Date) {
    return events.filter(event => isSameDay(event.date, date));
  }

  function renderDateCell(date: Date) {
    const eventsOnDate = getEventsByDate(date);
    if (eventsOnDate.length === 0) return null;
    
    return (
      <div className="absolute bottom-1 left-0 right-0 flex justify-center gap-0.5">
        {eventsOnDate.length > 0 && (
          <div className="flex gap-0.5 justify-center">
            {eventsOnDate.length <= 3 ? (
              eventsOnDate.map((event, i) => (
                <div 
                  key={i} 
                  className={`h-1 w-1 rounded-full ${event.color}`}
                />
              ))
            ) : (
              <>
                {eventsOnDate.slice(0, 2).map((event, i) => (
                  <div 
                    key={i} 
                    className={`h-1 w-1 rounded-full ${event.color}`}
                  />
                ))}
                <div className="h-1 w-1 rounded-full bg-gray-400" />
              </>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Calendar</h1>
          <p className="text-muted-foreground">Manage your ambitions and schedule</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <MixerHorizontalIcon className="h-4 w-4" />
            Filter
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" className="flex items-center gap-2">
                <PlusCircledIcon className="h-4 w-4" />
                Add Event
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Event</DialogTitle>
                <DialogDescription>
                  Create a new event or task for your calendar
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" placeholder="Event title" />
                </div>
                <div className="grid gap-2">
                  <Label>Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, "PPP") : <span>Select date</span>}
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
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="time">Time</Label>
                  <Input id="time" type="time" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="ambition">Related Ambition</Label>
                  <Select>
                    <SelectTrigger id="ambition">
                      <SelectValue placeholder="Select an ambition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="work">Work Promotion</SelectItem>
                      <SelectItem value="spanish">Learn Spanish</SelectItem>
                      <SelectItem value="marathon">Marathon Preparation</SelectItem>
                      <SelectItem value="finance">Finance Knowledge</SelectItem>
                      <SelectItem value="none">No Related Ambition</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Create Event</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={() => setView("month")}>
                <CalendarIcon className={cn(
                  "h-4 w-4",
                  view === "month" ? "text-primary" : "text-muted-foreground"
                )} />
              </Button>
              <Button variant="outline" size="icon" onClick={() => setView("week")}>
                <ListBulletIcon className={cn(
                  "h-4 w-4",
                  view === "week" ? "text-primary" : "text-muted-foreground"
                )} />
              </Button>
              <Button variant="outline" size="icon" onClick={() => setView("day")}>
                <ClockIcon className={cn(
                  "h-4 w-4",
                  view === "day" ? "text-primary" : "text-muted-foreground"
                )} />
              </Button>
              <div className="w-px h-6 bg-border mx-2" />
              <div className="flex items-center">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setDate(prev => {
                    const newDate = new Date(prev);
                    newDate.setMonth(prev.getMonth() - 1);
                    return newDate;
                  })}
                >
                  <ChevronLeftIcon className="h-4 w-4" />
                </Button>
                <h3 className="text-lg font-medium px-2">
                  {format(date, view === "month" ? "MMMM yyyy" : "PP")}
                </h3>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setDate(prev => {
                    const newDate = new Date(prev);
                    newDate.setMonth(prev.getMonth() + 1);
                    return newDate;
                  })}
                >
                  <ChevronRightIcon className="h-4 w-4" />
                </Button>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setDate(new Date())}
                className="ml-2"
              >
                Today
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {view === "month" && (
            <div className="pt-3">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                month={date}
                onMonthChange={setDate}
                className="rounded-md border w-full"
                components={{
                  Day: ({ date, ...props }) => {
                    return (
                      <div className="relative h-9 w-9 p-0" {...props}>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div>{date.getDate()}</div>
                        </div>
                        {renderDateCell(date)}
                      </div>
                    );
                  },
                }}
              />
            </div>
          )}
          
          {view === "week" && (
            <div className="space-y-1 pt-2">
              {Array.from({ length: 7 }).map((_, i) => {
                const currentDate = addDays(date, i);
                const dayEvents = getEventsByDate(currentDate);
                
                return (
                  <div 
                    key={i} 
                    className="flex py-2 hover:bg-accent/50 rounded-md cursor-pointer"
                    onClick={() => setSelectedDate(currentDate)}
                  >
                    <div className="w-16 font-medium text-center">
                      <div className="text-xs text-muted-foreground">{format(currentDate, "EEE")}</div>
                      <div className={cn(
                        "h-7 w-7 rounded-full flex items-center justify-center mx-auto mt-1",
                        isSameDay(currentDate, new Date()) ? "bg-primary text-primary-foreground" : ""
                      )}>
                        {format(currentDate, "d")}
                      </div>
                    </div>
                    <div className="flex-1 space-y-1">
                      {dayEvents.length > 0 ? (
                        dayEvents.map((event, i) => (
                          <div 
                            key={i} 
                            className="flex items-center rounded-md px-3 py-1 text-sm"
                          >
                            <div className={`w-2 h-2 rounded-full ${event.color} mr-2`} />
                            <span className="font-medium">{event.time}</span>
                            <span className="mx-2 flex-1">{event.title}</span>
                            <Badge variant="outline" className="ml-auto">{event.ambition}</Badge>
                          </div>
                        ))
                      ) : (
                        <div className="px-3 py-1 text-sm text-muted-foreground italic">
                          No events
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          
          {view === "day" && selectedDate && (
            <div className="space-y-6 pt-2">
              <div className="text-center py-3 border-b">
                <h2 className="text-xl font-semibold">{format(selectedDate, "EEEE")}</h2>
                <p className="text-muted-foreground">{format(selectedDate, "MMMM d, yyyy")}</p>
              </div>
              
              {dayView.length > 0 ? (
                <div className="space-y-4">
                  {dayView.map((event, i) => (
                    <div 
                      key={i} 
                      className={`border rounded-lg p-4 relative ${
                        event.type === 'milestone' ? 'border-amber-500/50 bg-amber-50/50 dark:bg-amber-950/10' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${event.color}`} />
                            <h3 className="font-medium">{event.title}</h3>
                          </div>
                          <p className="text-sm text-muted-foreground flex items-center gap-2">
                            <ClockIcon className="h-3 w-3" />
                            {event.time}
                          </p>
                        </div>
                        <Badge variant="outline">
                          {event.ambition}
                        </Badge>
                      </div>
                      
                      {event.type === 'milestone' && (
                        <div className="flex items-center mt-3 text-sm text-amber-600 dark:text-amber-500">
                          <TargetIcon className="h-4 w-4 mr-2" />
                          Milestone event
                        </div>
                      )}
                      
                      {event.type === 'recurring' && (
                        <div className="flex items-center mt-3 text-sm text-blue-600 dark:text-blue-500">
                          <InfoCircledIcon className="h-4 w-4 mr-2" />
                          Recurring event
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <ListBulletIcon className="h-12 w-12 mx-auto text-muted-foreground opacity-20" />
                  <h3 className="mt-2 font-medium">No events scheduled</h3>
                  <p className="text-sm text-muted-foreground">Add an event to get started</p>
                  <Button className="mt-4" variant="outline" size="sm">
                    <PlusIcon className="h-4 w-4 mr-1" />
                    Add Event
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      
      {selectedDate && dayView.length > 0 && view !== "day" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Events on {format(selectedDate, "MMMM d, yyyy")}</CardTitle>
            <CardDescription>
              {dayView.length} {dayView.length === 1 ? 'event' : 'events'} scheduled
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dayView.map((event, i) => (
                <div key={i} className="flex items-center justify-between p-3 border rounded-md">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-full min-h-[24px] rounded-full ${event.color}`} />
                    <div>
                      <p className="font-medium">{event.title}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <ClockIcon className="h-3 w-3" />
                        {event.time}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline">{event.ambition}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" className="ml-auto" onClick={() => setView("day")}>
              View Full Day
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}