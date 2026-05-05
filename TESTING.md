# 测试指南

## 手动测试清单

### 基础功能

- [ ] 首页加载正常
- [ ] 留言列表显示正确
- [ ] 无限滚动加载更多
- [ ] 搜索功能正常
- [ ] 排序切换正常

### 留言功能

- [ ] 输入昵称和内容
- [ ] 表单验证正常
- [ ] 提交成功提示
- [ ] 新留言显示在列表

### 投票功能

- [ ] 点赞按钮工作
- [ ] 踩按钮工作
- [ ] 重复点击取消投票
- [ ] 切换投票类型

### 响应式设计

- [ ] 桌面端显示正常
- [ ] 平板端显示正常
- [ ] 移动端显示正常
- [ ] 触摸目标足够大

### 错误处理

- [ ] 网络错误提示
- [ ] 表单验证错误
- [ ] 404 页面
- [ ] 500 错误页面

## 自动化测试

```bash
# 运行单元测试
npm test

# 运行 E2E 测试
npm run test:e2e

# 运行覆盖率报告
npm run test:coverage
```

## 性能测试

- 首屏加载时间 < 2s
- 交互响应时间 < 100ms
- 滚动流畅度 60fps

## 测试环境配置

### 数据库测试

使用独立的测试数据库，避免影响开发数据：

```env
# .env.test
DATABASE_URL="postgresql://postgres:password@localhost:5432/zju_feedback_test"
```

### 测试数据准备

```bash
# 重置测试数据库
npx prisma migrate reset --force

# 填充测试数据
npx prisma db seed
```

## 单元测试示例

### 表单验证测试

```typescript
import { validateMessage } from '@/lib/validations'

describe('Message Validation', () => {
  it('should accept valid message', () => {
    const result = validateMessage({
      nickname: '测试用户',
      content: '这是一条测试留言'
    })
    expect(result.success).toBe(true)
  })

  it('should reject empty nickname', () => {
    const result = validateMessage({
      nickname: '',
      content: '这是一条测试留言'
    })
    expect(result.success).toBe(false)
  })

  it('should reject content over 500 chars', () => {
    const result = validateMessage({
      nickname: '测试用户',
      content: 'a'.repeat(501)
    })
    expect(result.success).toBe(false)
  })
})
```

### API 路由测试

```typescript
import { createMocks } from 'node-mocks-http'
import { GET, POST } from '@/app/api/messages/route'

describe('/api/messages', () => {
  it('should return messages list', async () => {
    const { req } = createMocks({
      method: 'GET',
      url: '/api/messages?page=1&limit=10'
    })
    const response = await GET(req)
    const data = await response.json()
    
    expect(response.status).toBe(200)
    expect(data.messages).toBeDefined()
  })

  it('should create new message', async () => {
    const { req } = createMocks({
      method: 'POST',
      body: {
        nickname: '测试用户',
        content: '这是一条测试留言'
      }
    })
    const response = await POST(req)
    const data = await response.json()
    
    expect(response.status).toBe(201)
    expect(data.id).toBeDefined()
  })
})
```

## E2E 测试示例

### Playwright 测试

```typescript
import { test, expect } from '@playwright/test'

test.describe('Message Board', () => {
  test('should display messages', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('[data-testid="message-list"]')).toBeVisible()
  })

  test('should create new message', async ({ page }) => {
    await page.goto('/')
    
    await page.fill('[data-testid="nickname-input"]', '测试用户')
    await page.fill('[data-testid="content-input"]', '这是一条测试留言')
    await page.click('[data-testid="submit-button"]')
    
    await expect(page.locator('text=这是一条测试留言')).toBeVisible()
  })

  test('should vote on message', async ({ page }) => {
    await page.goto('/')
    
    const firstMessage = page.locator('[data-testid="message-card"]').first()
    await firstMessage.locator('[data-testid="like-button"]').click()
    
    await expect(firstMessage.locator('[data-testid="like-count"]')).toHaveText('1')
  })
})
```

## 测试覆盖率目标

| 模块 | 目标覆盖率 |
|------|-----------|
| 工具函数 | 90%+ |
| API 路由 | 80%+ |
| 组件 | 70%+ |
| 整体 | 75%+ |

## 持续集成

在 CI 环境中运行测试：

```yaml
# .github/workflows/test.yml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm test
        
      - name: Run E2E tests
        run: npm run test:e2e
```

## 调试测试

### 查看测试日志

```bash
# 详细输出
npm test -- --verbose

# 只运行特定测试
npm test -- --testNamePattern="Message Validation"

# 调试模式
npm test -- --inspect-brk
```

### 查看 E2E 测试

```bash
# 有头模式运行
npx playwright test --headed

# 查看测试报告
npx playwright show-report
```
