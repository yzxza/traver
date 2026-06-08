const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};

const defaultGeminiEndpoint = "https://ai-gateway.fosunpharma.com/google/global/gemini-3.1-pro-preview";
const defaultOpenAIModel = "gpt-4.1-mini";

function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json; charset=utf-8"
    },
    body: JSON.stringify(body)
  };
}

function safeParseJson(text) {
  const cleaned = String(text || "")
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch (error) {
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (!match) throw error;
    return JSON.parse(match[0]);
  }
}

function extractOpenAIText(data) {
  if (typeof data.output_text === "string") return data.output_text;

  const chunks = [];
  for (const item of data.output || []) {
    for (const content of item.content || []) {
      if (typeof content.text === "string") chunks.push(content.text);
    }
  }
  return chunks.join("\n").trim();
}

function extractGeminiText(data) {
  const chunks = [];
  for (const candidate of data.candidates || []) {
    for (const part of candidate.content?.parts || []) {
      if (typeof part.text === "string") chunks.push(part.text);
    }
  }
  return chunks.join("\n").trim();
}

function buildPrompt(payload) {
  const modelInput = {
    userInput: payload.input || {},
    variant: payload.variant || "value",
    localDraftForReference: payload.draftPlan || {}
  };

  return [
    "你是一个严谨的 AI 旅行规划产品后端。",
    "请根据用户输入生成可执行、结构化的旅行方案。",
    "重点考虑：便宜且合理的出返程日期、住宿安全便利、景点预约提前量、官方链接字段、城市间门到门交通、每日强度。",
    "如果没有实时机票和预约工具，不要声称查询到了实时价格；只能输出估算价格，并在 note/url 中说明需要二次确认。",
    "输出必须是中文 JSON。不要输出 Markdown，不要包裹代码块。",
    "JSON 顶层必须包含 summary、flights、itinerary、hotelAreas、bookings、transport。",
    "字段要求：",
    "- summary: bestDates, flightPerPerson, route, budget, estimatedTotal, confidence, note",
    "- flights[]: label, dates, price, reason, tag",
    "- itinerary[]: day, dateLabel, city, title, morning, afternoon, evening, hotelArea, booking, risk, cost",
    "- hotelAreas[]: area, score, reason, access",
    "- bookings[]: name, level(hot/info/safe), lead, url, note",
    "- transport[]: mode, route, time, price, verdict",
    "",
    "用户输入和本地草稿如下：",
    JSON.stringify(modelInput, null, 2)
  ].join("\n");
}

async function callGeminiGateway(payload) {
  const apiKey = process.env.GEMINI_API_KEY || process.env.AI_GATEWAY_API_KEY;
  const endpoint = process.env.GEMINI_ENDPOINT || process.env.AI_GATEWAY_ENDPOINT || defaultGeminiEndpoint;

  if (!apiKey) {
    return {
      statusCode: 501,
      body: {
        error: "GEMINI_API_KEY is not configured",
        fallback: true
      }
    };
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [{ text: buildPrompt(payload) }]
        }
      ],
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 8192,
        topP: 0.95,
        responseMimeType: "application/json",
        thinkingConfig: {
          thinkingLevel: "HIGH"
        }
      },
      safetySettings: [
        { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "OFF" },
        { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "OFF" },
        { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "OFF" },
        { category: "HARM_CATEGORY_HARASSMENT", threshold: "OFF" }
      ],
      tools: [{ googleSearch: {} }]
    })
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    return {
      statusCode: response.status,
      body: {
        error: data.error?.message || "Gemini gateway request failed",
        fallback: true
      }
    };
  }

  const text = extractGeminiText(data);
  return {
    statusCode: 200,
    body: {
      plan: safeParseJson(text),
      source: "gemini_gateway",
      model: process.env.GEMINI_MODEL || "gemini-3.1-pro-preview"
    }
  };
}

async function callOpenAI(payload) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 501,
      body: {
        error: "OPENAI_API_KEY is not configured",
        fallback: true
      }
    };
  }

  const model = process.env.OPENAI_MODEL || defaultOpenAIModel;
  const baseUrl = (process.env.OPENAI_BASE_URL || "https://api.openai.com/v1").replace(/\/$/, "");

  const response = await fetch(`${baseUrl}/responses`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model,
      instructions: "你是一个严谨的 AI 旅行规划产品后端。输出必须是中文 JSON，不要输出 Markdown。",
      input: buildPrompt(payload),
      max_output_tokens: 5000
    })
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    return {
      statusCode: response.status,
      body: {
        error: data.error?.message || "OpenAI API request failed",
        fallback: true
      }
    };
  }

  return {
    statusCode: 200,
    body: {
      plan: safeParseJson(extractOpenAIText(data)),
      source: "openai",
      model
    }
  };
}

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers: corsHeaders, body: "" };
  if (event.httpMethod !== "POST") return json(405, { error: "Method not allowed" });

  let payload;
  try {
    payload = JSON.parse(event.body || "{}");
  } catch {
    return json(400, { error: "Invalid JSON body" });
  }

  try {
    const provider = (process.env.AI_PROVIDER || "gemini").toLowerCase();
    const result = provider === "openai"
      ? await callOpenAI(payload)
      : await callGeminiGateway(payload);

    return json(result.statusCode, result.body);
  } catch (error) {
    return json(500, {
      error: error.message || "Unknown model API error",
      fallback: true
    });
  }
};
