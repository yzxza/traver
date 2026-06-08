# API 与部署方案

## 是否需要大模型 API

当前这个 MVP 本地打开时不需要。它已经可以在本地直接生成模拟旅行规划。

项目现在已经加入 Netlify Function，可在 Netlify 上通过环境变量接入 Gemini 网关或 OpenAI API。

如果要让它真正根据任意用户输入生成高质量结果，就需要大模型 API。建议不要把 API Key 写在前端页面里，因为 GitHub Pages 是公开静态托管，任何人都能看到前端代码。正确做法是：

1. 前端部署在 GitHub Pages。
2. 后端代理部署在 Vercel、Cloudflare Workers、Render 或你自己的服务器。
3. 大模型 Key、机票 Skill Key、地图 Key 都放在后端环境变量里。
4. 前端只请求你自己的后端接口。

## Netlify 环境变量

在 Netlify 项目中进入：

```text
Site configuration -> Environment variables
```

添加：

```text
AI_PROVIDER=gemini
GEMINI_ENDPOINT=https://ai-gateway.fosunpharma.com/google/global/gemini-3.1-pro-preview
GEMINI_API_KEY=你的网关 Bearer Token
GEMINI_MODEL=gemini-3.1-pro-preview
```

如果以后切换 OpenAI，再改成：

```text
AI_PROVIDER=openai
OPENAI_API_KEY=你的 OpenAI API Key
OPENAI_MODEL=gpt-4.1-mini
OPENAI_BASE_URL=https://api.openai.com/v1
```

不要把任何 Key 写入前端代码或公开仓库。

## 推荐部署架构

```text
用户浏览器
  ↓
GitHub Pages 静态前端
  ↓
你的后端 API 代理
  ↓
大模型 API / 机票价格 Skill / 地图 API / 景点官网检索
```

## 第一阶段：静态 MVP

适合目标：

- 快速给朋友、同事或投资人看产品雏形
- 验证界面、流程、结构化输出是否符合预期
- 不产生 API 成本

部署位置：

- GitHub Pages
- Netlify
- Vercel 静态站点

当前文件：

- `index.html`
- `styles.css`
- `app.js`
- `README.md`

## 第二阶段：接大模型

已新增后端接口：

```http
POST /api/plan
```

在当前 Netlify 版本中，实际路径是：

```http
POST /.netlify/functions/plan
```

请求：

```json
{
  "prompt": "8 月从上海出发去日本 7 天...",
  "constraints": {
    "origin": "上海",
    "dateWindow": "2026-08-01 至 2026-08-20",
    "days": 7,
    "budget": 12000,
    "travelers": "2 成人"
  }
}
```

返回：

```json
{
  "parsedIntent": {},
  "questions": [],
  "routeCandidates": [],
  "finalPlan": {}
}
```

前端替换点：

- `app.js` 里的 `buildPlan`
- `app.js` 里的 `buildItinerary`

## 第三阶段：接机票价格 Skill

新增后端接口：

```http
POST /api/flights/search
```

请求：

```json
{
  "origin": "上海",
  "destination": "东京",
  "departRange": ["2026-08-01", "2026-08-20"],
  "returnRange": ["2026-08-06", "2026-08-25"],
  "travelers": 2,
  "avoidRedEye": true
}
```

返回：

```json
{
  "updatedAt": "2026-06-08T08:00:00Z",
  "options": [
    {
      "departDate": "2026-08-06",
      "returnDate": "2026-08-12",
      "price": 2180,
      "airline": "示例航司",
      "duration": "3h10m",
      "risk": "非红眼，到达后可轻量活动"
    }
  ]
}
```

前端替换点：

- `app.js` 里的 `runFlightSkill`

## 第四阶段：接预约和交通数据

建议接口：

```http
POST /api/booking-rules
POST /api/intercity
POST /api/hotel-areas
```

关键要求：

- 预约网址必须优先官方来源。
- 价格必须标注更新时间。
- 城市间交通必须输出门到门耗时，而不是只输出飞行或行驶时间。
- 安全性建议只能做相对提示，避免绝对化承诺。

## 我建议你现在怎么选

先放 GitHub Pages，验证产品形态。

等你确认这个工具的体验方向后，再给我：

- 你想用的大模型 API Key 类型
- 机票价格数据源或 Skill 的调用方式
- 是否需要账号登录和保存历史计划

那时再加后端会更稳，也不会把 Key 暴露在公开网页里。
