import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabType } from "@/types/album";

interface TabSwitcherProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export function TabSwitcher(props: TabSwitcherProps) {
  return (
    <div class="px-2 sm:px-0 mt-6">
      <Tabs
        value={props.activeTab}
        onChange={(value) => props.onTabChange(value as TabType)}
      >
        <TabsList class="grid w-full grid-cols-2 bg-white/90 backdrop-blur-md shadow-soft rounded-2xl p-1">
          <TabsTrigger
            value="video"
            class="px-6 sm:px-8 py-4 sm:py-5 text-base sm:text-lg font-semibold data-[selected]:text-purple-600 data-[selected]:bg-gradient-to-b data-[selected]:from-purple-50 data-[selected]:to-transparent"
          >
            🎬 视频专辑
          </TabsTrigger>
          <TabsTrigger
            value="audio"
            class="px-6 sm:px-8 py-4 sm:py-5 text-base sm:text-lg font-semibold data-[selected]:text-pink-600 data-[selected]:bg-gradient-to-b data-[selected]:from-pink-50 data-[selected]:to-transparent"
          >
            🎵 音频专辑
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}