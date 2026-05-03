import { useState } from 'react';
import { X, KeyRound, Trash2 } from 'lucide-react';
import {
  getStoredApiKey, saveApiKey, clearApiKey,
  getStoredBaseUrl, saveBaseUrl, clearBaseUrl,
} from '@/lib/ai-summarize';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: () => void;
}

export default function ApiKeyModal({ isOpen, onClose, onSaved }: Props) {
  const [key, setKey] = useState(getStoredApiKey() || '');
  const [baseUrl, setBaseUrl] = useState(getStoredBaseUrl() || '');
  const [showKey, setShowKey] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    const trimmedKey = key.trim();
    const trimmedUrl = baseUrl.trim();
    if (trimmedKey) {
      saveApiKey(trimmedKey);
    } else {
      clearApiKey();
    }
    if (trimmedUrl) {
      saveBaseUrl(trimmedUrl);
    } else {
      clearBaseUrl();
    }
    onClose();
    onSaved?.();
  };

  const handleClear = () => {
    clearApiKey();
    clearBaseUrl();
    setKey('');
    setBaseUrl('');
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md mx-4 border border-[var(--border)] bg-[var(--bg)] p-8">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
        >
          <X size={16} strokeWidth={1.5} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <KeyRound size={18} strokeWidth={1.5} className="text-[var(--accent)]" />
          <div>
            <h3 className="text-sm font-medium text-[var(--text)]">配置 AI 总结 API Key</h3>
            <p className="text-[11px] text-[var(--text-muted)] mt-0.5">用于调用大模型自动生成结构化访谈摘要</p>
          </div>
        </div>

        {/* Input */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <label className="text-[11px] tracking-wider text-[var(--text-secondary)]">API Key</label>
            <button
              onClick={() => setShowKey(!showKey)}
              className="text-[10px] text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
            >
              {showKey ? '隐藏' : '显示'}
            </button>
          </div>
          <input
            type={showKey ? 'text' : 'password'}
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="sk-..."
            className="w-full bg-transparent border border-[var(--border)] px-4 py-3 text-[13px] text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] transition-colors"
          />
        </div>

        {/* Base URL */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <label className="text-[11px] tracking-wider text-[var(--text-secondary)]">API 调用地址</label>
          </div>
          <input
            type="text"
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
            placeholder="https://api.moonshot.cn/v1"
            className="w-full bg-transparent border border-[var(--border)] px-4 py-3 text-[13px] text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] transition-colors"
          />
        </div>

        {/* Info */}
        <div className="mb-6 space-y-2">
          <p className="text-[11px] leading-relaxed text-[var(--text-muted)]">
            • 你的 API Key 和调用地址仅保存在本地浏览器，不会上传到任何服务器
          </p>
          <p className="text-[11px] leading-relaxed text-[var(--text-muted)]">
            • 支持 Kimi（Moonshot）、OpenAI、KimiCode 等兼容 OpenAI 格式的 Key
          </p>
          <p className="text-[11px] leading-relaxed text-[var(--text-muted)]">
            • 单次访谈总结约消耗 3K–8K tokens，成本约 ¥0.05–0.15
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            className="btn-niki text-[12px] py-2.5 px-6 flex-1"
          >
            保存
          </button>
          <button
            onClick={onClose}
            className="py-2.5 px-5 text-[12px] text-[var(--text-secondary)] border border-[var(--border)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all"
          >
            取消
          </button>
          {(getStoredApiKey() || getStoredBaseUrl()) && (
            <button
              onClick={handleClear}
              className="flex items-center gap-1.5 py-2.5 px-4 text-[12px] text-red-400/70 hover:text-red-400 border border-red-900/30 hover:border-red-800/50 transition-all"
              title="清除已保存的 Key"
            >
              <Trash2 size={13} strokeWidth={1.5} />
              <span className="hidden sm:inline">清除</span>
            </button>
          )}
        </div>

        {/* Footer link */}
        <div className="mt-5 pt-4 border-t border-[var(--border)] text-center">
          <a
            href="https://platform.moonshot.cn/console/api-keys"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
          >
            没有 Key？前往 Kimi 开放平台获取 →
          </a>
        </div>
      </div>
    </div>
  );
}
