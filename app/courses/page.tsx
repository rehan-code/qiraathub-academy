import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const CoursesPage = () => {
  const courses = [
    {
      id: 1,
      title: "Hamzah al Kofi",
      description: "Learn the Qira'at of Hamzah al Kofi",
      image: "https://old.qiraathub.com/wp-content/uploads/2024/09/book-quran-scripture-8224121-1-768x512.png"
    },
    {
      id: 2,
      title: "Asim al Koofi",
      description: "Learn the Qira'at of Asim al Koofi",
      image: "https://old.qiraathub.com/wp-content/uploads/2024/09/an-quran-scripture-7741928-1-768x513.jpg"
    },
    {
      id: 3,
      title: "Ibn Amir Dimashqi",
      description: "Learn the Qira'at of Ibn Amir Dimashqi",
      image: "https://old.qiraathub.com/wp-content/uploads/2024/09/quran-islam-book-6862296-1-768x512.jpg"
    },
    {
      id: 4,
      title: "Abu Amr Al Basri",
      description: "Learn the Qira'at of Abu Amr Al Basri",
      image: "https://old.qiraathub.com/wp-content/uploads/2024/09/book-quran-open-1283468-1-768x512.jpg"
    },
    {
      id: 5,
      title: "Ibn Kathir",
      description: "Learn the Qira'at of Ibn Kathir",
      image: "https://old.qiraathub.com/wp-content/uploads/2024/09/quran_read20-1280x640-1-768x384.jpg"
    },
    {
      id: 6,
      title: "Nafi' Al Madani",
      description: "Learn the Qira'at of Nafi' Al Madani",
      image: "https://old.qiraathub.com/wp-content/uploads/2024/09/quran-islam-laptop-wallpaper-6114872-1-768x512.jpg"
    }
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Qira&apos;at Courses</h1>
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
                href={`/courses/`}
                className="inline-block bg-theme_primary text-white px-4 py-2 rounded-md hover:bg-theme_primary/90 transition-colors duration-300"
              >
                Enroll Now
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoursesPage;
