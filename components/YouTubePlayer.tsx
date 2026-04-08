"use client";

import React, { useEffect, useRef, useState } from "react";
import YouTube, { YouTubeProps } from "react-youtube";

interface YouTubePlayerProps {
	videoId: string | null;
	isPlaying: boolean;
	volume: number;
	onProgress: (currentTime: number, duration: number) => void;
	onEnded: () => void;
	seekTo: number | null;
	onReady: () => void;
}

export function YouTubePlayer({
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

	const onPlayerReady: YouTubeProps["onReady"] = (event) => {
		playerRef.current = event.target;
		setIsPlayerReady(true);
		event.target.setVolume(volume * 100);
		onReady();
	};

	useEffect(() => {
		if (!playerRef.current || !isPlayerReady) return;

		if (isPlaying) {
			playerRef.current.playVideo();
		} else {
			playerRef.current.pauseVideo();
		}
	}, [isPlaying, isPlayerReady]);

	useEffect(() => {
		if (!playerRef.current || !isPlayerReady) return;
		playerRef.current.setVolume(volume * 100);
	}, [volume, isPlayerReady]);

	useEffect(() => {
		if (!playerRef.current || !isPlayerReady) return;

		try {
			playerRef.current.seekTo(seekTo, true);
		} catch (e) {
			console.warn("Player not ready", e);
		}
	}, [seekTo, isPlayerReady]);

	useEffect(() => {
		if (!playerRef.current || !isPlayerReady) return;

		if (playerRef.current.getPlayerState() === 1) {
			const currentTime = playerRef.current.getCurrentTime();
			const duration = playerRef.current.getDuration();
			onProgress(currentTime, duration);
		}
	}, [isPlaying, isPlayerReady, onProgress]);

	useEffect(() => {
		return () => {
			if (playerRef.current) {
				try {
					playerRef.current.destroy();
				} catch (e) {
					console.warn("Destroy failed", e);
				}
			}
		};
	}, []);

	if (!videoId) return null;

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

	return (
		<div className="absolute w-0 h-0 overflow-hidden">
			<YouTube
				videoId={videoId}
				opts={opts}
				onReady={onPlayerReady}
				onEnd={onEnded}
				onError={(e) => console.error(e)}
			/>
		</div>
	);
}
