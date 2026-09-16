import { useState, useMemo } from 'react';

// Standard US unweighted 4.0 letter-grade → grade point map.
const GRADE_POINTS: Record<string, number> = {
  'A+': 4.0, 'A': 4.0, 'A-': 3.7,
  'B+': 3.3, 'B': 3.0, 'B-': 2.7,
  'C+': 2.3, 'C': 2.0, 'C-': 1.7,
  'D+': 1.3, 'D': 1.0, 'D-': 0.7,
  'F': 0.0,
};
const GRADE_KEYS = Object.keys(GRADE_POINTS);

interface Course { id: number; name: string; grade: string; credits: number; }

let nextId = 5;

export default function GpaCalculator() {
  const [courses, setCourses] = useState<Course[]>([
    { id: 1, name: 'Course 1', grade: 'A', credits: 3 },
    { id: 2, name: 'Course 2', grade: 'B+', credits: 4 },
    { id: 3, name: 'Course 3', grade: 'A-', credits: 3 },
  ]);

  const { gpa, totalCredits, totalPoints } = useMemo(() => {
    let credits = 0;
    let points = 0;
    for (const c of courses) {
      const cr = Number(c.credits) || 0;
      credits += cr;
      points += (GRADE_POINTS[c.grade] ?? 0) * cr;
    }
    return { gpa: credits > 0 ? points / credits : 0, totalCredits: credits, totalPoints: points };
  }, [courses]);

  const update = (id: number, patch: Partial<Course>) =>
    setCourses((cs) => cs.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  const addRow = () => setCourses((cs) => [...cs, { id: nextId++, name: `Course ${cs.length + 1}`, grade: 'A', credits: 3 }]);
  const removeRow = (id: number) => setCourses((cs) => (cs.length > 1 ? cs.filter((c) => c.id !== id) : cs));

  const band = gpa >= 3.7 ? 'Excellent (First Class / Dean\'s list territory)'
    : gpa >= 3.0 ? 'Good (solid B / upper-second)'
    : gpa >= 2.0 ? 'Satisfactory (C average, passing)'
    : 'Below average. Check your academic standing';

  return (
    <div className="relative not-prose">
      <div className="bg-white border-[2.5px] border-ink-900 rounded-3xl overflow-hidden shadow-sticker">
        <div className="bg-violet-300 border-b-[2.5px] border-ink-900 px-5 sm:px-7 py-4 flex items-center gap-3">
          <span className="text-2xl flex-shrink-0">🎓</span>
          <h2 className="!text-lg sm:!text-xl !my-0 !text-ink-900 font-extrabold" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.02em' }}>GPA Calculator (4.0 scale)</h2>
        </div>

        <div className="p-5 sm:p-7 bg-ink-50">
          {/* Header row */}
          <div className="hidden sm:grid grid-cols-[1fr_120px_100px_40px] gap-3 mb-2 px-1">
            <span className="text-xs font-extrabold uppercase tracking-wider text-ink-500">Course</span>
            <span className="text-xs font-extrabold uppercase tracking-wider text-ink-500">Grade</span>
            <span className="text-xs font-extrabold uppercase tracking-wider text-ink-500">Credits</span>
            <span></span>
          </div>
          <div className="space-y-2">
            {courses.map((c) => (
              <div key={c.id} className="grid grid-cols-[1fr_90px_70px_36px] sm:grid-cols-[1fr_120px_100px_40px] gap-2 sm:gap-3 items-center">
                <input type="text" value={c.name} onChange={(e) => update(c.id, { name: e.target.value })}
                  className="w-full px-3 py-2.5 bg-white border-2 border-ink-900 rounded-xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-violet-300 transition-all" aria-label="Course name" />
                <select value={c.grade} onChange={(e) => update(c.id, { grade: e.target.value })}
                  className="w-full px-2 py-2.5 bg-white border-2 border-ink-900 rounded-xl text-sm font-extrabold focus:outline-none focus:ring-4 focus:ring-violet-300 transition-all" aria-label="Letter grade">
                  {GRADE_KEYS.map((g) => <option key={g} value={g}>{g} ({GRADE_POINTS[g].toFixed(1)})</option>)}
                </select>
                <input type="number" min={0} max={12} step={0.5} value={c.credits} onChange={(e) => update(c.id, { credits: Math.max(0, Number(e.target.value) || 0) })}
                  className="w-full px-2 py-2.5 bg-white border-2 border-ink-900 rounded-xl text-sm font-bold text-center focus:outline-none focus:ring-4 focus:ring-lime-accent transition-all" inputMode="decimal" aria-label="Credit hours" />
                <button type="button" onClick={() => removeRow(c.id)} className="w-9 h-9 flex items-center justify-center rounded-xl border-2 border-ink-900 bg-white hover:bg-pink-accent text-ink-900 font-extrabold transition-colors" aria-label="Remove course">×</button>
              </div>
            ))}
          </div>
          <button type="button" onClick={addRow} className="mt-4 px-4 py-2.5 rounded-xl border-2 border-ink-900 bg-white hover:bg-lime-accent text-ink-900 text-sm font-extrabold transition-colors shadow-sticker-sm">+ Add course</button>
        </div>

        {/* Result */}
        <div className="p-5 sm:p-7 bg-white border-t-[2.5px] border-ink-900">
          <div className="bg-violet-300 border-[2.5px] border-ink-900 rounded-2xl p-5 sm:p-6 shadow-sticker-sm grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
            <div>
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-900 mb-1">Your GPA</div>
              <div className="text-5xl sm:text-6xl font-extrabold text-ink-900 leading-none" style={{ fontFamily: 'Inter Tight', letterSpacing: '-0.04em' }}>{gpa.toFixed(2)}</div>
            </div>
            <div className="sm:col-span-2">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-900 mb-1">{totalCredits} credit hours · {totalPoints.toFixed(1)} grade points</div>
              <p className="text-sm text-ink-900 font-bold !m-0">{band}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="text-xs text-ink-500 mt-3 px-1 font-bold">✨ Live · Unweighted 4.0 scale (A/A+ = 4.0). Honors/AP weighting and A+ = 4.3 vary by school. Check your transcript key.</div>
    </div>
  );
}
