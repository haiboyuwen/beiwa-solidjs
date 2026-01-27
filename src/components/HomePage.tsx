import { createSignal, createMemo, Show, onMount, onCleanup, createEffect } from "solid-js";
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

// 保存首页状态的工具函数
function saveHomeState(state: {
  scrollY: number;
  tab: TabType;
  search: string;
  videoTag: string;
  audioTag: string;
  videoPage: number;
  audioPage: number;
}) {
  sessionStorage.setItem('homeState', JSON.stringify(state));
}

function loadHomeState() {
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
  
  const [tab, setTab] = createSignal<TabType>(savedState?.tab || "video");
  const [search, setSearch] = createSignal(savedState?.search || "");
  const [videoTag, setVideoTag] = createSignal(savedState?.videoTag || "");
  const [audioTag, setAudioTag] = createSignal(savedState?.audioTag || "");
  const [videoPage, setVideoPage] = createSignal(savedState?.videoPage || 1);
  const [audioPage, setAudioPage] = createSignal(savedState?.audioPage || 1);
  const [isRestoring, setIsRestoring] = createSignal(!!savedState);

  // 恢复滚动位置
  onMount(() => {
    if (savedState?.scrollY) {
      // 等待数据加载和内容渲染后恢复滚动位置
      const restoreScroll = () => {
        const hasContent = (props.videoAlbums()?.length || 0) > 0 || (props.audioAlbums()?.length || 0) > 0;
        if (hasContent) {
          setTimeout(() => {
            window.scrollTo({ top: savedState.scrollY, behavior: 'instant' });
            setIsRestoring(false);
          }, 100);
        } else {
          // 如果数据还没加载，等待下一帧再试
          requestAnimationFrame(restoreScroll);
        }
      };
      restoreScroll();
    } else {
      setIsRestoring(false);
    }
  });

  // 在离开页面前保存状态（通过监听 visibilitychange 和 beforeunload）
  onMount(() => {
    const saveCurrentState = () => {
      saveHomeState({
        scrollY: window.scrollY,
        tab: tab(),
        search: search(),
        videoTag: videoTag(),
        audioTag: audioTag(),
        videoPage: videoPage(),
        audioPage: audioPage(),
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
      saveCurrentState(); // 组件卸载时保存
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
    createAlbumFilter(props.videoAlbums, search, videoTag, videoPage);
  
  // 音频专辑过滤
  const { filteredAlbums: filteredAudioAlbums, pagedAlbums: pagedAudioAlbums } = 
    createAlbumFilter(props.audioAlbums, search, audioTag, audioPage);

  // 无限滚动
  createInfiniteScroll(
    tab,
    videoPage,
    audioPage,
    setVideoPage,
    setAudioPage,
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
      <div class="container mx-auto px-2 sm:px-4">
        <TabSwitcher
          activeTab={tab()}
          onTabChange={(newTab) => {
            setTab(newTab);
            // 切换 Tab 时不重置搜索和分页，保持用户状态
          }}
        />
        
        <div class="py-4 sm:py-6">
          <SearchBar
            search={search()}
            onSearchChange={(value) => {
              setSearch(value);
              setVideoPage(1);
              setAudioPage(1);
            }}
            selectedTag={tab() === "video" ? videoTag() : audioTag()}
            onTagChange={(value) => {
              if (tab() === "video") {
                setVideoTag(value);
              } else {
                setAudioTag(value);
              }
              setVideoPage(1);
              setAudioPage(1);
            }}
            tags={tab() === "video" ? videoTags() : audioTags()}
          />
        </div>
        
        <div class="pb-6 sm:pb-8 px-2 sm:px-0">
          <Show
            when={tab() === "video"}
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