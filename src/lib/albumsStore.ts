import { createSignal, createMemo, onMount } from 'solid-js';
import { isServer } from 'solid-js/web';
import { VideoAlbum, AudioAlbum, TabType } from '@/types/album';
import { extractTags } from '@/lib/api';

const PAGE_SIZE = 50;

// 搜索和筛选逻辑
export function createAlbumFilter(
  albums: () => (VideoAlbum | AudioAlbum)[] | undefined,
  search: () => string,
  tag: () => string,
  page: () => number
) {
  const filteredAlbums = createMemo(() => {
    const albumsData = albums();
    if (!albumsData || !Array.isArray(albumsData)) return [];
    
    return albumsData.filter(album => {
      // 确保专辑数据有效且完整
      if (!album || !album.node_object_data) return false;
      
      const data = album.node_object_data;
      if (!data.title || data.item_total_number === undefined || data.item_total_number === null) {
        return false;
      }
      
      const title = data.title || "";
      const desc = data.description || "";
      const tags = (data.category_tag || "")
        .split(",")
        .map((t) => (typeof t === 'string' ? t.trim() : ""));
      
      const searchValue = search();
      const tagValue = tag();
      
      const matchSearch = !searchValue || 
        title.includes(searchValue) || 
        desc.includes(searchValue) || 
        tags.some((t) => t.includes(searchValue));
      
      const matchTag = !tagValue || tags.includes(tagValue);
      
      return matchSearch && matchTag;
    });
  });

  const pagedAlbums = createMemo(() => {
    const filtered = filteredAlbums();
    const currentPage = page();
    return filtered.slice(0, currentPage * PAGE_SIZE);
  });

  return { filteredAlbums, pagedAlbums };
}

// 无限滚动 Hook
export function createInfiniteScroll(
  tab: () => TabType,
  videoPage: () => number,
  audioPage: () => number,
  setVideoPage: (value: number | ((prev: number) => number)) => void,
  setAudioPage: (value: number | ((prev: number) => number)) => void,
  filteredVideoLength: () => number,
  filteredAudioLength: () => number
) {
  let loadingRef = false;

  onMount(() => {
    if (isServer) return;
    
    function handleScroll() {
      if (loadingRef) return;
      
      const scrollY = window.scrollY || window.pageYOffset;
      const viewportHeight = window.innerHeight;
      const fullHeight = document.documentElement.scrollHeight;
      
      if (fullHeight - (scrollY + viewportHeight) < 100) {
        loadingRef = true;
        
        if (tab() === "video") {
          setVideoPage((p: number) => {
            if (p * PAGE_SIZE < filteredVideoLength()) return p + 1;
            return p;
          });
        } else {
          setAudioPage((p: number) => {
            if (p * PAGE_SIZE < filteredAudioLength()) return p + 1;
            return p;
          });
        }
        
        setTimeout(() => { loadingRef = false; }, 200);
      }
    }
    
    // 使用 passive 选项提升滚动性能
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  });
}