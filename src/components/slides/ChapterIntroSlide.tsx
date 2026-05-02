interface Props {
  chapter: string;
  title: string;
  subtitle: string;
  image: string;
}

export default function ChapterIntroSlide({ chapter, title, subtitle, image }: Props) {
  return (
    <div className="h-full relative overflow-hidden">
      {/* Full-screen background */}
      <div className="absolute inset-0">
        <img src={image} alt="" className="w-full h-full object-cover" style={{ filter: 'saturate(0.25) brightness(0.3)' }} />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg)] via-[var(--bg)]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)]/60 to-transparent" />
      </div>

      {/* Giant chapter number as watermark */}
      <div
        className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-[10%] font-black leading-none select-none"
        style={{ fontSize: 'clamp(250px, 40vw, 500px)', color: 'var(--accent)', opacity: 0.04 }}
      >
        {chapter}
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center px-8 md:px-16 lg:px-24">
        <div className="max-w-2xl">
          <div className="flex items-center gap-4 mb-8">
            <span className="text-[11px] tracking-[0.2em] text-[var(--accent)]">章节</span>
            <div className="w-8 h-px bg-[var(--accent)]" />
            <span className="text-4xl md:text-5xl font-black text-[var(--accent)]">{chapter}</span>
          </div>

          <h2
            className="display-large mb-4"
            style={{ fontSize: 'clamp(32px, 6vw, 64px)' }}
          >
            {title}
          </h2>

          <p className="text-base text-[var(--text-secondary)] tracking-wide">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Corner decorations */}
      <div className="absolute bottom-8 left-8 w-8 h-8 border-b border-l border-[var(--border)] opacity-20 z-10" />
      <div className="absolute bottom-8 right-8 w-8 h-8 border-b border-r border-[var(--border)] opacity-20 z-10" />
    </div>
  );
}
