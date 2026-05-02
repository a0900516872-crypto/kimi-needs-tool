interface Props {
  title: string;
  content: string;
  image: string;
}

export default function PhilosophySlide({ title, content, image }: Props) {
  return (
    <div className="h-full flex flex-col lg:flex-row">
      {/* Left: Text */}
      <div className="flex-1 flex flex-col justify-center px-8 md:px-16 lg:px-24 py-12 lg:py-0">
        <span className="section-num mb-6">/PHILOSOPHY</span>
        <h2 className="display-large mb-8" style={{ fontSize: 'clamp(28px, 4vw, 48px)' }}>
          {title}
        </h2>
        <div className="max-w-lg">
          <p className="text-base leading-[1.9] text-[var(--text-secondary)]">
            {content}
          </p>
        </div>
        <div className="mt-12 w-16 h-px bg-[var(--accent)]" />
      </div>

      {/* Right: Image */}
      <div className="flex-1 relative overflow-hidden hidden lg:block" style={{ borderLeft: '1px solid var(--border)' }}>
        <img src={image} alt="" className="w-full h-full object-cover img-cinematic" />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg)]/40 to-transparent" />
      </div>
    </div>
  );
}
