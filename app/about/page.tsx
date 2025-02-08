import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <div className="relative h-[500px] w-full overflow-hidden">
        <Image
          src="https://qiraathub.com/wp-content/uploads/2024/09/quran-islam-laptop-wallpaper-6114872-1-768x512.jpg"
          alt="QiraatHub Hero"
          fill
          className="object-cover brightness-50"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10 container mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-center">
            About QiraatHub
          </h1>
          <p className="text-xl md:text-2xl text-center max-w-3xl mx-auto leading-relaxed">
            Empowering Muslims worldwide to master the authentic Qira&apos;at of the Holy Quran
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-20">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="order-2 md:order-1">
            <h2 className="text-4xl font-bold mb-8 text-gray-800">Our Mission</h2>
            <div className="space-y-6">
              <p className="text-lg text-gray-700 leading-relaxed">
                At QiraatHub, we are dedicated to preserving and teaching the authentic Qira&apos;at 
                of the Holy Quran. Our platform makes it possible for students worldwide to learn 
                from qualified instructors and master the various authentic readings of the Quran.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                We believe in making quality Quranic education accessible to everyone, 
                combining traditional teaching methods with modern technology to create 
                an effective and engaging learning experience.
              </p>
            </div>
          </div>
          <div className="order-1 md:order-2">
            <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300">
              <Image
                src="https://qiraathub.com/wp-content/uploads/2024/09/quran_read20-1280x640-1-768x384.jpg"
                alt="Our Mission"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-theme_primary/5 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">Why Choose QiraatHub</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Expert Teachers",
                description: "Learn from qualified scholars who are experts in their respective Qira'at",
                icon: "👨‍🏫"
              },
              {
                title: "Flexible Learning",
                description: "Study at your own pace with our structured online courses",
                icon: "⏰"
              },
              {
                title: "Community Support",
                description: "Join a global community of students dedicated to mastering Quranic recitation",
                icon: "🌍"
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-2xl font-semibold mb-4 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-theme_primary text-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl text-center">
          <h2 className="text-4xl font-bold mb-8">Start Your Journey Today</h2>
          <p className="text-xl mb-12 max-w-2xl mx-auto opacity-90">
            Join thousands of students worldwide who are discovering the beauty of 
            the various Qira&apos;at through our comprehensive online platform.
          </p>
          <Link 
            href="/courses" 
            className="inline-block bg-white text-theme_primary px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors duration-300"
          >
            Explore Our Courses
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
