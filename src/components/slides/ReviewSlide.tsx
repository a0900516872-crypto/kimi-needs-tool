import { useState, useCallback } from 'react';
import { CheckCircle, Copy, Download, FileAudio, Sparkles, ChevronDown, ChevronUp, AlertCircle, RotateCcw } from 'lucide-react';
import { summarizeTranscript, getStoredApiKey } from '@/lib/ai-summarize';
import ApiKeyModal from '@/components/ApiKeyModal';

interface Props {
  title: string;
  content: string;
  transcript: string;
  audioUrl: string | null;
}

type AiStatus = 'idle' | 'loading' | 'done' | 'error';

// 轻量 Markdown 渲染器（无外部依赖）
function renderMarkdown(md: string): React.ReactElement {
  const lines = md.split('\n');
  const elements: React.ReactElement[] = [];
  let key = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      elements.push(<div key={key++} className="h-3" />);
      continue;
    }

    // H1
    if (trimmed.startsWith('# ')) {
      elements.push(
        <h1 key={key++} className="text-lg font-medium text-[var(--text)] mt-6 mb-3 pb-2 border-b border-[var(--border)]">
          {parseInline(trimmed.slice(2))}
        </h1>
      );
      continue;
    }

    // H2
    if (trimmed.startsWith('## ')) {
      elements.push(
        <h2 key={key++} className="text-sm font-medium text-[var(--accent)] mt-5 mb-2 tracking-wider">
          {parseInline(trimmed.slice(3))}
        </h2>
      );
      continue;
    }

    // List item
    if (trimmed.startsWith('- ')) {
      const text = trimmed.slice(2);
      elements.push(
        <div key={key++} className="flex items-start gap-2 py-1.5 text-[13px] leading-relaxed text-[var(--text-secondary)]">
          <span className="mt-2 w-1 h-1 rounded-full bg-[var(--accent)]/60 shrink-0" />
          <span>{parseInline(text)}</span>
        </div>
      );
      continue;
    }

    // Plain text
    elements.push(
      <p key={key++} className="text-[13px] leading-relaxed text-[var(--text-secondary)] py-1">
        {parseInline(trimmed)}
      </p>
    );
  }

  return <div>{elements}</div>;
}

