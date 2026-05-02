interface Props {
  onStart: () => void;
}

export default function CoverSlide({ onStart }: Props) {
  return (
    <div className="h-full relative overflow-hidden flex flex-col">
      {/* Full-screen background */}
      <div className="absolute inset-0">
        <img src="/images/module-a.jpg" alt="" className="w-full h-full object-cover" style={{ filter: 'saturate(0.4) brightness(0.3)' }} />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-[var(--bg)]/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg)]/80 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col justify-between px-8 md:px-16 lg:px-24 py-12">
        {/* Top: Label */}
        <div>
          <span className="text-[10px] tracking-[0.4em] text-[var(--text-muted)]">DESIGN DISCOVERY</span>
        </div>

        {/* Center: Main brand */}
        <div className="max-w-3xl">
          {/* Brand Logo */}
          <div className="mb-10">
            <img src="/images/logo-cover.png" alt="飛计划 STUDIO" className="h-14 md:h-18 w-auto" />
          </div>

          <h1
            className="display-huge mb-6"
            style={{ fontSize: 'clamp(36px, 7vw, 80px)' }}
          >
            用对话，<br />找到家的起点
          </h1>
          <p className="text-base text-[var(--text-secondary)] font-light tracking-wide max-w-md leading-relaxed">
            一次深度访谈，胜过十套方案。让我们从你的生活开始，一起勾勒出理想家的轮廓。
          </p>
        </div>

        {/* Bottom */}
        <div className="flex items-end justify-between">
          <button onClick={onStart} className="flex items-center gap-2 text-[11px] tracking-[0.2em] text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors duration-300 group">
            <span>进入</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="group-hover:translate-x-1 transition-transform">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
          <div className="text-[10px] tracking-wider text-[var(--text-muted)] hidden md:block">
            飛计划 STUDIO
          </div>
        </div>
      </div>

      {/* Decorative corners */}
      <div className="absolute top-8 left-8 w-6 h-6 border-t border-l border-[var(--border)] opacity-30 z-20" />
      <div className="absolute top-8 right-8 w-6 h-6 border-t border-r border-[var(--border)] opacity-30 z-20" />
      <div className="absolute bottom-8 left-8 w-6 h-6 border-b border-l border-[var(--border)] opacity-30 z-20" />
      <div className="absolute bottom-8 right-8 w-6 h-6 border-b border-r border-[var(--border)] opacity-30 z-20" />
    </div>
  );
}
