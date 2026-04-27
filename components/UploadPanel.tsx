"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Youtube, Plus, Loader2Icon } from "lucide-react";
import { Track } from "@/lib/db";
import { toast } from "sonner";

interface UploadPanelProps {
	onAddTrack: (track: Track) => void;
	setLoading: (bool: boolean) => void;
	loading: boolean;
}

export function UploadPanel({ onAddTrack, setLoading, loading }: UploadPanelProps) {
	const [youtubeUrl, setYoutubeUrl] = useState("");
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleFileUpload = (
		e: React.ChangeEvent<HTMLInputElement>,
	) => {
		const file = e.target.files?.[0];
		if (!file) return;

		// Create a temporary audio element to get duration
		const audio = new Audio(URL.createObjectURL(file));
		audio.onloadedmetadata = () => {
			const newTrack: Track = {
				id: crypto.randomUUID(),
				title: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
				duration: audio.duration,
				src: URL.createObjectURL(file),
				type: "local",
			};
			onAddTrack(newTrack);
			if (fileInputRef.current) fileInputRef.current.value = "";
		};
	};

	const getVideoData = async (id: string) => {
		const audioSrc = `http://localhost:3002/api/yt/id=${id}`;
		const res = await fetch(audioSrc);

		const title = decodeURIComponent(
			res.headers.get("X-Title") || "YouTube Track",
		);
		const duration = res.headers.get("X-Duration");

		if (res.status === 404) {
			toast.error("Video not found", { position: "bottom-right" });
		} else if (res.status === 400) {
			toast.error("Invalid video ID", { position: "bottom-right" });
		} else if (res.status === 429) {
			toast.error("Too many requests, please try again later", { position: "bottom-right" });
		} else if (res.status === 500) {
			toast.error("Server error, try again later", {
				position: "bottom-right",
			});
		}
			const newTrack: Track = {
					id: crypto.randomUUID(),
					title: `${title || "YouTube Track"}`, 
					duration: duration ? parseFloat(duration) : 0,
					src: audioSrc,
					youtubeId: id,
					type: "youtube",
				};

			onAddTrack(newTrack);
			setYoutubeUrl("");

	};

	const handleYoutubeAdd = async () => {
		setLoading(true);
		if (!youtubeUrl) {
			setLoading(false);
			return toast.error("Please enter a YouTube URL", {
				position: "bottom-right",
			});
		}

		// Extract video ID
		const regExp =
			/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
		const match = youtubeUrl.match(regExp);
		const videoId = match && match[2].length === 11 ? match[2] : null;

		if (videoId) {
			await getVideoData(videoId).finally(() => setLoading(false));

			setLoading(false);
		} else {
			toast.error("Invalid video ID", { position: "bottom-right" });
			setLoading(false);
		}
	};

	return (
		<div className="space-y-6">
			<div className="space-y-4">
				<div className="space-y-2">
					<Label className="text-amber-950 font-medium">
						Local Audio File
					</Label>
					<div className="flex items-center gap-4">
						<Input
							type="file"
							accept="audio/*"
							className="hidden"
							ref={fileInputRef}
							onChange={handleFileUpload}
						/>
						<Button
							variant="outline"
							className="w-full border-dashed border-2 border-amber-900/30 hover:border-amber-900 hover:bg-amber-100"
							onClick={() => fileInputRef.current?.click()}>
							<Upload className="w-4 h-4 mr-2" />
							Select Audio File
						</Button>
					</div>
				</div>

				<div className="relative mb-2">
					<div className="absolute inset-0 flex items-center">
						<span className="w-full border-t border-amber-900/10" />
					</div>
					<div className="relative flex justify-center text-xs uppercase">
						<span className="bg-amber-50 px-2 text-amber-900/50">
							Or
						</span>
					</div>
				</div>

				<div className="space-y-2">
					<Label className="text-amber-950 font-medium">
						YouTube URL
					</Label>
					<div className="flex items-center gap-2">
						<div className="relative flex-1">
							<Youtube className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-900/50" />
							<Input
								placeholder="Paste YouTube link..."
								className="pl-9"
								value={youtubeUrl}
								onChange={(e) => setYoutubeUrl(e.target.value)}
								onKeyDown={(e) =>
									e.key === "Enter" && handleYoutubeAdd()
								}
							/>
						</div>
						<Button
							onClick={handleYoutubeAdd}
							size="icon"
							className="shrink-0">
							{loading ? (
								<Loader2Icon className="w-4 h-4 animate-spin " />
							) : (
								<Plus className="w-4 h-4" />
							)}
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
