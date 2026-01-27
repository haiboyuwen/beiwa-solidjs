import { VideoAlbum, AudioAlbum, TabType } from '@/types/album';

interface AlbumCardProps {
  album: VideoAlbum | AudioAlbum;
  type: TabType;
  onPlay: (type: TabType, albumId: string) => void;
}

export function AlbumCard(props: AlbumCardProps) {
  const handlePlay = () => {
    props.onPlay(props.type, props.album.node_object_id);
  };

  return (
    <div class="w-full max-w-sm mx-auto bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden hover:shadow-2xl hover:-translate-y-1 hover:border-blue-300 transition-all duration-300 cursor-pointer group"
         onClick={handlePlay}>
      <div class="relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50 aspect-[4/3]">
        <img
          src={props.album.node_object_data.picture_hori}
          alt={props.album.node_object_data.title}
          class="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
          loading="lazy"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent group-hover:from-black/40 transition-all duration-300 flex items-center justify-center">
          <div class="w-12 h-12 bg-white bg-opacity-90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <svg class="w-6 h-6 text-blue-600 ml-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8 5v10l8-5-8-5z"/>
            </svg>
          </div>
        </div>
        
        {/* 集数标签 */}
        <div class="absolute top-3 right-3 bg-gradient-to-r from-gray-900 to-gray-800 bg-opacity-90 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full shadow-lg">
          {props.album.node_object_data.item_now_number}/{props.album.node_object_data.item_total_number}集
        </div>
        
        {/* 类型标签 */}
        <div classList={{
          "absolute top-3 left-3 text-white text-xs px-3 py-1.5 rounded-full shadow-lg font-medium": true,
          "bg-gradient-to-r from-blue-500 to-blue-600": props.type === 'video',
          "bg-gradient-to-r from-orange-500 to-orange-600": props.type === 'audio'
        }}>
          {props.type === 'video' ? '视频' : '音频'}
        </div>
      </div>
      
      <div class="p-4">
        <h3 class="font-semibold text-gray-900 text-base line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
          {props.album.node_object_data.title}
        </h3>
        
        <p class="text-gray-600 text-sm line-clamp-2 mb-3 leading-relaxed">
          {props.album.node_object_data.description}
        </p>
        
        <div class="flex items-center justify-between text-xs text-gray-500">
          <span>共{props.album.node_object_data.item_total_number}集</span>
          <span class="text-green-600 font-medium">
            {props.album.node_object_data.charge_pattern === 0 ? '免费' : '付费'}
          </span>
        </div>
      </div>
    </div>
  );
}