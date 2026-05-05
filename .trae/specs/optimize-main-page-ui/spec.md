# 主页面 UI-UX 全面优化 Spec

## Why
当前留言添加与浏览页面在功能上已经完善，但视觉质感和交互体验仍有提升空间。需要在不改变 neutral 黑白灰色调的前提下，通过精细的光影层次、排版节奏、L1 级微交互提升画面高级感，使其与 Intro 打字机动画在视觉品质上匹配。同时遵循反 AI 设计规范，避免模板化千篇一律的布局。遵循 Vercel React 最佳实践确保性能不退化。

## 设计风格定位（Style Seed: 极简克制 Minimal Pure）

**Style**: 极简克制
**Keywords**: 干净、留白、精确、安静、高级、纸质感
**Tone**: 美术馆白墙上的一行字 — NOT 花哨、NOT 拥挤、NOT 霓虹
**Interaction Tier**: L1 精致静态（优雅 hover + 柔和入场）
**Dependencies**: CSS only（纯 CSS 动画，无外部动画库依赖）

---

## 1. 视觉主题与氛围 (Visual Theme & Atmosphere)

在 neutral 灰度色系基础上，通过精细的阴影层级、微妙的表面纹理、克制的动效，营造「安静但高级」的阅读体验。卡片不再是扁平的白色方块，而是有深度、有呼吸感的信息容器。

### 反 AI 设计原则
- 打破完全对称：卡片内容区使用非等比间距（如 header 区紧凑、content 区宽松）
- 微妙不规则：奇数卡片左侧带 2px 色条装饰，偶数卡片无色条
- 避免「AI 模板感」：搜索栏内嵌微阴影凹陷效果，而非简单边框

## 2. 色彩方案 (Color Palette & Roles)

**不修改现有 CSS 变量**，仅在 globals.css 中新增实用 CSS 变量用于增强层：

```css
:root {
  /* 新增表面层次（不修改 shadcn 变量） */
  --surface-elevated: oklch(1 0 0);                    /* 卡片悬浮态 */
  --shadow-color: oklch(0.145 0 0 / 0.04);             /* 默认阴影 */
  --shadow-hover: oklch(0.145 0 0 / 0.08);             /* 悬浮阴影 */
  --glow-ring: oklch(0.556 0 0 / 0.15);                /* 聚焦发光 */
  --shimmer-from: oklch(0.97 0 0);                     /* shimmer 起始 */
  --shimmer-to: oklch(0.922 0 0);                      /* shimmer 终止 */
  --accent-bar: oklch(0.556 0 0 / 0.6);                /* 卡片侧边装饰条 */
}

.dark {
  --surface-elevated: oklch(0.205 0 0);
  --shadow-color: oklch(0 0 0 / 0.2);
  --shadow-hover: oklch(0 0 0 / 0.35);
  --glow-ring: oklch(0.556 0 0 / 0.25);
  --shimmer-from: oklch(0.205 0 0);
  --shimmer-to: oklch(0.269 0 0);
  --accent-bar: oklch(0.708 0 0 / 0.5);
}
```

**色彩规则**: 所有新增颜色通过 CSS 变量引用，禁止硬编码 hex。

## 3. 排版规则 (Typography Rules)

保持现有 Geist 字体族不变。优化中文排版：

| 角色 | 字体 | 字号 | 字重 | 行高 | 字间距 |
|------|------|------|------|------|--------|
| 页面标题 | Geist Sans | 18px | 600 | 1.4 | — |
| 卡片昵称 | Geist Sans | 14px | 600 | 1.4 | — |
| 正文内容 | Geist Sans | 14px | 400 | 1.75 | 0.01em |
| 辅助文字 | Geist Sans | 12px | 400 | 1.5 | — |
| 表单标题 | Geist Sans | 16px | 600 | 1.4 | — |

**中文排版要求**: 中文正文行高 ≥ 1.75，字间距 0.01em，正文字号 ≥ 14px。

**Text Decoration**: 极简克制风格，不使用渐变文字或文字投影。

## 4. 组件样式 (Component Stylings)

### 4.1 消息卡片 (MessageCard)
- **默认态**: 多层柔阴影 `0 1px 3px var(--shadow-color), 0 4px 12px var(--shadow-color)`
- **悬浮态**: 阴影加深 + `translateY(-2px)` 微上浮，transition 300ms ease
- **奇偶差异**: 奇数卡片左侧带 2px 半透明色条（`::before` 伪元素），偶数无
- **CardFooter**: 移除硬边框，改用顶部 1px 渐变透明线（`linear-gradient(to right, transparent, var(--border), transparent)`）

