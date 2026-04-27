"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
	Play,
	Pause,
	SkipBack,
	SkipForward,
	Volume2,
	VolumeX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { YouTubePlayer } from "./YouTubePlayer";
import { AudioEngine } from "./AudioEngine";
import { Track } from "@/lib/db";

interface ControlsProps {
	tracks: Track[];
	currentTrack: Track | null;
	setCurrentTrack: (track: Track) => void;
	loading: boolean;
	setLoading: (bool: boolean) => void;
	isPlaying: boolean;
	setIsPlaying: (val: boolean) => void;
}

function formatTime(seconds: number) {
	if (isNaN(seconds)) return "0:00";
	const mins = Math.floor(seconds / 60);
	const secs = Math.floor(seconds % 60);
	return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function Controls({
	tracks,
	currentTrack,
	setCurrentTrack,
	isPlaying,
	setIsPlaying,
	loading,
	setLoading,
}: ControlsProps) {
	const [volume, setVolume] = useState(1);
	const [progress, setProgress] = useState(0);
	const [duration, setDuration] = useState(0);
	const [seekTo, setSeekTo] = useState<number | null>(null);

	useEffect(() => {
		const storedVolume = localStorage.getItem("volume");
		if (storedVolume) {
			// eslint-disable-next-line react-hooks/set-state-in-effect
			setVolume(parseFloat(storedVolume));
		}
	}, []);

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
			setProgress((prev) => {
				if (Math.floor(prev) === Math.floor(currentTime)) return prev;
				return currentTime;
			});

			setDuration((prev) => {
				if (prev === totalDuration || totalDuration === 0)
					return prev;
				return totalDuration;
			});
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

	const verifyTrackSrc = () => {
		if (!currentTrack) return;
		if (currentTrack.file) {
			return URL.createObjectURL(currentTrack.file);
		} else {
			return currentTrack.src || null;
		}
	};
	return (
		<div className="w-full max-w-md mx-auto space-y-6 mt-8 md:mt-1">
			{/* Progress Bar */}
			<div className="space-y-2">
				<Slider
					value={[progress]}
					max={duration || 100}
					step={1}
					onValueChange={(val) => handleSeek(val[0])}
					className="cursor-pointer"
				/>
				<div className="flex justify-between text-xs text-amber-900/70 font-mono">
					<span>{formatTime(progress)}</span>
					<span>{formatTime(duration)}</span>
				</div>
			</div>

			{/* Main Controls */}
			<div className="flex items-center justify-center gap-4">
				<Button
					variant="ghost"
					size="icon"
					onClick={handlePrevious}
					className="rounded-full w-12 h-12">
					<SkipBack className="w-6 h-6" />
				</Button>
				<Button
					variant="default"
					size="icon"
					onClick={handlePlayPause}
					className="rounded-full w-16 h-16 shadow-lg bg-amber-900 hover:bg-amber-800 text-amber-50">
					{isPlaying ? (
						<Pause className="w-8 h-8 fill-current" />
					) : (
						<Play className="w-8 h-8 fill-current ml-1" />
					)}
				</Button>
				<Button
					variant="ghost"
					size="icon"
					onClick={handleNext}
					className="rounded-full w-12 h-12">
					<SkipForward className="w-6 h-6" />
				</Button>
			</div>

			{/* Volume Control */}
			<div className="flex items-center gap-4 max-w-[200px] mx-auto">
				<Button
					variant="ghost"
					size="icon"
					className="w-8 h-8"
					onClick={() => setVolume(volume === 0 ? 1 : 0)}>
					{volume === 0 ? (
						<VolumeX className="w-4 h-4" />
					) : (
						<Volume2 className="w-4 h-4" />
					)}
				</Button>
				<Slider
					value={[volume]}
					max={1}
					step={0.01}
					onValueChange={(val) => {
						localStorage.setItem("volume", val[0].toString());
						setVolume(val[0]);
					}}
					className="cursor-pointer"
				/>
			</div>

			<AudioEngine
				file={currentTrack?.file || null}
				src={currentTrack?.src || null}
				isPlaying={isPlaying}
				volume={volume}
				setChecking={setLoading}
				onProgress={handleProgress}
				onEnded={handleEnded}
				seekTo={seekTo}
				onReady={() => {
					// Optional: handle ready state
				}}
			/>
			{/* 
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
				)} */}
		</div>
	);
}
