import { cache } from '@solidjs/router';
import { VideoAlbum, AudioAlbum } from '@/types/album';

// 直接导入 JSON 数据，避免服务器端 fetch 问题
import videoAlbumsData from '@/data/video_albums.json';
import audioAlbumsData from '@/data/audio_albums.json';

// 使用 cache 缓存数据获取，符合 SolidStart 最佳实践
export const getVideoAlbums = cache(async (): Promise<VideoAlbum[]> => {
  "use server";
  try {
    return videoAlbumsData as VideoAlbum[] || [];
  } catch (error) {
    console.error('Error fetching video albums:', error);
    return [];
  }
}, "video-albums");

export const getAudioAlbums = cache(async (): Promise<AudioAlbum[]> => {
  "use server";
  try {
    return audioAlbumsData as AudioAlbum[] || [];
  } catch (error) {
    console.error('Error fetching audio albums:', error);
    return [];
  }
}, "audio-albums");

// 根据ID查找视频专辑
export function findVideoAlbumById(albums: VideoAlbum[], albumId: string): VideoAlbum | null {
  return albums.find(a => 
    String(a.node_object_id) === albumId || 
    String(a.node_object_data.id) === albumId
  ) || null;
}

// 根据ID查找音频专辑
export function findAudioAlbumById(albums: AudioAlbum[], albumId: string): AudioAlbum | null {
  return albums.find(a => 
    String(a.node_object_id) === albumId || 
    String(a.node_object_data.id) === albumId
  ) || null;
}

// 提取标签
export function extractTags(albums: (VideoAlbum | AudioAlbum)[]): string[] {
  return Array.from(
    new Set(
      albums.flatMap((album) =>
        (album.node_object_data?.category_tag || "")
          .split(",")
          .map((tag: string) => (typeof tag === 'string' ? tag.trim() : ""))
          .filter((tag: string) => !!tag)
      )
    )
  );
}