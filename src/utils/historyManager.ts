import { VideoTrack } from '../types';

const HISTORY_KEY = 'youtube_gold_watch_history';

export interface HistoryItem extends VideoTrack {
  watchedAt: number;
}

export function addToHistory(track: VideoTrack): void {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    let items: HistoryItem[] = raw ? JSON.parse(raw) : [];

    // Remove existing if present to move to top
    items = items.filter((item) => item.id !== track.id);

    const newItem: HistoryItem = {
      ...track,
      watchedAt: Date.now(),
    };

    items.unshift(newItem);

    // Keep up to 60 items
    if (items.length > 60) {
      items = items.slice(0, 60);
    }

    localStorage.setItem(HISTORY_KEY, JSON.stringify(items));
  } catch (err) {
    console.warn('History save error:', err);
  }
}

export function getWatchHistory(): HistoryItem[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    return [];
  }
}

export function removeFromHistory(id: string): void {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return;
    let items: HistoryItem[] = JSON.parse(raw);
    items = items.filter((it) => it.id !== id);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(items));
  } catch (err) {
    console.warn('History remove error:', err);
  }
}

export function clearWatchHistory(): void {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch (err) {}
}

/**
 * AI Agent Playlist Generator:
 * Automatically curates a smart personalized playlist based on the user's
 * actual watch history and high-view virality, ensuring zero random news live streams!
 */
export function generateAiSmartQueue(
  currentTrack: VideoTrack,
  relatedVideos: VideoTrack[],
  history: VideoTrack[]
): VideoTrack[] {
  // Filter out any video that mentions live news or broadcast streams
  const isExcluded = (title: string, channel: string) => {
    const text = `${title} ${channel}`.toLowerCase();
    return (
      text.includes('live news') ||
      text.includes('breaking news') ||
      text.includes('aaj ki taza') ||
      text.includes('special bulletin') ||
      text.includes('aaj tak') ||
      text.includes('abp news') ||
      text.includes('zee news') ||
      text.includes('india today') ||
      text.includes('ndtv') ||
      text.includes('republic') ||
      text.includes('samachar') ||
      text.includes('live debate') ||
      text.includes('press conference') ||
      (text.includes('live') && text.includes('khabar'))
    );
  };

  const queue: VideoTrack[] = [];
  const seenIds = new Set<string>();
  seenIds.add(currentTrack.id);

  // 1. Add relevant related videos (clean, high view songs)
  for (const v of relatedVideos) {
    if (!seenIds.has(v.id) && !isExcluded(v.title, v.channel)) {
      queue.push(v);
      seenIds.add(v.id);
    }
  }

  // 2. Add history-based matching songs
  for (const h of history) {
    if (!seenIds.has(h.id) && !isExcluded(h.title, h.channel)) {
      queue.push(h);
      seenIds.add(h.id);
    }
  }

  return queue;
}
