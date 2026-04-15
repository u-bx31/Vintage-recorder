"use server";
import { ratelimit } from "@/lib/rate-limit";
export async function GET(req: Request) {
	try {
		const { searchParams } = new URL(req.url);
		const videoId = searchParams.get("id");

		// const ip = req.headers.get("x-forwarded-for") ?? "anonymous";

		// const { success } = await ratelimit.limit(ip);

		// if (!success) {
		// 	return new Response("Too many requests", { status: 429 });
		// }

		if (!videoId || !/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
			return new Response("Invalid video ID", { status: 400 });
		}

		const API_KEY = process.env.YOUTUBE_API_KEY;

		const res = await fetch(
			`https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoId}&key=${API_KEY}`,
			{
				next: { revalidate: 86400 }, // ✅ cache 24h
			},
		);

		if (!res.ok) {
			return new Response("YouTube API error", { status: 500 });
		}

		const data = await res.json();

		if (!data.items || data.items.length === 0) {
			return new Response("Video not found", { status: 404 });
		}

		const video = data.items?.[0];


		return Response.json({
			title: video.snippet.title,
			duration: video.contentDetails.duration,
			thumbnail: video.snippet.thumbnails.medium.url,
		});
	} catch (err) {
		return new Response("Server error", { status: 500 });
	}
}
