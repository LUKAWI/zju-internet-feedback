# 浙大校园网反馈留言板

浙江大学师生对校园网服务的评价、反馈和吐槽平台。

## 功能特性

- 📝 匿名留言（只需输入昵称）
- 👍👎 点赞/踩投票
- 🔍 关键词搜索
- 📊 按时间/热度排序
- ♾️ 无限滚动加载
- 📱 响应式设计（支持移动端）

## 技术栈

- **前端**: Next.js 16, React 19, shadcn/ui, Tailwind CSS v4
- **后端**: Next.js API Routes, Prisma ORM
- **数据库**: PostgreSQL 16
- **状态管理**: TanStack Query v5, Zustand v5
- **表单**: React Hook Form v7, Zod v4

## 快速开始

### 前置要求

- Node.js 18+
- Docker & Docker Compose
- npm 或 yarn

### 安装步骤

1. 克隆仓库
```bash
git clone <repository-url>
cd zju-campus-feedback
```

2. 安装依赖
```bash
npm install
```

3. 启动数据库
```bash
docker-compose up -d
```

4. 运行数据库迁移
```bash
npx prisma migrate dev
```

5. 启动开发服务器
```bash
npm run dev
```

6. 访问 http://localhost:3000

## 部署

### 本地部署（Docker）

```bash
docker-compose -f docker-compose.prod.yml up -d --build
```

### 腾讯云云开发部署

1. 安装 CloudBase CLI
```bash
npm install -g @cloudbase/cli
```

2. 登录
```bash
tcb login
```

3. 部署
```bash
tcb framework deploy
```

## 环境变量

创建 `.env.local` 文件：

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/zju_feedback"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## 项目结构

```
zju-campus-feedback/
├── app/                  # Next.js App Router
│   ├── api/              # API 路由
│   │   └── messages/     # 留言相关接口
│   ├── error.tsx         # 错误页面
│   ├── layout.tsx        # 根布局
│   ├── loading.tsx       # 加载状态
│   ├── not-found.tsx     # 404 页面
│   └── page.tsx          # 首页
├── components/           # React 组件
│   ├── MessageCard.tsx   # 留言卡片
│   ├── MessageForm.tsx   # 留言表单
│   ├── MessageList.tsx   # 留言列表
│   ├── SearchBar.tsx     # 搜索栏
│   ├── SortTabs.tsx      # 排序切换
│   ├── VoteButtons.tsx   # 投票按钮
│   └── ui/               # UI 组件库
├── lib/                  # 工具函数
│   ├── db.ts             # 数据库连接
│   ├── utils.ts          # 通用工具
│   └── validations.ts    # 表单验证
├── prisma/               # 数据库 Schema
│   └── schema.prisma     # 数据模型定义
├── public/               # 静态资源
├── docker-compose.yml    # Docker 配置
└── package.json          # 项目配置
```

## 数据库设计

### Message 表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | String | 主键，自动生成 |
| nickname | String | 用户昵称 |
| content | String | 留言内容 |
| createdAt | DateTime | 创建时间 |
| updatedAt | DateTime | 更新时间 |

### Vote 表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | String | 主键，自动生成 |
| type | String | 投票类型（like/dislike） |
| sessionId | String | 用户会话标识 |
| messageId | String | 关联留言 ID |
| createdAt | DateTime | 创建时间 |

## API 文档

### 获取留言列表

```
GET /api/messages?page=1&limit=20&sort=latest&search=关键词
```

**参数说明：**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| page | number | 1 | 页码 |
| limit | number | 20 | 每页数量 |
| sort | string | latest | 排序方式（latest/hot） |
| search | string | - | 搜索关键词 |

**响应示例：**

```json
{
  "messages": [
    {
      "id": "clx1234567890",
      "nickname": "匿名用户",
      "content": "校园网太慢了！",
      "createdAt": "2024-01-15T10:30:00Z",
      "likes": 5,
      "dislikes": 1,
      "userVote": null
    }
  ],
  "total": 100,
  "page": 1,
  "limit": 20
}
```

### 创建留言

```
POST /api/messages
Content-Type: application/json
```

**请求体：**

```json
{
  "nickname": "昵称",
  "content": "留言内容"
}
```

**验证规则：**

- `nickname`: 2-20 个字符
- `content`: 1-500 个字符

**响应示例：**

```json
{
  "id": "clx1234567890",
  "nickname": "匿名用户",
  "content": "校园网太慢了！",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

### 投票

```
POST /api/messages/[id]/vote
Content-Type: application/json
```

**请求体：**

```json
{
  "type": "like" | "dislike"
}
```

**行为说明：**

- 首次投票：创建投票记录
- 重复点击相同类型：取消投票
- 切换投票类型：更新投票记录

**响应示例：**

```json
{
  "success": true,
  "likes": 6,
  "dislikes": 1,
  "userVote": "like"
}
```

## 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/xxx`)
3. 提交更改 (`git commit -m 'feat: add xxx'`)
4. 推送到分支 (`git push origin feature/xxx`)
5. 创建 Pull Request

### 提交规范

使用 Conventional Commits 规范：

- `feat:` 新功能
- `fix:` 修复 Bug
- `docs:` 文档更新
- `style:` 代码格式调整
- `refactor:` 代码重构
- `test:` 测试相关
- `chore:` 构建/工具相关

## 许可证

MIT License
