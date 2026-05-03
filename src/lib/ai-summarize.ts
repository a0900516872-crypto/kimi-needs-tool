// ========================================
// AI 结构化总结 — 浏览器直连 Kimi API
// ========================================

const SYSTEM_PROMPT = `你是一位资深室内设计师助理，擅长从客户访谈记录中提取关键信息并结构化整理。

请根据以下访谈转录文本，按以下六大板块输出一份「客户需求挖掘摘要」。
每个板块下按需分条，信息不足时标注「未提及」。

输出格式必须是 Markdown，使用中文，不要添加与模板无关的寒暄语句。

# 客户需求挖掘访谈记录

## 一、客户画像
- **家庭成员**：
- **居住现状**：
- **换房/装修动机**：

## 二、生活方式
- **晨起习惯**：
- **归家动线**：
- **夜间节奏**：
- **周末模式**：

## 三、空间感受
- **现状满意点**：
- **现状痛点**：
- **风格直觉**：
- **情感锚点**：

## 四、设计红线
- **历史教训**：
- **不可让步项**：
- **特殊需求**：

## 五、理想愿景
- **未来场景**：
- **核心期待**：

## 六、设计师备忘
- **关键洞察**：提炼客户没有明说但隐含的核心诉求
- **待确认事项**：访谈中需要后续核实的问题
- **下一步行动**：基于本次访谈建议的后续动作
`;

interface SummarizeOptions {
  apiKey: string;
  transcript: string;
  baseUrl?: string;
  model?: string;
}

export async function summarizeTranscript(options: SummarizeOptions): Promise<string> {
  const { apiKey, transcript, baseUrl = 'https://api.moonshot.cn/v1', model = 'moonshot-v1-8k' } = options;

  // 截断超长文本（8k 模型上下文约 8K tokens，留 2K 给 system prompt）
  const maxChars = 12000;
  const trimmed = transcript.length > maxChars
    ? transcript.slice(0, maxChars) + '\n\n...（内容过长，已截断）'
    : transcript;

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `以下是本次客户需求挖掘访谈的转录文本，请按模板整理：\n\n${trimmed}` },
      ],
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => '未知错误');
    let message = `API 请求失败 (${response.status})`;
    try {
      const errJson = JSON.parse(errorText);
      message = errJson.error?.message || message;
    } catch {
      // ignore
    }
    throw new Error(message);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error('API 返回内容为空');
  }

  return content as string;
}

// localStorage Key 管理
const STORAGE_KEY = 'dm_api_key';

export function getStoredApiKey(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function saveApiKey(key: string): void {
  try {
    localStorage.setItem(STORAGE_KEY, key);
  } catch {
    // ignore
  }
}

export function clearApiKey(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
