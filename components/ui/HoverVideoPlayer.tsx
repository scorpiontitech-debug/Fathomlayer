"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

interface HoverVideoPlayerProps {
  imageSrc: string;
  videoSrc?: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  sizes?: string;
}

export function HoverVideoPlayer({
  imageSrc,
  videoSrc,
  alt,
  className = "",
  imageClassName = "",
  sizes = "100vw"
}: HoverVideoPlayerProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isHovered && videoRef.current) {
      videoRef.current.play().catch(() => {
        // Handle auto-play restrictions gracefully
      });
    } else if (!isHovered && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0; // Reset
    }
  }, [isHovered]);

  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Fallback Image (Always present, fades out when video plays) */}
      <Image
        src={imageSrc}
        alt={alt}
        fill
        sizes={sizes}
        className={`object-cover transition-opacity duration-700 ease-in-out ${imageClassName} ${isHovered && isVideoLoaded ? 'opacity-0' : 'opacity-100'}`}
      />

      {/* Hover Video (WebM/MP4) */}
      {videoSrc && (
        <video
          ref={videoRef}
          src={videoSrc}
          loop
          muted
          playsInline
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-in-out ${isHovered ? 'opacity-100' : 'opacity-0'}`}
          onLoadedData={() => setIsVideoLoaded(true)}
          preload="none"
        />
      )}
    </div>
  );
}
