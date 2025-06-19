// Define the course content type
export interface Video {
  id: number;
  title: string;
  duration: string;
  url: string;
  thumbnail: string;
  completed?: boolean;
}

export interface Resource {
  id: number;
  title: string;
  type: 'pdf' | 'doc' | 'quiz';
  url: string;
}

export interface CourseData {
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
    image: "/images/qiraat/hamza.png",
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
        thumbnail: "/images/qiraat/hamza.png",
        completed: true
      },
      {
        id: 2,
        title: "Historical Background",
        duration: "22:45",
        url: "https://example.com/video2",
        thumbnail: "/images/qiraat/hamza.png",
        completed: true
      },
      {
        id: 3,
        title: "Unique Recitation Rules - Part 1",
        duration: "35:10",
        url: "https://example.com/video3",
        thumbnail: "/images/qiraat/hamza.png"
      },
      {
        id: 4,
        title: "Unique Recitation Rules - Part 2",
        duration: "28:15",
        url: "https://example.com/video4",
        thumbnail: "/images/qiraat/hamza.png"
      },
      {
        id: 5,
        title: "Practical Application - Surah Al-Fatiha",
        duration: "42:20",
        url: "https://example.com/video5",
        thumbnail: "/images/qiraat/hamza.png"
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
    image: "/images/qiraat/asim.png",
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
        thumbnail: "/images/qiraat/asim.png",
        completed: true
      },
      {
        id: 2,
        title: "Historical Context",
        duration: "25:10",
        url: "https://example.com/asim-video2",
        thumbnail: "/images/qiraat/asim.png"
      },
      {
        id: 3,
        title: "Recitation Methodology",
        duration: "32:15",
        url: "https://example.com/asim-video3",
        thumbnail: "/images/qiraat/asim.png"
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
    description: "Explore the Qira'at of Ibn Amir Dimashqi in this comprehensive course covering all aspects of this important recitation tradition.",
    image: "/images/qiraat/ibn-amir.png",
    instructor: "Sheikh Ahmad",
    instructorTitle: "Senior Qira'at Instructor",
    totalVideos: 14,
    totalHours: "9.8",
    videos: [
      {
        id: 1,
        title: "Introduction to Ibn Amir's Qira'at",
        duration: "20:15",
        url: "https://example.com/ibn-amir-video1",
        thumbnail: "/images/qiraat/ibn-amir.png",
        completed: true
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
    image: "/images/qiraat/abu-amr.png",
    instructor: "Sheikh Ibrahim",
    instructorTitle: "Qira'at Scholar",
    totalVideos: 16,
    totalHours: "11.5",
    videos: [
      {
        id: 1,
        title: "Introduction to Abu Amr's Qira'at",
        duration: "19:30",
        url: "https://example.com/abu-amr-video1",
        thumbnail: "/images/qiraat/abu-amr.png",
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
    image: "/images/qiraat/quran-islam-wallpaper.png",
    instructor: "Sheikh Yusuf",
    instructorTitle: "Qira'at Expert",
    totalVideos: 18,
    totalHours: "12.3",
    videos: [
      {
        id: 1,
        title: "Introduction to Ibn Kathir's Qira'at",
        duration: "22:15",
        url: "https://example.com/ibn-kathir-video1",
        thumbnail: "/images/qiraat/quran-islam-wallpaper.png",
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
    image: "/images/qiraat/nafi-al-madani.png",
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
        thumbnail: "/images/qiraat/nafi-al-madani.png",
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

export default coursesData;
