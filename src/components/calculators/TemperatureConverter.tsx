import { useState } from 'react';

// Celsius is the single source of truth; the other scales derive from it.
const round = (n: number) => Number(n.toFixed(2));

export default function TemperatureConverter() {
  const [celsius, setCelsius] = useState<number>(37);

  const f = round(celsius * 9 / 5 + 32);
  const k = round(celsius + 273.15);

  const setFromF = (val: number) => setCelsius(round((val - 32) * 5 / 9));
  const setFromK = (val: number) => setCelsius(round(val - 273.15));

  const note = celsius <= 0 ? 'At or below water\'s freezing point (0 °C).'
    : celsius >= 100 ? 'At or above water\'s boiling point (100 °C at sea level).'
    : Math.abs(celsius - 37) < 0.6 ? 'Around normal human body temperature (37 °C / 98.6 °F).'
    : celsius >= 38 && celsius < 42 ? 'Fever range for humans (38 °C+ / 100.4 °F+).'
    : 'Comfortable, everyday temperature range.';

  const box = 'w-full px-3.5 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-lg font-extrabold focus:outline-none transition-all';

  return (
    <div className="relative not-prose">
      <div className="bg-white border-[2.5px] border-ink-900 rounded-3xl overflow-hidden shadow-sticker">
        <div className="bg-cyan-accent border-b-[2.5px] border-ink-900 px-5 sm:px-7 py-4 flex items-center gap-3">
          <span className="text-2xl flex-shrink-0">🌡️</span>
          <h2 className="!text-lg sm:!text-xl !my-0 !text-ink-900 font-extrabold" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.02em' }}>Temperature Converter</h2>
        </div>

        <div className="p-5 sm:p-7 bg-ink-50 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="tc-c" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Celsius (°C)</label>
            <input id="tc-c" type="number" value={celsius} onChange={(e) => setCelsius(Number(e.target.value) || 0)} className={`${box} focus:ring-4 focus:ring-cyan-accent`} inputMode="decimal" />
          </div>
          <div>
            <label htmlFor="tc-f" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Fahrenheit (°F)</label>
            <input id="tc-f" type="number" value={f} onChange={(e) => setFromF(Number(e.target.value) || 0)} className={`${box} focus:ring-4 focus:ring-yellow-accent`} inputMode="decimal" />
          </div>
          <div>
            <label htmlFor="tc-k" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Kelvin (K)</label>
            <input id="tc-k" type="number" value={k} onChange={(e) => setFromK(Number(e.target.value) || 0)} className={`${box} focus:ring-4 focus:ring-lime-accent`} inputMode="decimal" />
          </div>
        </div>

        <div className="p-5 sm:p-7 bg-white border-t-[2.5px] border-ink-900">
          <div className="bg-cyan-accent border-[2.5px] border-ink-900 rounded-2xl p-5 sm:p-6 shadow-sticker-sm">
            <div className="text-2xl sm:text-3xl font-extrabold text-ink-900 leading-tight" style={{ fontFamily: 'Inter Tight' }}>
              {round(celsius)} °C = {f} °F = {k} K
            </div>
            <p className="text-sm text-ink-900 font-bold mt-2 !m-0">{note}</p>
          </div>
        </div>
      </div>
      <div className="text-xs text-ink-500 mt-3 px-1 font-bold">✨ Live · Type in any field and the other two update. °F = °C × 9/5 + 32 · K = °C + 273.15</div>
    </div>
  );
}
