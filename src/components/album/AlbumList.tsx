import { VideoAlbum, AudioAlbum, TabType } from '@/types/album';
import { AlbumCard } from './AlbumCard';
import { For, Show } from 'solid-js';

interface AlbumListProps {
  albums: (VideoAlbum | AudioAlbum)[];
  type: TabType;
  onPlay: (type: TabType, albumId: string) => void;
  hasMore: boolean;
}

export function AlbumList(props: AlbumListProps) {
  return (
    <Show
      when={props.albums.length > 0}
      fallback={
        <div class="text-center py-16">
          <div class="text-6xl mb-4 opacity-50">📱</div>
          <p class="text-gray-600 text-lg">暂无匹配的专辑</p>
          <p class="text-gray-500 text-sm mt-2">请尝试调整搜索条件</p>
        </div>
      }
    >
      <div class="space-y-4 sm:space-y-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          <For each={props.albums}>
            {(album) => (
              <AlbumCard
                album={album}
                type={props.type}
                onPlay={props.onPlay}
              />
            )}
          </For>
        </div>
        
        <Show when={props.hasMore}>
          <div class="text-center py-6 sm:py-8">
            <div class="inline-flex items-center justify-center gap-3 text-gray-600">
              <div class="w-4 h-4 border-2 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
              <span class="text-sm sm:text-base">向下滑动加载更多...</span>
            </div>
          </div>
        </Show>
      </div>
    </Show>
  );
}