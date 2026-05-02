import { CheckCircle } from 'lucide-react';

interface Props {
  title: string;
  content: string;
}

export default function ReviewSlide({ title, content }: Props) {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center px-8 relative">
      <div className="max-w-2xl">
        {/* Icon */}
        <div className="w-12 h-12 flex items-center justify-center mx-auto mb-8" style={{ border: '1px solid var(--accent)', color: 'var(--accent)' }}>
          <CheckCircle size={20} strokeWidth={1.5} />
        </div>

        <span className="text-[10px] tracking-[0.3em] text-[var(--accent)] block mb-4">REVIEW</span>

        <h2 className="display-large mb-6" style={{ fontSize: 'clamp(28px, 5vw, 48px)' }}>
          {title}
        </h2>

        <p className="text-base leading-[1.9] text-[var(--text-secondary)] max-w-lg mx-auto">
          {content}
        </p>

        <div className="mt-12 w-16 h-px bg-[var(--accent)] mx-auto" />

        {/* Decorative items - visual summary */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-lg mx-auto">
          {['你和你的家', '一天的节奏', '心中的画面', '必须解决的事'].map((item, i) => (
            <div key={i} className="py-3 px-2 border border-[var(--border)] text-[11px] text-[var(--text-muted)] tracking-wider">
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
