import { useState, useCallback } from 'react';
import { CheckCircle, Copy, Download } from 'lucide-react';
import type { AnswersMap } from '@/types/answers';

interface Props {
  title: string;
  content: string;
  answers: AnswersMap;
}

const CHAPTER_NAMES: Record<string, string> = {
  '1': '你和你的家',
  '2': '一天的节奏',
  '3': '心中的画面',
  '4': '必须解决的事',
  '5': '未来说清楚',
};

const CHAPTER_ORDER = ['1', '2', '3', '4', '5'];

export default function ReviewSlide({ title, content, answers }: Props) {
  const [copied, setCopied] = useState(false);

  const grouped = CHAPTER_ORDER.map((ch) => ({
    chapter: ch,
    name: CHAPTER_NAMES[ch] || `章节 ${ch}`,
    items: Object.values(answers)
      .filter((a) => a.chapter === ch)
      .sort((a, b) => a.slideIndex - b.slideIndex),
  }));

  const totalAnswered = Object.values(answers).filter((a) => a.transcript.trim()).length;

  const buildMarkdown = useCallback(() => {
    const date = new Date().toLocaleDateString('zh-CN');
    let md = `# 飛计划 STUDIO — 客户需求挖掘访谈记录\n\n`;
    md += `访谈时间：${date}\n\n---\n\n`;

    grouped.forEach(({ name, items }) => {
      if (items.length === 0) return;
      md += `## ${name}\n\n`;
      items.forEach((item, idx) => {
        md += `**Q${idx + 1}: ${item.question}**\n`;
        if (item.transcript.trim()) {
          md += `> ${item.transcript.trim()}\n`;
        } else {
          md += `> *未记录*\n`;
        }
        md += `\n`;
      });
      md += `---\n\n`;
    });

    return md;
  }, [grouped]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(buildMarkdown());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const textarea = document.createElement('textarea');
      textarea.value = buildMarkdown();
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [buildMarkdown]);

  const handleExport = useCallback(() => {
    const blob = new Blob([buildMarkdown()], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `访谈记录_${new Date().toLocaleDateString('zh-CN')}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [buildMarkdown]);

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

        <p className="text-base leading-[1.9] text-[var(--text-secondary)] mb-10">
          {content}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-4 mb-10 text-[12px] text-[var(--text-muted)]">
          <span>已记录 {totalAnswered} 题</span>
          <span className="w-1 h-1 rounded-full bg-[var(--border-light)]" />
          <span>共 {Object.values(answers).length} 题</span>
        </div>

        {/* Chapter groups */}
        <div className="space-y-8">
          {grouped.map(({ chapter, name, items }) => (
            <div key={chapter} className="border border-[var(--border)] p-6">
              <h3 className="text-[var(--accent)] text-[12px] tracking-[0.2em] mb-5 font-medium">
                {name}
              </h3>
              {items.length === 0 ? (
                <p className="text-[13px] text-[var(--text-muted)] italic">本章节暂无问题</p>
              ) : (
                <div className="space-y-5">
                  {items.map((item) => (
                    <div key={item.slideIndex}>
                      <div className="text-[13px] font-medium text-[var(--text)] mb-1">
                        {item.question}
                      </div>
                      <div className="text-[13px] text-[var(--text-secondary)] pl-3 border-l border-[var(--border-light)] leading-relaxed">
                        {item.transcript.trim() ? (
                          item.transcript.trim()
                        ) : (
                          <span className="italic text-[var(--text-muted)]">未记录</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 mt-10 mb-16">
          <button
            onClick={handleCopy}
            className="btn-niki text-[13px] py-3 px-5"
          >
            <Copy size={14} strokeWidth={1.5} />
            <span>{copied ? '已复制' : '复制全部'}</span>
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 py-3 px-5 text-[13px] text-[var(--text-secondary)] border border-[var(--border)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all"
          >
            <Download size={14} strokeWidth={1.5} />
            <span>导出 Markdown</span>
          </button>
        </div>
      </div>
    </div>
  );
}
