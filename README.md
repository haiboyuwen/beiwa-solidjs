# Beiwa SolidJS

一个基于 SolidStart 构建的现代化视频音频专辑管理平台。

## ✨ 技术栈

- **框架**: [SolidStart](https://start.solidjs.com) 1.2.1 - 高性能的 SSR 框架
- **UI 库**: [SolidUI](https://solid-ui.com) + [Kobalte](https://kobalte.dev) - 无障碍组件
- **样式**: [Tailwind CSS](https://tailwindcss.com) v4 - 实用优先的 CSS 框架
- **路由**: [@solidjs/router](https://github.com/solidjs/solid-router) - SolidJS 官方路由
- **构建工具**: [Vinxi](https://vinxi.vercel.app) + Vite - 下一代全栈框架
- **验证**: [Zod](https://zod.dev) 4.x - 类型安全的数据验证
- **语言**: TypeScript 5.9

## 🚀 功能特性

- 📺 **视频/音频专辑管理** - 支持视频和音频内容的分类浏览
- 🔍 **智能搜索** - 实时搜索和标签筛选功能
- 🎨 **现代化 UI** - 使用 SolidUI + Kobalte 组件库构建
- 📱 **响应式设计** - 完美适配移动端和桌面端
- ⚡ **无限滚动** - 流畅的内容加载体验
- 💾 **状态持久化** - 使用 sessionStorage + createStore 保存浏览状态
- 🎬 **媒体播放** - 内置视频和音频播放器
- 🌈 **渐变主题** - 紫色/粉色渐变配色方案

## 📦 安装

```bash
# 克隆项目
git clone <repository-url>
cd beiwa-solidjs

# 安装依赖 (推荐使用 pnpm)
pnpm install

# 或使用 npm
npm install
```

## 🛠️ 开发

```bash
# 启动开发服务器
pnpm dev

# 在新标签页中打开
pnpm dev -- --open
```

开发服务器将在 http://localhost:3000 启动。

## 🏗️ 构建

```bash
# 构建生产版本
pnpm build

# 启动生产服务器
pnpm start

# 清理构建缓存
pnpm clean
```

## 📁 项目结构

```
src/
├── components/          # 组件目录
│   ├── album/          # 专辑相关组件
│   │   ├── AlbumCard.tsx
│   │   └── AlbumList.tsx
│   ├── ui/             # UI 组件 (SolidUI + 自定义)
│   │   ├── tabs.tsx    # SolidUI Tabs
│   │   ├── select.tsx  # SolidUI Select
│   │   ├── SearchBar.tsx
│   │   └── TabSwitcher.tsx
│   └── HomePage.tsx    # 首页组件
├── routes/             # 路由页面
│   ├── index.tsx       # 首页路由
│   ├── play.tsx        # 视频播放页
│   └── audio_play.tsx  # 音频播放页
├── lib/                # 工具库
│   ├── albumsStore.ts  # 状态管理
│   ├── api.ts          # API 工具
│   ├── schemas.ts      # Zod 数据验证
│   ├── validation.ts   # 验证工具函数
│   ├── utils.ts        # 通用工具 (cn)
│   └── storage.ts      # 存储工具
├── types/              # TypeScript 类型
│   └── album.ts        # Zod 类型推导
├── data/               # 数据文件
│   ├── video_albums.json
│   └── audio_albums.json
├── app.tsx             # 应用入口
└── app.css             # 全局样式 (Tailwind v4 + 主题)
```

## 🎯 核心功能

### 专辑浏览
- 视频/音频专辑切换
- 专辑卡片展示（封面、标题、描述、集数）
- 悬停效果和动画

### 搜索与筛选
- 实时搜索专辑标题和描述
- 标签筛选功能
- 搜索结果高亮

### 媒体播放
- 支持多集视频/音频播放
- 集数列表展示
- 播放控制

### 状态管理
- 滚动位置保存
- 搜索条件保存
- 标签筛选状态保存
- 分页状态保存

## 🔧 配置

### Tailwind CSS v4 配置

项目使用 Tailwind CSS v4，配置完全在 CSS 中完成：

- `app.config.ts` - Vinxi/Vite 配置 + Tailwind 插件集成
- `src/app.css` - Tailwind v4 主题配置 (`@theme` 指令)
- `tsconfig.json` - TypeScript 配置

**主要特性：**
- 使用 `@import "tailwindcss"` 替代旧的 `@tailwind` 指令
- 使用 `@theme` 指令定义动画和变量
- 所有颜色通过 CSS 变量配置，支持暗色模式

### 路径别名

```typescript
// 支持的别名
import { ... } from "@/lib/api"      // -> src/lib/api
import { ... } from "~/components"   // -> src/components
```

## 📝 开发说明

### 环境要求
- Node.js >= 22
- pnpm (推荐) 或 npm

### 数据验证

项目使用 Zod 进行类型安全的数据验证：

```typescript
// src/lib/schemas.ts
import { z } from "zod";

export const AlbumDataSchema = z.object({
  title: z.string(),
  description: z.string(),
  picture_hori: z.string().url(),
  item_total_number: z.number(),
  // ...
});

// 类型自动推导
export type AlbumData = z.infer<typeof AlbumDataSchema>;
```

### 状态管理

使用 `createStore` 统一管理首页状态：

```typescript
const [state, setState] = createStore<HomeState>({
  scrollY: 0,
  tab: "video",
  search: "",
  videoTag: "",
  audioTag: "",
  // ...
});

// 更新状态
setState('tab', 'audio');
setState('search', 'keyword');
```

### 数据格式
专辑数据存储在 `src/data/` 目录下的 JSON 文件中，格式如下：

```json
{
  "node_object_id": "专辑ID",
  "node_object_data": {
    "title": "标题",
    "description": "描述",
    "picture_hori": "封面图URL",
    "item_total_number": 总集数,
    "item_now_number": 当前集数,
    "category_tag": "标签1,标签2",
    "charge_pattern": 0
  }
}
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可

MIT License

---

使用 ❤️ 和 [SolidJS](https://solidjs.com) 构建
