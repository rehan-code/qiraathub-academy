import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, User2 } from 'lucide-react';
import CourseContent from './CourseContent';
import coursesData from '@/data/coursesData';

export default async function CourseResourcePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await Promise.resolve(params);
  const { slug } = resolvedParams;
  const course = coursesData[slug];

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Course not found</h1>
        <Link href="/courses" className="text-theme_primary hover:underline">
          Return to courses
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      {/* Header with course info */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-8">
          <Link 
            href="/courses" 
            className="inline-flex items-center text-gray-600 hover:text-theme_primary mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to courses
          </Link>
          
          <div className="flex flex-col md:flex-row gap-6">
            <div className="relative w-full md:w-64 h-48 rounded-lg overflow-hidden">
              <Image
                src={course.image}
                alt={course.title}
                fill
                className="object-cover"
              />
            </div>
            
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
              <p className="text-gray-600 mb-4">{course.description}</p>
              
              <div className="flex items-center mb-4">
                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200 mr-3 flex items-center justify-center">
                  {course.instructorImage ? (
                    <Image
                      src={course.instructorImage}
                      alt={course.instructor}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="text-gray-500 h-6 w-6">
                      <User2 className="h-full w-full" />
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-medium">{course.instructor}</p>
                  <p className="text-sm text-gray-500">{course.instructorTitle}</p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <div className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                  {course.totalVideos} videos
                </div>
                <div className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                  {course.totalHours} hours
                </div>
                <div className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                  {course.resources.length} resources
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content - Client Component */}
      <CourseContent course={course} />
    </div>
  );
}
