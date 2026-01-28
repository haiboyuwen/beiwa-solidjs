import { For, Show } from "solid-js";
import { TextField } from "@kobalte/core/text-field";
import { Select } from "@kobalte/core/select";

interface SearchBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  selectedTag: string;
  onTagChange: (value: string) => void;
  tags: string[];
  placeholder?: string;
}

export function SearchBar(props: SearchBarProps) {
  return (
    <div class="px-2 sm:px-0">
      <div class="flex flex-col gap-4 p-5 sm:p-6 bg-white/95 backdrop-blur-md rounded-2xl border border-purple-100 shadow-soft">
        {/* 搜索框 - 使用 Kobalte TextField */}
        <TextField
          value={props.search}
          onChange={props.onSearchChange}
          class="w-full"
        >
          <div class="relative">
            <div class="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400 z-10">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <TextField.Input
              placeholder={props.placeholder || "🔍 搜索专辑/描述/标签"}
              class="w-full pl-12 pr-4 py-3 sm:py-4 border-2 border-purple-200 rounded-xl bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all duration-200 text-sm sm:text-base shadow-sm"
            />
          </div>
        </TextField>

        {/* 标签选择 - 使用 Kobalte Select */}
        <Show when={props.tags.length > 0}>
          <Select
            value={props.selectedTag}
            onChange={(value) => {
              props.onTagChange(value || "");
              setTimeout(() => window.scrollTo(0, 0), 0);
            }}
            options={["", ...props.tags]}
            placeholder="📂 全部标签"
            itemComponent={(itemProps) => (
              <Select.Item
                item={itemProps.item}
                class="flex items-center justify-between px-4 py-3 text-gray-700 cursor-pointer hover:bg-purple-50 focus:bg-purple-100 outline-none data-[highlighted]:bg-purple-50"
              >
                <Select.ItemLabel>
                  {itemProps.item.rawValue === "" ? "📂 全部标签" : itemProps.item.rawValue}
                </Select.ItemLabel>
                <Select.ItemIndicator class="text-purple-600">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </Select.ItemIndicator>
              </Select.Item>
            )}
          >
            <Select.Trigger class="w-full flex items-center justify-between pl-12 pr-4 py-3 sm:py-4 border-2 border-purple-200 rounded-xl text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all duration-200 text-sm sm:text-base shadow-sm cursor-pointer relative">
              <div class="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <Select.Value<string>>
                {(state) => state.selectedOption() || "📂 全部标签"}
              </Select.Value>
              <Select.Icon class="text-purple-400">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </Select.Icon>
            </Select.Trigger>
            <Select.Portal>
              <Select.Content class="bg-white rounded-xl shadow-lg border border-purple-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                <Select.Listbox class="max-h-60 overflow-y-auto py-1" />
              </Select.Content>
            </Select.Portal>
          </Select>
        </Show>
      </div>
    </div>
  );
}