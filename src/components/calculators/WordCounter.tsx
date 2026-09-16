import { useState, useMemo } from 'react';

const SAMPLE = 'Paste or type your text here. This tool counts words, characters, sentences and paragraphs as you type, and estimates how long the text takes to read and to say aloud.';

export default function WordCounter() {
  const [text, setText] = useState(SAMPLE);

  const stats = useMemo(() => {
    const trimmed = text.trim();
    const words = trimmed ? trimmed.split(/\s+/).filter(Boolean).length : 0;
    const chars = text.length;
    const charsNoSpaces = text.replace(/\s/g, '').length;
    const sentences = trimmed ? (trimmed.match(/[^.!?]+[.!?]+/g)?.length ?? (trimmed ? 1 : 0)) : 0;
    const paragraphs = trimmed ? trimmed.split(/\n+/).filter((p) => p.trim().length).length : 0;
    const readMin = words / 200;   // ~200 wpm silent reading
    const speakMin = words / 130;  // ~130 wpm speaking
    return { words, chars, charsNoSpaces, sentences, paragraphs, readMin, speakMin };
  }, [text]);

  const fmtTime = (min: number) => {
    if (min < 1) return `${Math.max(1, Math.round(min * 60))} sec`;
    const m = Math.floor(min);
    const s = Math.round((min - m) * 60);
    return s >= 30 ? `${m + 1} min` : `${m} min`;
  };

  const tiles = [
    { label: 'Words', value: stats.words.toLocaleString(), color: 'bg-lime-accent' },
    { label: 'Characters', value: stats.chars.toLocaleString(), color: 'bg-cyan-accent' },
    { label: 'Characters (no spaces)', value: stats.charsNoSpaces.toLocaleString(), color: 'bg-yellow-accent' },
    { label: 'Sentences', value: stats.sentences.toLocaleString(), color: 'bg-violet-300' },
    { label: 'Paragraphs', value: stats.paragraphs.toLocaleString(), color: 'bg-white' },
    { label: 'Reading time', value: fmtTime(stats.readMin), color: 'bg-white' },
  ];

  return (
    <div className="relative not-prose">
      <div className="bg-white border-[2.5px] border-ink-900 rounded-3xl overflow-hidden shadow-sticker">
        <div className="bg-lime-accent border-b-[2.5px] border-ink-900 px-5 sm:px-7 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3"><span className="text-2xl">📝</span>
            <h2 className="!text-lg sm:!text-xl !my-0 !text-ink-900 font-extrabold" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.02em' }}>Word Counter</h2>
          </div>
          <button type="button" onClick={() => setText('')} className="px-3 py-1.5 rounded-full border-2 border-ink-900 bg-white hover:bg-pink-accent hover:text-white text-ink-900 text-xs font-extrabold transition-colors">Clear</button>
        </div>

        <div className="p-5 sm:p-7 bg-ink-50">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={8}
            placeholder="Type or paste your text…"
            className="w-full px-4 py-3 bg-white border-[2.5px] border-ink-900 rounded-2xl text-base font-medium text-ink-900 focus:outline-none focus:ring-4 focus:ring-lime-accent transition-all resize-y"
            aria-label="Text to count"
          />
        </div>

        <div className="p-5 sm:p-7 bg-white border-t-[2.5px] border-ink-900">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {tiles.map((t) => (
              <div key={t.label} className={`${t.color} border-[2.5px] border-ink-900 rounded-2xl p-4 shadow-sticker-sm`}>
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-700 mb-1">{t.label}</div>
                <div className="text-2xl sm:text-3xl font-extrabold text-ink-900 leading-none tabular-nums" style={{ fontFamily: 'Inter Tight' }}>{t.value}</div>
              </div>
            ))}
          </div>
          <p className="text-xs text-ink-600 mt-4 font-semibold">Speaking time ≈ {fmtTime(stats.speakMin)} at 130 words per minute.</p>
        </div>
      </div>
      <div className="text-xs text-ink-500 mt-3 px-1 font-bold">✨ Live · Counts update as you type. Nothing is uploaded. Everything runs in your browser.</div>
    </div>
  );
}
