import { createMemo, Show, onMount, onCleanup } from "solid-js";
import { createStore } from "solid-js/store";
import { useNavigate } from "@solidjs/router";
import { TabType } from "@/types/album";
import { createAlbumFilter, createInfiniteScroll } from "@/lib/albumsStore";
import { extractTags } from "@/lib/api";
import { TabSwitcher } from "@/components/ui/TabSwitcher";
import { SearchBar } from "@/components/ui/SearchBar";
import { AlbumList } from "@/components/album/AlbumList";

interface HomePageProps {
  videoAlbums: () => any[] | undefined;
  audioAlbums: () => any[] | undefined;
}

// 首页状态类型
interface HomeState {
  scrollY: number;
  tab: TabType;
  search: string;
  videoTag: string;
  audioTag: string;
  videoPage: number;
  audioPage: number;
  isRestoring: boolean;
}

// 保存首页状态到 sessionStorage
function saveHomeState(state: Omit<HomeState, 'isRestoring'>) {
  sessionStorage.setItem('homeState', JSON.stringify(state));
}

// 从 sessionStorage 加载首页状态
function loadHomeState(): Partial<HomeState> | null {
  try {
    const saved = sessionStorage.getItem('homeState');
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

export default function HomePage(props: HomePageProps) {
  const navigate = useNavigate();
  
  // 加载保存的状态
  const savedState = loadHomeState();
  
  // 使用 createStore 统一管理状态
  const [state, setState] = createStore<HomeState>({
    scrollY: savedState?.scrollY || 0,
    tab: savedState?.tab || "video",
    search: savedState?.search || "",
    videoTag: savedState?.videoTag || "",
    audioTag: savedState?.audioTag || "",
    videoPage: savedState?.videoPage || 1,
    audioPage: savedState?.audioPage || 1,
    isRestoring: !!savedState,
  });

  // 恢复滚动位置
  onMount(() => {
    if (savedState?.scrollY) {
      const restoreScroll = () => {
        const hasContent = (props.videoAlbums()?.length || 0) > 0 || (props.audioAlbums()?.length || 0) > 0;
        if (hasContent) {
          setTimeout(() => {
            window.scrollTo({ top: savedState.scrollY, behavior: 'instant' });
            setState('isRestoring', false);
          }, 100);
        } else {
          requestAnimationFrame(restoreScroll);
        }
      };
      restoreScroll();
    } else {
      setState('isRestoring', false);
    }
  });

  // 在离开页面前保存状态
  onMount(() => {
    const saveCurrentState = () => {
      saveHomeState({
        scrollY: window.scrollY,
        tab: state.tab,
        search: state.search,
        videoTag: state.videoTag,
        audioTag: state.audioTag,
        videoPage: state.videoPage,
        audioPage: state.audioPage,
      });
    };

    // 定期保存滚动位置
    let scrollTimeout: number;
    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = window.setTimeout(saveCurrentState, 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('beforeunload', saveCurrentState);
    document.addEventListener('visibilitychange', saveCurrentState);

    onCleanup(() => {
      saveCurrentState();
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('beforeunload', saveCurrentState);
      document.removeEventListener('visibilitychange', saveCurrentState);
      clearTimeout(scrollTimeout);
    });
  });

  // 提取标签
  const videoTags = createMemo(() => extractTags(props.videoAlbums() || []));
  const audioTags = createMemo(() => extractTags(props.audioAlbums() || []));

  // 视频专辑过滤
  const { filteredAlbums: filteredVideoAlbums, pagedAlbums: pagedVideoAlbums } = 
    createAlbumFilter(props.videoAlbums, () => state.search, () => state.videoTag, () => state.videoPage);
  
  // 音频专辑过滤
  const { filteredAlbums: filteredAudioAlbums, pagedAlbums: pagedAudioAlbums } = 
    createAlbumFilter(props.audioAlbums, () => state.search, () => state.audioTag, () => state.audioPage);

  // 无限滚动
  createInfiniteScroll(
    () => state.tab,
    () => state.videoPage,
    () => state.audioPage,
    (page) => setState('videoPage', page),
    (page) => setState('audioPage', page),
    () => filteredVideoAlbums().length,
    () => filteredAudioAlbums().length
  );

  function playAlbum(type: TabType, albumId: string) {
    if (type === "audio") {
      navigate(`/audio_play?album=${albumId}&ep=0`);
    } else {
      navigate(`/play?album=${albumId}&ep=0`);
    }
  }

  return (
    <div class="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      {/* 标题栏 */}
      <div class="bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 shadow-lg">
        <div class="container mx-auto px-4 py-8">
          <h1 class="text-4xl font-bold text-center text-white drop-shadow-md">
            🌟 快乐星球
          </h1>
          <p class="text-center text-purple-100 text-base mt-3">发现精彩内容，享受快乐时光 ✨</p>
        </div>
      </div>
      <div class="max-w-7xl mx-auto px-2 sm:px-4">
        <TabSwitcher
          activeTab={state.tab}
          onTabChange={(newTab) => setState('tab', newTab)}
        />
        
        <div class="py-4 sm:py-6">
          <SearchBar
            search={state.search}
            onSearchChange={(value) => {
              setState('search', value);
              setState('videoPage', 1);
              setState('audioPage', 1);
            }}
            selectedTag={state.tab === "video" ? state.videoTag : state.audioTag}
            onTagChange={(value) => {
              if (state.tab === "video") {
                setState('videoTag', value);
              } else {
                setState('audioTag', value);
              }
              setState('videoPage', 1);
              setState('audioPage', 1);
            }}
            tags={state.tab === "video" ? videoTags() : audioTags()}
          />
        </div>
        
        <div class="pb-6 sm:pb-8 px-2 sm:px-0">
          <Show
            when={state.tab === "video"}
            fallback={
              <AlbumList
                albums={pagedAudioAlbums()}
                type="audio"
                onPlay={playAlbum}
                hasMore={pagedAudioAlbums().length < filteredAudioAlbums().length}
              />
            }
          >
            <AlbumList
              albums={pagedVideoAlbums()}
              type="video"
              onPlay={playAlbum}
              hasMore={pagedVideoAlbums().length < filteredVideoAlbums().length}
            />
          </Show>
        </div>
      </div>
    </div>
  );
}