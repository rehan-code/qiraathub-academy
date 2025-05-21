import Image from 'next/image';
import TypingAnimation from './typing-animation';

export default function PopularCourse() {
  return (
    <div className="bg-gradient-to-b from-white to-gray-50 py-24 pt-4">
      <div className="container mx-auto px-24">
        <div className="grid md:grid-cols-5 gap-12 items-center">
          {/* Left Content */}
          <div className="md:col-span-3 space-y-8">
            <div className="space-y-4">
              <div className="inline-block bg-yellow-50 text-yellow-600 px-4 py-1.5 rounded-full text-sm font-medium">
                #1 The Most popular Course
              </div>
              <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                Private Hifdh{' '}
                <span className="text-yellow-500 font-black">& 10 Qiraat Classes</span>
              </h2>
            </div>

            <p className="text-gray-600 text-lg leading-relaxed">
              Learn the Usool, or foundations, of the 10 Qiraat through practical methods from qualified international lecturers in the English language from Al Azhar tradition.
            </p>
            
            <div className="space-y-4">
              {[
                'Study track of Qiraat designed by QiraatHub Academy.',
                'Private Classes Personalized to your learning style.',
                'Highly Qualified Lecturer From Al Azhar University Tradition',
                'Rewarded by Ijazah Sanad Muttasil upon graduation.',
                'Flexible schedule depending on the student\'s preferences.'
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-3 group">
                  <div className="text-yellow-500 transform group-hover:scale-110 transition-transform mt-1">➜</div>
                  <p className="text-gray-700 group-hover:text-gray-900 transition-colors">{item}</p>
                </div>
              ))}
            </div>

            <div className="space-y-6">
              <div className="flex items-center flex-wrap gap-2">
                <p className="text-gray-800 text-lg font-semibold">
                  The first institute teaching the Qiraat Sciences exclusively in
                </p>
                <div className="inline-block bg-yellow-500 text-white px-3 py-1.5 rounded-md font-bold tracking-wide shadow-sm">
                  <TypingAnimation text="English" />
                </div>
              </div>
              <p className="text-gray-800 font-medium leading-relaxed border-l-4 border-yellow-500 pl-4">
                ROOTED IN TRADITION WITH CHAIN OR SANAD GOING BACK TO THE PROPHET ﷺ THROUGH THE SCHOLARS
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <button className="bg-gray-900 text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 duration-200">
                View Details
              </button>
              <div className="text-gray-800">
                Book a free class or email us at{' '}
                <a href="mailto:info@qiraathub.com" className="text-yellow-500 hover:text-yellow-600 font-medium hover:underline transition-colors">
                  info@qiraathub.com
                </a>
                {' '}| <span className="font-bold hover:text-yellow-500 cursor-pointer transition-colors">Book Now</span>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="md:col-span-2 relative">
            <div className="relative bg-white rounded-2xl p-6 shadow-2xl transform hover:scale-[1.02] transition-transform duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 to-gray-50 rounded-2xl opacity-50"></div>
              <Image
                src="/images/Modern-Online-Design-Course-Ad-Instagram-Post.webp"
                alt="Qiraat Classes Preview"
                width={600}
                height={600}
                className="rounded-xl relative z-10"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
