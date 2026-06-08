const samplePrompt = "国庆后从上海出发去意大利 10 天，2 个成人，预算 3.5 万。想去罗马、佛罗伦萨和威尼斯，喜欢博物馆和美食，不想每天换酒店，希望知道哪天飞更便宜、城市间坐火车还是飞机、哪些景点要提前预约。";
const defaultDestinationValue = "日本 东京 京都 大阪";

const destinationPresets = {
  japan: {
    country: "日本",
    cities: ["东京", "京都", "大阪"],
    airport: "成田/羽田",
    currencyHint: "日元价格按实时汇率换算前需二次确认",
    hotelAreas: [
      { area: "东京 上野/浅草", score: 8.6, reason: "机场衔接好，价格相对友好，夜间便利度高，适合第一次去东京。", access: "到成田约 45-60 分钟" },
      { area: "京都站/四条河原町", score: 8.4, reason: "适合少换酒店，去岚山、伏见稻荷和大阪都方便。", access: "到京都站 5-15 分钟" },
      { area: "大阪 难波/心斋桥", score: 8.1, reason: "餐饮密度高，适合返程前购物和夜间活动。", access: "到关西机场约 45-55 分钟" }
    ],
    bookings: [
      { name: "三鹰之森吉卜力美术馆", level: "hot", lead: "提前 30 天关注放票", url: "https://www.ghibli-museum.jp/", note: "强预约，热门日期售罄快。" },
      { name: "东京国立博物馆", level: "info", lead: "提前 3-7 天", url: "https://www.tnm.jp/", note: "旺季建议预订，雨天替代价值高。" },
      { name: "清水寺/伏见稻荷大社", level: "safe", lead: "通常无需预约", url: "https://www.kiyomizudera.or.jp/", note: "建议早晨或傍晚去，避开团队客流。" }
    ],
    transport: [
      { mode: "新干线", route: "东京 → 京都", time: "约 2 小时 15 分钟，门到门约 3 小时", price: "约 ¥720-900/人", verdict: "推荐，市中心衔接最好。" },
      { mode: "飞机", route: "东京 → 大阪", time: "飞行短但机场转场长，门到门约 4.5 小时", price: "约 ¥500-900/人", verdict: "除非价格明显低，否则不优先。" },
      { mode: "夜巴", route: "东京 → 京都/大阪", time: "约 7-9 小时", price: "约 ¥220-420/人", verdict: "省钱但影响第二天体力。" }
    ],
    days: [
      ["抵达东京，住上野/浅草", "浦东出发，优先选择上午直飞。", "机场到上野办理入住，轻量休整。", "浅草寺夜景和隅田川散步。"],
      ["东京博物馆与城市漫步", "上野公园和东京国立博物馆。", "秋叶原或银座二选一。", "上野/浅草周边晚餐。"],
      ["东京主题日", "明治神宫或代代木公园。", "涩谷、表参道区域。", "视体力增加夜景点。"],
      ["东京前往京都", "东京站乘新干线到京都。", "入住京都站或四条河原町。", "锦市场、鸭川、祇园轻量散步。"],
      ["京都经典路线", "伏见稻荷大社早晨前往。", "清水寺、二年坂三年坂。", "四条河原町晚餐。"],
      ["京都到大阪", "岚山或金阁寺二选一。", "前往大阪难波入住。", "道顿堀和心斋桥。"],
      ["大阪返程", "大阪城或黑门市场。", "关西机场返程，预留 3 小时。", "回程不安排强门票项目。"]
    ]
  },
  italy: {
    country: "意大利",
    cities: ["罗马", "佛罗伦萨", "威尼斯"],
    airport: "罗马/米兰/威尼斯",
    currencyHint: "欧铁和博物馆价格旺季波动明显",
    hotelAreas: [
      { area: "罗马 Termini/蒙蒂", score: 8.0, reason: "交通便利，去主要景点和火车站都方便，夜间需选择主街酒店。", access: "到 Termini 5-12 分钟" },
      { area: "佛罗伦萨 SMN/老城边缘", score: 8.7, reason: "步行覆盖核心景点，火车转场轻松，适合博物馆路线。", access: "到 SMN 火车站 5-15 分钟" },
      { area: "威尼斯 圣露西亚/圣保罗", score: 8.2, reason: "行李友好度更好，少走桥，适合第一次去威尼斯。", access: "到火车站 5-20 分钟" }
    ],
    bookings: [
      { name: "梵蒂冈博物馆", level: "hot", lead: "提前 20-30 天", url: "https://www.museivaticani.va/", note: "强预约，建议选早场。" },
      { name: "乌菲兹美术馆", level: "hot", lead: "提前 14-21 天", url: "https://www.uffizi.it/", note: "热门时段售罄快。" },
      { name: "斗兽场", level: "info", lead: "提前 7-14 天", url: "https://colosseo.it/", note: "实名制和时段票需核对。" }
    ],
    transport: [
      { mode: "高速火车", route: "罗马 → 佛罗伦萨", time: "约 1.5 小时，门到门约 2.5 小时", price: "约 ¥180-420/人", verdict: "强推荐，市中心到市中心。" },
      { mode: "高速火车", route: "佛罗伦萨 → 威尼斯", time: "约 2 小时，门到门约 3 小时", price: "约 ¥220-520/人", verdict: "推荐，提前买票更划算。" },
      { mode: "飞机", route: "罗马 → 威尼斯", time: "飞行约 1 小时，门到门约 4.5 小时", price: "约 ¥350-900/人", verdict: "除非跨很远城市，否则不优先。" }
    ],
    days: [
      ["抵达罗马，住 Termini/蒙蒂", "选择白天抵达航班，预留入境时间。", "入住后轻量休整。", "特莱维喷泉和西班牙台阶散步。"],
      ["古罗马路线", "斗兽场和古罗马广场。", "万神殿、纳沃纳广场。", "蒙蒂区晚餐。"],
      ["梵蒂冈预约日", "梵蒂冈博物馆早场。", "圣彼得大教堂及周边。", "台伯河散步。"],
      ["罗马到佛罗伦萨", "高速火车前往佛罗伦萨。", "入住 SMN 或老城边缘。", "圣母百花大教堂外观和老桥。"],
      ["佛罗伦萨艺术日", "乌菲兹美术馆。", "学院美术馆或皮蒂宫。", "米开朗琪罗广场看日落。"],
      ["托斯卡纳轻量日", "锡耶纳或比萨二选一。", "返回佛罗伦萨休整。", "老城晚餐。"],
      ["前往威尼斯", "高速火车到威尼斯圣露西亚。", "入住行李友好区域。", "大运河和里亚托桥。"],
      ["威尼斯主岛", "圣马可广场和总督宫。", "水上巴士游大运河。", "避开主街找晚餐。"],
      ["离岛或自由日", "穆拉诺/布拉诺二选一。", "回主岛购物或休息。", "整理行李。"],
      ["返程", "预留水上交通到机场时间。", "返程航班。", "不安排强预约项目。"]
    ]
  },
  default: {
    country: "目的地",
    cities: ["核心城市 A", "核心城市 B", "返程城市"],
    airport: "主要机场",
    currencyHint: "价格为估算，需要真实 Skill 二次确认",
    hotelAreas: [
      { area: "中心火车站周边", score: 8.2, reason: "适合多城市移动，减少拖行李和换乘成本。", access: "到车站 5-15 分钟" },
      { area: "老城边缘", score: 8.0, reason: "兼顾安全、餐饮和步行游览，夜间便利度较高。", access: "到核心景点 10-25 分钟" },
      { area: "机场快线沿线", score: 7.8, reason: "适合早班机或晚到用户，避免返程焦虑。", access: "到机场约 35-60 分钟" }
    ],
    bookings: [
      { name: "热门博物馆/美术馆", level: "hot", lead: "提前 14-30 天", url: "https://example.com/official-booking", note: "需替换为官方预约链接。" },
      { name: "地标观景台", level: "info", lead: "提前 3-7 天", url: "https://example.com/tickets", note: "日落时段更容易售罄。" },
      { name: "开放街区/公园", level: "safe", lead: "通常无需预约", url: "https://example.com/info", note: "关注天气和开放时间。" }
    ],
    transport: [
      { mode: "高铁/火车", route: "城市 A → 城市 B", time: "门到门约 3 小时", price: "约 ¥200-600/人", verdict: "多城市旅行优先比较。" },
      { mode: "飞机", route: "城市 A → 城市 C", time: "门到门约 4-5 小时", price: "约 ¥400-1000/人", verdict: "距离很远时再考虑。" },
      { mode: "巴士/自驾", route: "短途支线", time: "约 2-4 小时", price: "约 ¥80-300/人", verdict: "适合预算优先或小众地点。" }
    ],
    days: [
      ["抵达与休整", "选择白天抵达。", "入住交通便利区域。", "轻量散步和早休息。"],
      ["核心景点日", "安排最重要景点。", "同区域串联。", "晚上安排低强度项目。"],
      ["城市移动日", "上午城际交通。", "下午入住和周边熟悉。", "晚上附近用餐。"],
      ["深度体验日", "博物馆或主题路线。", "留出咖啡/休息窗口。", "可替换为雨天方案。"],
      ["返程准备", "轻量购物或市场。", "前往机场/车站。", "不安排强预约。"]
    ]
  }
};

