import PopularCourse from "./components/popular-course";
import UserReviews from "./components/user-reviews";

export default function Home() {
  return (
    <div>
      <div className="text-center max-w-2xl mx-auto pt-[5rem] px-4">
        <h1 className="text-4xl font-bold mb-6 relative inline-block">
          Learn the Ten Qiraat
          <div className="absolute right-[-10px] bottom-[-5px] w-[190px] h-[3px] bg-yellow-400 rounded-full"></div>
        </h1>
        <p className="text-lg text-gray-700 pt-6">
          The ten Qiraat are distinct styles of Quranic recitation, each preserving the authenticity and beauty of the Quran.
        </p>
      </div>
      <PopularCourse />
      <UserReviews />
    </div>
  );
}
