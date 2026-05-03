# 方案：AI 结构化总结 — 信息回顾页

> 基于 research.md 结论，浏览器直连 Kimi API，零后端。

---

## 一、目标与范围

### 做什么
- ReviewSlide 增加「AI 智能总结」按钮
- 点击后调用 Kimi API，把原始转写文本提炼为结构化 Markdown
- 展示 AI 总结结果 + 原始转录文本（折叠）
- 支持一键复制/导出结构化 Markdown

### 不做什么
- 不改造录音逻辑（useMediaRecorder / useSpeechRecognition 不动）
- 不增加后端代理
- 不做自动触发（必须用户点击按钮，避免误消费 token）

---

## 二、文件改动清单

### 新建
| 文件 | 说明 |
|------|------|
| `src/lib/ai-summarize.ts` | 封装 Kimi API 调用 + system prompt |
| `src/components/ApiKeyModal.tsx` | API Key 输入弹窗 |

### 修改
| 文件 | 改动 |
|------|------|
| `src/components/slides/ReviewSlide.tsx` | 增加 AI 总结按钮、状态管理、结果展示区 |
| `src/App.tsx` | 可选：管理 API Key 弹窗的显隐状态 |

---

## 三、关键代码片段

### 3.1 System Prompt（`ai-summarize.ts`）

```typescript
const SYSTEM_PROMPT = `你是一位资深室内设计师助理，擅长从客户访谈记录中提取关键信息。

请根据以下访谈转录文本，按以下结构输出一份「客户需求挖掘摘要」。
如果某条信息在文本中未提及，请标注「未提及」。

输出格式必须是 Markdown，使用中文：

# 客户需求挖掘访谈记录 — {日期}

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
- **关键洞察**：
- **待确认事项**：
- **下一步行动**：
`;
```

### 3.2 API 调用函数

```typescript
export async function summarizeTranscript(apiKey: string, transcript: string): Promise<string> {
  const response = await fetch('https://api.moonshot.cn/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'moonshot-v1-8k',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `以下是访谈转录文本：\n\n${transcript}` },
      ],
      temperature: 0.3,
    }),
  });
  // 错误处理 + 解析 ...
}
```

### 3.3 ReviewSlide 新增 UI

布局从上到下：
1. 标题区（保持现有）
2. **AI 总结区**（新增）：
   - 未生成时：显示「🤖 AI 智能总结」按钮 + 小字说明（需要 API Key）
   - 生成中：loading spinner + "正在分析访谈内容..."
   - 生成后：结构化 Markdown 渲染 + 「重新生成」「复制」按钮
3. **原始转录区**（现有，改为折叠面板）：
   - 默认折叠，点击展开
   - 显示原始转录文本 + 字数统计
4. **操作按钮区**（调整）：
   - 复制结构化结果 / 导出结构化 Markdown / 下载音频

---

## 四、UI 状态流转

```
[无总结] → 点击「AI 总结」
    ↓ (检查 localStorage 是否有 API Key)
    ├─ 有 Key → 调用 API → [加载中] → [已生成]
    └─ 无 Key → 弹出 ApiKeyModal → 输入后保存到 localStorage → 继续调用 API

[已生成] → 点击「重新生成」→ [加载中] → [已生成]
```

---

## 五、依赖与风险

### 外部依赖
- Kimi API 网络可用性（国内基本稳定）
- 用户的 API Key 余额充足

### 风险点
| 风险 | 应对 |
|------|------|
| API Key 暴露在浏览器 | 页面加提示「Key 仅保存在本地」；支持一键清除 |
| 转写文本超长（>8K tokens） | 使用 moonshot-v1-32k 模型兜底；超长时截断 + 提示 |
| API 调用失败 | 明确错误提示；fallback 到原始转录展示 |
| 用户没有 Kimi Key | 提供申请链接；支持粘贴任意兼容 OpenAI 格式的 Key |

---

## 六、交互细节

### API Key 弹窗
- 标题：配置 AI 总结 API Key
- 输入框：password 类型，支持粘贴
- 说明文字：
  - "你的 API Key 仅保存在本地浏览器，不会上传到任何服务器"
  - "支持 Kimi（Moonshot）、OpenAI 等兼容 OpenAI 格式的 API Key"
  - 底部放「如何获取 Kimi API Key」链接
- 按钮：保存 / 取消 / 清除已有 Key

### Loading 状态
- 用现有设计系统的风格（不要突兀的 spinner）
- 文案："正在分析访谈内容，请稍候..."
- 显示一个简洁的脉冲动画

### 结果展示
- 用等宽字体 + Markdown 样式渲染
- 区块之间有明显分隔
- 关键标签（如「现状痛点」「不可让步项」）加粗突出

---

## 七、飞总批注区

> 飞总请在这里直接加批注（行内 `> 飞总：xxx`），我逐条回应。