let currentPlan = null;
let currentVariant = "value";
let autoFilledDestinationValue = defaultDestinationValue;

const elements = {
  form: document.getElementById("plannerForm"),
  sampleBtn: document.getElementById("sampleBtn"),
  exportBtn: document.getElementById("exportBtn"),
  prompt: document.getElementById("promptInput"),
  origin: document.getElementById("originInput"),
  destination: document.getElementById("destinationInput"),
  dateWindow: document.getElementById("dateWindowInput"),
  days: document.getElementById("daysInput"),
  budget: document.getElementById("budgetInput"),
  travelers: document.getElementById("travelersInput"),
  pace: document.getElementById("paceInput"),
  priority: document.getElementById("priorityInput"),
  avoidRedEye: document.getElementById("avoidRedEyeInput"),
  minHotel: document.getElementById("minHotelInput"),
  runLog: document.getElementById("runLog"),
  summaryGrid: document.getElementById("summaryGrid"),
  itineraryList: document.getElementById("itineraryList"),
  flightOptions: document.getElementById("flightOptions"),
  hotelAreas: document.getElementById("hotelAreas"),
  bookingTasks: document.getElementById("bookingTasks"),
  transportOptions: document.getElementById("transportOptions")
};

function detectPresetKey(text = "") {
  if (/日本|东京|京都|大阪/.test(text)) return "japan";
  if (/意大利|罗马|佛罗伦萨|威尼斯|米兰/.test(text)) return "italy";
  return "default";
}

