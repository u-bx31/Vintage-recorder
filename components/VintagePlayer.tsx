"use client"

import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface VintagePlayerProps {
  isPlaying: boolean;
  coverArt?: string;
}

export function VintagePlayer({ isPlaying, coverArt }: VintagePlayerProps) {
  return (
    <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 mx-auto flex items-center justify-center">
      {/* Base/Platter */}
      <div className="absolute inset-0 rounded-full bg-amber-950 shadow-2xl border-4 border-amber-900/50 flex items-center justify-center">
        {/* Vinyl Disc */}
        <div 
          className={cn(
            "relative w-[95%] h-[95%] rounded-full bg-[#111] shadow-inner flex items-center justify-center overflow-hidden transition-transform duration-1000",
            isPlaying ? "animate-spin-slow" : ""
          )}
          style={{ animationDuration: '4s' }}
        >
          {/* Vinyl Grooves */}
          <div className="absolute inset-0 rounded-full border border-white/5 m-2"></div>
          <div className="absolute inset-0 rounded-full border border-white/5 m-4"></div>
          <div className="absolute inset-0 rounded-full border border-white/5 m-6"></div>
          <div className="absolute inset-0 rounded-full border border-white/5 m-8"></div>
          <div className="absolute inset-0 rounded-full border border-white/5 m-10"></div>
          <div className="absolute inset-0 rounded-full border border-white/5 m-12"></div>
          <div className="absolute inset-0 rounded-full border border-white/5 m-16"></div>
          <div className="absolute inset-0 rounded-full border border-white/5 m-20"></div>
          <div className="absolute inset-0 rounded-full border border-white/5 m-24"></div>
          
          {/* Center Label */}
          <div className="relative w-1/3 h-1/3 rounded-full bg-amber-200 border-2 border-amber-800 flex items-center justify-center overflow-hidden">
            {coverArt ? (
              <Image src={coverArt} alt="Cover Art" fill className="object-cover opacity-80" referrerPolicy="no-referrer" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-amber-300 to-amber-600 opacity-80" />
            )}
            {/* Spindle Hole */}
            <div className="absolute w-3 h-3 bg-zinc-300 rounded-full shadow-inner border border-zinc-400"></div>
          </div>
          
          {/* Reflection highlight */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none"></div>
        </div>
      </div>

      {/* Tonearm */}
      <div 
        className={cn(
          "absolute top-4 right-4 w-12 h-48 origin-top-right transition-transform duration-1000 ease-in-out z-10",
          isPlaying ? "rotate-[25deg]" : "rotate-0"
        )}
      >
        {/* Pivot */}
        <div className="absolute top-0 right-0 w-8 h-8 bg-zinc-300 rounded-full shadow-md border border-zinc-400"></div>
        {/* Arm */}
        <div className="absolute top-4 right-3 w-2 h-36 bg-zinc-200 rounded-full shadow-sm origin-top transform -rotate-6"></div>
        {/* Headshell */}
        <div className="absolute bottom-6 right-5 w-4 h-8 bg-zinc-800 rounded-sm shadow-md transform rotate-12"></div>
      </div>
    </div>
  );
}
