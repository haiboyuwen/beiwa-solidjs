import { createAsync } from "@solidjs/router";
import { getVideoAlbums, getAudioAlbums } from "@/lib/api";
import HomePage from "@/components/HomePage";

export default function Home() {
  // 使用 createAsync 在客户端和服务端自动处理数据获取
  const videoAlbums = createAsync(() => getVideoAlbums());
  const audioAlbums = createAsync(() => getAudioAlbums());

  return (
    <main>
      <HomePage 
        videoAlbums={videoAlbums} 
        audioAlbums={audioAlbums}
      />
    </main>
  );
}