### 4.2 搜索栏 (SearchBar)
- **默认态**: 内阴影 `inset 0 1px 2px rgba(0,0,0,0.04)`，营造凹陷质感
- **聚焦态**: 边框变为 `var(--glow-ring)` + 外层 2px 光晕 ring
- **搜索图标**: 聚焦时从 muted-foreground 渐变到 foreground

### 4.3 排序标签 (SortTabs)
- **选中态滑块**: 带平滑 translateX 动画的背景滑块
- **图标**: 选中态微 scale(1.1) + 颜色加深
- **文字**: 选中态 font-weight 从 500 → 600

### 4.4 投票按钮 (VoteButtons)
- **点击态**: `scale(0.92)` 按压缩放 + spring 回弹
- **选中态**: 半透明背景色块 + 图标颜色饱和
- **数字**: 使用 `tabular-nums` + transition 平滑过渡

### 4.5 表单区域 (MessageForm)
- **移动端悬浮**: `backdrop-filter: blur(12px)` 毛玻璃背景，`backdrop-saturate(1.2)`
- **顶部**: 渐变分隔线替代硬边框
- **输入框聚焦**: 微妙高亮边框 + label 浮动效果
- **提交按钮**: hover 时 subtle 渐变 + active 时 scale(0.98)

### 4.6 骨架屏 (Skeleton)
- **Shimmer 光效**: `linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)` 从左到右扫光
- **Dark mode**: shimmer 色值调整为 `rgba(255,255,255,0.06)`

### 4.7 Header
- **底部**: 从 1px 硬边框改为底部渐变阴影（`box-shadow: 0 1px 0 0 var(--border), 0 4px 12px -4px var(--shadow-color)`）
- **滚动态**: 无变化（保持 sticky + backdrop-blur）

### 4.8 空状态 & 末尾状态
- **空状态**: 增加 MessageSquare icon + 更精致的排版
- **"已经到底啦"**: 上方增加居中渐变分隔线装饰

## 5. 布局原则 (Layout Principles)

- 保持现有 container 布局不变
- 卡片间距从 `space-y-3` 增加到 `space-y-4`，增加呼吸感
- 移动端安全区保持现有 44px 最小触摸目标

## 6. 深度与层级 (Depth & Elevation)

三层阴影体系：
| 层级 | 阴影 | 用途 |
|------|------|------|
| L0 | 无阴影 | 输入框、按钮默认态 |
| L1 | `0 1px 3px shadow-color` | 卡片默认态 |
| L2 | `0 4px 16px shadow-hover` + `translateY(-2px)` | 卡片悬浮态、表单底栏 |

## 7. 动效与交互 (Animation & Interaction)

**档位**: L1 精致静态（CSS only，无 JS 动画库）

| 动效 | 触发 | 实现 | 缓动 |
|------|------|------|------|
| 卡片入场 | 列表渲染 | `fadeInUp` stagger delay | `cubic-bezier(0.16, 1, 0.3, 1)` |
| Shimmer 扫光 | 骨架屏加载 | CSS `@keyframes shimmer` | `linear` |
| 悬浮上浮 | hover | `transform + box-shadow` transition | `ease` |
| 按压缩放 | active/click | `scale(0.92)` transition | `cubic-bezier(0.34, 1.56, 0.64, 1)` |
| 聚焦发光 | focus-visible | `box-shadow ring` transition | `ease` |
| 排序滑块 | 标签切换 | CSS `translateX` transition | `cubic-bezier(0.16, 1, 0.3, 1)` |
| 页面入场 | Intro 结束后 | `stagger fadeInUp` | `cubic-bezier(0.16, 1, 0.3, 1)` |

**Reduced Motion**: 已有 `@media (prefers-reduced-motion)` 降级规则保持不变。

## 8. Do's and Don'ts

### Do's
1. 所有新增颜色通过 CSS 变量引用
2. 保持 neutral 色调一致，不引入彩色强调
3. 动效时长 ≤ 500ms，缓动自然
4. 移动端触摸目标 ≥ 44×44px
5. 中文正文行高 ≥ 1.75

### Don'ts
1. 不修改 shadcn/ui 基础组件源码
2. 不引入新的 npm 依赖
3. 不使用 `filter: blur()` 在滚动元素上
4. 不使用 `backdrop-filter: blur()` 超过 14px
5. 不使用硬编码 hex 颜色值
6. 不在正文段落使用文字装饰（渐变/投影）
7. 不破坏现有暗色模式 CSS 变量
8. 不修改 loading.tsx 和 Intro.tsx

## 9. 响应式行为 (Responsive Behavior)

- **Desktop (> 640px)**: 当前布局保持，卡片间距稍增
- **Mobile (≤ 640px)**: 毛玻璃表单底栏、增大触摸目标、保持 16px 最小字号防 iOS 缩放

