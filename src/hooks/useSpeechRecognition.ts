import { useState, useRef, useCallback, useEffect } from 'react';

// Web Speech API 类型声明（浏览器原生，无 npm 包）
declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }

  interface SpeechRecognitionEvent extends Event {
    resultIndex: number;
    results: SpeechRecognitionResultList;
  }

  interface SpeechRecognitionErrorEvent extends Event {
    error: string;
  }

  interface SpeechRecognition {
    lang: string;
    continuous: boolean;
    interimResults: boolean;
    maxAlternatives: number;
    onresult: ((event: SpeechRecognitionEvent) => void) | null;
    onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
    onend: (() => void) | null;
    start(): void;
    stop(): void;
  }
}

interface UseSpeechRecognitionReturn {
  supported: boolean;
  isListening: boolean;
  transcript: string;
  interim: string;
  start: () => void;
  stop: () => void;
  reset: () => void;
}

export function useSpeechRecognition(): UseSpeechRecognitionReturn {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interim, setInterim] = useState('');
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const isListeningRef = useRef(false);

  const supported =
    typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  useEffect(() => {
    if (!supported) return;

    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const r: SpeechRecognition = new SR();
    r.lang = 'zh-CN';
    r.continuous = true;
    r.interimResults = true;
    r.maxAlternatives = 1;

    r.onresult = (e: SpeechRecognitionEvent) => {
      let finalText = '';
      let tempText = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const result = e.results[i];
        if (result.isFinal) {
          finalText += result[0].transcript;
        } else {
          tempText += result[0].transcript;
        }
      }
      if (finalText) {
        setTranscript(prev => prev + finalText);
      }
      setInterim(tempText);
    };

    r.onerror = (e: SpeechRecognitionErrorEvent) => {
      if (e.error === 'no-speech' || e.error === 'aborted') {
        return;
      }
      console.warn('Speech recognition error:', e.error);
      if (e.error === 'not-allowed') {
        setIsListening(false);
        isListeningRef.current = false;
      }
    };

    r.onend = () => {
      if (isListeningRef.current) {
        try {
          r.start();
        } catch {
          // 已经在运行或已关闭
        }
      }
    };

    recognitionRef.current = r;

    return () => {
      try {
        r.stop();
      } catch {
        // ignore
      }
    };
  }, [supported]);

  const start = useCallback(() => {
    setTranscript('');
    setInterim('');
    setIsListening(true);
    isListeningRef.current = true;
    try {
      recognitionRef.current?.start();
    } catch {
      // ignore
    }
  }, []);

  const stop = useCallback(() => {
    setIsListening(false);
    isListeningRef.current = false;
    setInterim('');
    try {
      recognitionRef.current?.stop();
    } catch {
      // ignore
    }
  }, []);

  const reset = useCallback(() => {
    setTranscript('');
    setInterim('');
  }, []);

  return { supported, isListening, transcript, interim, start, stop, reset };
}
