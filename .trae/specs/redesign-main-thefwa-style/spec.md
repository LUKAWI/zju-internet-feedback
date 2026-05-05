# 主页面完全重构 — theFWA 黑白极简风格 Spec

## Why
当前主页面在 `optimize-main-page-ui` 规范下完成了 L1 级的视觉优化，但整体设计语言仍偏向传统的 SaaS/论坛式布局，缺乏 theFWA 获奖网站那种「编辑级排版 + 雕塑级动效」的高级感。需要对正文部分（loading page 除外）进行完全重构，参考 theFWA 上 Obys Agency、Nagarā 等黑白极简获奖网站的排版哲学和动效语言，将页面从「功能型 UI」提升为「杂志级体验型 UI」。

## 设计风格定位（Style Seed: 编辑级极简 Editorial Minimal）

**Style**: 编辑级极简
**Keywords**: 雕塑感、留白、排版驱动、克制、暗涌、呼吸感、纸媒质感
**Tone**: 像翻阅一本精心排版的独立杂志 — NOT 论坛、NOT SaaS dashboard、NOT 卡片列表
**Reference**: Obys Agency（排版驱动+动态）、Nagarā（黑白编辑风+电影感）、PHQ Studios（film-noir 暗调+微动效）
**Interaction Tier**: L2 流畅交互（滚动 reveal、视差、排版动画、卡片悬浮追踪光）

## What Changes

### 完全重构（架构级变更）
- `app/page.tsx` — 全新布局结构：从「header + 搜索栏 + 列表 + 表单」改为「编辑级 Hero 区 + 内容流 + 优雅表单」
- `app/globals.css` — 全新设计 Token、L2 级动效系统（滚动 reveal、卡片追踪光 SpotlightCard、文字动画）
- `components/MessageCard.tsx` — 从「圆角卡片+阴影」重构为「编辑级信息块+悬浮追踪光」
- `components/MessageList.tsx` — 骨架屏从「shimmer 灰色块」重构为「排版骨架」
- `components/MessageForm.tsx` — 从「毛玻璃卡片」重构为「杂志投稿区」
- `components/VoteButtons.tsx` — 从「按钮组」重构为「标签式交互条」
- `components/SearchBar.tsx` — 从「输入框」重构为「无界搜索条」
- `components/SortTabs.tsx` — 从「标签切换」重构为「排版导航条」

### 不变更范围
- `app/loading.tsx` — 不修改 loading page
- `components/Intro.tsx` — 不修改 Intro 打字机动画
- `app/layout.tsx` — 不修改布局框架
- `app/providers.tsx` — 不修改
- 所有 `components/ui/*` — 不修改 shadcn 基础组件源码
- 所有 API 路由 — 不修改
- 数据库 schema — 不修改
- 表单验证逻辑 — 不修改

### 设计语言关键转变

| 维度 | 旧设计 (optimize-main-page-ui) | 新设计 (redesign-thefwa) |
|------|------|------|
| 布局哲学 | 居中 container + header 栅格 | 左右分栏+非对称留白 |
| 卡片风格 | 圆角+多层阴影+奇偶色条 | 无边框矩形块+悬浮追踪光+极微阴影 |
| 间距节奏 | Tailwind 默认 space-y-4 | 8px/16px/24px/48px/80px 严格梯度 |
| 字体层级 | Geist 单一字重 | Geist 多字重+大字标题+编辑级层级 |
| 颜色深度 | neutral 灰度色阶 | 纯黑白+微暖灰底+单点强调 |
| 动效层级 | L1 精致静态 (hover+fadeIn) | L2 流畅交互 (scroll reveal+parallax+spotlight) |
| 表单形态 | 卡片容器+毛玻璃 | 沉浸式投稿区+浮动发送 |
| 搜索形态 | 凹陷内阴影输入框 | 下划线式无界搜索 |
| 排序形态 | iOS 风格分段控件 | 排版级文字导航 |

