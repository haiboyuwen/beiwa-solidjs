// 专辑相关类型定义
export interface Episode {
  id: string | number;
  title: string;
  cover?: string;
  picture_hori?: string;
  url?: string;
  fhd?: string;
  hd?: string;
  sd?: string;
  ld?: string;
  res_identifier?: string;
}

export interface AlbumData {
  id: number;
  title: string;
  description: string;
  category_tag: string;
  item_total_number: number;
  item_now_number: number;
  picture_hori: string;
  picture_vert: string;
  charge_pattern: number;
  product_id: string;
  price: number;
  award_money: number;
  original_price: number;
  pintuan_price: number;
  searchable?: number;
  extend_extra: {
    detail_introduction: string;
  };
}

export interface VideoAlbumData extends AlbumData {
  obj_class: string;
}

export interface AudioAlbumData extends AlbumData {
  obj_class: "CmsAudioAlbum";
}

export interface VideoAlbum {
  node_object_id: string;
  node_object_data: VideoAlbumData;
  node_relation_children: Episode[];
}

export interface AudioAlbum {
  node_object_id: string;
  node_object_data: AudioAlbumData;
  node_relation_children: Episode[];
}

export type TabType = "video" | "audio";

export interface Resolution {
  label: string;
  url: string;
}