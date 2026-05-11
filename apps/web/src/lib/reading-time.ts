// Calculate reading time from plain text content
export function calculateReadingTime(text: string): {
  minutes: number;
  words: number;
  displayText: string;
} {
  const words = text.trim().split(/\s+/).length;
  const wordsPerMinute = 200;
  const minutes = Math.ceil(words / wordsPerMinute);

  return {
    minutes,
    words,
    displayText: minutes === 1 ? "1 min read" : `${minutes} min read`,
  };
}
