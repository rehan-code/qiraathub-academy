import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CourseData } from '@/data/coursesData';
import { BookOpen } from 'lucide-react';

const CoursesPage = () => {
  const courses: CourseData[] = []; // change to coursesData from coursesData.ts when ready

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Qira&apos;at Courses</h1>
      
      {courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative w-full h-48">
                <Image
                  src={course.image}
                  alt={course.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2">{course.title}</h2>
                <p className="text-gray-600 mb-4">{course.description}</p>
                <Link 
                  href={`/courses/${course.slug}`}
                  className="inline-block bg-theme_primary text-white px-4 py-2 rounded-md hover:bg-theme_primary/90 transition-colors duration-300"
                >
                  Enroll Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <div className="bg-gray-100 rounded-full p-6 mb-6">
            <BookOpen
              className="h-16 w-16 text-theme_primary"
              aria-hidden="true"
            />
          </div>
          <h2 className="text-2xl font-bold mb-2">Courses Coming Soon</h2>
          <p className="text-gray-600 max-w-md mb-6">
            We are currently preparing high-quality Qira&apos;at courses for you. 
            Please check back soon for our upcoming course offerings.
          </p>
          <Link 
            href="/" 
            className="inline-block bg-theme_primary text-white px-6 py-3 rounded-md hover:bg-theme_primary/90 transition-colors duration-300"
          >
            Back to Home
          </Link>
        </div>
      )}
    </div>
  );
};

export default CoursesPage;
