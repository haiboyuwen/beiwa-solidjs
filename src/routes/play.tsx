import { useSearchParams, useNavigate, A } from "@solidjs/router";
import { createAsync } from "@solidjs/router";
import { Show, For, createSignal, createMemo } from "solid-js";
import { getVideoAlbums, findVideoAlbumById } from "@/lib/api";

export default function PlayPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const albumId = () => {
    const param = searchParams.album;
    return Array.isArray(param) ? param[0] : param;
  };
  const episodeIndex = () => Number(searchParams.ep || "0");

  const videoAlbums = createAsync(() => getVideoAlbums());
  const currentAlbum = () => {
    const albums = videoAlbums();
    const id = albumId();
    return albums && id ? findVideoAlbumById(albums, id) : null;
  };

  const episodes = () => currentAlbum()?.node_relation_children || [];
  const currentEpisode = () => episodes()[episodeIndex()];
  
  // 视频质量选择
  const [quality, setQuality] = createSignal<'fhd' | 'hd' | 'sd' | 'ld'>('hd');
  
  const videoUrl = createMemo(() => {
    const ep = currentEpisode();
    if (!ep) return '';
    const q = quality();
    return ep[q] || ep.hd || ep.sd || ep.ld || '';
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

  return (
    <div class="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-950">
      <Show
        when={currentAlbum()}
        fallback={
          <div class="flex items-center justify-center min-h-screen">
            <div class="text-center">
              <div class="w-16 h-16 border-4 border-purple-300 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p class="text-purple-200 text-lg">加载中...</p>
            </div>
          </div>
        }
      >
        {(album) => (
          <div class="container mx-auto px-4 py-6 max-w-7xl">
            {/* 返回按钮 */}
            <div class="mb-6">
              <button
                onClick={() => navigate("/")}
                class="group inline-flex items-center justify-center w-11 h-11 bg-purple-600/20 hover:bg-purple-600/40 text-white rounded-full transition-all duration-300 cursor-pointer backdrop-blur-md border-2 border-purple-400/60 hover:border-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:shadow-[0_0_20px_rgba(168,85,247,0.5)]"
                title="返回"
              >
                <svg class="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* 左侧：视频播放器 */}
              <div class="lg:col-span-2 space-y-6">
                <div class="bg-black rounded-2xl overflow-hidden shadow-2xl ring-2 ring-purple-500/20">
                  <Show
                    when={currentEpisode()}
                    fallback={
                      <div class="aspect-video flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
                        <p class="text-gray-400 text-lg">请选择集数</p>
                      </div>
                    }
                  >
                    <video
                      class="w-full aspect-video"
                      src={videoUrl()}
                      controls
                      autoplay
                      onEnded={playNext}
                    />
                  </Show>
                </div>

                {/* 视频信息和控制 */}
                <div class="bg-gradient-to-br from-purple-800/40 to-indigo-800/40 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-purple-500/20">
                  <h1 class="text-3xl font-bold text-white mb-2 drop-shadow-lg">
                    {album().node_object_data.title}
                  </h1>
                  <Show when={currentEpisode()}>
                    <p class="text-xl text-purple-200 mb-4">{currentEpisode()!.title}</p>
                  </Show>
                  <p class="text-purple-200/80 text-sm mb-6 leading-relaxed">{album().node_object_data.description}</p>

                  {/* 播放控制 */}
                  <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div class="flex gap-3">
                      <button
                        onClick={playPrev}
                        disabled={episodeIndex() === 0}
                        class="group inline-flex items-center gap-2 px-5 py-2.5 bg-transparent hover:bg-purple-600/30 disabled:bg-transparent disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-full transition-all duration-300 border-2 border-purple-400/60 hover:border-purple-300 disabled:border-gray-600 shadow-[0_0_12px_rgba(168,85,247,0.2)] hover:shadow-[0_0_18px_rgba(168,85,247,0.4)]"
                      >
                        <svg class="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-0.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
                        </svg>
                        <span class="font-medium">上一集</span>
                      </button>
                      <button
                        onClick={playNext}
                        disabled={episodeIndex() >= episodes().length - 1}
                        class="group inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-pink-600/80 to-purple-600/80 hover:from-pink-500 hover:to-purple-500 disabled:from-gray-700/50 disabled:to-gray-800/50 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-full transition-all duration-300 border-2 border-pink-400/60 hover:border-pink-300 disabled:border-gray-600 shadow-[0_0_12px_rgba(236,72,153,0.3)] hover:shadow-[0_0_18px_rgba(236,72,153,0.5)]"
                      >
                        <span class="font-medium">下一集</span>
                        <svg class="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
                        </svg>
                      </button>
                    </div>

                    {/* 画质选择 */}
                    <div class="flex gap-2">
                      <For each={[
                        { key: 'ld', label: '流畅' },
                        { key: 'sd', label: '标清' },
                        { key: 'hd', label: '高清' },
                        { key: 'fhd', label: '超清' }
                      ]}>
                        {(q) => (
                          <button
                            onClick={() => setQuality(q.key as any)}
                            classList={{
                              "px-4 py-2 rounded-lg text-sm transition-all duration-200 font-medium": true,
                              "bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg": quality() === q.key,
                              "bg-purple-900/30 text-purple-200 hover:bg-purple-800/50 border border-purple-500/30": quality() !== q.key
                            }}
                          >
                            {q.label}
                          </button>
                        )}
                      </For>
                    </div>
                  </div>
                </div>
              </div>

              {/* 右侧：集数列表 */}
              <div class="lg:col-span-1">
                <div class="bg-gradient-to-br from-purple-800/40 to-indigo-800/40 backdrop-blur-md rounded-2xl p-5 max-h-[800px] overflow-y-auto scrollbar-thin shadow-xl border border-purple-500/20">
                  <h2 class="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <span>📺</span>
                    <span>选集</span>
                    <span class="text-purple-300 text-sm font-normal">({episodes().length}集)</span>
                  </h2>
                  <div class="space-y-2">
                    <For each={episodes()}>
                      {(ep, index) => (
                        <button
                          onClick={() => playEpisode(index())}
                          classList={{
                            "w-full text-left p-4 rounded-xl transition-all duration-200": true,
                            "bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg scale-105": index() === episodeIndex(),
                            "bg-purple-900/20 text-purple-100 hover:bg-purple-800/40 border border-purple-500/20": index() !== episodeIndex()
                          }}
                        >
                          <div class="flex items-center justify-between">
                            <span class="font-medium truncate flex-1">
                              {index() + 1}. {ep.title}
                            </span>
                            <Show when={index() === episodeIndex()}>
                              <svg class="w-5 h-5 ml-2 flex-shrink-0 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
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