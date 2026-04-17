"use client"

import React from 'react';
import { Track } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Trash2, Play, Music, Youtube } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TrackListProps {
  tracks: Track[];
  currentTrackId: string | null;
  onSelectTrack: (track: Track) => void;
  onDeleteTrack: (id: string) => void;
}

export function TrackList({ tracks, currentTrackId, onSelectTrack, onDeleteTrack }: TrackListProps) {
  if (tracks.length === 0) {
    return (
      <div className="text-center py-8 text-amber-900/50 text-sm">
        No tracks in your library yet.
      </div>
    );
  }
  console.log('tracks', tracks);

  return (
    <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
      {tracks.map((track) => (
        <div 
          key={track.id}
          className={cn(
            "flex items-center justify-between p-3 rounded-lg border transition-colors group",
            currentTrackId === track.id 
              ? "bg-amber-900/10 border-amber-900/30" 
              : "bg-amber-50/50 border-amber-900/10 hover:bg-amber-900/5"
          )}
        >
          <div className="flex items-center gap-3 overflow-hidden">
            <div className={cn(
              "w-10 h-10 rounded-md flex items-center justify-center flex-shrink-0",
              track.type === 'youtube' ? "bg-red-100 text-red-600" : "bg-amber-200 text-amber-800"
            )}>
              {track.type === 'youtube' ? <Youtube className="w-5 h-5" /> : <Music className="w-5 h-5" />}
            </div>
            <div className="truncate">
              <p className="font-medium text-sm truncate text-amber-950">{track.title}</p>
              <p className="text-xs text-amber-900/60 capitalize">{track.type} Audio</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-amber-900 hover:text-amber-950 hover:bg-amber-200"
              onClick={() => onSelectTrack(track)}
            >
              <Play className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-100"
              onClick={() => onDeleteTrack(track.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