## Impact
- Affected specs: `optimize-main-page-ui`（被本规范完全替代）
- Affected code: `app/page.tsx`, `app/globals.css`, `components/MessageCard.tsx`, `components/MessageList.tsx`, `components/MessageForm.tsx`, `components/VoteButtons.tsx`, `components/SearchBar.tsx`, `components/SortTabs.tsx`

---

## 1. 视觉主题与氛围 (Visual Theme & Atmosphere)

**设计哲学**: 「信息即排版」。每条留言不再是被卡片包裹的数据行，而是杂志页面上的独立段落。通过大幅留白、克制的分隔线、精准的字重层级，营造「翻阅独立杂志」的沉浸感。

**空间节奏**: 
- 页面级留白：左右各 80px（桌面端）→ 24px（移动端）
- 内容区最大宽度：720px（正文级阅读宽度，不撑满屏幕）
- Section 间距：80px（桌面）→ 48px（移动端）

**氛围关键词**: 安静、精确、阅读感、雕塑感、不喧哗

### Anti-AI 设计原则（强化版）
- **非对称留白**: 内容区偏左，右侧大量留白（桌面端）
- **排版不规则**: 留言之间的间距不严格相等，通过微妙的「韵律节奏」排布
- **去卡片化**: 不使用传统 Card 组件的圆角+背景色+阴影包裹
- **人工质感**: 搜索条使用下划线式（类似纸质表单），而非圆角矩形框

---

## 2. 色彩方案 (Color Palette & Roles)

**完全重构 CSS 变量体系**。保留 shadcn 变量名以兼容 UI 组件，但值全部重定义：

```css
:root {
  /* 核心黑白 */
  --background: oklch(0.98 0 0);            /* 微暖白底，非纯白 */
  --foreground: oklch(0.1 0 0);             /* 接近纯黑正文 */
  
  /* 卡片与表面 */
  --card: oklch(1 0 0);                     /* 纯白卡片 */
  --card-foreground: oklch(0.1 0 0);
  
  /* 层级灰色 */
  --muted: oklch(0.96 0 0);                 /* 次级背景 */
  --muted-foreground: oklch(0.45 0 0);      /* 辅助文字 */
  --border: oklch(0.88 0 0);                /* 极淡分隔 */
  --input: oklch(0.92 0 0);
  --ring: oklch(0.15 0 0);                  /* 聚焦环用黑色 */
  
  /* 主色 - 纯黑 */
  --primary: oklch(0.1 0 0);
  --primary-foreground: oklch(1 0 0);
  
  --secondary: oklch(0.95 0 0);
  --secondary-foreground: oklch(0.15 0 0);
  
  --accent: oklch(0.95 0 0);
  --accent-foreground: oklch(0.15 0 0);
  
  /* 增加变量 */
  --surface-elevated: oklch(1 0 0);
  --shadow-color: oklch(0.1 0 0 / 0.03);
  --shadow-hover: oklch(0.1 0 0 / 0.06);
  --glow-ring: oklch(0.1 0 0 / 0.12);
  --spotlight-color: oklch(0.1 0 0 / 0.04);
  --accent-bar: oklch(0.1 0 0 / 0.8);
  
  --radius: 0rem;                           /* 完全去圆角 */
}

.dark {
  --background: oklch(0.1 0 0);
  --foreground: oklch(0.95 0 0);
  --card: oklch(0.13 0 0);
  --card-foreground: oklch(0.95 0 0);
  --muted: oklch(0.15 0 0);
  --muted-foreground: oklch(0.55 0 0);
  --border: oklch(0.2 0 0);
  --input: oklch(0.18 0 0);
  --ring: oklch(0.85 0 0);
  --primary: oklch(0.95 0 0);
  --primary-foreground: oklch(0.1 0 0);
  --secondary: oklch(0.18 0 0);
  --secondary-foreground: oklch(0.95 0 0);
  --shadow-color: oklch(0 0 0 / 0.3);
  --shadow-hover: oklch(0 0 0 / 0.5);
  --spotlight-color: oklch(1 0 0 / 0.03);
  --accent-bar: oklch(0.85 0 0 / 0.6);
}
```

