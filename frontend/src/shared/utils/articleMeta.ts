export function getRelativeTime(
  publishedAt: string | null,
): string {
  if (!publishedAt) {
    return "Date unavailable";
  }

  const publishedDate =
    new Date(publishedAt);

  const difference =
    Date.now() - publishedDate.getTime();

  const minutes =
    Math.floor(difference / 60000);

  if (minutes < 1) {
    return "Just now";
  }

  if (minutes < 60) {
    return `${minutes} min ago`;
  }

  const hours =
    Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours} hr${hours === 1 ? "" : "s"} ago`;
  }

  const days =
    Math.floor(hours / 24);

  if (days < 7) {
    return `${days} day${days === 1 ? "" : "s"} ago`;
  }

  return publishedDate.toLocaleDateString();
}


export function getReadingTime(
  content: string | null,
  summary: string | null,
): string {
  const text =
    content || summary || "";

  const wordCount =
    text.trim()
      ? text.trim().split(/\s+/).length
      : 0;

  const minutes =
    Math.max(
      1,
      Math.ceil(wordCount / 220),
    );

  return `${minutes} min read`;
}