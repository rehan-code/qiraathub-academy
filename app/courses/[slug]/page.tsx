import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, BookOpen, User2 } from 'lucide-react';
import CourseContent from './CourseContent';

// Define the course content type
interface Video {
  id: number;
  title: string;
  duration: string;
  url: string;
  thumbnail: string;
  completed?: boolean;
}

interface Resource {
  id: number;
  title: string;
  type: 'pdf' | 'doc' | 'quiz';
  url: string;
}

interface CourseData {
  id: number;
  slug: string;
  title: string;
  description: string;
  image: string;
  instructor: string;
  instructorTitle: string;
  instructorImage?: string; // Made optional with the ? operator
  totalVideos: number;
  totalHours: string;
  videos: Video[];
  resources: Resource[];
}

// Mock data for courses
const coursesData: Record<string, CourseData> = {
  "hamzah-al-kofi": {
    id: 1,
    slug: "hamzah-al-kofi",
    title: "Hamzah al Kofi",
    description: "This comprehensive course covers the Qira'at of Hamzah al Kofi, one of the seven canonical Qira'at. You'll learn the unique recitation style, rules, and methodologies associated with this reading.",
    image: "https://old.qiraathub.com/wp-content/uploads/2024/09/book-quran-scripture-8224121-1-768x512.png",
    instructor: "Sheikh Abdullah",
    instructorTitle: "Qira'at Specialist",
    totalVideos: 12,
    totalHours: "8.5",
    videos: [
      {
        id: 1,
        title: "Introduction to Hamzah al Kofi",
        duration: "15:30",
        url: "https://example.com/video1",
        thumbnail: "https://old.qiraathub.com/wp-content/uploads/2024/09/book-quran-scripture-8224121-1-768x512.png",
        completed: true
      },
      {
        id: 2,
        title: "Historical Background",
        duration: "22:45",
        url: "https://example.com/video2",
        thumbnail: "https://old.qiraathub.com/wp-content/uploads/2024/09/book-quran-scripture-8224121-1-768x512.png",
        completed: true
      },
      {
        id: 3,
        title: "Unique Recitation Rules - Part 1",
        duration: "35:10",
        url: "https://example.com/video3",
        thumbnail: "https://old.qiraathub.com/wp-content/uploads/2024/09/book-quran-scripture-8224121-1-768x512.png"
      },
      {
        id: 4,
        title: "Unique Recitation Rules - Part 2",
        duration: "28:15",
        url: "https://example.com/video4",
        thumbnail: "https://old.qiraathub.com/wp-content/uploads/2024/09/book-quran-scripture-8224121-1-768x512.png"
      },
      {
        id: 5,
        title: "Practical Application - Surah Al-Fatiha",
        duration: "42:20",
        url: "https://example.com/video5",
        thumbnail: "https://old.qiraathub.com/wp-content/uploads/2024/09/book-quran-scripture-8224121-1-768x512.png"
      }
    ],
    resources: [
      {
        id: 1,
        title: "Hamzah al Kofi Study Guide",
        type: "pdf",
        url: "/resources/hamzah-guide.pdf"
      },
      {
        id: 2,
        title: "Recitation Practice Sheet",
        type: "doc",
        url: "/resources/practice-sheet.doc"
      },
      {
        id: 3,
        title: "Module 1 Assessment",
        type: "quiz",
        url: "/quizzes/module1"
      }
    ]
  },
  "asim-al-koofi": {
    id: 2,
    slug: "asim-al-koofi",
    title: "Asim al Koofi",
    description: "Master the Qira'at of Asim al Koofi through this detailed course. Learn the distinctive features and rules of this widely practiced recitation style.",
    image: "https://old.qiraathub.com/wp-content/uploads/2024/09/an-quran-scripture-7741928-1-768x513.jpg",
    instructor: "Sheikh Muhammad",
    instructorTitle: "Hafiz & Qira'at Teacher",
    totalVideos: 15,
    totalHours: "10.2",
    videos: [
      {
        id: 1,
        title: "Introduction to Asim al Koofi",
        duration: "18:45",
        url: "https://example.com/asim-video1",
        thumbnail: "https://old.qiraathub.com/wp-content/uploads/2024/09/an-quran-scripture-7741928-1-768x513.jpg",
        completed: true
      },
      {
        id: 2,
        title: "Historical Context",
        duration: "25:30",
        url: "https://example.com/asim-video2",
        thumbnail: "https://old.qiraathub.com/wp-content/uploads/2024/09/an-quran-scripture-7741928-1-768x513.jpg"
      },
      {
        id: 3,
        title: "Recitation Methodology",
        duration: "32:15",
        url: "https://example.com/asim-video3",
        thumbnail: "https://old.qiraathub.com/wp-content/uploads/2024/09/an-quran-scripture-7741928-1-768x513.jpg"
      }
    ],
    resources: [
      {
        id: 1,
        title: "Asim al Koofi Reference Guide",
        type: "pdf",
        url: "/resources/asim-guide.pdf"
      },
      {
        id: 2,
        title: "Practice Exercises",
        type: "doc",
        url: "/resources/asim-exercises.doc"
      }
    ]
  },
  "ibn-amir-dimashqi": {
    id: 3,
    slug: "ibn-amir-dimashqi",
    title: "Ibn Amir Dimashqi",
    description: "Explore the Qira'at of Ibn Amir Dimashqi, the prominent reciter from Damascus. This course covers all aspects of this important recitation tradition.",
    image: "https://old.qiraathub.com/wp-content/uploads/2024/09/quran-islam-book-6862296-1-768x512.jpg",
    instructor: "Sheikh Ahmad",
    instructorTitle: "Qira'at Master",
    totalVideos: 14,
    totalHours: "9.5",
    videos: [
      {
        id: 1,
        title: "Introduction to Ibn Amir's Qira'at",
        duration: "20:15",
        url: "https://example.com/ibn-amir-video1",
        thumbnail: "https://old.qiraathub.com/wp-content/uploads/2024/09/quran-islam-book-6862296-1-768x512.jpg",
        completed: true
      },
      {
        id: 2,
        title: "Distinctive Features",
        duration: "28:40",
        url: "https://example.com/ibn-amir-video2",
        thumbnail: "https://old.qiraathub.com/wp-content/uploads/2024/09/quran-islam-book-6862296-1-768x512.jpg"
      }
    ],
    resources: [
      {
        id: 1,
        title: "Ibn Amir Comprehensive Guide",
        type: "pdf",
        url: "/resources/ibn-amir-guide.pdf"
      }
    ]
  },
  "abu-amr-al-basri": {
    id: 4,
    slug: "abu-amr-al-basri",
    title: "Abu Amr Al Basri",
    description: "Learn the Qira'at of Abu Amr Al Basri in this detailed course covering all aspects of this important recitation tradition.",
    image: "https://old.qiraathub.com/wp-content/uploads/2024/09/book-quran-open-1283468-1-768x512.jpg",
    instructor: "Sheikh Yusuf",
    instructorTitle: "Qira'at Scholar",
    totalVideos: 13,
    totalHours: "8.8",
    videos: [
      {
        id: 1,
        title: "Introduction to Abu Amr's Qira'at",
        duration: "19:30",
        url: "https://example.com/abu-amr-video1",
        thumbnail: "https://old.qiraathub.com/wp-content/uploads/2024/09/book-quran-open-1283468-1-768x512.jpg",
        completed: true
      }
    ],
    resources: [
      {
        id: 1,
        title: "Abu Amr Study Materials",
        type: "pdf",
        url: "/resources/abu-amr-materials.pdf"
      }
    ]
  },
  "ibn-kathir": {
    id: 5,
    slug: "ibn-kathir",
    title: "Ibn Kathir",
    description: "A comprehensive course on the Qira'at of Ibn Kathir, covering the unique aspects and rules of this recitation tradition.",
    image: "https://old.qiraathub.com/wp-content/uploads/2024/09/quran_read20-1280x640-1-768x384.jpg",
    instructor: "Sheikh Ibrahim",
    instructorTitle: "Senior Qira'at Instructor",
    totalVideos: 16,
    totalHours: "11.2",
    videos: [
      {
        id: 1,
        title: "Introduction to Ibn Kathir's Qira'at",
        duration: "22:10",
        url: "https://example.com/ibn-kathir-video1",
        thumbnail: "https://old.qiraathub.com/wp-content/uploads/2024/09/quran_read20-1280x640-1-768x384.jpg",
        completed: true
      }
    ],
    resources: [
      {
        id: 1,
        title: "Ibn Kathir Reference Guide",
        type: "pdf",
        url: "/resources/ibn-kathir-guide.pdf"
      }
    ]
  },
  "nafi-al-madani": {
    id: 6,
    slug: "nafi-al-madani",
    title: "Nafi' Al Madani",
    description: "Master the Qira'at of Nafi' Al Madani through this detailed course covering all aspects of this important recitation tradition.",
    image: "https://old.qiraathub.com/wp-content/uploads/2024/09/quran-islam-laptop-wallpaper-6114872-1-768x512.jpg",
    instructor: "Sheikh Khalid",
    instructorTitle: "Qira'at Expert",
    totalVideos: 15,
    totalHours: "10.5",
    videos: [
      {
        id: 1,
        title: "Introduction to Nafi's Qira'at",
        duration: "21:45",
        url: "https://example.com/nafi-video1",
        thumbnail: "https://old.qiraathub.com/wp-content/uploads/2024/09/quran-islam-laptop-wallpaper-6114872-1-768x512.jpg",
        completed: true
      }
    ],
    resources: [
      {
        id: 1,
        title: "Nafi' Al Madani Study Guide",
        type: "pdf",
        url: "/resources/nafi-guide.pdf"
      }
    ]
  }
};

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