function detectPreset(text) {
  return destinationPresets[detectPresetKey(text)] || destinationPresets.default;
}

function knownDestinationLabel(presetKey) {
  const preset = destinationPresets[presetKey];
  if (!preset || presetKey === "default") return "";
  return `${preset.country} ${preset.cities.join(" ")}`;
}

function extractDestinationText(prompt = "", origin = "") {
  const knownPlaces = [
    "新疆", "乌鲁木齐", "伊犁", "喀纳斯", "赛里木湖", "云南", "昆明", "大理", "丽江", "香格里拉",
    "四川", "成都", "九寨沟", "重庆", "北京", "上海", "西安", "广州", "深圳", "香港", "澳门",
    "泰国", "曼谷", "清迈", "普吉", "新加坡", "韩国", "首尔", "釜山", "法国", "巴黎", "尼斯",
    "瑞士", "苏黎世", "卢塞恩", "英国", "伦敦", "西班牙", "巴塞罗那", "马德里",
    "美国", "纽约", "洛杉矶", "旧金山"
  ];
  const departurePlaces = [];
  const departureMatch = prompt.match(/从([^，。,.；;]*?)(?:出发|去|到|飞|坐|前往)/);
  if (departureMatch) {
    departurePlaces.push(...knownPlaces.filter((place) => departureMatch[1].includes(place)));
  }

  const found = knownPlaces.filter((place) => {
    if (!prompt.includes(place)) return false;
    if (origin && place === origin) return false;
    if (departurePlaces.includes(place)) return false;
    return true;
  });
  if (found.length) return [...new Set(found)].join(" ");

  const match = prompt.match(/(?:去|到|游|玩)([^，。,.；;]+)/);
  if (!match) return "";

  return match[1]
    .replace(/\d+\s*(天|日|周|个月)?/g, "")
    .replace(/预算.*$/g, "")
    .replace(/左右|大概|想|希望|从.*出发/g, "")
    .trim();
}

