import { ChevronLeft, ChevronRight, FileText, ClipboardList } from 'lucide-react';

interface Props {
  current: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  showNotes: boolean;
  onToggleNotes: () => void;
  onGoToReview?: () => void;
  answerCount?: number;
}

export default function Controls({ current, total, onPrev, onNext, showNotes, onToggleNotes, onGoToReview, answerCount = 0 }: Props) {
  const progress = ((current + 1) / total) * 100;
  const hasAnswers = answerCount > 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50" style={{ borderTop: '1px solid var(--border)' }}>
      {/* Progress bar */}
      <div className="h-[1px] w-full bg-[var(--border)]">
        <div
          className="h-full bg-[var(--accent)] transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="h-14 flex items-center bg-[var(--bg)]">
        {/* Prev */}
        <button
          onClick={onPrev}
          disabled={current === 0}
          className="flex items-center gap-2 h-full px-6 text-[11px] tracking-[0.15em] text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-white/[0.02] disabled:opacity-20 disabled:cursor-not-allowed transition-all duration-200 border-r border-[var(--border)]"
        >
          <ChevronLeft size={14} strokeWidth={1.5} />
          <span className="hidden sm:inline">PREV</span>
        </button>

        {/* Page number */}
        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold tabular-nums text-[var(--text)]">
              {String(current + 1).padStart(2, '0')}
            </span>
            <span className="text-[10px] text-[var(--text-muted)] mx-1">/</span>
            <span className="text-[11px] tabular-nums text-[var(--text-muted)]">
              {String(total).padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* Next + Notes + Review */}
        <div className="flex items-center h-full">
          <button
            onClick={onNext}
            disabled={current === total - 1}
            className="flex items-center gap-2 h-full px-6 text-[11px] tracking-[0.15em] text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-white/[0.02] disabled:opacity-20 disabled:cursor-not-allowed transition-all duration-200 border-l border-[var(--border)]"
          >
            <span className="hidden sm:inline">NEXT</span>
            <ChevronRight size={14} strokeWidth={1.5} />
          </button>

          {onGoToReview && (
            <button
              onClick={onGoToReview}
              className="flex items-center justify-center h-full w-14 hover:bg-white/[0.02] transition-all duration-200 border-l border-[var(--border)]"
              style={{ color: hasAnswers ? 'var(--accent)' : 'var(--text-secondary)' }}
              title="查看汇总 (Alt+R)"
            >
              <ClipboardList size={15} strokeWidth={1.5} />
            </button>
          )}

          <button
            onClick={onToggleNotes}
            className="flex items-center justify-center h-full w-14 hover:bg-white/[0.02] transition-all duration-200 border-l border-[var(--border)]"
            style={{ color: showNotes ? 'var(--accent)' : 'var(--text-secondary)' }}
            title="笔记 (N)"
          >
            <FileText size={15} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
