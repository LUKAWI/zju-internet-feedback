# Tasks

- [x] Task 1: globals.css — 新增动画与变量基础
  - [ ] SubTask 1.1: 新增 CSS 变量层（:root 和 .dark 中的 shadow/shimmer/glow/accent-bar 变量）
  - [ ] SubTask 1.2: 添加 shimmer 扫光 @keyframes（骨架屏用）
  - [ ] SubTask 1.3: 添加 fadeInUp 入场 @keyframes（stagger delay 支持）
  - [ ] SubTask 1.4: 添加 shimmer-skeleton utility class（background + animation 组合）
  - [ ] SubTask 1.5: 添加 glass-panel utility class（backdrop-filter + 背景色半透明）
  - [ ] SubTask 1.6: 添加 focus-glow utility class（聚焦发光 ring 效果）
  - [ ] SubTask 1.7: 添加 press-scale utility class（active 按压缩放）
  - [ ] SubTask 1.8: 添加 page-enter utility class（页面区域入场动画）

- [ ] Task 2: MessageCard 卡片质感优化
  - [ ] SubTask 2.1: 卡片默认态添加多层柔阴影（L1 层级）
  - [ ] SubTask 2.2: 卡片悬浮态阴影加深 + translateY(-2px) 微上浮
  - [ ] SubTask 2.3: 奇数卡片左侧添加 ::before 2px 半透明色条装饰
  - [ ] SubTask 2.4: 优化正文排版：行高 1.75、字间距 0.01em
  - [ ] SubTask 2.5: CardFooter 移除硬边框，改用渐变透明分隔线
  - [ ] SubTask 2.6: Hover shadow 使用 CSS 变量 var(--shadow-hover)（暗色模式兼容）

- [ ] Task 3: SearchBar 搜索栏视觉增强
  - [ ] SubTask 3.1: 默认态添加 inset 内阴影凹陷效果
  - [ ] SubTask 3.2: 聚焦态添加 focus-glow 边框发光 + 图标颜色变化到 foreground
  - [ ] SubTask 3.3: 清除按钮 hover 微 scale 反馈

- [ ] Task 4: SortTabs 排序标签精致化
  - [ ] SubTask 4.1: 重构为自定义组件（不修改 ui/tabs.tsx），实现选中态滑块平移动画
  - [ ] SubTask 4.2: 选中态图标 scale(1.1) + 颜色从 muted-foreground 变为 foreground
  - [ ] SubTask 4.3: 选中态文字 weight 500 → 600

- [ ] Task 5: MessageList 加载态与状态优化
  - [ ] SubTask 5.1: 骨架屏应用 shimmer-skeleton class 替代默认 pulse
  - [ ] SubTask 5.2: 空状态增加 MessageSquare icon 装饰
  - [ ] SubTask 5.3: "已经到底啦" 上方增加居中渐变分隔线（::before 渐变线）
  - [ ] SubTask 5.4: 加载更多 spinner 优化为更精致的样式

- [ ] Task 6: MessageForm 表单高级感
  - [ ] SubTask 6.1: 移动端悬浮表单应用 glass-panel 毛玻璃效果
  - [ ] SubTask 6.2: 表单顶部渐变分隔线替代硬边框
  - [ ] SubTask 6.3: 输入框聚焦态应用 focus-glow 效果
  - [ ] SubTask 6.4: 提交按钮应用 press-scale + hover 微渐变

- [ ] Task 7: VoteButtons 交互质感
  - [ ] SubTask 7.1: 点击时应用 press-scale 缩放微动效（cubic-bezier(0.34, 1.56, 0.64, 1)）
  - [ ] SubTask 7.2: 选中态添加半透明背景色块
  - [ ] SubTask 7.3: 确保 tabular-nums 用于数字显示

- [ ] Task 8: page.tsx 主页面布局与入场动画
  - [ ] SubTask 8.1: header 底部改为渐变阴影替代硬 border-b
  - [ ] SubTask 8.2: 主内容区各 section 添加 page-enter stagger 入场动画
  - [ ] SubTask 8.3: footer 上方添加渐变分隔线
  - [ ] SubTask 8.4: 静态 JSX 提取：将 footer 内容提取为常量（rendering-hoist-jsx）

- [x] Task 9: React Best Practices 审计与优化
  - [ ] SubTask 9.1: MessageCard — getAvatarColor 用 useMemo 缓存（rerender-memo）
  - [ ] SubTask 9.2: VoteButtons — 确保所有 setState 使用函数式写法（rerender-functional-setstate）
  - [ ] SubTask 9.3: 确保无内联组件定义（rerender-no-inline-components）
  - [ ] SubTask 9.4: MessageList — 长列表卡片添加 content-visibility: auto（rendering-content-visibility）

- [x] Task 10: 验证与收尾
  - [ ] SubTask 10.1: 运行 lint 确保无代码规范问题
  - [ ] SubTask 10.2: 验证暗色模式兼容（阴影/半透明色值在 dark 模式下合理）
  - [ ] SubTask 10.3: 验证移动端适配（小屏幕下无溢出/错位）
  - [ ] SubTask 10.4: 启动 dev server 验证页面效果

# Task Dependencies
- Task 1（全局 CSS 基础）应首先完成，后续任务依赖这些 utility class
- Task 2-8 可并行执行，但建议按顺序逐个完成以便逐步验证
- Task 9（React Best Practices 审计）在 Task 2-8 完成后执行
- Task 10（验证）在所有其他任务完成后执行
