# Danmaku 弹幕系统 - 产品需求文档

## Overview
- **Summary**: 在 Hero 区域实现弹幕系统，从用户留言中随机选取内容，以横向滚动方式展示。采用 VS Code Light 配色风格和社交媒体文本框设计。
- **Purpose**: 替代原有的静态标题和副标题，让页面更具动态感和互动性，展示真实用户反馈内容。
- **Target Users**: 所有访问校园网反馈平台的用户

## Goals
- 移除原 Hero 标题和副标题
- 实现弹幕系统，从留言中随机选取内容
- 弹幕从右至左滚动，支持多条同时展示
- 采用 VS Code Light 配色风格
- 弹幕采用社交媒体文本框设计风格
- 内容动态变化，每次刷新展示不同弹幕

## Non-Goals (Out of Scope)
- 不实现弹幕发送功能（仅展示）
- 不添加过多彩色元素
- 不实现弹幕屏蔽/过滤功能

## Background & Context
- 基于 theFWA 黑白极简设计风格 + VS Code Light 配色
- 现有留言数据存储在 API 中
- 需要保持与整体设计语言一致

## Functional Requirements
- **FR-1**: 弹幕系统从 API 获取留言数据
- **FR-2**: 随机选取 3-5 条留言作为弹幕内容
- **FR-3**: 弹幕从右侧进入，左侧退出，持续滚动
- **FR-4**: 多条弹幕同时滚动，高度随机分布
- **FR-5**: hover 时弹幕暂停并显示完整内容提示
- **FR-6**: 弹幕内容动态变化，每次刷新展示不同组合

## Non-Functional Requirements
- **NFR-1**: 弹幕动画流畅，不影响页面性能
- **NFR-2**: 响应式设计，适配桌面和移动端
- **NFR-3**: VS Code Light 配色风格
- **NFR-4**: 社交媒体文本框设计（圆角卡片、轻微阴影）
- **NFR-5**: 支持 prefers-reduced-motion 降级

## Constraints
- **Technical**: React + TypeScript + TailwindCSS
- **Design**: VS Code Light 配色，适度圆角，轻微阴影
- **Performance**: 同时最多显示 5 条弹幕

## Assumptions
- 留言 API 正常返回数据
- 用户浏览器支持 CSS 动画
- 弹幕内容已过滤敏感词

## Acceptance Criteria

### AC-1: 弹幕组件加载
- **Given**: 用户进入页面且留言数据可用
- **When**: Hero 区域渲染完成
- **Then**: 弹幕容器显示 3-5 条滚动弹幕
- **Verification**: `human-judgment`

### AC-2: 弹幕滚动动画
- **Given**: 弹幕组件已加载
- **When**: 弹幕进入可视区域
- **Then**: 弹幕从右侧平滑滚动至左侧退出
- **Verification**: `human-judgment`

### AC-3: 弹幕内容截取
- **Given**: 弹幕内容超过 30 字符
- **When**: 弹幕显示时
- **Then**: 只显示前 30 字符，hover 显示完整内容
- **Verification**: `human-judgment`

### AC-4: 弹幕暂停效果
- **Given**: 弹幕正在滚动
- **When**: 用户 hover 弹幕项
- **Then**: 该弹幕暂停滚动，显示完整内容提示
- **Verification**: `human-judgment`

### AC-5: 动态内容变化
- **Given**: 用户刷新页面
- **When**: 弹幕组件重新加载
- **Then**: 展示不同的留言组合
- **Verification**: `human-judgment`

### AC-6: 响应式适配
- **Given**: 页面在不同设备上显示
- **When**: 窗口大小改变
- **Then**: 弹幕容器高度和字体大小自适应
- **Verification**: `human-judgment`

### AC-7: VS Code Light 配色风格
- **Given**: 弹幕组件渲染完成
- **When**: 查看弹幕样式
- **Then**: 背景 #f3f3f3，文字 #3c3c3c，边框 #d4d4d4
- **Verification**: `human-judgment`

### AC-8: 社交媒体文本框风格
- **Given**: 弹幕组件渲染完成
- **When**: 查看弹幕样式
- **Then**: 圆角卡片设计，轻微阴影，头像+用户名+内容布局
- **Verification**: `human-judgment`

### AC-9: 性能优化
- **Given**: 弹幕正在播放
- **When**: 监控页面性能
- **Then**: FPS 保持在 60，无明显卡顿
- **Verification**: `programmatic`

## Open Questions
- [ ] 是否需要添加弹幕数量配置项？

---

## 设计规范

### 视觉设计

**VS Code Light 配色方案**:
```css
--danmaku-bg: #f3f3f3;      /* VS Code Light 背景 */
--danmaku-text: #3c3c3c;    /* VS Code 文字色 */
--danmaku-border: #d4d4d4;  /* VS Code 边框色 */
--danmaku-accent: #007acc;  /* VS Code 蓝色强调 */
```

**社交媒体文本框风格**:
- 圆角：8px
- 阴影：`0 1px 3px rgba(0,0,0,0.1)`
- 内边距：10px 12px
- 布局：头像 + 用户名 + 内容

**排版**:
- 用户名：12px，半粗体
- 内容：13px，常规字重
- 头像：24x24 像素，圆角 50%

### 动效设计

**动画类型**:
- 入场：从右侧滑入
- 滚动：匀速向左移动
- 暂停：hover 时停止
- 退出：左侧滑出

**缓动函数**:
- 匀速滚动：`linear`
- hover 过渡：`cubic-bezier(0.16, 1, 0.3, 1)`

**降级策略**:
```css
@media (prefers-reduced-motion: reduce) {
  .danmaku-item {
    animation-duration: 0.01ms !important;
  }
}
```

### React Best Practices

**性能优化**:
- 使用 IntersectionObserver 延迟加载
- 弹幕复用机制（循环使用已退出的弹幕元素）
- requestAnimationFrame 节流

**代码结构**:
- 独立 Danmaku 组件
- 自定义 hook 处理弹幕逻辑
- 模块级常量定义
