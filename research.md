# 研究：AI 结构化总结 — 信息回顾页优化

## 现状分析

### 当前数据流
- `App.tsx` 维护全局录音状态：`useMediaRecorder()` + `useSpeechRecognition()`
- `savedTranscript` 从 localStorage 读取，`transcript` 是实时转写
- `ReviewSlide` 接收 `transcript: string` + `audioUrl: string | null`
- ReviewSlide 目前只做「展示原始转写文本 + 复制/导出/下载」

### 现有文件清单
| 文件 | 职责 | 改动点 |
|------|------|--------|
| `App.tsx` | 主控制器 | 可能需增加 API Key 弹窗状态 |
| `ReviewSlide.tsx` | 信息回顾页 | **核心改动**：增加 AI 总结 UI + API 调用 |
| `useSpeechRecognition.ts` | 语音识别 | 不改 |
| `useMediaRecorder.ts` | 音频录制 | 不改 |

## 技术方案评估

### 方案1：浏览器直连 Kimi API（推荐）
- **URL**: `https://api.moonshot.cn/v1/chat/completions`
- **模型**: `moonshot-v1-8k` 或 `moonshot-v1-32k`
- **CORS**: 支持，浏览器可直接调用
- **费用**: 约 ¥0.012/1K tokens（8k 模型），一次访谈转写 3K-8K tokens，单次成本约 ¥0.05-0.10
- **优势**: 国内网络友好、价格低、中文理解好
- **风险**: API Key 暴露在浏览器端（仅限个人使用，不可公开分享）

### 方案2：浏览器直连 OpenAI API
- **URL**: `https://api.openai.com/v1/chat/completions`
- **模型**: `gpt-4o-mini`
- **CORS**: 支持
- **费用**: 更低，但国内网络可能需要代理
- **风险**: 同方案1 + 网络不稳定

### 方案3：Vercel Edge Function 代理
- **思路**: 前端 → Vercel Edge Function → Kimi API
- **优势**: API Key 隐藏在后端，可公开分享
- **劣势**: 需要新增后端代码、增加复杂度、延迟多 100-200ms

## 结论

**采用方案1（浏览器直连 Kimi）**，理由：
1. 飞总个人使用，API Key 自己保管即可
2. 零后端复杂度，改动最小
3. 国内网络最稳
4. 成本极低（单次不到1毛钱）

**安全兜底**：
- API Key 只存 localStorage，不上传服务器
- 页面增加醒目提示「API Key 仅保存在本地浏览器」
- 支持一键清除 Key
