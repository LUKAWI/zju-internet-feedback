# Danmaku 弹幕系统 - 实现计划

## [ ] Task 1: 添加弹幕动画 CSS 样式（VS Code Light 配色）
- **Priority**: P0
- **Depends On**: None
- **Description**: 
  - 在 globals.css 中添加 VS Code Light 配色变量
  - 添加弹幕滚动动画 @keyframes
  - 添加弹幕容器和弹幕项样式（圆角卡片、轻微阴影）
  - 添加 hover 暂停效果
- **Acceptance Criteria Addressed**: AC-2, AC-4, AC-7, AC-8
- **Test Requirements**:
  - `human-judgment` TR-1.1: 弹幕动画平滑，无卡顿
  - `human-judgment` TR-1.2: hover 时弹幕暂停
  - `human-judgment` TR-1.3: VS Code Light 配色（#f3f3f3 背景，#3c3c3c 文字）
  - `human-judgment` TR-1.4: 社交媒体文本框风格（圆角 8px，阴影）

## [ ] Task 2: 创建 Danmaku 组件（社交媒体风格）
- **Priority**: P0
- **Depends On**: Task 1
- **Description**: 
  - 创建 components/Danmaku.tsx 组件
  - 实现弹幕数据获取逻辑
  - 实现随机选取留言算法
  - 实现弹幕循环播放机制
  - 社交媒体风格布局（头像+用户名+内容）
- **Acceptance Criteria Addressed**: AC-1, AC-2, AC-5, AC-8, AC-9
- **Test Requirements**:
  - `human-judgment` TR-2.1: 显示 3-5 条弹幕
  - `human-judgment` TR-2.2: 刷新页面展示不同弹幕组合
  - `human-judgment` TR-2.3: 社交媒体文本框布局（头像+用户名+内容）
  - `programmatic` TR-2.4: FPS 保持 60 帧

## [ ] Task 3: 创建 useDanmaku 自定义 Hook
- **Priority**: P1
- **Depends On**: Task 2
- **Description**: 
  - 抽取弹幕逻辑为独立 hook
  - 处理弹幕数据管理
  - 实现弹幕复用机制
- **Acceptance Criteria Addressed**: AC-1, AC-5
- **Test Requirements**:
  - `human-judgment` TR-3.1: 代码结构清晰，可复用
  - `human-judgment` TR-3.2: 无内存泄漏

## [ ] Task 4: 修改 page.tsx 集成弹幕组件
- **Priority**: P0
- **Depends On**: Task 2
- **Description**: 
  - 移除 HeroTitle 组件
  - 移除副标题段落
  - 添加 Danmaku 组件
  - 调整布局间距
- **Acceptance Criteria Addressed**: AC-1, AC-6
- **Test Requirements**:
  - `human-judgment` TR-4.1: Hero 区域无标题，显示弹幕
  - `human-judgment` TR-4.2: 搜索栏和排序导航位置正确

## [ ] Task 5: 响应式适配
- **Priority**: P1
- **Depends On**: Task 1, Task 2
- **Description**: 
  - 实现移动端弹幕容器高度调整
  - 实现字体大小自适应
  - 确保触摸设备体验良好
- **Acceptance Criteria Addressed**: AC-6
- **Test Requirements**:
  - `human-judgment` TR-5.1: 移动端弹幕容器高度适配
  - `human-judgment` TR-5.2: 无横向溢出

## [ ] Task 6: 性能优化与测试
- **Priority**: P2
- **Depends On**: Task 2, Task 3
- **Description**: 
  - 添加 IntersectionObserver 延迟加载
  - 使用 requestAnimationFrame 节流
  - 验证性能指标
- **Acceptance Criteria Addressed**: AC-9
- **Test Requirements**:
  - `programmatic` TR-6.1: FPS >= 60
  - `human-judgment` TR-6.2: 内存使用稳定

## [ ] Task 7: 测试与验证
- **Priority**: P2
- **Depends On**: All
- **Description**: 
  - 测试弹幕功能完整性
  - 验证设计风格契合度
  - 检查代码质量
- **Acceptance Criteria Addressed**: All
- **Test Requirements**:
  - `human-judgment` TR-7.1: 所有 AC 均通过
  - `human-judgment` TR-7.2: 代码符合 React Best Practices

## Task Dependencies
```
Task 1 ──────┬───> Task 2 ────> Task 4
             │         │
             │         └───> Task 3
             │
             └─────> Task 5

Task 2, 3 ───> Task 6

All ───> Task 7
```
