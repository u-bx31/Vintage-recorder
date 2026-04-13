"use client";

import React, { useEffect, useRef, useState } from "react";
import YouTube, { YouTubeProps } from "react-youtube";

interface YouTubePlayerProps {
	curentTrack: any;
	videoId: string | null;
	isPlaying: boolean;
	volume: number;
	onProgress: (currentTime: number, duration: number) => void;
	onEnded: () => void;
	seekTo: number | null;
	onReady: () => void;
}

export function YouTubePlayer({
	curentTrack,
	videoId,
	isPlaying,
	volume,
	onProgress,
	onEnded,
	seekTo,
	onReady,
}: YouTubePlayerProps) {
	const playerRef = useRef<any>(null);
	const [isPlayerReady, setIsPlayerReady] = useState(false);

	if (
		!videoId ||
		typeof videoId !== "string" ||
		videoId.trim() === ""
	) {
		return null;
	}

	const onPlayerReady: YouTubeProps["onReady"] = (event) => {
		playerRef.current = event.target;
		event.target.setVolume(volume * 100);
	};

	useEffect(() => {
		if (isPlaying) {
			playerRef.current?.playVideo();
		} else {
			playerRef.current?.pauseVideo();
		}
	}, [isPlaying, isPlayerReady]);

	useEffect(() => {
		playerRef.current?.setVolume(volume * 100);
	}, [volume, isPlayerReady]);

	useEffect(() => {
		try {
			playerRef.current?.seekTo(seekTo, true);
		} catch (e) {
			console.warn("Player not ready", e);
		}
	}, [seekTo, isPlayerReady]);

	useEffect(() => {
		const currentTime = playerRef.current?.getCurrentTime();
		const duration = playerRef.current?.getDuration();
		onProgress(currentTime, duration);
	}, [isPlaying, isPlayerReady, onProgress]);

	// useEffect(() => {
	// 	return () => {
	// 		if (playerRef.current) {
	// 			try {
	// 				playerRef.current.destroy();
	// 			} catch (e) {
	// 				console.warn("Destroy failed", e);
	// 			}
	// 		}
	// 	};
	// }, []);

	const opts: YouTubeProps["opts"] = {
		height: "0",
		width: "0",
		playerVars: {
			autoplay: 0,
			controls: 0,
			disablekb: 1,
			fs: 0,
			modestbranding: 1,
			rel: 0,
			iv_load_policy: 3,
			enablejsapi: 1, // ✅ ADD THIS
			origin:
				typeof window !== "undefined" ? window.location.origin : "",
		},
	};
	// console.log("ref", playerRef.current);
	// console.log("isPlaying", isPlaying);

	return (
		<div className="absolute w-0 h-0 overflow-hidden">
			<YouTube
				videoId={videoId}
				opts={opts}
				onReady={onPlayerReady}
				onEnd={onEnded}
				loading="lazy"
			/>
		</div>
	);
}
