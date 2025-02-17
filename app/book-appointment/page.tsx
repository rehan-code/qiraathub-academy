"use client";

import { useState } from "react";
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
import "react-datepicker/dist/react-datepicker.css";

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

// Sample courses with duration in hours
const COURSES = [
  { id: 1, name: "Quran Reading", duration: 1 },
  { id: 2, name: "Tajweed", duration: 1.5 },
  { id: 3, name: "Hifz Program", duration: 2 },
  { id: 4, name: "Islamic Studies", duration: 1 },
];

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

export default function BookAppointment() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [timeSlots, setTimeSlots] = useState<string[]>([]);

  // Reset time when course changes
  const handleCourseChange = (courseName: string) => {
    setSelectedCourse(courseName);
    setSelectedTime(""); // Reset selected time
    
    // Find selected course and generate time slots
    const course = COURSES.find(c => c.name === courseName);
    if (course) {
      setTimeSlots(generateTimeSlots(course.duration));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedTime || !selectedCourse) {
      alert("Please fill in all fields");
      return;
    }

    const course = COURSES.find(c => c.name === selectedCourse);
    const appointmentData = {
      date: format(selectedDate, "yyyy-MM-dd"),
      time: selectedTime,
      course: selectedCourse,
      duration: course?.duration,
    };

    // TODO: Add your API endpoint to handle the appointment booking
    try {
      // const response = await fetch("/api/book-appointment", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(appointmentData),
      // });
      
      alert("Appointment booked successfully!"); // Replace with proper notification
    } catch (error) {
      console.error("Error booking appointment:", error);
      alert("Error booking appointment. Please try again."); // Replace with proper error handling
    }
  };

  return (
    <>
      <style>{calendarStyles}</style>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Book an Appointment</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Calendar Section */}
            <Card className="md:order-1">
              <CardHeader>
                <CardTitle>Select Date</CardTitle>
                <CardDescription>
                  Choose your preferred appointment date from the calendar below
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
                <CardTitle>Appointment Details</CardTitle>
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
                    Book Appointment
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
