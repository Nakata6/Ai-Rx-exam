'use client';
import { useState, useCallback } from 'react';

export function useSpeech() {
  const [ttsEnabled, setTtsEnabled] = useState(false);

  const speakText = useCallback((text: string) => {
    if (!ttsEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const u  = new SpeechSynthesisUtterance(text);
    u.lang   = 'en-US';
    u.rate   = 0.9;
    window.speechSynthesis.speak(u);
  }, [ttsEnabled]);

  return { ttsEnabled, setTtsEnabled, speakText };
}
