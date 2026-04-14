"use client";

import React, {
	useState,
	useEffect,
	useCallback,
	useRef,
} from "react";
import { VintagePlayer } from "@/components/VintagePlayer";
import { Controls } from "@/components/Controls";
import { AudioEngine } from "@/components/AudioEngine";
import { YouTubePlayer } from "@/components/YouTubePlayer";
import { TrackList } from "@/components/TrackList";
import { UploadPanel } from "@/components/UploadPanel";
import { Track, addTrack, getAllTracks, deleteTrack } from "@/lib/db";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Library, Settings2, Disc3 } from "lucide-react";

export default function Home() {
	const [tracks, setTracks] = useState<Track[]>([]);
	const [currentTrack, setCurrentTrack] = useState<Track | null>(
		null,
	);
	const [isPlaying, setIsPlaying] = useState(false);
	const [volume, setVolume] = useState(1);
	const [progress, setProgress] = useState(0);
	const [duration, setDuration] = useState(0);
	const [seekTo, setSeekTo] = useState<number | null>(null);
	const [crackleEnabled, setCrackleEnabled] = useState(false);
	const crackleAudioRef = useRef<HTMLAudioElement | null>(null);

	// Load tracks from IndexedDB on mount
	useEffect(() => {
		const loadTracks = async () => {
			const loadedTracks = await getAllTracks();
			setTracks(loadedTracks);
			if (loadedTracks.length > 0) {
				setCurrentTrack(loadedTracks[0]);
			}
		};
		loadTracks();
	}, []);

	// Keyboard shortcuts
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.code === "Space" && e.target === document.body) {
				e.preventDefault();
				setIsPlaying((prev) => !prev);
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, []);

	// Crackle effect
	useEffect(() => {
		if (crackleEnabled && isPlaying) {
			if (!crackleAudioRef.current) {
				// Using a public domain crackle sound or generating one
				// For this demo, we'll use a placeholder or create a simple noise node if possible,
				// but since we need an audio file, we'll just simulate it or use a data URI if we had one.
				// Let's just create a silent audio element for now to avoid errors, or use a known public URL.
				crackleAudioRef.current = new Audio(
					"https://cdn.pixabay.com/download/audio/2022/03/15/audio_7d2f9b2b81.mp3?filename=vinyl-crackle-105151.mp3",
				);
				crackleAudioRef.current.loop = true;
				crackleAudioRef.current.volume = 0.2;
			}
			crackleAudioRef.current.play().catch(() => {});
		} else {
			if (crackleAudioRef.current) {
				crackleAudioRef.current.pause();
			}
		}
	}, [crackleEnabled, isPlaying]);

	const handleAddTrack = async (track: Track) => {
		await addTrack(track);
		setTracks((prev) => [...prev, track]);
		if (!currentTrack) {
			setCurrentTrack(track);
		}
	};

	const handleDeleteTrack = async (id: string) => {
		await deleteTrack(id);
		setTracks((prev) => prev.filter((t) => t.id !== id));
		if (currentTrack?.id === id) {
			setCurrentTrack(null);
			setIsPlaying(false);
			setProgress(0);
			setDuration(0);
		}
	};

	const handlePlayPause = () => {
		if (!currentTrack) return;
		setIsPlaying(!isPlaying);
	};

	const handleNext = () => {
		if (tracks.length === 0) return;
		const currentIndex = tracks.findIndex(
			(t) => t.id === currentTrack?.id,
		);
		const nextIndex = (currentIndex + 1) % tracks.length;
		setCurrentTrack(tracks[nextIndex]);
		setIsPlaying(true);
		setProgress(0);
	};

	const handlePrevious = () => {
		if (tracks.length === 0) return;
		const currentIndex = tracks.findIndex(
			(t) => t.id === currentTrack?.id,
		);
		const prevIndex =
			(currentIndex - 1 + tracks.length) % tracks.length;
		setCurrentTrack(tracks[prevIndex]);
		setIsPlaying(true);
		setProgress(0);
	};
	const handleProgress = useCallback(
		(currentTime: number, totalDuration: number) => {
			setProgress(currentTime);
			if (totalDuration > 0) setDuration(totalDuration);
		},
		[],
	);

	const handleEnded = () => {
		handleNext();
	};

	const handleSeek = (value: number) => {
		setProgress(value);
		setSeekTo(value);
		// Reset seekTo after a short delay so it can be triggered again
		setTimeout(() => setSeekTo(null), 100);
	};

	return (
		<div className="min-h-screen flex flex-col relative overflow-hidden">
			{/* Background Texture & Vignette */}
			<div className="absolute inset-0 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] opacity-20 mix-blend-multiply"></div>
			<div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]"></div>

			{/* Header */}
			<header className="relative z-10 p-6 flex justify-between items-center">
				<div className="flex items-center gap-3">
					<div className="w-10 h-10 rounded-full bg-amber-900 flex items-center justify-center text-amber-50 shadow-lg">
						<Disc3 className="w-6 h-6" />
					</div>
					<h1 className="font-serif text-2xl font-bold text-amber-950 tracking-tight">
						Vintage Player
					</h1>
				</div>

				<div className="flex items-center gap-4">
					<Dialog>
						<DialogTrigger asChild>
							<Button
								variant="outline"
								className="bg-amber-50/50 backdrop-blur-sm border-amber-900/20">
								<Library className="w-4 h-4 mr-2" />
								Library
							</Button>
						</DialogTrigger>
						<DialogContent className="sm:max-w-[600px]">
							<DialogHeader>
								<DialogTitle>Music Library</DialogTitle>
							</DialogHeader>
							<div className="grid md:grid-cols-2 gap-6 mt-4">
								<div>
									<h4 className="text-sm font-medium mb-3 text-amber-950">
										Add New Track
									</h4>
									<UploadPanel onAddTrack={handleAddTrack} />
								</div>
								<div>
									<h4 className="text-sm font-medium mb-3 text-amber-950">
										Your Tracks
									</h4>
									<TrackList
										tracks={tracks}
										currentTrackId={currentTrack?.id || null}
										onSelectTrack={(track) => {
											setCurrentTrack(track);
											setIsPlaying(true);
											setProgress(0);
										}}
										onDeleteTrack={handleDeleteTrack}
									/>
								</div>
							</div>
						</DialogContent>
					</Dialog>

					<Button
						variant="ghost"
						size="icon"
						onClick={() => setCrackleEnabled(!crackleEnabled)}
						className={
							crackleEnabled
								? "text-amber-900 bg-amber-200"
								: "text-amber-900/50 hover:text-amber-900"
						}
						title="Toggle Vinyl Crackle">
						<Settings2 className="w-5 h-5" />
					</Button>
				</div>
			</header>

			{/* Main Content */}
			<main className="flex-1 relative z-10 flex flex-col items-center justify-center p-6">
				<div className="w-full max-w-4xl mx-auto grid lg:grid-cols-1 gap-12 items-center">
					{/* Player Visuals */}
					<div className="flex flex-col items-center justify-center space-y-12">
						<VintagePlayer
							isPlaying={isPlaying}
							coverArt={
								currentTrack?.type === "youtube"
									? `https://img.youtube.com/vi/${currentTrack.youtubeId}/hqdefault.jpg`
									: undefined
							}
						/>

						<div className="text-center space-y-2 max-w-md w-full">
							<h2 className="font-serif text-3xl font-bold text-amber-950 truncate px-4">
								{currentTrack
									? currentTrack.title
									: "No track selected"}
							</h2>
							<p className="text-amber-900/60 font-medium uppercase tracking-widest text-sm">
								{currentTrack
									? currentTrack.type === "youtube"
										? "YouTube Audio"
										: "Local Audio"
									: "Add tracks to begin"}
							</p>
						</div>

						<Controls
							isPlaying={isPlaying}
							onPlayPause={handlePlayPause}
							onPrevious={handlePrevious}
							onNext={handleNext}
							volume={volume}
							onVolumeChange={setVolume}
							progress={progress}
							duration={duration}
							onSeek={handleSeek}
						/>
					</div>
				</div>
			</main>

			{/* Hidden Audio Engines */}
			{currentTrack?.type === "local" && (
				<AudioEngine
					file={currentTrack.file || null}
					isPlaying={isPlaying}
					volume={volume}
					onProgress={handleProgress}
					onEnded={handleEnded}
					seekTo={seekTo}
					onReady={() => {
						// Optional: handle ready state
					}}
				/>
			)}

			{currentTrack?.type === "youtube" &&
				currentTrack?.youtubeId &&
				currentTrack !== null && (
					<YouTubePlayer
						curentTrack={currentTrack}
						key={currentTrack?.youtubeId}
						videoId={currentTrack.youtubeId}
						isPlaying={isPlaying}
						volume={volume}
						onProgress={handleProgress}
						onEnded={handleEnded}
						seekTo={seekTo}
						onReady={() => {
							// Optional: handle ready state
						}}
					/>
				)}
		</div>
	);
}
