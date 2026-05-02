interface Props {
  title: string;
  subtitle: string;
  content: string;
}

export default function TransitionSlide({ title, subtitle, content }: Props) {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center px-8 relative">
      {/* Minimal center content - lots of whitespace */}
      <div className="max-w-2xl">
        <h2
          className="display-large mb-4"
          style={{ fontSize: 'clamp(32px, 6vw, 64px)' }}
        >
          {title}
        </h2>
        <p
          className="display-huge mb-12"
          style={{ fontSize: 'clamp(28px, 5vw, 48px)', color: 'var(--accent)' }}
        >
          {subtitle}
        </p>
        <div className="w-8 h-px bg-[var(--border)] mx-auto mb-8" />
        <p className="text-sm leading-[1.8] text-[var(--text-muted)] max-w-md mx-auto">
          {content}
        </p>
      </div>

      {/* Decorative thin lines */}
      <div className="absolute top-1/2 left-8 w-px h-24 -translate-y-1/2 bg-[var(--border)] opacity-30 hidden md:block" />
      <div className="absolute top-1/2 right-8 w-px h-24 -translate-y-1/2 bg-[var(--border)] opacity-30 hidden md:block" />
    </div>
  );
}
