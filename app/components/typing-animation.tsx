"use client";
import { useEffect, useState, useCallback } from 'react';

interface TypingAnimationProps {
  text: string;
  className?: string;
}

export default function TypingAnimation({ text, className = '' }: TypingAnimationProps) {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const typeText = useCallback(() => {
    setDisplayText(() => text.substring(0, currentIndex + 1));
    setCurrentIndex(prev => prev + 1);
  }, [currentIndex, text]);

  const eraseText = useCallback(() => {
    setDisplayText(() => text.substring(0, currentIndex - 1));
    setCurrentIndex(prev => prev - 1);
  }, [currentIndex, text]);
  
  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;

    const animate = () => {
      if (isTyping) {
        if (currentIndex < text.length) {
          typeText();
          timeoutId = setTimeout(animate, 30);
        } else {
          setIsTyping(false);
          timeoutId = setTimeout(animate, 4000);
        }
      } else {
        if (currentIndex > 0) {
          eraseText();
          timeoutId = setTimeout(animate, 100);
        } else {
          setIsTyping(true);
          timeoutId = setTimeout(animate, 500);
        }
      }
    };

    timeoutId = setTimeout(animate, isTyping ? 500 : 100);

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [text, isTyping, currentIndex, typeText, eraseText]);

  return (
    <span className={className}>
      {displayText}
      <span className="animate-pulse">|</span>
    </span>
  );
}
