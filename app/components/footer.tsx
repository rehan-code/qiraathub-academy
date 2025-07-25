import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-100">
      <div className="container mx-auto py-6 px-4 sm:px-10 lg:px-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 mt-2">
          {/* Logo and Description */}
          <div className="space-y-6">
            <Link href="/" className="block w-[260px]">
              <div className="relative aspect-[260/60] w-full transition-transform duration-300 ease-in-out hover:scale-105">
                <Image
                  src="/Horizontal Logo.png"
                  alt="QiraatHub Logo"
                  fill
                  sizes="260px"
                  className="object-contain"
                />
              </div>
            </Link>
            <p className="text-gray-600 text-sm leading-relaxed text-justify">
              Your gateway to mastering the ten Qiraat. Explore authentic
              resources and connect with a supportive learning community.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-600 hover:text-theme_primary transition-colors flex items-center gap-2 group"><span className="w-0 group-hover:w-2 h-0.5 bg-theme_primary transition-all duration-300"></span>Home</Link></li>
              <li><Link href="/about" className="text-gray-600 hover:text-theme_primary transition-colors flex items-center gap-2 group"><span className="w-0 group-hover:w-2 h-0.5 bg-theme_primary transition-all duration-300"></span>About</Link></li>
              <li><Link href="/courses" className="text-gray-600 hover:text-theme_primary transition-colors flex items-center gap-2 group"><span className="w-0 group-hover:w-2 h-0.5 bg-theme_primary transition-all duration-300"></span>Courses</Link></li>
              <li><Link href="/contact" className="text-gray-600 hover:text-theme_primary transition-colors flex items-center gap-2 group"><span className="w-0 group-hover:w-2 h-0.5 bg-theme_primary transition-all duration-300"></span>Contact</Link></li>
            </ul>
          </div>

          {/* Popular Courses */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Popular Courses</h3>
            <ul className="space-y-2">
              <li><Link href="/courses/nafi-al-madani" className="text-gray-600 hover:text-theme_primary transition-colors flex items-center gap-2 group"><span className="w-0 group-hover:w-2 h-0.5 bg-theme_primary transition-all duration-300"></span>Nafi&apos; al-Madani</Link></li>
              <li><Link href="/courses/ibn-kathir" className="text-gray-600 hover:text-theme_primary transition-colors flex items-center gap-2 group"><span className="w-0 group-hover:w-2 h-0.5 bg-theme_primary transition-all duration-300"></span>Ibn Kathir</Link></li>
              <li><Link href="/courses/abu-amr-al-basri" className="text-gray-600 hover:text-theme_primary transition-colors flex items-center gap-2 group"><span className="w-0 group-hover:w-2 h-0.5 bg-theme_primary transition-all duration-300"></span>Abu Amr Al Basri</Link></li>
              <li><Link href="/courses/ibn-amir-dimashqi" className="text-gray-600 hover:text-theme_primary transition-colors flex items-center gap-2 group"><span className="w-0 group-hover:w-2 h-0.5 bg-theme_primary transition-all duration-300"></span>Ibn Amir Dimashqi</Link></li>
            </ul>
          </div>

          {/* Stay Connected */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Stay Connected</h3>
            <div className="space-y-4">
              <a href="mailto:info@qiraathub.com" className="text-gray-600 hover:text-theme_primary transition-colors flex items-center gap-2 group">
                <svg className="w-5 h-5 transform group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                info@qiraathub.com
              </a>
              <div className="flex gap-4">
                <a href="https://www.youtube.com/@qiraat" className="text-gray-600 hover:text-red-600 hover:scale-110 transition-all duration-300" aria-label="YouTube" target="_blank" rel="noopener noreferrer">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                </a>
                <a href="https://www.facebook.com/QiraatHub/" className="text-gray-600 hover:text-blue-600 hover:scale-110 transition-all duration-300" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/></svg>
                </a>
                <a href="https://www.instagram.com/qiraathub/" className="text-gray-600 hover:text-pink-600 hover:scale-110 transition-all duration-300" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/></svg>
                </a>
                <a href="https://x.com/QiraatHub" className="text-gray-600 hover:text-[#1DA1F2] hover:scale-110 transition-all duration-300" aria-label="Twitter" target="_blank" rel="noopener noreferrer">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                </a>
              </div>
              <form className="space-y-2">
                <input 
                  type="email" 
                  id="newsletter-email"
                  name="email"
                  placeholder="Your email address" 
                  autoComplete="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
                <button 
                  type="submit" 
                  className="w-full px-4 py-2  bg-theme_primary text-white rounded-md hover:bg-theme_primary/90 transition duration-200"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="pt-6 border-t border-gray-200">
          <p className="text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} QiraatHub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