**色彩规则**: 
- 所有新增颜色通过 CSS 变量引用，禁止硬编码
- 保持纯黑白，不引入蓝色/绿色等彩色强调（与参考的 Obys 一致）
- 暗色模式下灰色阶反向但保持相同对比度

---

## 3. 排版规则 (Typography Rules)

**字体系统**: 保持 Geist Sans + Geist Mono，通过多字重 + 大字差营造编辑级层次。

| 角色 | 字体 | 字号 | 字重 | 行高 | 字间距 |
|------|------|------|------|------|--------|
| Hero 大标题 | Geist Sans | 48px / 56px(md) / 64px(lg) | 300 (Light) | 1.1 | -0.02em |
| Section 标题 | Geist Sans | 20px | 500 | 1.3 | -0.01em |
| 留言昵称 | Geist Sans | 14px | 600 | 1.4 | — |
| 留言正文 | Geist Sans | 15px | 400 | 1.8 | 0.01em |
| 辅助文字 | Geist Sans | 12px | 400 | 1.5 | 0.02em |
| 表单标签 | Geist Sans | 13px | 500 | 1.4 | 0.02em |
| 统计数字 | Geist Mono | 14px | 500 | 1 | tabular-nums |

**Text Decoration**: 
- Hero 大标题可添加极微妙的 `letter-spacing` 负值营造紧凑高级感
- 不在正文使用任何渐变/投影

---

## 4. 组件样式 (Component Stylings)

### 4.1 消息卡片 → 消息块 (MessageCard → MessageBlock)

**重构思路**: 从「Card 包裹」改为「无边界编辑块」。每条留言是一个独立排版段落。

- **默认态**: 无背景色、无圆角、无阴影。仅靠底部 1px 极淡分隔线（`var(--border)`）区分
- **悬浮态**: `::before` 伪元素在左侧出现 2px 竖线（非半透明色条，而是纯黑）作为阅读指示器；同时微弱的 SpotlightCard 跟踪光效跟随鼠标
- **取消** Avatar 彩色背景 → 改为纯黑/白文字头像（首字母），极小尺寸
- **取消** CardFooter → 投票按钮移到昵称同行右侧
- **取消** "热门" Badge → 用排版标记替代（如斜体 small-caps 标注）
- **正文排版**: 行高 1.8，字间距 0.01em，段落感更强
- **hover 过渡**: 所有过渡使用 `cubic-bezier(0.16, 1, 0.3, 1)` 400ms

**SpotlightCard 实现**:
```css
.message-block {
  position: relative;
  overflow: hidden;
}
.message-block::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(
    600px circle at var(--mx) var(--my),
    var(--spotlight-color),
    transparent 40%
  );
  opacity: 0;
  transition: opacity 0.3s;
  pointer-events: none;
}
.message-block:hover::before {
  opacity: 1;
}
```

### 4.2 搜索栏 → 无界搜索条 (SearchBar)

**重构思路**: 从「圆角矩形输入框+内阴影」改为「下划线式编辑级搜索」。

- **默认态**: 无边框、无背景、底部 1px 细线。placeholder 文字大写+宽字距
- **聚焦态**: 底部线从 1px 变为 2px 黑色，placeholder 渐隐
- **图标**: Search 图标缩小到 14px，始终在左侧。聚焦时颜色从 muted-foreground → foreground
- **清除按钮**: 不再是 X 按钮，而是在右侧出现「ESC」或「清除」文字链接

### 4.3 排序导航 → 排版导航条 (SortTabs)

**重构思路**: 从「iOS 分段控件滑块」改为「文字排版导航」。

- **布局**: 左右两段文字「最新」和「最热」，之间用极淡的 `·` 或 `|` 分隔
- **选中态**: 文字颜色加深到 foreground + 底部出现 1px 下划线（非背景滑块）
- **非选中态**: muted-foreground 颜色
- **过渡**: 下划线 translateX 平移动画，duration 300ms ease-out
- **取消图标**: 移除 Clock/Flame 图标（排版级设计不需要图标）

### 4.4 投票按钮 → 标签交互条 (VoteButtons)

**重构思路**: 从「ghost 按钮+彩色 hover」改为「微型文字标签」。

