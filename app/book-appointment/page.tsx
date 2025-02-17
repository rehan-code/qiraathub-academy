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
                  Choose your preferred appointment date
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                  minDate={new Date()}
                  dateFormat="MMMM d, yyyy"
                  inline
                  calendarClassName="!w-full"
                />
              </CardContent>
            </Card>

            {/* Time and Course Selection */}
            <Card className="md:order-2">
              <CardHeader>
                <CardTitle>Appointment Details</CardTitle>
                <CardDescription>
                  Select your preferred time and course
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    {/* Selected Date Display */}
                    {selectedDate && (
                      <div className="p-3 bg-slate-50 rounded-lg">
                        <p className="text-sm text-slate-500">Selected Date</p>
                        <p className="font-medium">
                          {format(selectedDate, "MMMM d, yyyy")}
                        </p>
                      </div>
                    )}

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
