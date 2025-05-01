"use client";

import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import "react-datepicker/dist/react-datepicker.css";
import { SignedOut, useUser } from "@clerk/nextjs";

// Custom styles for the calendar
const calendarStyles = `
  .react-datepicker {
    font-family: inherit;
    border: none;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
    width: 100%;
  }
  .react-datepicker__month-container {
    float: none;
    width: 100%;
    padding: 0.5rem;
  }
  .react-datepicker__header {
    background-color: white;
    border-bottom: 1px solid #e5e7eb;
    padding-top: 1rem;
  }
  .react-datepicker__current-month {
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }
  .react-datepicker__month {
    margin: 0;
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 0.2rem;
  }
  .react-datepicker__week {
    display: contents;
  }
  .react-datepicker__day-names {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 0.2rem;
    margin-bottom: 0.5rem;
  }
  .react-datepicker__day-name {
    color: #6b7280;
    font-weight: 500;
    margin: 0;
    padding: 0.3rem 0;
    width: auto;
    text-align: center;
  }
  .react-datepicker__day {
    margin: 0;
    width: auto;
    height: auto;
    padding: 0.6rem 0;
    line-height: 1;
    transition: all 0.2s;
  }
  .react-datepicker__day--selected {
    background-color: #2563eb !important;
    color: white !important;
  }
  .react-datepicker__day--keyboard-selected {
    background-color: #93c5fd;
    color: white;
  }
  .react-datepicker__navigation {
    top: 1rem;
  }
`;


// Function to generate time slots based on course duration
const generateTimeSlots = (durationHours: number) => {
  const slots: string[] = [];
  const startHour = 9; // 9 AM
  const endHour = 21; // 8 PM
  
  for (let hour = startHour; hour <= endHour - durationHours; hour++) {
    const time = new Date();
    time.setHours(hour, 0, 0);
    slots.push(time.toLocaleTimeString('en-US', { 
      hour: 'numeric',
      minute: '2-digit',
      hour12: true 
    }));
  }
  
  return slots;
};

export default function BookClass() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const { toast } = useToast();
  const { isLoaded, isSignedIn, user } = useUser();

  // courses
  const COURSES = [
    { id: 1, name: "Trial / Evaluation Class", duration: 1 },
    ...isSignedIn ? [
      { id: 2, name: "Quran Reading", duration: 1 },
      { id: 3, name: "Tajweed", duration: 1.5 },
      { id: 4, name: "Hifz Program", duration: 2 },
      { id: 5, name: "Islamic Studies", duration: 1 },
    ] : []
  ];

  // Autofill email if user is logged in
  useEffect(() => {
    if (isLoaded && isSignedIn && user?.primaryEmailAddress) {
      setEmail(user.primaryEmailAddress.emailAddress);
    }
  }, [isLoaded, isSignedIn, user]);

  // Reset time when course changes
  const handleCourseChange = (courseName: string) => {
    setSelectedCourse(courseName);
    setSelectedTime(""); // Reset selected time
    
    // Find selected course and generate time slots
    const course = COURSES.find(c => c.name === courseName);
    if (course) {
      setTimeSlots(generateTimeSlots(course.duration));
      toast({
        title: "Course Selected",
        description: `Duration: ${course.duration} ${course.duration === 1 ? 'hour' : 'hours'}. Please select your preferred time.`,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedTime || !selectedCourse || !email) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    const course = COURSES.find(c => c.name === selectedCourse);
    const classData = {
      date: format(selectedDate, "yyyy-MM-dd"),
      time: selectedTime,
      course: selectedCourse,
      duration: course?.duration,
      email: email,
    };

    try {
      // Show loading toast
      toast({
        title: "Booking in progress",
        description: "Please wait while we process your booking...",
      });
      
      // Call API endpoint to book class and send email with calendar invite
      const response = await fetch("/api/book-class", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(classData),
      });
      
      if (!response.ok) {
        throw new Error("Failed to book class");
      }
      
      toast({
        title: "Success!",
        description: `Your class for ${selectedCourse} has been booked for ${format(selectedDate, "MMMM d, yyyy")} at ${selectedTime}. A confirmation email with calendar invite has been sent to ${email}.`,
      });

      // Reset form
      setSelectedTime("");
      setSelectedCourse("");
      setEmail("");
      setTimeSlots([]);
    } catch (error) {
      console.error("Error booking class:", error);
      toast({
        title: "Error",
        description: "Error booking class. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <style>{calendarStyles}</style>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Book a Class</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Calendar Section */}
            <Card className="md:order-1">
              <CardHeader>
                <CardTitle>Select Date</CardTitle>
                <CardDescription>
                  Choose your preferred class date from the calendar below
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <DatePicker
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    minDate={new Date()}
                    dateFormat="MMMM d, yyyy"
                    inline
                    calendarClassName="!w-full"
                  />
                  <div className="text-sm text-slate-500">
                    Selected date: {selectedDate ? format(selectedDate, "MMMM d, yyyy") : "Please select a date"}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Time and Course Selection */}
            <Card className="md:order-2">
              <CardHeader>
                <CardTitle>Class Details</CardTitle>
                <CardDescription>
                  Select your course and preferred time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    {/* Selected Date Display */}
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <p className="text-sm text-slate-500">Selected Date</p>
                      <p className="font-medium">
                        {format(selectedDate || new Date(), "MMMM d, yyyy")}
                      </p>
                    </div>
                    {/* Email Field - Only shown when user is not logged in */}
                    <SignedOut  >
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Email Address
                        </label>
                        <div className="relative">
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your.email@example.com"
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-theme_primary focus:border-transparent"
                            required
                          />
                        </div>
                      </div>
                    </SignedOut>

                    {/* Course Selection */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Select Course
                      </label>
                      <Select onValueChange={handleCourseChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a course" />
                        </SelectTrigger>
                        <SelectContent>
                          {COURSES.map((course) => (
                            <SelectItem key={course.id} value={course.name}>
                              {course.name} ({course.duration} {course.duration === 1 ? 'hour' : 'hours'})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Time Selection */}
                    {selectedCourse && (
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Select Time
                        </label>
                        <Select onValueChange={setSelectedTime} value={selectedTime}>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose a time" />
                          </SelectTrigger>
                          <SelectContent>
                            {timeSlots.map((time) => (
                              <SelectItem key={time} value={time}>
                                {time}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <p className="text-sm text-slate-500 mt-1">
                          Duration: {COURSES.find(c => c.name === selectedCourse)?.duration} {
                            COURSES.find(c => c.name === selectedCourse)?.duration === 1 ? 'hour' : 'hours'
                          }
                        </p>
                      </div>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-theme_primary hover:bg-theme_primary/90"
                    disabled={!selectedDate || !selectedTime || !selectedCourse}
                  >
                    Book Class
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Toaster />
    </>
  );
}
