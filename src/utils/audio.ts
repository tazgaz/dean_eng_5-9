/**
 * Sound effects synthesizer using Web Audio API and Speech Synthesis for native English pronunciation.
 * Works offline and requires no external asset files.
 */

let audioCtx: AudioContext | null = null;
let isMuted = false;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function toggleAudioMute(): boolean {
  isMuted = !isMuted;
  return isMuted;
}

export function getAudioMuted(): boolean {
  return isMuted;
}

/**
 * Pronounce an English word using the browser's speech synthesis
 */
export function speakWord(word: string): void {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';
    utterance.rate = 0.85; // slightly slower for 5th graders to hear clearly
    utterance.pitch = 1.05;
    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('Speech synthesis not available', err);
  }
}

/**
 * Speak an entire English sentence at a comfortable natural pace
 */
export function speakSentence(sentence: string): void {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  try {
    window.speechSynthesis.cancel();
    const cleanSentence = sentence.replace(/["״]/g, '').trim();
    const utterance = new SpeechSynthesisUtterance(cleanSentence);
    utterance.lang = 'en-US';
    utterance.rate = 0.88; // comfortable cadence for comprehension
    utterance.pitch = 1.02;
    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('Speech synthesis not available', err);
  }
}

/**
 * Speak an English sentence with a clean silent pause where the blank (_____) is,
 * without saying any words or sounds (no "blank", no "mm").
 */
export function speakSentenceWithBlankPause(sentence: string, pauseMs: number = 750): void {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  try {
    window.speechSynthesis.cancel();
    const clean = sentence.replace(/["״]/g, '').trim();
    const parts = clean.split(/_+/);

    if (parts.length <= 1) {
      speakSentence(clean);
      return;
    }

    const firstPart = parts[0].trim();
    const secondPart = parts.slice(1).join(' ').trim();

    if (!firstPart && secondPart) {
      setTimeout(() => {
        speakSentence(secondPart);
      }, pauseMs);
      return;
    }

    if (firstPart && !secondPart) {
      speakSentence(firstPart);
      return;
    }

    const u1 = new SpeechSynthesisUtterance(firstPart);
    u1.lang = 'en-US';
    u1.rate = 0.88;
    u1.pitch = 1.02;

    const u2 = new SpeechSynthesisUtterance(secondPart);
    u2.lang = 'en-US';
    u2.rate = 0.88;
    u2.pitch = 1.02;

    u1.onend = () => {
      setTimeout(() => {
        try {
          window.speechSynthesis.speak(u2);
        } catch (e) {
          console.warn(e);
        }
      }, pauseMs);
    };

    window.speechSynthesis.speak(u1);
  } catch (err) {
    console.warn('Speech synthesis error', err);
  }
}

/**
 * Play a cheerful "Correct!" chime
 */
export function playSoundCorrect(): void {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0.001, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.18, now + idx * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.32);
    });
  } catch (e) {
    console.debug('Audio error', e);
  }
}

/**
 * Play an ascending ladder climb sound
 */
export function playSoundLadder(): void {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const freqs = [330, 392, 440, 523, 587, 659, 784, 880];
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.06);

      gain.gain.setValueAtTime(0.01, now + idx * 0.06);
      gain.gain.linearRampToValueAtTime(0.15, now + idx * 0.06 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.18);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.06);
      osc.stop(now + idx * 0.06 + 0.2);
    });
  } catch (e) {
    console.debug('Audio error', e);
  }
}

/**
 * Play a bubble popping sound
 */
export function playSoundBubble(): void {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.09);
  } catch (e) {
    console.debug('Audio error', e);
  }
}

/**
 * Play a card flip tick
 */
export function playSoundCardFlip(): void {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(600, now + 0.05);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.06);
  } catch (e) {
    console.debug('Audio error', e);
  }
}

/**
 * Play an encouraging soft chime
 */
export function playSoundEncourage(): void {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(350, now + 0.2);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.26);
  } catch (e) {
    console.debug('Audio error', e);
  }
}

/**
 * Play victory fanfare for stage completion
 */
export function playSoundFanfare(): void {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const fanfareNotes = [
      { f: 523.25, t: 0, d: 0.15 },
      { f: 523.25, t: 0.15, d: 0.15 },
      { f: 523.25, t: 0.3, d: 0.15 },
      { f: 659.25, t: 0.45, d: 0.3 },
      { f: 587.33, t: 0.75, d: 0.15 },
      { f: 659.25, t: 0.9, d: 0.15 },
      { f: 783.99, t: 1.05, d: 0.5 },
    ];

    fanfareNotes.forEach((n) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(n.f, now + n.t);

      gain.gain.setValueAtTime(0.001, now + n.t);
      gain.gain.linearRampToValueAtTime(0.2, now + n.t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + n.t + n.d);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + n.t);
      osc.stop(now + n.t + n.d + 0.05);
    });
  } catch (e) {
    console.debug('Audio error', e);
  }
}
