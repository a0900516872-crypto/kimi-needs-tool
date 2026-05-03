import { ArrowUpRight } from 'lucide-react';

interface Props {
  title: string;
  subtitle: string;
  content: string;
}

export default function EndSlide({ title, subtitle, content }: Props) {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center px-8 relative overflow-hidden">
      {/* Watermark */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-black select-none whitespace-nowrap"
        style={{ fontSize: 'clamp(120px, 25vw, 350px)', color: 'var(--accent)', opacity: 0.03 }}
      >
        飛计划
      </div>

      <div className="relative z-10 max-w-2xl">
        {/* Brand Logo */}
        <div className="mb-10">
          <img src="/images/logo-header.png" alt="飛计划" className="h-10 md:h-12 mx-auto" />
        </div>

        {subtitle && (
          <span className="text-[10px] tracking-[0.3em] text-[var(--text-muted)] block mb-6">
            {subtitle}
          </span>
        )}

        <h2 className="display-large mb-6" style={{ fontSize: 'clamp(32px, 6vw, 56px)' }}>
          {title}
        </h2>

        <p className="text-base leading-[1.8] text-[var(--text-secondary)] max-w-md mx-auto mb-12">
          {content}
        </p>

        <div className="flex items-center justify-center gap-4">
          <span className="text-[11px] tracking-wider text-[var(--text-muted)]">飛计划设计事务所</span>
          <ArrowUpRight size={12} className="text-[var(--text-muted)]" />
        </div>
      </div>

      {/* Corner decorations */}
      <div className="absolute top-8 left-8 w-8 h-8 border-t border-l border-[var(--border)] opacity-20" />
      <div className="absolute top-8 right-8 w-8 h-8 border-t border-r border-[var(--border)] opacity-20" />
      <div className="absolute bottom-8 left-8 w-8 h-8 border-b border-l border-[var(--border)] opacity-20" />
      <div className="absolute bottom-8 right-8 w-8 h-8 border-b border-r border-[var(--border)] opacity-20" />
    </div>
  );
}