- **布局**: 放在昵称右侧同行，极小尺寸
- **样式**: 
  - 默认态：muted-foreground 文字 + 数字
  - 点赞选中态：foreground 文字 + 极淡黑色底（无彩色）
  - 踩选中态：foreground 文字 + 极淡黑色底
- **取消彩色 hover**（emerald/rose）→ 统一用黑色系
- **点击动效**: 数字有快速 scale 弹跳（cubic-bezier spring）
- **取消 ThumbsUp/ThumbsDown 图标** → 改为 `▲` `▼` 或文字 `+1` `-1` 简洁标记

### 4.5 留言表单 → 杂志投稿区 (MessageForm)

**重构思路**: 从「sticky 毛玻璃卡片」改为「沉浸式投稿 section」。

- **桌面端**: 不再 sticky。作为独立 section 出现在留言列表下方，有大幅留白包围
- **标题**: 大号 Section 标题「发表看法」，而非 CardTitle
- **输入框**: 无边框/底部线式（与搜索栏统一语言）
- **昵称+内容**: 两行，昵称在左输入框在右（桌面端横向布局）
- **提交按钮**: 不再全宽 primary button → 改为右对齐的文字式按钮（仅有下划线装饰）
- **移动端**: 恢复 sticky 底部栏，但使用更干净的纯黑底+白字设计（非毛玻璃）

### 4.6 骨架屏 (Skeleton)

**重构思路**: 从「shimmer 扫光灰块」改为「排版线框骨架」。

- 用极简的灰色横线模拟文字排版（不同宽度代表标题/正文/时间）
- 不使用 shimmer 光效（过于「AI 感」）
- 使用微弱的 pulse opacity 动画（更安静）

### 4.7 Header

- **底部**: 取消渐变阴影 → 仅 1px border-b（极简）
- **Logo 区**: 缩小到更克制的尺寸
- **背景**: 不再 backdrop-blur → 纯色背景（更干净）

### 4.8 空状态 & 末尾状态

- **空状态**: 大号排版文字「暂无留言」+ 极小辅助文字，无装饰图标（Obys 风格）
- **末尾**: 极简的「—— FIN ——」或 `· · ·` 标记

---

## 5. 布局原则 (Layout Principles)

**页面整体结构**（桌面端 > 768px）:
```
┌──────────────────────────────────────────────────┐
│ [Header: Logo + 标题，极简单行]                      │
├──────────────────────────────────────────────────┤
│                                                    │
│   [Hero Section: 大标题 + 描述 + 搜索/排序]          │
│   (居中 720px 最大宽度，上方 120px 留白)              │
│                                                    │
│   [Message List: 留言流]                            │
│   (居中 720px，每条留言 48px 间距)                   │
│                                                    │
│   [Form Section: 发表看法]                          │
│   (居中 720px，上方 80px 留白)                       │
│                                                    │
│                    —— FIN ——                       │
│                                                    │
└──────────────────────────────────────────────────┘
```

**间距梯度**（8px 基准）:
- Element 内间距: 8px / 16px
- 同 Section 元素间距: 24px
- Section 间间距: 48px / 80px
- 页面级留白: 120px

---

## 6. 深度与层级 (Depth & Elevation)

**极简阴影体系**（与 theFWA 风格一致：几乎无阴影）:

| 层级 | 阴影 | 用途 |
|------|------|------|
| L0 | 无 | 几乎所有元素 |
| L1 | `0 1px 2px rgba(0,0,0,0.04)` | 仅移动端 sticky form 使用 |
| L2 | 无（用追踪光代替） | 卡片 hover |

**设计原则**: 通过排版层级（字号/字重/留白）建立深度，而非通过阴影。这是 theFWA 黑白网站的核心设计语言。

---

## 7. 动效与交互 (Animation & Interaction)

**档位**: L2 流畅交互

### L2 Signature Moments（6 类动效，缺一不可）

