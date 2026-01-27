import { Tabs } from "@kobalte/core/tabs";
import { TabType } from "@/types/album";

interface TabSwitcherProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export function TabSwitcher(props: TabSwitcherProps) {
  return (
    <div class="max-w-5xl mx-auto px-2 sm:px-0 mt-6">
      <Tabs
        value={props.activeTab}
        onChange={(value) => props.onTabChange(value as TabType)}
        class="bg-white/90 backdrop-blur-md shadow-soft rounded-2xl overflow-hidden"
      >
        <Tabs.List class="flex list-none p-0 m-0 relative">
          <Tabs.Trigger
            value="video"
            class="px-6 sm:px-8 py-4 sm:py-5 text-base sm:text-lg font-semibold cursor-pointer transition-all duration-300 ease-in-out flex-1 text-center relative border-none bg-transparent data-[selected]:text-purple-600 data-[selected]:bg-gradient-to-b data-[selected]:from-purple-50 data-[selected]:to-transparent text-gray-500 hover:text-purple-500 hover:bg-purple-50/50 outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-inset"
          >
            🎬 视频专辑
          </Tabs.Trigger>
          <Tabs.Trigger
            value="audio"
            class="px-6 sm:px-8 py-4 sm:py-5 text-base sm:text-lg font-semibold cursor-pointer transition-all duration-300 ease-in-out flex-1 text-center relative border-none bg-transparent data-[selected]:text-pink-600 data-[selected]:bg-gradient-to-b data-[selected]:from-pink-50 data-[selected]:to-transparent text-gray-500 hover:text-pink-500 hover:bg-pink-50/50 outline-none focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:ring-inset"
          >
            🎵 音频专辑
          </Tabs.Trigger>
          <Tabs.Indicator class="absolute bottom-0 h-1 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-t-full transition-all duration-300" />
        </Tabs.List>
      </Tabs>
    </div>
  );
}