---

## What Changes
- `app/page.tsx` — 优化布局结构，添加页面入场 stagger 动画，改进 header 阴影
- `app/globals.css` — 新增动画关键帧、阴影变量、shimmer 样式、毛玻璃 utility
- `components/SearchBar.tsx` — 内阴影凹陷质感 + 聚焦发光 + 图标颜色跟随
- `components/SortTabs.tsx` — 自定义选中态滑块动画
- `components/MessageCard.tsx` — 多层阴影 + 奇偶差异装饰 + 排版优化 + CardFooter 渐变线
- `components/MessageList.tsx` — shimmer 骨架屏 + 空状态 icon + 末尾装饰线
- `components/MessageForm.tsx` — 毛玻璃底栏 + 聚焦高亮 + 按钮微交互
- `components/VoteButtons.tsx` — 按压缩放 + 选中态背景色块

**不变更范围：**
- `app/loading.tsx` — 不修改 loading page
- `components/Intro.tsx` — 不修改 Intro 打字机动画
- 所有 `components/ui/*` 基础组件 — 不修改 shadcn 基础组件源码
- CSS 变量色彩方案 — 保持 neutral 色调不变
- API 逻辑和数据流 — 不修改

## React Best Practices 合规要求

遵循 Vercel React 最佳实践：

| 规则 ID | 规则 | 应用场景 |
|---------|------|----------|
| `rendering-hoist-jsx` | 静态 JSX 提取到组件外 | MessageCard 的 Avatar 颜色数组 |
| `rerender-memo` | 昂贵计算使用 useMemo | getAvatarColor 函数缓存 |
| `rerender-functional-setstate` | 使用函数式 setState | VoteButtons 中的计数更新 |
| `rerender-dependencies` | effect 依赖使用原始类型 | SearchBar 的 debounce effect |
| `rendering-content-visibility` | 长列表使用 content-visibility | MessageList 列表优化 |
| `rerender-no-inline-components` | 不在组件内定义子组件 | 所有组件文件 |
| `js-batch-dom-css` | 通过 class 批量操作 CSS | 动画状态切换 |

## Impact
- Affected specs: 无（独立视觉优化）
- Affected code: `app/page.tsx`, `app/globals.css`, `components/SearchBar.tsx`, `components/SortTabs.tsx`, `components/MessageCard.tsx`, `components/MessageList.tsx`, `components/MessageForm.tsx`, `components/VoteButtons.tsx`

## ADDED Requirements

### Requirement: 骨架屏 Shimmer 光效
系统 SHALL 在消息列表加载时显示带 shimmer 光效的骨架屏。

#### Scenario: 首次加载
- **WHEN** 用户进入页面且消息数据尚未返回
- **THEN** 显示带从左到右 shimmer 光扫过的骨架屏卡片

### Requirement: 多层阴影层级体系
系统 SHALL 为卡片、搜索栏、表单等元素使用三层阴影层级体系。

#### Scenario: 卡片悬浮
- **WHEN** 用户鼠标悬停在消息卡片上
- **THEN** 卡片阴影从 L1 深度过渡到 L2 深度并产生 translateY(-2px) 上浮

### Requirement: 页面入场 stagger 动画
系统 SHALL 在页面渲染后为主内容区域添加分段渐入动画。

#### Scenario: 页面出现
- **WHEN** 页面内容渲染
- **THEN** header → 搜索/排序 → 消息列表 → 表单 依次 fadeInUp 渐入

### Requirement: 反 AI 设计 - 不规则卡片装饰
系统 SHALL 在奇数消息卡片左侧添加 2px 半透明色条装饰，打破完全对称。

#### Scenario: 消息卡片视觉多样性
- **WHEN** 多条消息依次显示
- **THEN** 奇数卡片有左侧色条装饰，偶数卡片无

### Requirement: 表单毛玻璃底栏
系统 SHALL 在移动端使用毛玻璃效果的悬浮底栏。

#### Scenario: 移动端悬浮表单
- **WHEN** 用户在移动端滚动消息列表
- **THEN** 底部表单区域使用 backdrop-filter: blur(12px) 毛玻璃效果

## MODIFIED Requirements

### Requirement: 搜索栏凹陷质感
修改为带内阴影（inset shadow）凹陷效果 + 聚焦时边框发光 + 图标颜色跟随聚焦态变化。

### Requirement: 投票按钮按压反馈
修改为带 scale(0.92) 按压缩放、spring 回弹缓动、选中态半透明背景色块。

### Requirement: 排序标签滑块动画
修改为带 CSS 平滑 translateX 背景滑块动画的自定义排序切换。

## REMOVED Requirements
无
