import { useState, useEffect, useRef, useCallback } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';

interface Props {
  chapter?: string;
  title: string;
  guide: string;
  image: string;
  questionIndex: number;
  totalInChapter: number;
  slideIndex: number;
  savedAnswer?: string;
  onSaveAnswer: (slideIndex: number, transcript: string) => void;
}

export default function QuestionSlide({
  chapter,
  title,
  guide,
  image,
  questionIndex,
  totalInChapter,
  slideIndex,
  savedAnswer,
  onSaveAnswer,
}: Props) {
  const { supported, isListening, transcript, interim, start, stop } = useSpeechRecognition();
  const [text, setText] = useState(savedAnswer || '');
  const [saveStatus, setSaveStatus] = useState('');
  const saveTimer = useRef<ReturnType<typeof setTimeout>>(null);

  // 当 savedAnswer 从父组件更新时（如翻页回来），同步到本地
  useEffect(() => {
    if (!isListening) {
      setText(savedAnswer || '');
    }
  }, [savedAnswer, isListening]);

  // 自动保存
  const autoSave = useCallback((value: string) => {
    onSaveAnswer(slideIndex, value);
    setSaveStatus('已保存');
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => setSaveStatus(''), 2000);
  }, [slideIndex, onSaveAnswer]);

  // 停止录音时自动保存
  useEffect(() => {
    if (!isListening && transcript) {
      const final = transcript.trim();
      if (final) {
        setText(final);
        autoSave(final);
      }
    }
  }, [isListening, transcript, autoSave]);

  // 组件卸载时保存
  useEffect(() => {
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, []);

  const handleToggleRecording = () => {
    if (isListening) {
      stop();
    } else {
      setText('');
      start();
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setText(val);
    autoSave(val);
  };

  const displayText = isListening ? transcript + interim : text;
  const statusText = isListening
    ? interim || '正在聆听，请说话…'
    : saveStatus || (supported ? '点击麦克风开始录音，或手动输入' : '当前浏览器不支持语音输入，请手动输入');

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
            className="display-large mb-8 leading-[1.1]"
            style={{ fontSize: 'clamp(26px, 5vw, 52px)' }}
          >
            {title}
          </h2>

          {/* Guide */}
          <div className="pl-5 border-l-2 border-[var(--border-light)] max-w-xl mb-8">
            <p className="text-sm md:text-[15px] leading-[1.8] text-[var(--text-secondary)]">
              {guide}
            </p>
          </div>

          {/* Recording area */}
          <div className="max-w-xl">
            {/* Mic button + status */}
            <div className="flex items-center gap-4 mb-3">
              {supported && (
                <button
                  onClick={handleToggleRecording}
                  className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isListening
                      ? 'bg-red-600 recorder-pulse'
                      : 'bg-[var(--border-light)] hover:bg-[var(--border)]'
                  }`}
                  title={isListening ? '停止录音' : '开始录音'}
                >
                  {isListening ? (
                    <MicOff size={18} className="text-white" />
                  ) : (
                    <Mic size={18} className="text-[var(--text-secondary)]" />
                  )}
                </button>
              )}
              <span className="text-[12px] text-[var(--text-muted)]">
                {statusText}
              </span>
            </div>

            {/* Text area */}
            <div
              className="border border-[var(--border)] rounded-sm p-4 transition-colors"
              style={{ background: isListening ? 'rgba(198,40,40,0.03)' : 'var(--bg-card)' }}
            >
              <textarea
                className="w-full bg-transparent text-[14px] leading-relaxed text-[var(--text-secondary)] outline-none resize-none scrollbar-thin"
                rows={4}
                value={displayText}
                onChange={handleTextChange}
                placeholder={supported ? '客户回答将显示在这里，录音或手动输入均可…' : '请手动输入客户回答…'}
                readOnly={isListening}
              />
              {isListening && interim && (
                <div className="mt-2 text-[12px] text-[var(--accent)] animate-pulse">
                  {interim}
                </div>
              )}
            </div>

            {/* Privacy hint */}
            <p className="mt-2 text-[10px] text-[var(--text-muted)]">
              文字仅保存在本地浏览器，不会上传至任何服务器
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
