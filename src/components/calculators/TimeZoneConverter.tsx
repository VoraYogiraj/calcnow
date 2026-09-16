import { useState, useEffect, useMemo } from 'react';

interface Zone { id: string; label: string; abbr: string; }

// Curated list of the most-searched time zones (IANA ids → friendly labels).
const ZONES: Zone[] = [
  { id: 'Pacific/Honolulu', label: 'Honolulu', abbr: 'HST' },
  { id: 'America/Los_Angeles', label: 'Los Angeles', abbr: 'PT' },
  { id: 'America/Denver', label: 'Denver', abbr: 'MT' },
  { id: 'America/Chicago', label: 'Chicago', abbr: 'CT' },
  { id: 'America/New_York', label: 'New York', abbr: 'ET' },
  { id: 'America/Sao_Paulo', label: 'São Paulo', abbr: 'BRT' },
  { id: 'UTC', label: 'UTC', abbr: 'UTC' },
  { id: 'Europe/London', label: 'London', abbr: 'GMT/BST' },
  { id: 'Europe/Paris', label: 'Paris', abbr: 'CET' },
  { id: 'Europe/Berlin', label: 'Berlin', abbr: 'CET' },
  { id: 'Europe/Moscow', label: 'Moscow', abbr: 'MSK' },
  { id: 'Asia/Dubai', label: 'Dubai', abbr: 'GST' },
  { id: 'Asia/Karachi', label: 'Karachi', abbr: 'PKT' },
  { id: 'Asia/Kolkata', label: 'India (IST)', abbr: 'IST' },
  { id: 'Asia/Dhaka', label: 'Dhaka', abbr: 'BST' },
  { id: 'Asia/Bangkok', label: 'Bangkok', abbr: 'ICT' },
  { id: 'Asia/Singapore', label: 'Singapore', abbr: 'SGT' },
  { id: 'Asia/Hong_Kong', label: 'Hong Kong', abbr: 'HKT' },
  { id: 'Asia/Shanghai', label: 'Beijing / Shanghai', abbr: 'CST' },
  { id: 'Asia/Tokyo', label: 'Tokyo', abbr: 'JST' },
  { id: 'Asia/Seoul', label: 'Seoul', abbr: 'KST' },
  { id: 'Australia/Sydney', label: 'Sydney', abbr: 'AEST/AEDT' },
  { id: 'Pacific/Auckland', label: 'Auckland', abbr: 'NZST/NZDT' },
];

// Offset (ms) of a zone at a given UTC instant — DST-aware via Intl.
function zoneOffset(utcMs: number, tz: string): number {
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone: tz, hour12: false,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  });
  const parts = dtf.formatToParts(new Date(utcMs));
  const m: Record<string, string> = {};
  for (const p of parts) m[p.type] = p.value;
  const hour = m.hour === '24' ? '00' : m.hour;
  const asUTC = Date.UTC(+m.year, +m.month - 1, +m.day, +hour, +m.minute, +m.second);
  return asUTC - utcMs;
}

// Convert a wall-clock time in `fromTz` to the UTC instant it represents.
function wallTimeToInstant(y: number, mo: number, d: number, h: number, mi: number, fromTz: string): number {
  const guess = Date.UTC(y, mo - 1, d, h, mi);
  const off = zoneOffset(guess, fromTz);
  return guess - off;
}

function fmtInZone(instant: number, tz: string) {
  const date = new Intl.DateTimeFormat('en-US', { timeZone: tz, weekday: 'short', month: 'short', day: 'numeric' }).format(instant);
  const time = new Intl.DateTimeFormat('en-US', { timeZone: tz, hour: 'numeric', minute: '2-digit', hour12: true }).format(instant);
  return { date, time };
}

