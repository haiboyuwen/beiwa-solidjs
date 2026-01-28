import { z } from 'zod';
import { 
  VideoAlbumSchema, 
  AudioAlbumSchema, 
  PlayParamsSchema,
  type VideoAlbum,
  type AudioAlbum 
} from '@/lib/schemas';

/**
 * 验证并解析视频专辑数据
 */
export function validateVideoAlbums(data: unknown): VideoAlbum[] {
  try {
    return z.array(VideoAlbumSchema).parse(data);
  } catch (error) {
    console.error('Video albums validation error:', error);
    return [];
  }
}

/**
 * 验证并解析音频专辑数据
 */
export function validateAudioAlbums(data: unknown): AudioAlbum[] {
  try {
    return z.array(AudioAlbumSchema).parse(data);
  } catch (error) {
    console.error('Audio albums validation error:', error);
    return [];
  }
}

/**
 * 安全验证单个视频专辑
 */
export function safeParseVideoAlbum(data: unknown) {
  return VideoAlbumSchema.safeParse(data);
}

/**
 * 安全验证单个音频专辑
 */
export function safeParseAudioAlbum(data: unknown) {
  return AudioAlbumSchema.safeParse(data);
}

/**
 * 验证播放页面 URL 参数
 */
export function validatePlayParams(params: unknown) {
  const result = PlayParamsSchema.safeParse(params);
  
  if (!result.success) {
    console.error('Play params validation error:', result.error);
    return { albumId: '', ep: undefined };
  }
  
  return result.data;
}

/**
 * 安全获取字符串参数
 */
export function safeGetStringParam(value: string | string[] | undefined): string {
  if (Array.isArray(value)) {
    return value[0] || '';
  }
  return value || '';
}

/**
 * 安全获取数字参数
 */
export function safeGetNumberParam(value: string | string[] | undefined): number | undefined {
  const str = safeGetStringParam(value);
  if (!str) return undefined;
  
  const num = parseInt(str, 10);
  return isNaN(num) ? undefined : num;
}
