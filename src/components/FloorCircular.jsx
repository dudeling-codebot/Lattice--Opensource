import { useState, useMemo } from 'react';
import { FLOORS, FLOOR_DAILY_RECORDS } from '../data/mockData.js';

const SIZE = 132;
const STROKE = 13;
const R = (SIZE - STROKE) / 2 - 2;
const CIRC = 2 * Math.PI * R;

function FloorRing({ floor, kwh, cost, total, focused, selected, onSelect }) {
  const pct = total > 0 ? Math.round((kwh / total) * 100) : 0;
  const dim = selected && !focused ? 0.35 : 1;
  const arc = Math.max(0.035 * CIRC, kwh * (CIRC / Math.max(total, 1)));

  return (
    <button
      onClick={() => onSelect(focused ? null : floor.id)}
      className="flex flex-col items-center gap-2.5 rounded-2xl p-4 border transition-all"
      style={{
        background: focused ? floor.soft : 'var(--surface-2)',
        borderColor: focused ? floor.color : 'var(--border)',
        opacity: dim,
      }}
    >
      <div className="relative" style={{ width: SIZE, height: SIZE }}>
        <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} className="block">
          {/* track */}
          <circle cx={SIZE / 2} cy={SIZE / 2} r={R} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={STROKE} />
          {/* value arc */}
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={R}
            fill="none"
            stroke={floor.color}
            strokeWidth={focused ? STROKE + 2 : STROKE}
            strokeLinecap="round"
            strokeDasharray={`${arc} ${CIRC}`}
            strokeDashoffset={CIRC * 0.25}
            transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
            style={{ transition: 'stroke-dasharray 0.4s ease, stroke-width 0.15s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <p className="text-[24px] font-black leading-none tracking-tight" style={{ color: floor.color }}>{kwh}</p>
          <p className="text-[10px] font-bold text-muted mt-0.5">kWh · {pct}%</p>
        </div>
      </div>

      <div className="w-full text-center">
        <p className="text-[13px] font-extrabold truncate flex items-center justify-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: floor.color }} />
          {floor.name}
        </p>
        <p className="text-[11px] font-mono font-bold mt-0.5" style={{ color: floor.color }}>₹{cost?.toLocaleString('en-IN') ?? cost}</p>
      </div>
    </button>
  );
}

export default function FloorCircular() {
  const [dayIdx, setDayIdx] = useState(FLOOR_DAILY_RECORDS.length - 1);
  const [selectedFloor, setSelectedFloor] = useState(null);

  const days = FLOOR_DAILY_RECORDS;
  const selectedDay = days[dayIdx];
  const total = selectedDay.totalKwh;

  return (
    <div>
      {/* Day selector */}
      <div className="flex gap-1.5 overflow-x-auto pb-3 -mx-1 px-1" style={{ scrollbarWidth: 'thin' }}>
        {days.map((d, i) => {
          const active = i === dayIdx;
          return (
            <button
              key={d.iso}
              onClick={() => setDayIdx(i)}
              className="shrink-0 rounded-xl px-3 py-2 text-center min-w-[70px] transition-all border"
              style={{
                background: active ? 'var(--accent)' : 'var(--surface-2)',
                color: active ? '#fff' : 'var(--text-muted)',
                borderColor: active ? 'var(--accent)' : 'transparent',
              }}
            >
              <p className="text-[11px] font-extrabold leading-none">{d.label}</p>
              <p className="text-[10px] font-mono mt-1 opacity-80">{d.dateLabel}</p>
              <p className="text-[10px] font-bold mt-1">{d.totalKwh} kWh</p>
            </button>
          );
        })}
      </div>

      {/* One distinct circle per floor */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 mt-2">
        {FLOORS.map(floor => (
          <FloorRing
            key={floor.id}
            floor={floor}
            kwh={selectedDay.floors[floor.id].kwh}
            cost={selectedDay.floors[floor.id].cost}
            total={total}
            focused={selectedFloor === floor.id}
            selected={selectedFloor}
            onSelect={setSelectedFloor}
          />
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-xl p-3" style={{ background: 'var(--surface-2)' }}>
        <span className="text-[11px] font-bold text-muted">{selectedDay.label} · {selectedDay.dateLabel}</span>
        <span className="text-[11px] font-mono font-bold" style={{ color: 'var(--accent)' }}>Total ₹{selectedDay.totalCost.toLocaleString('en-IN')}</span>
      </div>

      <p className="text-[11px] text-faint leading-relaxed mt-3">
        One circle per floor — each arc shows that floor's share of the day's total. Tap a circle to focus it.
      </p>
    </div>
  );
}