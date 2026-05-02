interface Props {
  chapter?: string;
  title: string;
  guide: string;
  image: string;
  questionIndex: number;
  totalInChapter: number;
}

export default function QuestionSlide({ chapter, title, guide, image, questionIndex, totalInChapter }: Props) {
  return (
    <div className="h-full relative overflow-hidden">
      {/* Subtle full-screen background */}
      <div className="absolute inset-0">
        <img
          src={image}
          alt=""
          className="w-full h-full object-cover"
          style={{ filter: 'saturate(0.2) brightness(0.2)' }}
        />
        <div className="absolute inset-0 bg-[var(--bg)]/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center px-8 md:px-16 lg:px-24">
        <div className="max-w-4xl">
          {/* Chapter tag */}
          {chapter && (
            <div className="flex items-center gap-3 mb-10">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
              <span className="text-[11px] tracking-[0.15em] text-[var(--accent)] font-medium">
                章节 {chapter}
              </span>
              <span className="text-[11px] text-[var(--text-muted)]">
                {questionIndex + 1} / {totalInChapter}
              </span>
            </div>
          )}

          {/* THE QUESTION — large and bold */}
          <h2
            className="display-large mb-10 leading-[1.1]"
            style={{ fontSize: 'clamp(26px, 5vw, 52px)' }}
          >
            {title}
          </h2>

          {/* Guide */}
          <div className="pl-5 border-l-2 border-[var(--border-light)] max-w-xl">
            <p className="text-sm md:text-[15px] leading-[1.8] text-[var(--text-secondary)]">
              {guide}
            </p>
          </div>
        </div>
      </div>

      {/* Corner decorations */}
      <div className="absolute top-8 right-8 w-6 h-6 border-t border-r border-[var(--border)] opacity-20 z-10" />
      <div className="absolute bottom-8 left-8 w-6 h-6 border-b border-l border-[var(--border)] opacity-20 z-10" />
    </div>
  );
}
