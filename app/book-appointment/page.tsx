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

// Available time slots
const TIME_SLOTS = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
];

// Sample courses - replace with your actual courses
const COURSES = [
  { id: 1, name: "Quran Reading" },
  { id: 2, name: "Tajweed" },
  { id: 3, name: "Hifz Program" },
  { id: 4, name: "Islamic Studies" },
];

export default function BookAppointment() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedCourse, setSelectedCourse] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedTime || !selectedCourse) {
      alert("Please fill in all fields");
      return;
    }

    const appointmentData = {
      date: format(selectedDate, "yyyy-MM-dd"),
      time: selectedTime,
      course: selectedCourse,
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
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Book an Appointment</CardTitle>
          <CardDescription>
            Select your preferred date, time, and course for the appointment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Date Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Select Date
              </label>
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                minDate={new Date()}
                dateFormat="MMMM d, yyyy"
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                placeholderText="Choose a date"
              />
            </div>

            {/* Time Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Select Time
              </label>
              <Select onValueChange={setSelectedTime}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a time" />
                </SelectTrigger>
                <SelectContent>
                  {TIME_SLOTS.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Course Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Select Course
              </label>
              <Select onValueChange={setSelectedCourse}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a course" />
                </SelectTrigger>
                <SelectContent>
                  {COURSES.map((course) => (
                    <SelectItem key={course.id} value={course.name}>
                      {course.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              className="w-full bg-theme_primary hover:bg-theme_primary/90"
            >
              Book Appointment
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