function splitDestinationCities(destinationText = "") {
  const cleaned = destinationText
    .replace(/[，。,.；;、/]+/g, " ")
    .replace(/和|及|与|还有|以及/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const parts = cleaned.split(" ").filter(Boolean);
  if (parts.length >= 2) return [...new Set(parts)].slice(0, 4);
  if (parts.length === 1) return [parts[0], `${parts[0]}核心区`, `${parts[0]}周边`];
  return destinationPresets.default.cities;
}

function buildDynamicPreset(destinationText, prompt) {
  const cities = splitDestinationCities(destinationText);
  const country = cities[0] || "目的地";
  return {
    country,
    cities,
    airport: `${country}主要机场/高铁站`,
    currencyHint: "当前为通用估算结果，接入真实 Skill 后会替换为实时价格和官方预约规则。",
    hotelAreas: cities.slice(0, 3).map((city, index) => ({
      area: `${city} 中心交通区`,
      score: [8.3, 8.1, 7.9][index] || 7.8,
      reason: "优先选择靠近轨道交通、主街、火车站或机场快线的位置，兼顾安全、行李移动和夜间便利。",
      access: "到核心景点约 15-30 分钟，到主要交通枢纽约 20-60 分钟"
    })),
    bookings: [
      { name: `${country}热门博物馆/美术馆`, level: "hot", lead: "提前 14-30 天", url: "待接入官方预约检索", note: "当前为通用提醒，真实版本会返回官方链接和放票规则。" },
      { name: `${country}地标观景/演出项目`, level: "info", lead: "提前 3-14 天", url: "待接入官方预约检索", note: "日落、周末和节假日时段更容易售罄。" },
      { name: `${country}开放街区/自然景点`, level: "safe", lead: "通常无需预约", url: "待接入开放时间检索", note: "需要结合天气、交通管制和季节性开放情况确认。" }
    ],
    transport: [
      { mode: "高铁/火车", route: `${cities[0]} → ${cities[1] || "下一站"}`, time: "门到门约 2.5-4 小时", price: "约 ¥150-600/人", verdict: "多城市旅行优先比较，行李和市中心衔接更友好。" },
      { mode: "飞机", route: `${cities[0]} → ${cities[2] || cities[1] || "远途城市"}`, time: "门到门约 4-6 小时", price: "约 ¥400-1200/人", verdict: "距离较远或跨区域时再优先。" },
      { mode: "包车/巴士", route: "短途支线", time: "约 2-5 小时", price: "约 ¥80-500/人", verdict: "适合自然景区、亲子或行李较多的情况。" }
    ],
    days: [
      [`抵达${cities[0]}，入住交通便利区域`, "选择白天抵达，减少第一天强度。", "入住后熟悉周边交通和餐饮。", "轻量散步，早点休息。"],
      [`${cities[0]}核心景点日`, "安排最重要的预约型景点。", "同区域串联，减少折返。", "夜间选择酒店附近项目。"],
      [`前往${cities[1] || cities[0]}，控制移动强度`, "上午进行城市间交通。", "下午入住并安排低强度街区。", "晚上以餐饮和休息为主。"],
      [`${cities[1] || cities[0]}深度体验`, "主题景点或博物馆。", "保留休息窗口。", "可根据天气切换室内项目。"],
      [`${cities[2] || "周边"}弹性日`, "自然景区、古城或购物二选一。", "根据体力做加减法。", "整理预约和返程事项。"],
      ["返程准备", "轻量安排市场或周边散步。", "预留充足机场/高铁站交通时间。", "不安排强预约项目。"]
    ]
  };
}

function resolveDestination(prompt, rawDestination, origin = "") {
  const promptKey = detectPresetKey(prompt);
  const promptDestinationText = extractDestinationText(prompt, origin);

  if (promptKey !== "default") {
    const destinationValue = knownDestinationLabel(promptKey);
    elements.destination.value = destinationValue;
    autoFilledDestinationValue = destinationValue;
    return {
      destinationValue,
      preset: destinationPresets[promptKey]
    };
  }

  if (promptDestinationText) {
    elements.destination.value = promptDestinationText;
    autoFilledDestinationValue = promptDestinationText;
    return {
      destinationValue: promptDestinationText,
      preset: buildDynamicPreset(promptDestinationText, prompt)
    };
  }

  const usableField = rawDestination && rawDestination !== autoFilledDestinationValue ? rawDestination : "";
  const fieldKey = detectPresetKey(usableField);
  if (fieldKey !== "default") {
    return {
      destinationValue: usableField,
      preset: destinationPresets[fieldKey]
    };
  }

  if (usableField) {
    return {
      destinationValue: usableField,
      preset: buildDynamicPreset(usableField, prompt)
    };
  }

  elements.destination.value = "";
  return {
    destinationValue: "",
    preset: buildDynamicPreset("未指定目的地", prompt)
  };
}

function extractNumber(text, fallback) {
  const match = text.match(/(\d+(?:\.\d+)?)\s*(万|千|k|K)?/);
  if (!match) return fallback;
  const number = Number(match[1]);
  const unit = match[2];
  if (unit === "万") return Math.round(number * 10000);
  if (unit === "千" || unit === "k" || unit === "K") return Math.round(number * 1000);
  return number;
}

function readInput() {
  const prompt = elements.prompt.value.trim();
  const rawDestination = elements.destination.value.trim();
  const origin = elements.origin.value.trim() || "上海";
  const resolvedDestination = resolveDestination(prompt, rawDestination, origin);
  const destinationValue = resolvedDestination.destinationValue;
  const preset = resolvedDestination.preset;
  const days = Math.max(2, Math.min(30, Number(elements.days.value) || extractNumber(prompt, 7)));
  const budget = Number(elements.budget.value) || 12000;

  return {
    prompt,
    origin,
    destination: destinationValue || preset.country,
    dateWindow: elements.dateWindow.value.trim() || "未来 30 天",
    days,
    budget,
    travelers: elements.travelers.value.trim() || "2 成人",
    pace: elements.pace.value,
    priority: elements.priority.value,
    avoidRedEye: elements.avoidRedEye.checked,
    minHotelChanges: elements.minHotel.checked,
    preset
  };
}

function runFlightSkill(input, variant) {
  const base = input.budget > 25000 ? 5200 : input.preset.country === "日本" ? 2180 : 4850;
  const modifier = {
    cheap: -0.13,
    value: 0,
    comfort: 0.16,
    family: 0.08
  }[variant] || 0;

  const price = Math.round(base * (1 + modifier) / 10) * 10;
  const cheapPrice = Math.round(base * 0.88 / 10) * 10;
  const comfortPrice = Math.round(base * 1.18 / 10) * 10;

  return [
    {
      label: "推荐组合",
      dates: "窗口内第 6 天出发，第 12 天返回",
      price,
      reason: input.avoidRedEye ? "避开红眼，抵达后仍能轻量活动。" : "价格和总耗时平衡最好。",
      tag: "性价比"
    },
    {
      label: "最低价组合",
      dates: "窗口内第 5 天出发，第 12 天返回",
      price: cheapPrice,
      reason: "价格更低，但可能需要多请假或接受早晚班。",
      tag: "省钱"
    },
    {
      label: "舒适组合",
      dates: "窗口内第 7 天出发，第 13 天返回",
      price: comfortPrice,
      reason: "起降时间更友好，适合家庭或不想太赶的用户。",
      tag: "舒适"
    }
  ];
}

function buildItinerary(input, variant) {
  const presetDays = input.preset.days;
  const cityNames = input.preset.cities;
  const days = Array.from({ length: input.days }, (_, index) => {
    const source = presetDays[index] || presetDays[presetDays.length - 1];
    const city = cityNames[Math.min(Math.floor(index / Math.max(1, Math.ceil(input.days / cityNames.length))), cityNames.length - 1)];
    const intensity = variant === "family" || input.pace === "relaxed" ? "低强度" : variant === "comfort" ? "中低强度" : "中等强度";
    return {
      day: index + 1,
      dateLabel: `第 ${index + 1} 天`,
      city,
      title: source[0],
      morning: source[1],
      afternoon: source[2],
      evening: source[3],
      hotelArea: input.preset.hotelAreas[Math.min(Math.floor(index / 3), input.preset.hotelAreas.length - 1)].area,
      booking: index === 1 ? "检查热门景点预约" : index === input.days - 1 ? "预留返程交通时间" : "按当天体力微调",
      risk: index === 0 ? "抵达日不安排强门票" : intensity,
      cost: estimateDailyCost(input, variant, index)
    };
  });
  return days;
}

function estimateDailyCost(input, variant, index) {
  const base = Math.max(260, Math.round(input.budget / input.days / 2.8));
  const multiplier = variant === "cheap" ? 0.82 : variant === "comfort" ? 1.24 : variant === "family" ? 1.08 : 1;
  const firstLast = index === 0 || index === input.days - 1 ? 0.8 : 1;
  return Math.round(base * multiplier * firstLast);
}

function buildPlan(input, variant) {
  const flights = runFlightSkill(input, variant);
  const itinerary = buildItinerary(input, variant);
  const perPersonFlight = flights[0].price;
  const travelerCount = /(\d+)/.test(input.travelers) ? Number(input.travelers.match(/(\d+)/)[1]) : 2;
  const flightTotal = perPersonFlight * travelerCount;
  const localTotal = itinerary.reduce((sum, day) => sum + day.cost, 0) * travelerCount;
  const hotelTotal = Math.round(input.days * (variant === "cheap" ? 520 : variant === "comfort" ? 980 : 720));
  const total = flightTotal + localTotal + hotelTotal;

  return {
    input,
    variant,
    generatedAt: new Date().toISOString(),
    summary: {
      bestDates: flights[0].dates,
      flightPerPerson: perPersonFlight,
      route: input.preset.cities.join(" → "),
      budget: input.budget,
      estimatedTotal: total,
      confidence: total <= input.budget ? "预算内" : "略超预算",
      note: input.preset.currencyHint
    },
    flights,
    itinerary,
    hotelAreas: input.preset.hotelAreas,
    bookings: input.preset.bookings,
    transport: input.preset.transport
  };
}

function formatMoney(value) {
  return `¥${Number(value).toLocaleString("zh-CN")}`;
}

function renderRunLog(plan) {
  const logs = [
    ["1", "解析旅行意图", `${plan.input.origin} 出发，目的地识别为 ${plan.input.preset.country}，天数 ${plan.input.days} 天。`],
    ["2", "调用航班价格 Skill", `生成 ${plan.flights.length} 个出返程价格窗口，当前推荐 ${formatMoney(plan.summary.flightPerPerson)}/人。`],
    ["3", "计算城市顺序", `推荐路线：${plan.summary.route}。`],
    ["4", "生成预约和交通清单", `找到 ${plan.bookings.length} 个预约事项，${plan.transport.length} 个城际交通方案。`],
    ["5", plan.modelSource === "openai" ? "大模型增强" : "本地模拟模式", plan.modelSource === "openai" ? `已通过 ${plan.modelName || "大模型"} 生成结构化方案。` : "未配置或未连通大模型 API，使用本地模拟 Skill。"]
  ];

  elements.runLog.innerHTML = logs.map(([icon, title, text]) => `
    <div class="log-item">
      <div class="log-icon">${icon}</div>
      <div><b>${title}</b><span>${text}</span></div>
    </div>
  `).join("");
}

function renderSummary(plan) {
  const cards = [
    ["推荐出返程", plan.summary.bestDates, "价格、红眼风险和抵达后体力综合最优。"],
    ["往返机票", `${formatMoney(plan.summary.flightPerPerson)}/人`, "来自模拟 Flight Price Skill。"],
    ["城市顺序", plan.summary.route, "减少折返，优先城市中心交通。"],
    ["预算判断", `${formatMoney(plan.summary.estimatedTotal)} · ${plan.summary.confidence}`, `用户预算 ${formatMoney(plan.summary.budget)}。`]
  ];

  elements.summaryGrid.innerHTML = cards.map(([label, value, note]) => `
    <article class="summary-card">
      <span>${label}</span>
      <b>${value}</b>
      <p>${note}</p>
    </article>
  `).join("");
}

function renderItinerary(plan) {
  elements.itineraryList.innerHTML = plan.itinerary.map((day) => `
    <article class="day-card">
      <div class="day-index">
        <b>D${day.day}</b>
        <span>${day.dateLabel}</span>
        <span>${day.city}</span>
      </div>
      <div class="day-main">
        <h4>${day.title}</h4>
        <div class="time-list">
          <div class="time-item"><b>上午</b><span>${day.morning}</span></div>
          <div class="time-item"><b>下午</b><span>${day.afternoon}</span></div>
          <div class="time-item"><b>晚上</b><span>${day.evening}</span></div>
        </div>
        <div class="day-meta">
          <span class="pill">住：${day.hotelArea}</span>
          <span class="pill">预算：${formatMoney(day.cost)}/人</span>
          <span class="pill">${day.booking}</span>
          <span class="pill">${day.risk}</span>
        </div>
      </div>
    </article>
  `).join("");
}

function renderOptionList(target, items, render) {
  target.innerHTML = `<div class="option-list">${items.map(render).join("")}</div>`;
}

function renderInsights(plan) {
  renderOptionList(elements.flightOptions, plan.flights, (flight) => `
    <div class="option-item">
      <div class="option-head"><span>${flight.label} · ${flight.tag}</span><b class="price">${formatMoney(flight.price)}</b></div>
      <span>${flight.dates}</span>
      <p>${flight.reason}</p>
    </div>
  `);

  renderOptionList(elements.hotelAreas, plan.hotelAreas, (hotel) => `
    <div class="option-item">
      <div class="option-head"><span>${hotel.area}</span><b>${hotel.score}</b></div>
      <span>${hotel.access}</span>
      <p>${hotel.reason}</p>
    </div>
  `);

  renderOptionList(elements.bookingTasks, plan.bookings, (booking) => `
    <div class="option-item">
      <div class="option-head"><span>${booking.name}</span><b class="booking-badge ${booking.level}">${booking.lead}</b></div>
      <span>${booking.url}</span>
      <p>${booking.note}</p>
    </div>
  `);

  renderOptionList(elements.transportOptions, plan.transport, (transport) => `
    <div class="option-item">
      <div class="option-head"><span>${transport.mode} · ${transport.route}</span><b>${transport.price}</b></div>
      <span>${transport.time}</span>
      <p>${transport.verdict}</p>
    </div>
  `);
}

function renderPlan(plan) {
  currentPlan = plan;
  renderRunLog(plan);
  renderSummary(plan);
  renderItinerary(plan);
  renderInsights(plan);
}

function mergeModelPlan(localPlan, modelPlan, modelMeta) {
  return {
    ...localPlan,
    summary: modelPlan.summary || localPlan.summary,
    flights: modelPlan.flights || localPlan.flights,
    itinerary: modelPlan.itinerary || localPlan.itinerary,
    hotelAreas: modelPlan.hotelAreas || localPlan.hotelAreas,
    bookings: modelPlan.bookings || localPlan.bookings,
    transport: modelPlan.transport || localPlan.transport,
    modelSource: modelMeta.source || "openai",
    modelName: modelMeta.model || ""
  };
}

async function fetchModelPlan(input, variant, draftPlan) {
  const response = await fetch("/.netlify/functions/plan", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      input,
      variant,
      draftPlan
    })
  });

  if (!response.ok) {
    const errorPayload = await response.json().catch(() => ({}));
    throw new Error(errorPayload.error || "Model API request failed");
  }

  return response.json();
}

