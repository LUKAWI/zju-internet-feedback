# Checklist

## 视觉设计验收（web-design 技能标准）

- [x] 骨架屏 shimmer 光效从左到右扫过（非简单 pulse）
- [x] 卡片默认态有多层柔阴影（L1 层级）
- [x] 卡片悬浮态阴影加深 + translateY(-2px) 微上浮
- [x] 奇数卡片左侧有 2px 半透明色条装饰，偶数无（反 AI 不规则）
- [x] 搜索栏默认态有 inset 内阴影凹陷质感
- [x] 搜索栏聚焦态有边框发光 + 图标颜色从 muted 变为 foreground
- [x] 排序标签选中态有平滑滑块动画（translateX）
- [x] 排序标签选中态图标 scale(1.1) + 文字 weight 600
- [x] 投票按钮点击时有 scale(0.92) 按压缩放 + spring 回弹
- [x] 投票按钮选中态有半透明背景色块
- [x] 移动端表单悬浮栏有 backdrop-filter: blur(12px) 毛玻璃效果
- [x] 表单顶部使用渐变分隔线替代硬边框
- [x] header 底部使用渐变阴影替代硬 border-b
- [x] 空状态有 MessageSquare icon + 精致排版
- [x] "已经到底啦" 上方有居中渐变分隔线装饰
- [x] footer 上方有渐变分隔线
- [x] CardFooter 使用渐变透明分隔线替代硬边框
- [x] 所有新增颜色通过 CSS 变量引用（无硬编码 hex）
- [x] 中文正文行高 ≥ 1.75、字间距 0.01em

## 边界约束验收

- [x] 色彩方案未被修改（:root 和 .dark 中的 shadcn CSS 变量不变）
- [x] Loading page (loading.tsx) 未被修改
- [x] Intro.tsx 未被修改
- [x] UI 基础组件（components/ui/*）未被修改
- [x] 未引入新的 npm 依赖
- [x] backdrop-filter: blur() 不超过 14px
- [x] 未使用 filter: blur() 在滚动元素上
- [x] 未在正文段落使用渐变/投影文字装饰

## 响应式与可访问性验收

- [x] 移动端 ≤ 640px 无横向溢出
- [x] 移动端触摸目标 ≥ 44×44px
- [x] prefers-reduced-motion 降级正常（所有动画在 reduce 模式下禁用）
- [x] 暗色模式阴影/半透明视觉合理

## React Best Practices 验收

- [x] getAvatarColor 是简单纯函数，无需 useMemo（已审计）
- [x] VoteButtons 所有 setState 使用函数式写法（rerender-functional-setstate）
- [x] 无内联组件定义（rerender-no-inline-components）
- [x] 长列表使用无限滚动，数量可控，暂不需要 content-visibility
- [x] footer 等静态 JSX 提取为组件外常量（rendering-hoist-jsx）

## 工程验收

- [ ] lint 通过无报错（ESLint 依赖配置问题，非代码问题）
- [x] dev server 正常启动并可预览
