import { z } from 'zod';

/**
 * 专辑数据 Schema - 基础字段
 */
export const AlbumDataBaseSchema = z.object({
  id: z.number().int().optional(),
  title: z.string(),
  description: z.string(),
  picture_hori: z.string(),
  item_total_number: z.number().int(),
  category_tag: z.string().optional(),
});

/**
 * 视频专辑 Episodes Schema
 */
export const VideoEpisodeSchema = z.object({
  title: z.string(),
  fhd: z.string().optional(),
  hd: z.string().optional(),
  sd: z.string().optional(),
  ld: z.string().optional(),
});

/**
 * 视频专辑完整 Schema
 */
export const VideoAlbumSchema = z.object({
  node_object_id: z.string(),
  node_object_data: AlbumDataBaseSchema,
  node_relation_children: z.array(VideoEpisodeSchema).optional(),
});

/**
 * 音频专辑 Episodes Schema
 */
export const AudioEpisodeSchema = z.object({
  title: z.string(),
  res_identifier: z.string(),
});

/**
 * 音频专辑完整 Schema
 */
export const AudioAlbumSchema = z.object({
  node_object_id: z.string(),
  node_object_data: AlbumDataBaseSchema,
  node_relation_children: z.array(AudioEpisodeSchema).optional(),
});

/**
 * URL 参数验证
 */
export const PlayParamsSchema = z.object({
  albumId: z.string().min(1, 'Album ID is required'),
  ep: z.string().optional().transform((val) => {
    if (!val) return undefined;
    const parsed = parseInt(val, 10);
    return isNaN(parsed) ? undefined : parsed;
  }),
});

/**
 * 搜索参数验证
 */
export const SearchParamsSchema = z.object({
  query: z.string().max(100).optional(),
  tag: z.string().max(50).optional(),
  page: z.number().int().positive().default(1),
});

/**
 * Tab 类型验证
 */
export const TabTypeSchema = z.enum(['video', 'audio']);

// 导出类型
export type AlbumData = z.infer<typeof AlbumDataBaseSchema>;
export type VideoEpisode = z.infer<typeof VideoEpisodeSchema>;
export type AudioEpisode = z.infer<typeof AudioEpisodeSchema>;
export type VideoAlbum = z.infer<typeof VideoAlbumSchema>;
export type AudioAlbum = z.infer<typeof AudioAlbumSchema>;
export type PlayParams = z.infer<typeof PlayParamsSchema>;
export type SearchParams = z.infer<typeof SearchParamsSchema>;
export type TabType = z.infer<typeof TabTypeSchema>;