function setGenerating(isGenerating) {
  const submitButton = elements.form.querySelector(".primary-button");
  if (!submitButton) return;
  submitButton.disabled = isGenerating;
  submitButton.innerHTML = isGenerating
    ? '<svg viewBox="0 0 24 24"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"></path></svg> 正在生成'
    : '<svg viewBox="0 0 24 24"><path d="M22 2L11 13"></path><path d="M22 2l-7 20-4-9-9-4 20-7z"></path></svg> 生成旅行规划';
}

async function generatePlan(variant = currentVariant) {
  currentVariant = variant;
  const input = readInput();
  const localPlan = {
    ...buildPlan(input, variant),
    modelSource: "local"
  };
  renderPlan(localPlan);

  if (location.protocol === "file:") {
    return localPlan;
  }

  setGenerating(true);
  try {
    const modelResult = await fetchModelPlan(input, variant, localPlan);
    if (modelResult.plan) {
      const enhancedPlan = mergeModelPlan(localPlan, modelResult.plan, modelResult);
      renderPlan(enhancedPlan);
      return enhancedPlan;
    }
  } catch (error) {
    console.warn("Using local fallback:", error.message);
  } finally {
    setGenerating(false);
  }

  return localPlan;
}

function updateVariantTabs(variant) {
  document.querySelectorAll(".variant-tab").forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.variant === variant);
  });
}

