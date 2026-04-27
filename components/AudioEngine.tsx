"use client";

import React, { useEffect, useRef } from "react";

interface AudioEngineProps {
	src ?: string | null;
	isPlaying: boolean;
	volume: number;
	onProgress: (currentTime: number, duration: number) => void;
	onEnded: () => void;
	setChecking: (bool: boolean) => void;
	seekTo: number | null;
	onReady: () => void;
}

export function AudioEngine({
	src,
	isPlaying,
	volume,
	setChecking,
	onProgress,
	onEnded,
	seekTo,
	onReady,
}: AudioEngineProps) {
	const audioRef = useRef<HTMLAudioElement>(null);
	const audioContextRef = useRef<AudioContext | null>(null);
	const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(
		null,
	);
	const objectUrlRef = useRef<string | null>(null);

	useEffect(() => {
		

		if (audioRef.current) {
			if (!audioContextRef.current) {
				const AudioContext =
					window.AudioContext || window.webkitAudioContext;
				audioContextRef.current = new AudioContext();
			}

			const ctx = audioContextRef.current;

			// 2. ONLY create the source if we haven't already
			if (!sourceNodeRef.current) {
				sourceNodeRef.current = ctx.createMediaElementSource(
					audioRef.current,
				);
			}

			const source = sourceNodeRef.current;

			// 3. Re-build the filters
			const bandpass = ctx.createBiquadFilter();
			bandpass.type = "bandpass";
			bandpass.frequency.value = 2000;

			const highpass = ctx.createBiquadFilter();
			highpass.type = "highpass";
			highpass.frequency.value = 200;

			const lowpass = ctx.createBiquadFilter();
			lowpass.type = "lowpass";
			lowpass.frequency.value = 4000;

			// 4. IMPORTANT: Disconnect anything previously connected to the source
			// This allows you to "re-wire" the chain if settings change
			source.disconnect();

			// 5. Connect the chain
			source.connect(bandpass);
			bandpass.connect(highpass);
			highpass.connect(lowpass);
			lowpass.connect(ctx.destination);
			audioRef.current.load();
		}

		return () => {
		
		};
	}, [src]);

	useEffect(() => {
		if (!audioRef.current) return;

		if (isPlaying) {
			audioRef.current
				.play()
				.catch((e) => console.error("Playback failed", e));
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
		onProgress(
			audioRef.current.currentTime,
			audioRef.current.duration,
		);
	};

	const handleLoadedMetadata = () => {
		onReady();
	};

	return (
		<audio
			ref={audioRef}
			src={src}
			crossOrigin="anonymous"
			onPlay={() => console.log("playing")}
			onWaiting={() => setChecking(true)}
			onCanPlay={() => setChecking(false)}
			onPause={() => console.log("paused")}
			onTimeUpdate={handleTimeUpdate}
			onEnded={onEnded}
			onLoadedMetadata={handleLoadedMetadata}
			className="hidden"
		/>
	);
}
