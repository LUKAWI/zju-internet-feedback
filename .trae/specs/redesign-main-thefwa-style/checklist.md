# Checklist

## 设计 Token 验收

- [ ] :root CSS 变量使用纯黑白色彩方案（背景微暖白 oklch(0.98 0 0)、前景近纯黑 oklch(0.1 0 0)）
- [ ] :root 中 --radius: 0rem（全局无圆角）
- [ ] .dark CSS 变量黑白反转正确且对比度合理
- [ ] 所有新增颜色通过 CSS 变量引用，无硬编码 hex
- [ ] 增强变量（surface-elevated/shadow-color/spotlight-color/accent-bar）正确定义
- [ ] 旧有的 shadow-color/shadow-hover/glow-ring 等变量更新为新设计方案的值

## L2 动效系统验收（6 类 Signature Moments）

- [ ] Text Animation — Hero H1：split-char stagger fadeInUp 入场动画可正常工作
- [ ] Text Animation — Section H2：滚动触发 reveal（「发表看法」标题）
- [ ] Text Animation — Body：留言块滚动 stagger reveal 入场（IntersectionObserver 驱动）
- [ ] Animation — 元素级：SpotlightCard 追踪光跟随鼠标移动（桌面端）
- [ ] Component — 交互构件：SortTabs 下划线 translateX 平滑滑动 + 投票数字弹跳
- [ ] Background — 氛围层：body 全局 Grain 纹理（纯 CSS，非 WebGL）

## 组件重构验收

- [ ] MessageCard → MessageBlock：移除 Card/CardContent/CardFooter 包裹
- [ ] MessageBlock 默认态：无背景色、无圆角、无阴影
- [ ] MessageBlock 悬浮态：左侧出现 2px 纯黑阅读指示线
- [ ] MessageBlock hover 过渡使用 cubic-bezier(0.16, 1, 0.3, 1) 400ms
- [ ] SpotlightCard 在触摸设备上自动禁用（matchMedia hover 检测）
- [ ] Avatar 使用纯黑/白文字头像（无彩色背景）
- [ ] 移除「热门」Badge，改为排版标记
- [ ] 正文行高 1.8、字间距 0.01em、字号 15px

- [ ] SearchBar：无边框+底部 1px 线样式
- [ ] SearchBar 聚焦态：底部线变 2px 黑色 + placeholder 渐隐
- [ ] SearchBar 清除按钮为文字链接「清除」
- [ ] 移除 SearchBar 的 inset 内阴影

- [ ] SortTabs：移除背景滑块+图标，改为纯文字+下划线导航
- [ ] SortTabs 下划线 translateX 平滑滑动（cubic-bezier(0.16,1,0.3,1) 300ms）

- [ ] VoteButtons：移除 ThumbsUp/ThumbsDown 图标
- [ ] VoteButtons：移除 emerald/rose 彩色 hover
- [ ] VoteButtons：选中态使用黑色系（无彩色）
- [ ] VoteButtons：点击时数字有 spring 弹跳动效

- [ ] MessageList 骨架屏：排版线框式（无 shimmer 扫光）
- [ ] MessageList 空状态：大号排版文字「暂无留言」（无图标）
- [ ] MessageList 末尾：「—— FIN ——」标记

- [ ] MessageForm 桌面端：非 sticky 独立 section
- [ ] MessageForm 标题为大号 Section 标题「发表看法」
- [ ] MessageForm 输入框使用下划线样式
- [ ] MessageForm 提交按钮为右对齐文字式（非全宽 primary）
- [ ] MessageForm 移动端：纯色 sticky bottom（非毛玻璃）

## 页面布局验收

- [ ] Header 使用纯色背景 + 1px border-b（无渐变阴影和 backdrop-blur）
- [ ] Hero 区域包含大号标题+描述+搜索+排序
- [ ] 桌面端内容最大宽度 720px 居中
- [ ] Hero 大标题有 split-char stagger 入场动画
- [ ] Section 间距使用 48px/80px 梯度

## 边界约束验收

- [ ] loading.tsx 未被修改
- [ ] Intro.tsx 未被修改
- [ ] UI 基础组件（components/ui/*）未被修改
- [ ] API 路由未被修改
- [ ] 未引入新的 npm 依赖（所有动效 CSS + IntersectionObserver 实现）
- [ ] 未使用 filter: blur() 在滚动元素上
- [ ] 未使用 backdrop-filter: blur()（极简风格不需要毛玻璃）
- [ ] 未在正文段落使用渐变/投影文字装饰

## 响应式与可访问性验收

- [ ] 移动端 ≤ 640px 无横向溢出
- [ ] 移动端触摸目标 ≥ 44×44px
- [ ] prefers-reduced-motion 降级正常（所有动画在 reduce 模式下禁用）
- [ ] 暗色模式黑白反转合理（背景深黑、文字浅白）
- [ ] SpotlightCard 仅在 matchMedia('(hover: hover)') 桌面端生效

## React Best Practices 验收

- [ ] SpotlightCard mousemove 使用 rAF 节流
- [ ] ScrollReveal 使用单个 IntersectionObserver（非每元素 new 一个）
- [ ] 所有 setState 使用函数式写法
- [ ] 无内联组件定义
- [ ] 静态 JSX 提取为组件外常量

## 工程验收

- [ ] lint 通过无报错
- [ ] dev server 正常启动并可预览
