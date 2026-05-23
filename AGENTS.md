# 项目上下文

## 项目简介

**乡音留痕·岁月永存** - 乡村老人数字回忆录平台

一个基于 AI 技术的乡村老人记忆留存平台，通过智能访谈、素材采集、成果生成三大模块，帮助老人记录一生故事，生成回忆录、家书、家谱等数字文创产品。

### 版本技术栈

- **Framework**: Next.js 16 (App Router)
- **Core**: React 19
- **Language**: TypeScript 5
- **UI 组件**: shadcn/ui (基于 Radix UI)
- **Styling**: Tailwind CSS 4
- **AI 能力**: coze-coding-dev-sdk (LLM, ASR, TTS)
- **存储**: S3 兼容对象存储

## 目录结构

```
├── public/                 # 静态资源
├── scripts/                # 构建与启动脚本
├── src/
│   ├── app/
│   │   ├── api/           # 后端 API
│   │   │   ├── chat/      # AI 对话接口（流式）
│   │   │   ├── generate/  # 内容生成接口（回忆录、家书、家谱）
│   │   │   └── upload/    # 文件上传接口
│   │   ├── globals.css    # 全局样式
│   │   ├── layout.tsx     # 根布局
│   │   └── page.tsx       # 主页面
│   ├── components/
│   │   ├── hero-section.tsx        # 首页 Hero 区域
│   │   ├── interview-section.tsx   # 智能访谈模块
│   │   ├── material-section.tsx    # 素材采集模块
│   │   ├── output-section.tsx      # 成果中心模块
│   │   └── ui/            # Shadcn UI 组件库
│   ├── hooks/             # 自定义 Hooks
│   └── lib/               # 工具库
├── DESIGN.md              # 设计规范
├── next.config.ts         # Next.js 配置
├── package.json           # 项目依赖管理
└── tsconfig.json          # TypeScript 配置
```

## 核心功能模块

### 1. 智能访谈 (interview-section.tsx)

- 六大维度访谈：童年乡土、农耕生活、时代变迁、婚恋家庭、人生感悟、乡土民俗
- AI 流式对话引导
- 对话记录自动保存
- 维度导航和进度跟踪

### 2. 素材采集 (material-section.tsx)

- 照片上传：支持多图上传，用于数字人生成
- 视频上传：采集老人动态影像
- 声音录制：浏览器录音，采集老人原声

### 3. 成果中心 (output-section.tsx)

- 回忆录生成：根据访谈内容自动整理
- 家书生成：老人对家人的寄语
- 家谱整理：家族关系记录
- 数字人说明：数字分身生成指导
- 支持下载、打印功能

## API 接口

### POST /api/chat

AI 智能对话接口，流式返回

请求体：
```json
{
  "messages": [{ "role": "user", "content": "..." }]
}
```

### POST /api/generate

内容生成接口

请求体：
```json
{
  "type": "memoir" | "letter" | "genealogy" | "digital-human",
  "interviewData": { ... },
  "materialData": { ... }
}
```

### POST /api/upload

文件上传接口

Form Data:
- file: File
- type: 'photo' | 'video' | 'voice'

## 包管理规范

**仅允许使用 pnpm** 作为包管理器，**严禁使用 npm 或 yarn**。

常用命令：
- 安装依赖：`pnpm install`
- 添加依赖：`pnpm add <package>`
- 开发模式：`pnpm dev`
- 构建项目：`pnpm build`

## 开发规范

### 编码规范

- 默认按 TypeScript `strict` 心智写代码
- 禁止隐式 `any` 和 `as any`
- 函数参数、返回值应有明确类型
- 清理未使用的变量和导入

### 流式响应规范

所有 AI 相关接口必须使用 SSE 流式响应：
- Content-Type: text/event-stream
- 格式：`data: {content}\n\n`
- 结束标记：`data: [DONE]\n\n`

### 文件存储规范

- 使用 S3Storage 上传文件到对象存储
- 必须使用 `generatePresignedUrl` 生成访问 URL
- 禁止自行拼接 URL
