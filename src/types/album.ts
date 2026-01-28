// 专辑相关类型定义
// 使用 Zod Schema 生成类型以确保运行时验证
export * from '@/lib/schemas';

// 兼容旧类型的别名（用于平滑迁移）
export type { 
  VideoEpisode as Episode,
  AlbumData,
  VideoAlbum,
  AudioAlbum,
  TabType
} from '@/lib/schemas';


export interface Resolution {
  label: string;
  url: string;
}