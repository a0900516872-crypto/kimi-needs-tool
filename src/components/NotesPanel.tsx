import { useState, useEffect, useRef, useCallback } from 'react';
import { X, Download } from 'lucide-react';

interface NotesPanelProps {
  isOpen: boolean;
  onClose: () => void;
  currentSlide: number;
  slideLabel: string;
  questionText?: string;
}

export default function NotesPanel({ isOpen, onClose, currentSlide, slideLabel, questionText }: NotesPanelProps) {
  const [notes, setNotes] = useState<Record<number, string>>({});
  const [saveStatus, setSaveStatus] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('dm_notes');
      if (saved) setNotes(JSON.parse(saved));
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.value = notes[currentSlide] || '';
    }
  }, [currentSlide, notes, isOpen]);

  const persist = useCallback((newNotes: Record<number, string>) => {
    localStorage.setItem('dm_notes', JSON.stringify(newNotes));
    setSaveStatus('已保存');
    setTimeout(() => setSaveStatus(''), 1500);
  }, []);

  const handleInput = () => {
    setSaveStatus('');
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      if (textareaRef.current) {
        const newNotes = { ...notes, [currentSlide]: textareaRef.current.value };
        setNotes(newNotes);
        persist(newNotes);
      }
    }, 800);
  };

  const handleManualSave = () => {
    if (textareaRef.current) {
      const newNotes = { ...notes, [currentSlide]: textareaRef.current.value };
      setNotes(newNotes);
      persist(newNotes);
    }
  };

  const handleExport = () => {
    const count = Object.values(notes).filter((v) => (v as string)?.trim()).length;
    if (count === 0) return;
    let md = '# 需求挖掘访谈笔记\n\n';
    md += `导出时间：${new Date().toLocaleString('zh-CN')}\n\n---\n\n`;
    for (const [idx, content] of Object.entries(notes)) {
      if (!content?.trim()) continue;
      md += `## 第 ${Number(idx) + 1} 页\n\n${content.trim()}\n\n---\n\n`;
    }
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `访谈笔记_${new Date().toLocaleDateString('zh-CN')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const noteCount = Object.values(notes).filter((v) => (v as string)?.trim()).length;

  return (
    <>
      <div
        className="fixed inset-0 z-[70] transition-opacity duration-500"
        style={{ background: 'rgba(0,0,0,0.5)', opacity: isOpen ? 1 : 0, pointerEvents: isOpen ? 'auto' : 'none' }}
        onClick={onClose}
      />
      <div
        className="fixed top-12 right-0 bottom-0 z-[80] w-full max-w-sm flex flex-col transition-transform duration-500"
        style={{
          background: 'var(--bg-elevated)',
          borderLeft: '1px solid var(--border)',
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-12 px-5" style={{ borderBottom: '1px solid var(--border)' }}>
          <h3 className="text-[12px] font-semibold tracking-widest" style={{ color: 'var(--text)' }}>
            设计师笔记
            {noteCount > 0 && <span className="ml-2 text-[10px] font-normal" style={{ color: 'var(--text-dim)' }}>{noteCount}</span>}
          </h3>
          <div className="flex items-center gap-2">
            {noteCount > 0 && (
              <button onClick={handleExport} className="p-1.5 transition-colors hover:text-white" style={{ color: 'var(--text-dim)' }} title="导出">
                <Download size={14} />
              </button>
            )}
            <button onClick={onClose} className="p-1.5 transition-colors hover:text-white" style={{ color: 'var(--text-dim)' }}>
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Context */}
        <div className="px-5 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="text-[10px] uppercase tracking-[0.15em] mb-1" style={{ color: 'var(--text-dim)' }}>当前问题</div>
          <div className="text-[13px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            {questionText || slideLabel || '导航页'}
          </div>
        </div>

        {/* Textarea */}
        <div className="flex-1 p-4 min-h-0">
          <textarea
            ref={textareaRef}
            className="w-full h-full p-4 text-[13px] leading-relaxed resize-none outline-none scrollbar-thin input-niki"
            placeholder="记录客户的回答要点、情绪词、矛盾点..."
            onInput={handleInput}
            onKeyDown={(e) => { if (e.ctrlKey && e.key === 'Enter') { e.preventDefault(); handleManualSave(); } }}
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between h-10 px-5" style={{ borderTop: '1px solid var(--border)' }}>
          <span className="text-[10px]" style={{ color: 'var(--text-dim)' }}>Ctrl+Enter 保存</span>
          <span className="text-[10px] transition-opacity duration-300" style={{ color: 'var(--accent)', opacity: saveStatus ? 1 : 0 }}>{saveStatus}</span>
        </div>
      </div>
    </>
  );
}
