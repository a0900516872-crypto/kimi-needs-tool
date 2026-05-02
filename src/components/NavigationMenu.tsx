import { X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  current: number;
  onNavigate: (index: number) => void;
}

const navItems = [
  { num: '00', label: '封面', idx: 0 },
  { num: '01', label: '关于我们', idx: 1 },
  { num: '02', label: '代表案例', idx: 2 },
  { num: '03', label: '开始', idx: 5 },
  { num: '04', label: '你和你的家', idx: 6 },
  { num: '05', label: '一天的节奏', idx: 11 },
  { num: '06', label: '你心中的画面', idx: 16 },
  { num: '07', label: '那些绕不开的事', idx: 21 },
  { num: '08', label: '未来的某个早晨', idx: 25 },
  { num: '09', label: '信息回顾', idx: 28 },
];

export default function NavigationMenu({ isOpen, onClose, current, onNavigate }: Props) {
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[70] transition-opacity duration-500"
        style={{ background: 'rgba(0,0,0,0.6)', opacity: isOpen ? 1 : 0, pointerEvents: isOpen ? 'auto' : 'none' }}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className="fixed top-0 right-0 bottom-0 z-[80] w-full max-w-md transition-transform duration-500 flex flex-col"
        style={{
          background: 'var(--bg-elevated)',
          borderLeft: '1px solid var(--border)',
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-12 px-6 border-b border-[var(--border)]">
          <span className="text-[11px] tracking-widest text-[var(--text-muted)]">导航</span>
          <button onClick={onClose} className="flex items-center gap-1.5 text-[11px] tracking-widest text-[var(--text-muted)] hover:text-white transition-colors">
            <X size={14} strokeWidth={1.5} />
            CLOSE
          </button>
        </div>

        {/* Nav Items */}
        <div className="flex-1 py-2 overflow-y-auto scrollbar-thin">
          {navItems.map((item) => (
            <button
              key={item.num}
              onClick={() => { onNavigate(item.idx); onClose(); }}
              className="w-full flex items-center gap-5 px-6 py-3.5 text-left transition-colors duration-200 hover:bg-white/[0.02] group border-b border-[var(--border)]"
            >
              <span className="text-[11px] text-[var(--text-muted)] group-hover:text-white transition-colors w-6">/{item.num}</span>
              <span className="flex-1 text-sm font-bold tracking-wide text-[var(--text)] group-hover:text-white transition-colors">
                {item.label}
              </span>
              <span className="w-1.5 h-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity bg-[var(--accent)]" />
            </button>
          ))}
        </div>

        {/* Progress */}
        <div className="px-6 py-4 border-t border-[var(--border)]">
          <div className="text-[11px] mb-3 tracking-wider text-[var(--text-muted)]">当前进度</div>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold tabular-nums text-[var(--text)]">{String(current + 1).padStart(2, '0')}</span>
            <span className="text-sm text-[var(--text-muted)]">/</span>
            <span className="text-sm tabular-nums text-[var(--text-muted)]">30</span>
          </div>
          <div className="mt-3 h-[2px] w-full bg-[var(--border)]">
            <div className="h-full bg-[var(--accent)] transition-all duration-500" style={{ width: `${((current + 1) / 30) * 100}%` }} />
          </div>
        </div>
      </div>
    </>
  );
}
