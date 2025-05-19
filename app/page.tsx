import PopularCourse from "./components/popular-course";
// import UserReviews from "./components/user-reviews";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Learn the Ten Qiraat - Professional Quranic Recitation Courses",
  description: "QiraatHub Academy offers expert-led courses in the Ten Qiraat. Learn authentic Quranic recitation styles with certified teachers through our structured online program.",
  openGraph: {
    title: "Learn the Ten Qiraat - QiraatHub Academy",
    description: "Master the Ten Qiraat with QiraatHub Academy's professional Quranic recitation courses led by certified teachers.",
    images: [
      {
        url: '/images/og-home.jpg',
        width: 1200,
        height: 630,
        alt: 'QiraatHub Academy Homepage',
      },
    ],
  },
};

export default function Home() {
  return (
    <div>
      <div className="text-center max-w-2xl mx-auto py-20 px-4">
        <h1 className="text-4xl font-bold mb-6 relative inline-block">
          Learn the Ten Qiraat
          <div className="absolute right-[-10px] bottom-[-5px] w-[190px] h-[3px] bg-yellow-400 rounded-full"></div>
        </h1>
        <p className="text-lg text-gray-700 pt-6">
          The ten Qiraat are distinct styles of Quranic recitation, each preserving the authenticity and beauty of the Quran.
        </p>
      </div>
      <PopularCourse />
      {/* <UserReviews /> uncomment this line to show user reviews */}
    </div>
  );
}
