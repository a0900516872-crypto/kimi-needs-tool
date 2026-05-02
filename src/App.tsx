import { useState, useEffect, useCallback, useRef } from 'react';
import { buildSlides, getActLabel, getChapterLabel, getSlideLabel } from '@/data/slides';
import type { AnswersMap } from '@/types/answers';
import Spotlight from '@/components/Spotlight';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NavigationMenu from '@/components/NavigationMenu';
import Controls from '@/components/Controls';
import NotesPanel from '@/components/NotesPanel';
import Timer from '@/components/Timer';
import CoverSlide from '@/components/slides/CoverSlide';
import PhilosophySlide from '@/components/slides/PhilosophySlide';
import CaseSlide from '@/components/slides/CaseSlide';
import TransitionSlide from '@/components/slides/TransitionSlide';
import ChapterIntroSlide from '@/components/slides/ChapterIntroSlide';
import QuestionSlide from '@/components/slides/QuestionSlide';
import ReviewSlide from '@/components/slides/ReviewSlide';
import EndSlide from '@/components/slides/EndSlide';

const SLIDES = buildSlides();
const TOTAL = SLIDES.length;

export default function App() {
  const [current, setCurrent] = useState(0);
  const [showNotes, setShowNotes] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [noteCount, setNoteCount] = useState(0);
  const [started, setStarted] = useState(false);
  const [slideKey, setSlideKey] = useState(0);
  const [answers, setAnswers] = useState<AnswersMap>({});
  const touchX = useRef(0);

  // Note count
  useEffect(() => {
    const update = () => {
      try {
        const n = JSON.parse(localStorage.getItem('dm_notes') || '{}');
        setNoteCount(Object.values(n).filter((v) => (v as string)?.trim()).length);
      } catch { setNoteCount(0); }
    };
    update();
    const iv = setInterval(update, 2000);
    return () => clearInterval(iv);
  }, [current]);

  const navTo = useCallback((index: number) => {
    if (index < 0 || index >= TOTAL) return;
    setSlideKey((k) => k + 1);
    setCurrent(index);
    setShowMenu(false);
    if (index > 0) setStarted(true);
  }, []);

  const goNext = useCallback(() => { if (current < TOTAL - 1) navTo(current + 1); }, [current, navTo]);
  const goPrev = useCallback(() => { if (current > 0) navTo(current - 1); }, [current, navTo]);

  // Load answers from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem('dm_answers');
      if (raw) setAnswers(JSON.parse(raw));
    } catch { /* ignore */ }
  }, []);

  const saveAnswer = useCallback((slideIndex: number, transcript: string) => {
    const slide = SLIDES[slideIndex];
    const next: AnswersMap = {
      ...answers,
      [slideIndex]: {
        slideIndex,
        question: slide.title || '',
        chapter: slide.chapter || '',
        transcript,
        updatedAt: new Date().toISOString(),
      }
    };
    setAnswers(next);
    localStorage.setItem('dm_answers', JSON.stringify(next));
  }, [answers]);

  const goToReview = useCallback(() => {
    const reviewIndex = SLIDES.findIndex(s => s.type === 'review');
    if (reviewIndex >= 0) navTo(reviewIndex);
  }, [navTo]);

  // Keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'TEXTAREA' || target.tagName === 'INPUT') {
        if (e.key === 'Escape') target.blur();
        return;
      }
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault(); goNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault(); goPrev();
      } else if (e.key === 'n' || e.key === 'N') {
        setShowNotes((p) => !p);
      } else if (e.key === 'm' || e.key === 'M') {
        setShowMenu((p) => !p);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goNext, goPrev]);

  // Touch
  useEffect(() => {
    const onS = (e: TouchEvent) => { touchX.current = e.changedTouches[0].screenX; };
    const onE = (e: TouchEvent) => {
      const d = touchX.current - e.changedTouches[0].screenX;
      if (Math.abs(d) > 50) d > 0 ? goNext() : goPrev();
    };
    document.addEventListener('touchstart', onS);
    document.addEventListener('touchend', onE);
    return () => { document.removeEventListener('touchstart', onS); document.removeEventListener('touchend', onE); };
  }, [goNext, goPrev]);

  // Wheel
  useEffect(() => {
    let to: ReturnType<typeof setTimeout>, acc = 0;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault(); acc += e.deltaY;
      clearTimeout(to);
      to = setTimeout(() => { Math.abs(acc) > 30 && (acc > 0 ? goNext() : goPrev()); acc = 0; }, 80);
    };
    window.addEventListener('wheel', onWheel, { passive: false });
    return () => { window.removeEventListener('wheel', onWheel); clearTimeout(to); };
  }, [goNext, goPrev]);

  const slide = SLIDES[current];
  const displayCurrent = started ? current : 0;

  // Compute chapter question index/total
  let qIdx = 0, qTotal = 0;
  if (slide.type === 'question' && slide.chapter) {
    // Count questions in this chapter
    const chapterSlides = SLIDES.filter(s => s.chapter === slide.chapter && s.type === 'question');
    qTotal = chapterSlides.length;
    qIdx = chapterSlides.findIndex(s => s.title === slide.title);
  }

  const renderSlide = () => {
    switch (slide.type) {
      case 'cover': return <CoverSlide onStart={() => navTo(1)} />;
      case 'philosophy': return <PhilosophySlide title={slide.title!} content={slide.content!} image={slide.image!} />;
      case 'case': return <CaseSlide caseName={slide.caseName!} caseQuote={slide.caseQuote!} image={slide.image!} />;
      case 'transition': return <TransitionSlide title={slide.title!} subtitle={slide.subtitle!} content={slide.content!} />;
      case 'chapter-intro': return <ChapterIntroSlide chapter={slide.chapter!} title={slide.title!} subtitle={slide.subtitle!} image={slide.image!} />;
      case 'question': return <QuestionSlide chapter={slide.chapter} title={slide.title!} guide={slide.guide!} image={slide.image!} questionIndex={qIdx} totalInChapter={qTotal} slideIndex={current} savedAnswer={answers[current]?.transcript} onSaveAnswer={saveAnswer} />;
      case 'review': return <ReviewSlide title={slide.title!} content={slide.content!} answers={answers} />;
      case 'end': return <EndSlide title={slide.title!} subtitle={slide.subtitle!} content={slide.content!} />;
      default: return null;
    }
  };

  // Header labels
  const actLabel = getActLabel(slide.act);
  const slideLabel = getSlideLabel(slide);
  const chapterLabel = slide.chapter ? getChapterLabel(slide.chapter) : '';

  return (
    <div className="relative w-full h-full overflow-hidden" style={{ background: 'var(--bg)' }}>
      {/* Visual effects */}
      <Spotlight />
      <div className="scanlines" />
      <div className="grid-overlay" />
      <div className="fixed inset-0 pointer-events-none z-[1]"
        style={{ background: 'radial-gradient(ellipse 50% 40% at 30% 20%, rgba(198,40,40,0.025) 0%, transparent 70%)' }} />

      {/* Header */}
      <Header
        moduleLabel={actLabel}
        subLabel={chapterLabel || slideLabel}
        onToggleMenu={() => setShowMenu(!showMenu)}
      />

      {/* Navigation Menu */}
      <NavigationMenu isOpen={showMenu} onClose={() => setShowMenu(false)} current={displayCurrent} onNavigate={navTo} />

      {/* Timer */}
      <Timer isRunning={started && slide.type !== 'end'} />

      {/* Main Content */}
      <main className="absolute inset-0 z-10" style={{ top: '48px', bottom: '56px' }}>
        <div
          key={`${displayCurrent}-${slideKey}`}
          className="w-full h-full"
          style={{ animation: 'slideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
        >
          {renderSlide()}
        </div>
      </main>

      {/* Controls */}
      {started && (
        <Controls
          current={displayCurrent}
          total={TOTAL}
          onPrev={goPrev}
          onNext={goNext}
          showNotes={showNotes}
          onToggleNotes={() => setShowNotes(!showNotes)}
          onGoToReview={goToReview}
          answerCount={Object.keys(answers).length}
        />
      )}

      {/* Notes Panel */}
      <NotesPanel
        isOpen={showNotes}
        onClose={() => setShowNotes(false)}
        currentSlide={displayCurrent}
        slideLabel={slideLabel}
        questionText={slide.type === 'question' ? slide.title : undefined}
      />

      {/* Footer */}
      {started && <Footer current={displayCurrent} total={TOTAL} noteCount={noteCount} />}

      {/* Keyboard hint */}
      {started && (
        <div className="fixed bottom-16 left-1/2 -translate-x-1/2 z-30 text-[11px] hidden lg:block tracking-wider" style={{ color: 'var(--text-muted)', opacity: 0.5 }}>
          ← → 翻页 · N 笔记 · M 菜单
        </div>
      )}

      {/* Transition keyframes */}
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(16px) scale(0.985); filter: blur(2px); }
          to { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
        }
      `}</style>
    </div>
  );
}
