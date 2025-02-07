'use client';
import { useEffect, useRef } from 'react';
import { FaQuoteLeft } from 'react-icons/fa';

const reviews = [
    {
        id: 1,
        name: "Ahmad Hassan",
        review: "The course helped me understand the nuances of different Qiraat. The teaching methodology was excellent!"
    },
    {
        id: 2,
        name: "Sarah Ahmed",
        review: "As someone who already memorized Quran, this course opened new dimensions in understanding the variations."
    },
    {
        id: 3,
        name: "Mohammed Ali",
        review: "The interactive learning approach and detailed explanations made complex concepts easy to grasp."
    },
    {
        id: 4,
        name: "Fatima Khan",
        review: "Excellent resource for both students and teachers. The course structure is well thought out."
    }
];

export default function UserReviews() {
    const scrollRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const scrollContainer = scrollRef.current;
        const content = contentRef.current;
        if (!scrollContainer || !content) return;

        const cardWidth = 400 + 32; // card width + gap
        let scrollAmount = 0;
        
        const scroll = () => {
            if (!scrollContainer) return;
            
            scrollAmount += 0.5;
            if (scrollAmount >= cardWidth * reviews.length) {
                scrollAmount = 0;
                scrollContainer.scrollLeft = 0;
            } else {
                scrollContainer.scrollLeft = scrollAmount;
            }
        };

        const intervalId = setInterval(scroll, 30);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="py-20 bg-gradient-to-b from-white to-gray-50">
            <div className="max-w-7xl mx-auto px-4">
                <h2 className="text-4xl font-bold text-center mb-4">
                    What Our Learners Say
                </h2>
                <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
                    Discover how QiraatHub has helped students master the Ten Qiraat
                </p>
                
                <div className="relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10"></div>
                    <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10"></div>
                    
                    <div 
                        ref={scrollRef}
                        className="flex space-x-8 pb-8 scrollbar-hide relative"
                        style={{ overflow: 'hidden' }}
                    >
                        <div ref={contentRef} className="flex space-x-8">
                            {[...reviews, ...reviews, ...reviews].map((review, index) => (
                                <div 
                                    key={`${review.id}-${index}`}
                                    className="flex-none w-[400px] min-h-[200px] bg-white rounded-2xl shadow-lg p-8 mt-6 mb-2 hover:shadow-xl transition-all duration-300 border border-gray-100 relative group"
                                >
                                    <div className="absolute -top-4 left-8 bg-yellow-400 w-8 h-8 flex items-center justify-center rounded-full shadow-md transform -rotate-12 group-hover:rotate-0 transition-transform duration-300">
                                        <FaQuoteLeft className="text-white text-sm" />
                                    </div>
                                    <div className="mb-6 pt-2">
                                        <p className="text-gray-700 text-lg leading-relaxed italic">
                                            &quot;{review.review}&quot;
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-between mt-auto">
                                        <div>
                                            <h3 className="font-semibold text-lg text-gray-900">{review.name}</h3>
                                            <div className="h-1 w-12 bg-yellow-400 rounded-full mt-2"></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
