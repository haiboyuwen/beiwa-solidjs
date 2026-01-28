import { z } from 'zod';

/**
 * 专辑数据 Schema
 */
export const AlbumDataSchema = z.object({
  title: z.string(),
  description: z.string(),
  picture_hori: z.string().url(),
  item_total_number: z.number().int().positive(),
  item_now_number: z.number().int().nonnegative(),
  category_tag: z.string().optional(),
  charge_pattern: z.number().int().nonnegative(),
});

export const AlbumSchema = z.object({
  node_object_id: z.string(),
  node_object_data: AlbumDataSchema,
});

/**
 * 视频专辑 Episodes Schema
 */
export const VideoEpisodeSchema = z.object({
  ep: z.number().int().positive(),
  title: z.string(),
  res_identifier: z.string().url(),
  fhd: z.string().url().optional(),
  hd: z.string().url().optional(),
  sd: z.string().url().optional(),
  ld: z.string().url().optional(),
});

export const VideoAlbumSchema = AlbumSchema.extend({
  node_object_data: AlbumDataSchema.extend({
    episodes: z.array(VideoEpisodeSchema).optional(),
  }),
  node_relation_children: z.array(VideoEpisodeSchema).optional(),
});

/**
 * 音频专辑 Episodes Schema
 */
export const AudioEpisodeSchema = z.object({
  ep: z.number().int().positive(),
  title: z.string(),
  res_identifier: z.string().url(),
});

export const AudioAlbumSchema = AlbumSchema.extend({
  node_object_data: AlbumDataSchema.extend({
    episodes: z.array(AudioEpisodeSchema).optional(),
  }),
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
export type AlbumData = z.infer<typeof AlbumDataSchema>;
export type Album = z.infer<typeof AlbumSchema>;
export type VideoEpisode = z.infer<typeof VideoEpisodeSchema>;
export type AudioEpisode = z.infer<typeof AudioEpisodeSchema>;
export type VideoAlbum = z.infer<typeof VideoAlbumSchema>;
export type AudioAlbum = z.infer<typeof AudioAlbumSchema>;
export type PlayParams = z.infer<typeof PlayParamsSchema>;
export type SearchParams = z.infer<typeof SearchParamsSchema>;
export type TabType = z.infer<typeof TabTypeSchema>;
