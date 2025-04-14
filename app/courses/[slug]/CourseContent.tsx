"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Play, CheckCircle, BookOpen, FileText, Download } from 'lucide-react';
import { motion } from 'framer-motion';

// Import types from the parent component
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

interface CourseContentProps {
  course: CourseData;
}

export default function CourseContent({ course }: CourseContentProps) {
  const [activeVideo, setActiveVideo] = useState<Video | null>(course.videos[0] || null);
  const [activeTab, setActiveTab] = useState<'videos' | 'resources'>('videos');

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl pt-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Video player */}
        <div className="lg:col-span-2">
          {activeVideo && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              <div className="relative aspect-video bg-gray-900">
                {/* Video thumbnail with play button (in a real app, this would be a video player) */}
                <div className="absolute inset-0">
                  <Image
                    src={activeVideo.thumbnail}
                    alt={activeVideo.title}
                    fill
                    className="object-cover opacity-70"
                  />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <button className="bg-white/90 hover:bg-white rounded-full p-4 shadow-lg transition-all duration-300 transform hover:scale-105">
                    <Play className="w-8 h-8 text-theme_primary" />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2">{activeVideo.title}</h2>
                <p className="text-gray-500">{activeVideo.duration}</p>
              </div>
            </motion.div>
          )}
        </div>
        
        {/* Course content sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-gray-200">
              <button
                className={`flex-1 py-4 text-center font-medium ${
                  activeTab === 'videos' 
                    ? 'text-theme_primary border-b-2 border-theme_primary' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('videos')}
              >
                Videos
              </button>
              <button
                className={`flex-1 py-4 text-center font-medium ${
                  activeTab === 'resources' 
                    ? 'text-theme_primary border-b-2 border-theme_primary' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('resources')}
              >
                Resources
              </button>
            </div>
            
            {/* Tab content */}
            <div className="p-4">
              {activeTab === 'videos' && (
                <div className="space-y-3">
                  {course.videos.map((video) => (
                    <button
                      key={video.id}
                      className={`w-full text-left p-3 rounded-lg transition-all duration-200 flex items-start ${
                        activeVideo?.id === video.id 
                          ? 'bg-theme_primary/10 border border-theme_primary/20' 
                          : 'hover:bg-gray-100 border border-transparent'
                      }`}
                      onClick={() => setActiveVideo(video)}
                    >
                      <div className="relative w-20 h-12 rounded overflow-hidden flex-shrink-0 mr-3">
                        <Image
                          src={video.thumbnail}
                          alt={video.title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                          <Play className="w-4 h-4 text-white" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm line-clamp-2">{video.title}</p>
                        <div className="flex items-center mt-1">
                          <p className="text-xs text-gray-500 mr-2">{video.duration}</p>
                          {video.completed && (
                            <CheckCircle className="w-3 h-3 text-green-500" />
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
              
              {activeTab === 'resources' && (
                <div className="space-y-3">
                  {course.resources.map((resource) => (
                    <a
                      key={resource.id}
                      href={resource.url}
                      className="block p-3 rounded-lg hover:bg-gray-100 border border-transparent transition-all duration-200"
                    >
                      <div className="flex items-center">
                        {resource.type === 'pdf' && (
                          <FileText className="w-5 h-5 text-red-500 mr-3" />
                        )}
                        {resource.type === 'doc' && (
                          <FileText className="w-5 h-5 text-blue-500 mr-3" />
                        )}
                        {resource.type === 'quiz' && (
                          <BookOpen className="w-5 h-5 text-purple-500 mr-3" />
                        )}
                        <div className="flex-1">
                          <p className="font-medium text-sm">{resource.title}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {resource.type === 'pdf' && 'PDF Document'}
                            {resource.type === 'doc' && 'Document'}
                            {resource.type === 'quiz' && 'Interactive Quiz'}
                          </p>
                        </div>
                        <Download className="w-4 h-4 text-gray-400" />
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
