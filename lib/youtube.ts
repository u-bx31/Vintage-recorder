export function parseDuration(iso: string) {
  const match = iso.match(/PT(\d+H)?(\d+M)?(\d+S)?/);

  const hours = match?.[1] ? parseInt(match[1]) : 0;
  const minutes = match?.[2] ? parseInt(match[2]) : 0;
  const seconds = match?.[3] ? parseInt(match[3]) : 0;

  const totalMinutes = hours * 60 + minutes;

  return `${totalMinutes}:${seconds.toString().padStart(2, "0")}`;
}