| 类别 | 动效 | 落点 |
|------|------|------|
| Text Animation — Hero H1 | ScrollFloat / 拆分字母 stagger 入场 | Hero 大标题区域 |
| Text Animation — Section H2 | 滚动触发 fadeInUp + 微位移 | 「发表看法」标题 |
| Text Animation — Body | 留言正文滚动 reveal（stagger 入场） | MessageBlock 列表 |
| Animation — 元素级 | SpotlightCard 鼠标追踪光 | 每条留言 hover 时 |
| Component — 交互构件 | SortTabs 下划线滑动 + 数字弹跳 | 排序导航 + 投票反馈 |
| Background — 氛围层 | 全局微妙的 Grain 纹理（纯 CSS，非 WebGL） | body 背景 |

### 具体动效定义

| 动效 | 触发 | 实现 | 缓动 | 时长 |
|------|------|------|------|------|
| Hero 大标题入场 | load | 拆分字符 stagger fadeInUp（纯 CSS @keyframes） | cubic-bezier(0.16,1,0.3,1) | 600ms/char, 50ms stagger |
| Section 标题 reveal | scroll into view | IntersectionObserver + CSS class toggle | cubic-bezier(0.16,1,0.3,1) | 500ms |
| 留言块入场 | scroll into view | IntersectionObserver stagger reveal | cubic-bezier(0.16,1,0.3,1) | 400ms/item, 60ms stagger |
| SpotlightCard 追踪光 | mousemove (rAF 节流) | CSS var --mx/--my + radial-gradient | — | — |
| SortTabs 下划线 | click | CSS translateX transition | cubic-bezier(0.16,1,0.3,1) | 300ms |
| 投票数字弹跳 | click | CSS @keyframes numberPop + spring | cubic-bezier(0.34,1.56,0.64,1) | 300ms |
| 搜索条聚焦 | focus | 底部线 1px→2px + placeholder 渐隐 | ease | 200ms |

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 8. Do's and Don'ts

### Do's
1. 所有颜色通过 CSS 变量引用，零硬编码 hex
2. 保持纯黑白配色，不引入任何彩色强调
3. 排版驱动：通过字号/字重/留白建立层次，非通过阴影/圆角
4. 动效使用 cubic-bezier(0.16, 1, 0.3, 1) 作为默认缓动（theFWA 级「重量感」）
5. 移动端触摸目标 ≥ 44×44px
6. 中文正文行高 ≥ 1.75
7. 桌面端内容最大宽度 720px（阅读舒适宽度）
8. SpotlightCard 使用 rAF 节流 mousemove
9. 优先使用 CSS-only 动效，不引入 GSAP/Framer Motion
10. SpotlightCard 仅在 `matchMedia('(hover: hover)')` 下启用

### Don'ts
1. 不使用圆角（`--radius: 0rem`）
2. 不使用卡片阴影包裹内容
3. 不使用 filter: blur() 在任何滚动元素上
4. 不使用彩色强调色（蓝/绿/红）
5. 不使用渐变文字
6. 不修改 shadcn/ui 基础组件源码
7. 不修改 loading.tsx 和 Intro.tsx
8. 不引入新的 npm 依赖（L2 动效全部 CSS + IntersectionObserver 实现）
9. 不使用 backdrop-filter: blur()（极简风格不需要毛玻璃）
10. 不在正文段落使用文字装饰

---

## 9. 响应式行为 (Responsive Behavior)

| 断点 | 布局变化 |
|------|----------|
| > 768px | 内容居中 720px 宽度，左右大量留白 |
| ≤ 768px | 内容宽度自适应，左右 padding 24px，Hero 字号缩小 |
| ≤ 640px | 移除 SpotlightCard 追踪光（无 hover 设备），Form 恢复 sticky bottom，字体进一步缩小 |

**移动端特别处理**:
- SpotlightCard 在触摸设备上自动禁用
- 表单恢复为 sticky 底部栏（纯色背景，非毛玻璃）
- Hero 大标题字号缩小到 32px
- 搜索条全宽
- 排序导航保持文字样式但增大触摸区域

---

## ADDED Requirements

### Requirement: Hero 编辑级标题区
系统 SHALL 在留言列表上方展示一个编辑级排版的 Hero 区域，包含大号极简标题、描述文字、搜索和排序。

