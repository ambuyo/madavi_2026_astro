import type { WordPressPost } from "./fetch";
import * as fs from "fs";
import * as path from "path";

const CACHE_DIR = ".cache";
const POSTS_CACHE_FILE = path.join(CACHE_DIR, "wordpress-posts.json");

export async function readCachedPosts(): Promise<WordPressPost[] | null> {
  try {
    if (!fs.existsSync(POSTS_CACHE_FILE)) {
      return null;
    }
    const data = fs.readFileSync(POSTS_CACHE_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return null;
  }
}

export async function writeCachedPosts(posts: WordPressPost[]): Promise<void> {
  try {
    if (!fs.existsSync(CACHE_DIR)) {
      fs.mkdirSync(CACHE_DIR, { recursive: true });
    }
    fs.writeFileSync(POSTS_CACHE_FILE, JSON.stringify(posts, null, 2));
  } catch (error) {
    console.error("Failed to write posts cache:", error);
  }
}
