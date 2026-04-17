"use client"

import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface ControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onPrevious: () => void;
  onNext: () => void;
  volume: number;
  onVolumeChange: (value: number) => void;
  progress: number;
  duration: number;
  onSeek: (value: number) => void;
}

function formatTime(seconds: number) {
  if (isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function Controls({
  isPlaying,
  onPlayPause,
  onPrevious,
  onNext,
  volume,
  onVolumeChange,
  progress,
  duration,
  onSeek
}: ControlsProps) {
  return (
    <div className="w-full max-w-md mx-auto space-y-6 mt-8 md:mt-1">
      {/* Progress Bar */}
      <div className="space-y-2">
        <Slider
          value={[progress]}
          max={duration || 100}
          step={1}
          onValueChange={(val) => onSeek(val[0])}
          className="cursor-pointer"
        />
        <div className="flex justify-between text-xs text-amber-900/70 font-mono">
          <span>{formatTime(progress)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Main Controls */}
      <div className="flex items-center justify-center gap-4">
        <Button variant="ghost" size="icon" onClick={onPrevious} className="rounded-full w-12 h-12">
          <SkipBack className="w-6 h-6" />
        </Button>
        <Button 
          variant="default" 
          size="icon" 
          onClick={onPlayPause} 
          className="rounded-full w-16 h-16 shadow-lg bg-amber-900 hover:bg-amber-800 text-amber-50"
        >
          {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
        </Button>
        <Button variant="ghost" size="icon" onClick={onNext} className="rounded-full w-12 h-12">
          <SkipForward className="w-6 h-6" />
        </Button>
      </div>

      {/* Volume Control */}
      <div className="flex items-center gap-4 max-w-[200px] mx-auto">
        <Button variant="ghost" size="icon" className="w-8 h-8" onClick={() => onVolumeChange(volume === 0 ? 1 : 0)}>
          {volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </Button>
        <Slider
          value={[volume]}
          max={1}
          step={0.01}
          onValueChange={(val) => onVolumeChange(val[0])}
          className="cursor-pointer"
        />
      </div>
    </div>
  );
}