#### Scenario: 用户进入页面
- **WHEN** 用户完成 Intro 动画后进入主页面
- **THEN** 显示大号 Light 字重标题（如"校园网反馈"），配合 stagger 字符入场动画

### Requirement: 无边界留言排版块
系统 SHALL 以无边框、无圆角、无背景色的排版块形式展示每条留言，仅以极淡底线分隔。

#### Scenario: 查看留言列表
- **WHEN** 留言数据加载完成
- **THEN** 每条留言以纯文字排版块形式展示，hover 时左侧出现黑色阅读指示线 + SpotlightCard 追踪光效

### Requirement: SpotlightCard 鼠标追踪光
系统 SHALL 在桌面端留言块 hover 时显示跟随鼠标位置的径向渐变追踪光效。

#### Scenario: 鼠标悬停留言
- **WHEN** 用户在桌面端将鼠标移动到留言块上
- **THEN** 留言块内出现跟随鼠标的微弱径向渐变光斑

### Requirement: 排版级排序导航
系统 SHALL 使用纯文字排版导航替代分段控件式排序切换。

#### Scenario: 切换排序方式
- **WHEN** 用户点击"最新"或"最热"
- **THEN** 选中项底部出现下划线并 translateX 平滑滑动，无背景色块

### Requirement: 标签式投票交互
系统 SHALL 将投票按钮重构为微型标签式交互条，使用黑色系替代彩色强调。

#### Scenario: 用户点赞
- **WHEN** 用户点击点赞按钮
- **THEN** 数字有 spring 弹跳动效，选中态使用黑色系高亮（非彩色）

### Requirement: 杂志投稿区表单
系统 SHALL 将留言表单重构为沉浸式编辑级投稿区，桌面端不再 sticky。

#### Scenario: 桌面端使用表单
- **WHEN** 用户在桌面端滚动到表单区
- **THEN** 表单作为独立 section 展示，有大标题"发表看法"，输入框使用下划线样式

### Requirement: 排版线框骨架屏
系统 SHALL 使用极简灰色横线模拟文字排版的骨架屏，替代 shimmer 扫光效果。

#### Scenario: 留言加载中
- **WHEN** 留言数据正在加载
- **THEN** 显示由不同宽度灰色横线组成的排版骨架（模拟标题/正文/时间）

## MODIFIED Requirements

### Requirement: 搜索栏无界样式
将搜索栏从「圆角矩形输入框+内阴影」重构为「纯下划线式编辑级搜索条」，placeholder 大写宽字距。

### Requirement: 页面布局主轴
将页面从「header + container + 卡片列表 + sticky 表单」重构为「header + Hero + 留言流 + 编辑部表单」的编辑级排版布局，桌面端内容最大宽度 720px。

### Requirement: 色彩方案
将 neutral 灰色阶重新定义为更纯净的黑白色阶（背景微暖白、前景近纯黑），暗色模式同步调整。

## REMOVED Requirements

### Requirement: 奇偶色条装饰
**Reason**: 新的设计语言中留言块无背景色，色条改为 hover 时出现的纯黑阅读指示线
**Migration**: 移除 `.accent-bar-odd` 类和相关 CSS

### Requirement: 毛玻璃表单底栏
**Reason**: 极简风格不使用 backdrop-filter，桌面端表单不再 sticky
**Migration**: 移除 `.glass-panel` 类，移动端使用纯色 sticky 底栏

### Requirement: 骨架屏 Shimmer 扫光
**Reason**: Shimmer 光效过于「AI 模板感」，改为更安静的排版线框骨架
**Migration**: 移除 `.shimmer-skeleton` 类和 `@keyframes shimmer`

### Requirement: 彩色 Avatar
**Reason**: 黑白极简风格不使用彩色标识
**Migration**: Avatar 改为纯黑/白文字头像，移除 `AVATAR_COLORS` 彩色数组

### Requirement: SortTabs 图标
**Reason**: 排版级设计不需要图标装饰
**Migration**: 移除 Clock/Flame 图标，改为纯文字导航
