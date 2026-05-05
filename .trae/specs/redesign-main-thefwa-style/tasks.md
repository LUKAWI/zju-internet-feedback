# Tasks

- [ ] Task 1: globals.css — 全新设计 Token 与 L2 动效系统
  - [ ] SubTask 1.1: 重定义 :root 和 .dark CSS 变量（纯黑白色彩方案、0rem 圆角）
  - [ ] SubTask 1.2: 添加 Grain 纹理背景（纯 CSS 实现，body 全局氛围层）
  - [ ] SubTask 1.3: 添加 Hero stagger 字符入场 @keyframes（fadeInUp + letterSpacing 释放）
  - [ ] SubTask 1.4: 添加 ScrollReveal 滚动触发动画 class（IntersectionObserver 驱动的 CSS class）
  - [ ] SubTask 1.5: 添加 SpotlightCard 追踪光 utility class（--mx/--my + radial-gradient）
  - [ ] SubTask 1.6: 添加排版线框骨架屏样式（无 shimmer 的安静 pulse）
  - [ ] SubTask 1.7: 添加 SortTabs 下划线滑动动画 class
  - [ ] SubTask 1.8: 添加 numberPop 数字弹跳 @keyframes（投票反馈用）
  - [ ] SubTask 1.9: 添加下划线输入框样式 utility（underline-input）
  - [ ] SubTask 1.10: 确保 :root 中 --radius: 0rem
  - [ ] SubTask 1.11: 确保 reduced-motion 降级规则完整

- [ ] Task 2: MessageCard → MessageBlock 编辑级留言块重构
  - [ ] SubTask 2.1: 移除 Card/CardContent/CardFooter 包裹，改为纯 div 排版块
  - [ ] SubTask 2.2: 默认态：无背景色、无圆角、无阴影、仅底部 1px 分隔线
  - [ ] SubTask 2.3: 悬浮态：左侧出现 2px 纯黑阅读指示竖线（::before 伪元素）
  - [ ] SubTask 2.4: 集成 SpotlightCard 追踪光效（mousemove rAF + CSS var --mx/--my）
  - [ ] SubTask 2.5: SpotlightCard 仅在 matchMedia('(hover: hover)') 下启用
  - [ ] SubTask 2.6: Avatar 从彩色背景改为纯黑/白文字头像（移除 AVATAR_COLORS）
  - [ ] SubTask 2.7: 投票按钮移到昵称同行右侧（标签式交互条）
  - [ ] SubTask 2.8: 移除"热门"Badge 组件，改为排版标记（小字 muted-foreground）
  - [ ] SubTask 2.9: 正文排版：行高 1.8、字间距 0.01em、字号 15px
  - [ ] SubTask 2.10: hover 过渡使用 cubic-bezier(0.16, 1, 0.3, 1) 400ms
  - [ ] SubTask 2.11: 添加 IntersectionObserver scroll-reveal 入场动画（stagger 60ms）

- [ ] Task 3: SearchBar → 无界下划线搜索条重构
  - [ ] SubTask 3.1: 移除圆角矩形 Input 包裹，改为无边框+底部 1px 线样式
  - [ ] SubTask 3.2: 聚焦态底部线 1px→2px 黑色，placeholder 渐隐
  - [ ] SubTask 3.3: 清除按钮改为文字链接「清除」（非 X icon）
  - [ ] SubTask 3.4: Search 图标缩小到 14px + 聚焦颜色过渡
  - [ ] SubTask 3.5: 移除 inset 内阴影样式

- [ ] Task 4: SortTabs → 排版文字导航重构
  - [ ] SubTask 4.1: 移除 bg-muted 背景+滑块，改为纯文字+下划线导航
  - [ ] SubTask 4.2: 选中态底部出现 1px 下划线（translateX 平滑滑动）
  - [ ] SubTask 4.3: 移除 Clock/Flame 图标
  - [ ] SubTask 4.4: 非选中态 muted-foreground → 选中态 foreground
  - [ ] SubTask 4.5: 两段文字之间用 `|` 分隔