function downloadJson() {
  if (!currentPlan) generatePlan();
  const blob = new Blob([JSON.stringify(currentPlan, null, 2)], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `tripwise-plan-${Date.now()}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

elements.form.addEventListener("submit", (event) => {
  event.preventDefault();
  generatePlan(currentVariant);
  document.getElementById("result").scrollIntoView({ behavior: "smooth", block: "start" });
});

elements.sampleBtn.addEventListener("click", () => {
  elements.prompt.value = samplePrompt;
  elements.origin.value = "上海";
  elements.destination.value = "意大利 罗马 佛罗伦萨 威尼斯";
  elements.dateWindow.value = "2026-10-10 至 2026-10-31";
  elements.days.value = "10";
  elements.budget.value = "35000";
  elements.travelers.value = "2 成人";
  elements.priority.value = "value";
});

elements.prompt.addEventListener("blur", () => {
  const prompt = elements.prompt.value.trim();
  const origin = elements.origin.value.trim() || "上海";
  resolveDestination(prompt, elements.destination.value.trim(), origin);
});

elements.exportBtn.addEventListener("click", downloadJson);

document.querySelectorAll(".variant-tab").forEach((tab) => {
  tab.addEventListener("click", async () => {
    const variant = tab.dataset.variant;
    updateVariantTabs(variant);
    await generatePlan(variant);
  });
});

document.querySelectorAll("[data-scroll-target]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".nav-item").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    document.getElementById(button.dataset.scrollTarget).scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

generatePlan("value");
