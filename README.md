# TripWise AI 旅行规划器

这是一个可直接部署的旅行规划 MVP。当前版本是纯前端单页应用，不需要安装依赖，也不需要大模型 API Key 就能运行。

## 当前能力

- 自然语言旅行需求输入
- 出发地、目的地、日期、天数、预算、人数、节奏等结构化字段
- 模拟 Flight Price Skill，输出推荐日期和价格窗口
- 模拟住宿区域推荐，包含安全便利和机场/车站衔接说明
- 模拟景点预约 Skill，包含提前多久预约和官网链接字段
- 城市间交通比较，突出门到门耗时
- 每日行程生成
- 性价比、省钱、舒适、亲子四种方案切换
- JSON 导出

## 当前边界

当前版本还没有接入真实大模型。它使用“规则解析 + 目的地预设 + 通用目的地生成”来模拟问答效果：

- 日本、意大利会使用较完整的示例预设。
- 新疆、云南、泰国、法国等其他目的地会进入通用动态方案。
- 任意目的地都不会继续套用上一次的国家。
- 真实价格、预约网址和开放时间需要后续接入后端 Skill。

## 接入大模型

项目已内置 Netlify Function：

```text
/.netlify/functions/plan
```

部署到 Netlify 后，在项目环境变量里配置 Gemini 网关：

```text
AI_PROVIDER=gemini
GEMINI_ENDPOINT=https://ai-gateway.fosunpharma.com/google/global/gemini-3.1-pro-preview
GEMINI_API_KEY=你的网关 Bearer Token
GEMINI_MODEL=gemini-3.1-pro-preview
```

前端会优先请求这个函数；如果没有配置 Key 或请求失败，会自动回退到本地模拟方案。

注意：不要把 API Key 写进 `app.js` 或网页里。

## 本地打开

直接双击打开：

```text
travel-planner-app/index.html
```

或用任意静态服务托管 `travel-planner-app` 目录。

## GitHub Pages 部署

1. 新建一个 GitHub 仓库。
2. 上传 `travel-planner-app` 目录内的全部文件。
3. 在仓库 Settings -> Pages 中选择部署分支。
4. 如果放在仓库根目录，入口就是 `index.html`。

## 后续接入真实 API

当前真实接口建议分为四类：

- `/api/plan`：大模型规划接口，用于解析自然语言和生成解释。
- `/api/flights/search`：机票价格 Skill，查询日期窗口和往返价格。
- `/api/booking-rules`：景点预约 Skill，查询官网、预约时间和售罄风险。
- `/api/intercity`：城市间交通 Skill，查询高铁/飞机/巴士价格和门到门时间。

前端目前的模拟逻辑集中在 `app.js`：

- `runFlightSkill`
- `buildItinerary`
- `destinationPresets`
- `buildPlan`

后续只需要把这些函数替换为真实 API 调用即可。
