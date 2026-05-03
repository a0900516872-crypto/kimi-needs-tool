import { Clock } from 'lucide-react';

interface FooterProps {
  current: number;
  total: number;
  noteCount: number;
}

export default function Footer({ noteCount }: FooterProps) {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="fixed bottom-14 left-0 right-0 z-40 h-8 flex items-center justify-between px-4 md:px-6" style={{ borderTop: '1px solid var(--border)' }}>
      {/* Left */}
      <div className="flex items-center gap-4">
        <span className="text-[10px] tracking-wider hidden md:inline-block" style={{ color: 'var(--text-dim)' }}>
          <Clock size={10} className="inline mr-1" />
          {timeStr}
        </span>
        <span className="text-[10px] tracking-wider" style={{ color: 'var(--text-dim)' }}>
          ©{String(now.getFullYear()).slice(2)}
        </span>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        {noteCount > 0 && (
          <span className="text-[10px] tracking-wider" style={{ color: 'var(--text-dim)' }}>
            笔记 {noteCount}
          </span>
        )}
        <span className="text-[10px] tracking-wider hidden md:inline-block" style={{ color: 'var(--text-dim)' }}>
          飛计划设计事务所
        </span>
      </div>
    </div>
  );
}
