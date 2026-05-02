interface Props {
  caseName: string;
  caseQuote: string;
  image: string;
}

export default function CaseSlide({ caseName, caseQuote, image }: Props) {
  return (
    <div className="h-full relative overflow-hidden">
      {/* Full-screen background image */}
      <div className="absolute inset-0">
        <img
          src={image}
          alt={caseName}
          className="w-full h-full object-cover"
          style={{ filter: 'saturate(0.35) brightness(0.35)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-[var(--bg)]/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-end px-8 md:px-16 lg:px-24 pb-16 md:pb-24">
        <span className="text-[11px] tracking-[0.2em] text-[var(--accent)] mb-4">
          代表案例
        </span>
        <h3 className="text-xl md:text-2xl font-bold tracking-wide mb-8 text-[var(--text)]">
          {caseName}
        </h3>
        <blockquote
          className="text-xl md:text-2xl lg:text-3xl font-light leading-relaxed max-w-3xl text-[var(--text-secondary)]"
        >
          {caseQuote}
        </blockquote>
      </div>

      {/* Corner decorations */}
      <div className="absolute top-8 left-8 w-8 h-8 border-t border-l border-[var(--border)] opacity-20 z-10" />
      <div className="absolute top-8 right-8 w-8 h-8 border-t border-r border-[var(--border)] opacity-20 z-10" />
    </div>
  );
}
