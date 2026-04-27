import { openDB, DBSchema, IDBPDatabase } from 'idb';

export interface Track {
  id: string;
  title: string;
  duration: number;
  src?: string; // For local uploads
  ytApiUrl?: string; // For YouTube tracks-+
  youtubeId?: string; 
  type: 'local' | 'youtube';
}

interface MusicPlayerDB extends DBSchema {
  tracks: {
    key: string;
    value: Track;
  };
}

let dbPromise: Promise<IDBPDatabase<MusicPlayerDB>> | null = null;

if (typeof window !== 'undefined') {
  dbPromise = openDB<MusicPlayerDB>('music-player-db', 1, {
    upgrade(db) {
      db.createObjectStore('tracks', { keyPath: 'id' });
    },
  });
}

export const addTrack = async (track: Track) => {
  if (!dbPromise) return;
  const db = await dbPromise;
  await db.put('tracks', track);
};

export const getAllTracks = async (): Promise<Track[]> => {
  if (!dbPromise) return [];
  const db = await dbPromise;
  return db.getAll('tracks');
};

export const deleteTrack = async (id: string) => {
  if (!dbPromise) return;
  const db = await dbPromise;
  await db.delete('tracks', id);
};
