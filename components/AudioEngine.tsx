"use client"

import React, { useEffect, useRef } from 'react';

interface AudioEngineProps {
  file: File | null;
  isPlaying: boolean;
  volume: number;
  onProgress: (currentTime: number, duration: number) => void;
  onEnded: () => void;
  seekTo: number | null;
  onReady: () => void;
}

export function AudioEngine({
  file,
  isPlaying,
  volume,
  onProgress,
  onEnded,
  seekTo,
  onReady
}: AudioEngineProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const objectUrlRef = useRef<string | null>(null);

  useEffect(() => {
    if (!file) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
      return;
    }

    const url = URL.createObjectURL(file);
    objectUrlRef.current = url;

    if (audioRef.current) {
      audioRef.current.src = url;
      audioRef.current.load();
    }

    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, [file]);

  useEffect(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.play().catch(e => console.error("Playback failed", e));
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    if (!audioRef.current || seekTo === null) return;
    audioRef.current.currentTime = seekTo;
  }, [seekTo]);

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    onProgress(audioRef.current.currentTime, audioRef.current.duration);
  };

  const handleLoadedMetadata = () => {
    onReady();
  };

  return (
    <audio
      ref={audioRef}
      onTimeUpdate={handleTimeUpdate}
      onEnded={onEnded}
      onLoadedMetadata={handleLoadedMetadata}
      className="hidden"
    />
  );
}
