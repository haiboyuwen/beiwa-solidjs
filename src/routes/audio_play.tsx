import { useSearchParams, useNavigate, A } from "@solidjs/router";
import { createAsync } from "@solidjs/router";
import { Show, For, createSignal, createMemo, onMount, onCleanup, createEffect } from "solid-js";
import { getAudioAlbums, findAudioAlbumById } from "@/lib/api";

export default function AudioPlayPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const albumId = () => {
    const param = searchParams.album;
    return Array.isArray(param) ? param[0] : param;
  };
  const episodeIndex = () => Number(searchParams.ep || "0");

  const audioAlbums = createAsync(() => getAudioAlbums());
  const currentAlbum = () => {
    const albums = audioAlbums();
    const id = albumId();
    return albums && id ? findAudioAlbumById(albums, id) : null;
  };

  const episodes = () => currentAlbum()?.node_relation_children || [];
  const currentEpisode = () => episodes()[episodeIndex()];
  
  // 音频播放状态
  const [isPlaying, setIsPlaying] = createSignal(false);
  const [currentTime, setCurrentTime] = createSignal(0);
  const [duration, setDuration] = createSignal(0);
  let audioRef: HTMLAudioElement | undefined;

  const audioUrl = createMemo(() => {
    const ep = currentEpisode();
    if (!ep) return '';
    return ep.res_identifier || '';
  });

  const playEpisode = (index: number) => {
    setSearchParams({ album: albumId()!, ep: String(index) });
  };

  const playNext = () => {
    const nextIndex = episodeIndex() + 1;
    if (nextIndex < episodes().length) {
      playEpisode(nextIndex);
    }
  };

  const playPrev = () => {
    const prevIndex = episodeIndex() - 1;
    if (prevIndex >= 0) {
      playEpisode(prevIndex);
    }
  };

  const togglePlay = () => {
    if (!audioRef) return;
    if (isPlaying()) {
      audioRef.pause();
    } else {
      audioRef.play();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  onMount(() => {
    if (audioRef) {
      audioRef.addEventListener('play', () => setIsPlaying(true));
      audioRef.addEventListener('pause', () => setIsPlaying(false));
      audioRef.addEventListener('timeupdate', () => setCurrentTime(audioRef!.currentTime));
      audioRef.addEventListener('loadedmetadata', () => setDuration(audioRef!.duration));
      audioRef.addEventListener('ended', playNext);
    }
  });

  createEffect(() => {
    const url = audioUrl();
    if (audioRef && url) {
      audioRef.load();
      audioRef.play().catch(() => {});
    }
  });

  onCleanup(() => {
    if (audioRef) {
      audioRef.pause();
    }
  });

  return (
    <div class="min-h-screen bg-gradient-to-br from-purple-950 via-pink-900 to-purple-950">
      <Show
        when={currentAlbum()}
        fallback={
          <div class="flex items-center justify-center min-h-screen">
            <div class="text-center">
              <div class="w-16 h-16 border-4 border-purple-300 border-t-pink-500 rounded-full animate-spin mx-auto mb-4"></div>
              <p class="text-purple-200 text-lg">加载中...</p>
            </div>
          </div>
        }
      >
        {(album) => (
          <div class="container mx-auto px-4 py-6 max-w-6xl">
            {/* 返回按钮 */}
            <div class="mb-6">
              <button
                onClick={() => navigate("/")}
                class="group inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-600/80 to-pink-600/80 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl transition-all duration-300 border-none cursor-pointer backdrop-blur-md shadow-lg hover:shadow-xl hover:-translate-y-0.5 font-medium"
              >
                <svg class="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>返回</span>
              </button>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* 左侧：播放器和专辑信息 */}
              <div class="lg:col-span-2 space-y-6">
                {/* 专辑封面和播放器 */}
                <div class="bg-gradient-to-br from-purple-800/50 to-pink-800/50 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-purple-500/30">
                  <div class="flex flex-col md:flex-row gap-8 items-center">
                    {/* 封面 */}
                    <div class="flex-shrink-0">
                      <div class="w-64 h-64 rounded-2xl overflow-hidden shadow-2xl ring-4 ring-purple-500/30 hover:ring-purple-400/50 transition-all">
                        <img
                          src={album().node_object_data.picture_hori}
                          alt={album().node_object_data.title}
                          class="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    {/* 播放器控制 */}
                    <div class="flex-1 w-full">
                      <h1 class="text-3xl font-bold text-white mb-2 drop-shadow-lg">
                        {album().node_object_data.title}
                      </h1>
                      <Show when={currentEpisode()}>
                        <p class="text-xl text-purple-200 mb-6">{currentEpisode()!.title}</p>
                      </Show>

                      {/* 进度条 */}
                      <div class="mb-6">
                        <div class="relative w-full h-2 bg-purple-900/50 rounded-lg overflow-hidden">
                          <div 
                            class="absolute left-0 top-0 h-full bg-gradient-to-r from-pink-500 to-pink-400 transition-all"
                            style={{ width: `${(currentTime() / (duration() || 1)) * 100}%` }}
                          />
                          <input
                            type="range"
                            min="0"
                            max={duration()}
                            value={currentTime()}
                            onInput={(e) => {
                              if (audioRef) {
                                audioRef.currentTime = Number(e.currentTarget.value);
                              }
                            }}
                            class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                        </div>
                        <div class="flex justify-between text-sm text-purple-200 mt-3">
                          <span class="font-medium">{formatTime(currentTime())}</span>
                          <span>{formatTime(duration())}</span>
                        </div>
                      </div>

                      {/* 播放控制按钮 */}
                      <div class="flex items-center justify-center gap-4">
                        <button
                          onClick={playPrev}
                          disabled={episodeIndex() === 0}
                          class="p-3 bg-gradient-to-br from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:from-purple-900 disabled:to-purple-800 disabled:text-purple-600 text-white rounded-full transition-all shadow-lg hover:shadow-xl"
                        >
                          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z" />
                          </svg>
                        </button>

                        <button
                          onClick={togglePlay}
                          class="p-5 bg-white hover:bg-purple-50 text-purple-600 rounded-full shadow-2xl transition-all transform hover:scale-110 active:scale-95"
                        >
                          <Show
                            when={isPlaying()}
                            fallback={
                              <svg class="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M8 5v10l8-5-8-5z"/>
                              </svg>
                            }
                          >
                            <svg class="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                            </svg>
                          </Show>
                        </button>

                        <button
                          onClick={playNext}
                          disabled={episodeIndex() >= episodes().length - 1}
                          class="p-3 bg-gradient-to-br from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:from-purple-900 disabled:to-purple-800 disabled:text-purple-600 text-white rounded-full transition-all shadow-lg hover:shadow-xl"
                        >
                          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798l-5.445-3.63z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* 隐藏的 audio 元素 */}
                  <audio
                    ref={audioRef}
                    src={audioUrl()}
                  />
                </div>

                {/* 专辑描述 */}
                <div class="bg-gradient-to-br from-purple-800/40 to-pink-800/40 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-purple-500/20">
                  <h2 class="text-xl font-bold text-white mb-3 flex items-center gap-2">
                    <span>📖</span>
                    <span>专辑简介</span>
                  </h2>
                  <p class="text-purple-200/90 leading-relaxed">
                    {album().node_object_data.description}
                  </p>
                </div>
              </div>

              {/* 右侧：集数列表 */}
              <div class="lg:col-span-1">
                <div class="bg-gradient-to-br from-purple-800/40 to-pink-800/40 backdrop-blur-md rounded-2xl p-5 max-h-[800px] overflow-y-auto scrollbar-thin shadow-xl border border-purple-500/20">
                  <h2 class="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <span>🎵</span>
                    <span>播放列表</span>
                    <span class="text-purple-300 text-sm font-normal">({episodes().length}集)</span>
                  </h2>
                  <div class="space-y-2">
                    <For each={episodes()}>
                      {(ep, index) => (
                        <button
                          onClick={() => playEpisode(index())}
                          classList={{
                            "w-full text-left p-4 rounded-xl transition-all duration-200": true,
                            "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105": index() === episodeIndex(),
                            "bg-purple-900/20 text-purple-100 hover:bg-purple-800/40 border border-purple-500/20": index() !== episodeIndex()
                          }}
                        >
                          <div class="flex items-center justify-between">
                            <span class="font-medium truncate flex-1">
                              {index() + 1}. {ep.title}
                            </span>
                            <Show when={index() === episodeIndex()}>
                              <svg classList={{
                                "w-5 h-5 ml-2 flex-shrink-0": true,
                                "animate-pulse": isPlaying()
                              }} fill="currentColor" viewBox="0 0 20 20">
                                <path d="M8 5v10l8-5-8-5z"/>
                              </svg>
                            </Show>
                          </div>
                        </button>
                      )}
                    </For>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Show>
    </div>
  );
}