export default function TimeZoneConverter() {
  const [fromTz, setFromTz] = useState('America/New_York');
  const [toTz, setToTz] = useState('Asia/Kolkata');
  // datetime-local value "YYYY-MM-DDTHH:mm" interpreted as wall time in fromTz.
  const [dt, setDt] = useState('');
  const [now, setNow] = useState(() => Date.now());

  // Initialize the input to the current wall time in the default from-zone.
  useEffect(() => {
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: fromTz, hour12: false,
      year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit',
    }).formatToParts(new Date());
    const m: Record<string, string> = {};
    for (const p of parts) m[p.type] = p.value;
    setDt(`${m.year}-${m.month}-${m.day}T${m.hour === '24' ? '00' : m.hour}:${m.minute}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const result = useMemo(() => {
    if (!dt) return null;
    const [datePart, timePart] = dt.split('T');
    if (!datePart || !timePart) return null;
    const [y, mo, d] = datePart.split('-').map(Number);
    const [h, mi] = timePart.split(':').map(Number);
    const instant = wallTimeToInstant(y, mo, d, h, mi, fromTz);
    const out = fmtInZone(instant, toTz);
    // Offset difference in hours between the two zones at this instant.
    const diffMs = zoneOffset(instant, toTz) - zoneOffset(instant, fromTz);
    const diffH = diffMs / 3600000;
    return { out, diffH };
  }, [dt, fromTz, toTz]);

  const fromZone = ZONES.find((z) => z.id === fromTz)!;
  const toZone = ZONES.find((z) => z.id === toTz)!;
  const nowFrom = fmtInZone(now, fromTz);
  const nowTo = fmtInZone(now, toTz);

  const diffLabel = result
    ? result.diffH === 0
      ? 'same time'
      : `${Math.abs(result.diffH)} ${Math.abs(result.diffH) === 1 ? 'hour' : 'hours'} ${result.diffH > 0 ? 'ahead' : 'behind'}`
    : '';

  const zoneSelect = (value: string, onChange: (v: string) => void, label: string, ring: string) => (
    <div>
      <label className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className={`w-full px-3 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 ${ring} transition-all`}>
        {ZONES.map((z) => <option key={z.id} value={z.id}>{z.label} ({z.abbr})</option>)}
      </select>
    </div>
  );

  return (
    <div className="relative not-prose">
      <div className="bg-white border-[2.5px] border-ink-900 rounded-3xl overflow-hidden shadow-sticker">
        <div className="bg-sky-300 border-b-[2.5px] border-ink-900 px-5 sm:px-7 py-4 flex items-center gap-3">
          <span className="text-2xl flex-shrink-0">🌐</span>
          <h2 className="!text-lg sm:!text-xl !my-0 !text-ink-900 font-extrabold" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.02em' }}>Time Zone Converter</h2>
        </div>

        <div className="p-5 sm:p-7 bg-ink-50">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {zoneSelect(fromTz, setFromTz, 'From zone', 'focus:ring-cyan-accent')}
            {zoneSelect(toTz, setToTz, 'To zone', 'focus:ring-lime-accent')}
          </div>
          <div className="mt-4">
            <label htmlFor="tz-dt" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Date & time in {fromZone.label}</label>
            <input id="tz-dt" type="datetime-local" value={dt} onChange={(e) => setDt(e.target.value)}
              className="w-full px-3.5 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-sky-300 transition-all" />
          </div>
        </div>

        <div className="p-5 sm:p-7 bg-white border-t-[2.5px] border-ink-900">
          {result ? (
            <div className="bg-sky-300 border-[2.5px] border-ink-900 rounded-2xl p-5 sm:p-6 shadow-sticker-sm">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-900 mb-1">{fromZone.label} → {toZone.label}</div>
              <div className="text-3xl sm:text-4xl font-extrabold text-ink-900 leading-tight" style={{ fontFamily: 'Inter Tight', letterSpacing: '-0.03em' }}>{result.out.time}</div>
              <div className="text-sm text-ink-900 font-bold mt-1">{result.out.date} · {toZone.label} is {diffLabel} of {fromZone.label}</div>
            </div>
          ) : (
            <div className="text-ink-600 font-bold">Pick a date and time to convert.</div>
          )}

          <div className="grid grid-cols-2 gap-3 mt-5">
            <div className="bg-ink-50 border-2 border-ink-200 rounded-xl p-3">
              <div className="text-[10px] font-bold text-ink-500 uppercase">Now in {fromZone.label}</div>
              <div className="text-lg font-extrabold text-ink-900 tabular-nums">{nowFrom.time}</div>
              <div className="text-xs text-ink-600 font-semibold">{nowFrom.date}</div>
            </div>
            <div className="bg-ink-50 border-2 border-ink-200 rounded-xl p-3">
              <div className="text-[10px] font-bold text-ink-500 uppercase">Now in {toZone.label}</div>
              <div className="text-lg font-extrabold text-ink-900 tabular-nums">{nowTo.time}</div>
              <div className="text-xs text-ink-600 font-semibold">{nowTo.date}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="text-xs text-ink-500 mt-3 px-1 font-bold">✨ Live · Uses your browser's time-zone database, so daylight saving (DST) is handled automatically for the selected date.</div>
    </div>
  );
}
