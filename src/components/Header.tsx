import { Menu, Mic, Square } from 'lucide-react';

interface Props {
  moduleLabel: string;
  subLabel: string;
  onToggleMenu: () => void;
  isRecording?: boolean;
  recordingTime?: string;
  onToggleRecording?: () => void;
}

export default function Header({ moduleLabel, subLabel, onToggleMenu, isRecording, recordingTime, onToggleRecording }: Props) {
  return (
    <header className="fixed top-0 left-0 right-0 z-[60] h-12 flex items-center border-b border-[var(--border)] bg-[var(--bg)]">
      {/* Left: Logo */}
      <div className="flex items-center gap-3 h-full px-5 md:px-8">
        <img src="/images/logo-header.png" alt="飛计划" className="h-7 w-auto" />
        <div className="hidden md:flex items-center gap-3">
          <div className="w-px h-4 bg-[var(--border)]" />
          <span className="text-[10px] tracking-[0.15em] text-[var(--text-muted)]">飛计划</span>
        </div>
      </div>

      {/* Center: Act info */}
      <div className="flex-1 flex items-center justify-center h-full">
        {moduleLabel && (
          <div className="flex items-center gap-3">
            <span className="text-[11px] tracking-wider text-[var(--text-secondary)]">{moduleLabel}</span>
            {subLabel && (
              <>
                <span className="text-[10px] text-[var(--text-muted)]">·</span>
                <span className="text-[11px] text-[var(--accent)]">{subLabel}</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Right: Record + Menu */}
      <div className="flex items-center h-full">
        {onToggleRecording && (
          <button
            onClick={onToggleRecording}
            className="flex items-center gap-2 h-full px-4 md:px-6 text-[11px] tracking-[0.15em] border-l border-[var(--border)] hover:bg-white/[0.02] transition-colors duration-200"
            title={isRecording ? '停止录音' : '开始录音'}
          >
            {isRecording ? (
              <>
                <span className="w-2 h-2 rounded-full bg-red-500 recorder-pulse" />
                <span className="text-red-400 hidden sm:inline">{recordingTime || '00:00'}</span>
                <Square size={12} strokeWidth={1.5} className="text-red-400" />
              </>
            ) : (
              <>
                <Mic size={14} strokeWidth={1.5} className="text-[var(--text-muted)]" />
                <span className="text-[var(--text-muted)] hidden sm:inline">录音</span>
              </>
            )}
          </button>
        )}

        <button
          onClick={onToggleMenu}
          className="flex items-center gap-2 h-full px-5 md:px-8 text-[11px] tracking-[0.2em] text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-white/[0.02] transition-colors duration-200 border-l border-[var(--border)]"
        >
          <Menu size={14} strokeWidth={1.5} />
          <span className="hidden sm:inline">MENU</span>
        </button>
      </div>
    </header>
  );
}
