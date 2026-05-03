import { useState, useCallback } from 'react';
import { CheckCircle, Copy, Download, FileAudio } from 'lucide-react';

interface Props {
  title: string;
  content: string;
  transcript: string;
  audioUrl: string | null;
}

export default function ReviewSlide({ title, content, transcript, audioUrl }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(transcript);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = transcript;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [transcript]);

  const handleExportText = useCallback(() => {
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

        {/* Transcript area */}
        <div className="border border-[var(--border)] p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[12px] tracking-[0.15em] text-[var(--text-muted)]">访谈转写文本</span>
            {transcript && (
              <span className="text-[10px] text-[var(--text-muted)]">共 {transcript.length} 字</span>
            )}
          </div>

          {transcript ? (
            <div className="text-[14px] leading-[1.9] text-[var(--text-secondary)] whitespace-pre-wrap">
              {transcript}
            </div>
          ) : (
            <p className="text-[13px] text-[var(--text-muted)] italic">暂无转写记录，访谈时开启录音即可自动生成。</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          {transcript && (
            <>
              <button
                onClick={handleCopy}
                className="btn-niki text-[13px] py-3 px-5"
              >
                <Copy size={14} strokeWidth={1.5} />
                <span>{copied ? '已复制' : '复制文本'}</span>
              </button>
              <button
                onClick={handleExportText}
                className="flex items-center gap-2 py-3 px-5 text-[13px] text-[var(--text-secondary)] border border-[var(--border)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all"
              >
                <Download size={14} strokeWidth={1.5} />
                <span>导出 Markdown</span>
              </button>
            </>
          )}

          {audioUrl && (
            <button
              onClick={handleDownloadAudio}
              className="flex items-center gap-2 py-3 px-5 text-[13px] text-[var(--text-secondary)] border border-[var(--border)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all"
            >
              <FileAudio size={14} strokeWidth={1.5} />
              <span>下载音频</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
