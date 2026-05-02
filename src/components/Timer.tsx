import { useState, useEffect, useRef } from 'react';
import { Clock, RotateCcw } from 'lucide-react';

interface TimerProps {
  isRunning: boolean;
}

export default function Timer({ isRunning }: TimerProps) {
  const [seconds, setSeconds] = useState(0);
  const [visible, setVisible] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => setSeconds(s => s + 1), 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isRunning]);

  const fmt = (s: number) => {
    const m = Math.floor(s / 60), sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  return (
    <div className="fixed top-12 left-0 z-50 hidden md:flex items-center">
      <button
        onClick={() => setVisible(!visible)}
        className="flex items-center gap-2 h-8 px-4 text-[11px] tracking-wider transition-colors hover:text-white"
        style={{ color: isRunning ? 'var(--accent)' : 'var(--text-dim)' }}
      >
        <Clock size={12} />
        {visible ? fmt(seconds) : '计时器'}
      </button>
      {visible && (
        <button
          onClick={() => setSeconds(0)}
          className="p-1 transition-colors hover:text-white"
          style={{ color: 'var(--text-dim)' }}
        >
          <RotateCcw size={11} />
        </button>
      )}
    </div>
  );
}