- [ ] Task 5: VoteButtons → 标签式微型交互条重构
  - [ ] SubTask 5.1: 移除 ThumbsUp/ThumbsDown 图标，改为简洁符号标记
  - [ ] SubTask 5.2: 移除 emerald/rose 彩色 hover，统一改为黑色系
  - [ ] SubTask 5.3: 选中态使用 foreground 文字+极淡黑底
  - [ ] SubTask 5.4: 点击时应用 numberPop spring 弹跳动效
  - [ ] SubTask 5.5: 重新设计极小尺寸布局（放在昵称右侧同行）

- [ ] Task 6: MessageList 列表容器与状态重构
  - [ ] SubTask 6.1: 骨架屏从 shimmer 扫光改为排版线框（不同宽度灰线模拟文字）
  - [ ] SubTask 6.2: 空状态移除 MessageSquare icon，改为大号排版文字「暂无留言」
  - [ ] SubTask 6.3: 末尾状态改为极简「—— FIN ——」标记
  - [ ] SubTask 6.4: 移除卡片间距 space-y-4，改为 48px 间距梯度
  - [ ] SubTask 6.5: 错误状态保持简洁但排版优化

- [ ] Task 7: MessageForm → 杂志投稿区重构
  - [ ] SubTask 7.1: 桌面端取消 sticky + 毛玻璃，作为独立 section 展示
  - [ ] SubTask 7.2: 标题改为大号 Section 标题「发表看法」
  - [ ] SubTask 7.3: 输入框改为下划线样式（与搜索栏统一）
  - [ ] SubTask 7.4: 提交按钮改为右对齐文字式按钮（下划线装饰，非全宽 primary）
  - [ ] SubTask 7.5: 移动端恢复 sticky bottom，使用纯黑底+白字（非毛玻璃）
  - [ ] SubTask 7.6: 桌面端昵称+内容尝试横向布局（昵称左，内容右）

- [ ] Task 8: page.tsx 全新编辑级页面布局
  - [ ] SubTask 8.1: Header 改为纯色背景 + 1px border-b（移除渐变阴影和 backdrop-blur）
  - [ ] SubTask 8.2: 新增 Hero 编辑级标题区（大号标题+描述+搜索+排序）
  - [ ] SubTask 8.3: Hero 大标题实现 split-char stagger 入场动画
  - [ ] SubTask 8.4: 内容区最大宽度 720px 居中
  - [ ] SubTask 8.5: 留言流 section 与表单 section 使用 80px 间距
  - [ ] SubTask 8.6: Footer 极简化

- [ ] Task 9: React Best Practices 审计与优化
  - [ ] SubTask 9.1: SpotlightCard mousemove 使用 rAF 节流
  - [ ] SubTask 9.2: ScrollReveal 使用单个 IntersectionObserver 实例（非每元素一个）
  - [ ] SubTask 9.3: 确保所有 setState 使用函数式写法
  - [ ] SubTask 9.4: 确保无内联组件定义
  - [ ] SubTask 9.5: 静态 JSX 提取为组件外常量

- [ ] Task 10: 验证与收尾
  - [ ] SubTask 10.1: 运行 lint 确保无错误
  - [ ] SubTask 10.2: 验证暗色模式兼容（黑白反转合理）
  - [ ] SubTask 10.3: 验证移动端适配（无横向溢出、触摸目标达标）
  - [ ] SubTask 10.4: 验证 reduced-motion 降级正常
  - [ ] SubTask 10.5: 验证 SpotlightCard 在触摸设备上禁用
  - [ ] SubTask 10.6: 启动 dev server 并验证完整视觉效果

# Task Dependencies
- **Task 1**（globals.css 设计 Token + 动效系统）为所有后续任务的基础，必须首先完成
- **Task 2-7**（各组件重构）依赖 Task 1，但彼此之间可并行执行
- **Task 8**（page.tsx 布局）依赖 Task 2-7（需要新组件接口）
- **Task 9**（React Best Practices）在 Task 2-8 完成后进行审计
- **Task 10**（验证）在所有其他任务完成后执行