// 解析行内格式：加粗
function parseInline(text: string): React.ReactElement {
  const parts: (string | React.ReactElement)[] = [];
  const regex = /\*\*(.+?)\*\*/g;
  let lastIndex = 0;
  let match;
  let idx = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    parts.push(
      <strong key={idx++} className="text-[var(--text)] font-medium">
        {match[1]}
      </strong>
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return <>{parts}</>;
}

export default function ReviewSlide({ title, content, transcript, audioUrl }: Props) {
  const [copied, setCopied] = useState(false);
  const [copiedStructured, setCopiedStructured] = useState(false);
  const [aiStatus, setAiStatus] = useState<AiStatus>('idle');
  const [aiResult, setAiResult] = useState('');
  const [aiError, setAiError] = useState('');
  const [showRaw, setShowRaw] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleCopy = useCallback(async (text: string, setter: (v: boolean) => void) => {
    try {
      await navigator.clipboard.writeText(text);
      setter(true);
      setTimeout(() => setter(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setter(true);
      setTimeout(() => setter(false), 2000);
    }
  }, []);

  const handleCopyRaw = useCallback(() => {
    handleCopy(transcript, setCopied);
  }, [transcript, handleCopy]);

  const handleCopyStructured = useCallback(() => {
    handleCopy(aiResult, setCopiedStructured);
  }, [aiResult, handleCopy]);

  const handleExportStructured = useCallback(() => {
    const date = new Date().toLocaleDateString('zh-CN');
    const md = `# 飛计划 STUDIO — 客户需求挖掘访谈摘要\n\n访谈时间：${date}\n\n---\n\n${aiResult}\n`;
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `访谈摘要_${date}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [aiResult]);

  const handleExportRaw = useCallback(() => {
    const date = new Date().toLocaleDateString('zh-CN');
    const md = `# 飛计划 STUDIO — 客户需求挖掘访谈记录\n\n访谈时间：${date}\n\n---\n\n${transcript}\n`;
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `访谈记录_${date}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [transcript]);

  const handleDownloadAudio = useCallback(() => {
    if (!audioUrl) return;
    const a = document.createElement('a');
    a.href = audioUrl;
    a.download = `访谈录音_${new Date().toLocaleDateString('zh-CN')}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, [audioUrl]);

  const handleAiSummarize = useCallback(async () => {
    const apiKey = getStoredApiKey();
    if (!apiKey) {
      setShowModal(true);
      return;
    }
    if (!transcript.trim()) {
      setAiError('暂无转写内容，无法进行 AI 总结');
      setAiStatus('error');
      return;
    }

    setAiStatus('loading');
    setAiError('');
    try {
      const result = await summarizeTranscript({ apiKey, transcript });
      setAiResult(result);
      setAiStatus('done');
    } catch (err) {
      setAiError(err instanceof Error ? err.message : '总结失败，请检查 API Key 是否有效');
      setAiStatus('error');
    }
  }, [transcript]);

  const hasTranscript = transcript.trim().length > 0;

  return (
    <div className="h-full overflow-y-auto scrollbar-thin px-8 md:px-16 lg:px-24 py-12 relative">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <CheckCircle size={18} strokeWidth={1.5} className="text-[var(--accent)]" />
          <span className="text-[10px] tracking-[0.3em] text-[var(--accent)]">REVIEW</span>
        </div>

        <h2 className="display-large mb-3" style={{ fontSize: 'clamp(28px, 5vw, 48px)' }}>
          {title}
        </h2>

        <p className="text-base leading-[1.9] text-[var(--text-secondary)] mb-8">
          {content}
        </p>

        {/* AI Summary Section */}
        <div className="border border-[var(--border)] p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={15} strokeWidth={1.5} className="text-[var(--accent)]" />
              <span className="text-[12px] tracking-[0.15em] text-[var(--text-muted)]">AI 结构化摘要</span>
            </div>
            {aiStatus === 'done' && (
              <span className="text-[10px] text-green-400/70">已生成</span>
            )}
          </div>

          {/* AI Content Area */}
          {aiStatus === 'idle' && (
            <div className="text-center py-10">
              <Sparkles size={32} strokeWidth={1} className="text-[var(--text-muted)] mx-auto mb-4 opacity-40" />
              <p className="text-[13px] text-[var(--text-muted)] mb-1">
                {hasTranscript ? '点击按钮，AI 将自动提炼访谈关键信息' : '暂无转写内容，访谈时开启录音即可生成摘要'}
              </p>
              <button
                onClick={handleAiSummarize}
                disabled={!hasTranscript}
                className="btn-niki text-[13px] py-3 px-6 mt-4 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Sparkles size={14} strokeWidth={1.5} />
                <span>AI 智能总结</span>
              </button>
              <p className="text-[10px] text-[var(--text-muted)] mt-3">
                需要配置 Kimi / OpenAI API Key · 单次约 ¥0.05–0.15
              </p>
            </div>
          )}

          {aiStatus === 'loading' && (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-[13px] text-[var(--text-secondary)]">正在分析访谈内容，请稍候...</p>
              <p className="text-[11px] text-[var(--text-muted)] mt-2">大模型正在提取关键信息并结构化整理</p>
            </div>
          )}

          {aiStatus === 'done' && (
            <div className="space-y-2">
              {renderMarkdown(aiResult)}
            </div>
          )}

          {aiStatus === 'error' && (
            <div className="text-center py-8">
              <AlertCircle size={28} strokeWidth={1.5} className="text-red-400 mx-auto mb-3" />
              <p className="text-[13px] text-red-400/80 mb-1">{aiError}</p>
              <div className="flex items-center justify-center gap-3 mt-4">
                <button
                  onClick={handleAiSummarize}
                  className="btn-niki text-[12px] py-2.5 px-5"
                >
                  <RotateCcw size={13} strokeWidth={1.5} />
                  <span>重试</span>
                </button>
                <button
                  onClick={() => setShowModal(true)}
                  className="text-[12px] text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
                >
                  检查 API Key
                </button>
              </div>
            </div>
          )}

          {/* AI Actions */}
          {aiStatus === 'done' && (
            <div className="flex flex-wrap items-center gap-3 mt-6 pt-5 border-t border-[var(--border)]">
              <button
                onClick={handleCopyStructured}
                className="btn-niki text-[12px] py-2.5 px-4"
              >
                <Copy size={13} strokeWidth={1.5} />
                <span>{copiedStructured ? '已复制' : '复制摘要'}</span>
              </button>
              <button
                onClick={handleExportStructured}
                className="flex items-center gap-2 py-2.5 px-4 text-[12px] text-[var(--text-secondary)] border border-[var(--border)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all"
              >
                <Download size={13} strokeWidth={1.5} />
                <span>导出 Markdown</span>
              </button>
              <button
                onClick={handleAiSummarize}
                className="flex items-center gap-2 py-2.5 px-4 text-[12px] text-[var(--text-secondary)] border border-[var(--border)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all"
              >
                <RotateCcw size={13} strokeWidth={1.5} />
                <span>重新生成</span>
              </button>
            </div>
          )}
        </div>

        {/* Raw Transcript — Collapsible */}
        <div className="border border-[var(--border)] mb-6">
          <button
            onClick={() => setShowRaw(!showRaw)}
            className="w-full flex items-center justify-between p-4 hover:bg-white/[0.01] transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="text-[12px] tracking-[0.15em] text-[var(--text-muted)]">原始转录文本</span>
              {transcript && (
                <span className="text-[10px] text-[var(--text-muted)]">共 {transcript.length} 字</span>
              )}
            </div>
            {showRaw ? (
              <ChevronUp size={14} strokeWidth={1.5} className="text-[var(--text-muted)]" />
            ) : (
              <ChevronDown size={14} strokeWidth={1.5} className="text-[var(--text-muted)]" />
            )}
          </button>

          {showRaw && (
            <div className="px-4 pb-4">
              {transcript ? (
                <div className="text-[13px] leading-[1.9] text-[var(--text-secondary)] whitespace-pre-wrap border-t border-[var(--border)] pt-4">
                  {transcript}
                </div>
              ) : (
                <p className="text-[13px] text-[var(--text-muted)] italic border-t border-[var(--border)] pt-4">
                  暂无转写记录，访谈时开启录音即可自动生成。
                </p>
              )}

              {/* Raw Actions */}
              {transcript && (
                <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-[var(--border)]">
                  <button
                    onClick={handleCopyRaw}
                    className="flex items-center gap-2 py-2.5 px-4 text-[12px] text-[var(--text-secondary)] border border-[var(--border)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all"
                  >
                    <Copy size={13} strokeWidth={1.5} />
                    <span>{copied ? '已复制' : '复制文本'}</span>
                  </button>
                  <button
                    onClick={handleExportRaw}
                    className="flex items-center gap-2 py-2.5 px-4 text-[12px] text-[var(--text-secondary)] border border-[var(--border)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all"
                  >
                    <Download size={13} strokeWidth={1.5} />
                    <span>导出 Markdown</span>
                  </button>
                  {audioUrl && (
                    <button
                      onClick={handleDownloadAudio}
                      className="flex items-center gap-2 py-2.5 px-4 text-[12px] text-[var(--text-secondary)] border border-[var(--border)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all"
                    >
                      <FileAudio size={13} strokeWidth={1.5} />
                      <span>下载音频</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSaved={() => {
          if (aiStatus === 'idle' || aiStatus === 'error') {
            handleAiSummarize();
          }
        }}
      />
    </div>
  );
}
