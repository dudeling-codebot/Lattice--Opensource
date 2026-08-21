import { useState } from 'react';
import { Sun, Battery, Plug, Home, Droplets, Flame, Cable, BarChart3 } from 'lucide-react';

const TABS = ['Summary', 'Electricity', 'Gas', 'Water', 'Now'];

const ELEC_BARS = [
  { grid: 0.42, solar: 0, ret: 0 },
  { grid: 0.55, solar: 0, ret: 0 },
  { grid: 0.47, solar: 0, ret: 0 },
  { grid: 0.16, solar: 0, ret: 0 },
  { grid: 0.52, solar: 0, ret: 0 },
  { grid: 0.11, solar: 0, ret: 0 },
  { grid: 0.28, solar: 0, ret: 0 },
  { grid: 0.66, solar: 0, ret: 0 },
  { grid: 0.54, solar: 0.08, ret: 0 },
  { grid: 0.41, solar: 0.27, ret: 0 },
  { grid: 0.31, solar: 0.19, ret: -0.09 },
  { grid: 0.52, solar: 0.27, ret: -0.04 },
  { grid: 0.72, solar: 0.78, ret: -0.04 },
  { grid: 0.18, solar: 1.40, ret: -0.11 },
  { grid: 0.09, solar: 0.81, ret: -0.54 },
  { grid: 0.05, solar: 0.47, ret: -0.45 },
  { grid: 0.19, solar: 1.52, ret: -0.25 },
  { grid: 0, solar: 0, ret: 0 },
];

const SOLAR_BARS = [0, 0, 0, 0.12, 0.28, 1.47, 1.36, 1.78, 0.92, 0.55, 0.35, 0.18];

function ElectricityChart() {
  const w = 680, h = 220, padL = 36, padR = 12, padT = 16, padB = 28;
  const maxY = 2.0, minY = -1.0;
  const y = v => padT + (maxY - v) / (maxY - minY) * (h - padT - padB);
  const y0 = y(0);
  const bw = (w - padL - padR) / ELEC_BARS.length - 6;
  const xLabels = ['Aug 20', '3:30 PM', '7:30 PM', '11:30 PM', '3:30 AM', '7:30 AM'];
  return (
    <div>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-[240px] block">
        {[2.0, 1.5, 1.0, 0.5, 0, -0.5].map(v => (
          <g key={v}>
            <line x1={padL} x2={w - padR} y1={y(v)} y2={y(v)} stroke="var(--border)" strokeWidth="0.6" />
            <text x={padL - 6} y={y(v) + 3} fontSize="9" fill="var(--text-faint)" textAnchor="end">{v.toFixed(1)}</text>
          </g>
        ))}
        <text x={padL - 6} y={padT - 4} fontSize="8" fill="var(--text-faint)">kWh</text>
        {ELEC_BARS.map((b, i) => {
          const x = padL + i * ((w - padL - padR) / ELEC_BARS.length) + 3;
          const gridH = Math.abs(b.grid / (maxY - minY) * (h - padT - padB));
          const solarH = Math.abs(b.solar / (maxY - minY) * (h - padT - padB));
          const retH = Math.abs(b.ret / (maxY - minY) * (h - padT - padB));
          return (
            <g key={i}>
              {b.grid > 0 && <rect x={x} y={y(b.grid)} width={bw} height={gridH} fill="#93C5E8" rx="3" />}
              {b.solar > 0 && <rect x={x} y={y(b.grid + b.solar)} width={bw} height={solarH} fill="#FCD08A" rx="3" />}
              {b.ret < 0 && <rect x={x} y={y0} width={bw} height={retH} fill="#A99BC7" rx="3" />}
              {b.ret < 0 && b.ret < -0.25 && <rect x={x} y={y0 + retH} width={bw} height={4} fill="#7C6FAD" rx="2" />}
            </g>
          );
        })}
        <line x1={padL} x2={w - padR} y1={y0} y2={y0} stroke="var(--text-faint)" strokeWidth="0.9" />
        {xLabels.map((l, i) => {
          const x = padL + i * ((w - padL - padR) / (xLabels.length - 1));
          return <text key={l} x={x} y={h - 6} fontSize="9" fill="var(--text-faint)" textAnchor={i === 0 ? 'start' : i === xLabels.length - 1 ? 'end' : 'middle'}>{l}</text>;
        })}
      </svg>
      <div className="flex flex-wrap gap-3 justify-center text-[10px] text-faint mt-1">
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm" style={{ background: '#FCD08A' }} />Solar</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm" style={{ background: '#93C5E8' }} />Grid consumption low tariff</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm" style={{ background: '#A99BC7' }} />Returned to grid</span>
      </div>
    </div>
  );
}

function SolarChart() {
  const w = 680, h = 200, padL = 32, padR = 12, padT = 16, padB = 28;
  const maxY = 1.8;
  const y = v => h - padB - (v / maxY) * (h - padT - padB);
  const bw = (w - padL - padR) / SOLAR_BARS.length - 8;
  const xLabels = ['Aug 20', '3:30 PM', '7:30 PM', '11:30 PM', '3:30 AM', '7:30 AM'];
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-[220px] block">
      {[1.5, 1.2, 0.9, 0.6, 0.3].map(v => (
        <g key={v}>
          <line x1={padL} x2={w - padR} y1={y(v)} y2={y(v)} stroke="var(--border)" strokeWidth="0.6" />
          <text x={padL - 6} y={y(v) + 3} fontSize="9" fill="var(--text-faint)" textAnchor="end">{v.toFixed(1)}</text>
        </g>
      ))}
      <text x={padL - 6} y={padT - 4} fontSize="8" fill="var(--text-faint)">kWh</text>
      {SOLAR_BARS.map((v, i) => {
        const x = padL + i * ((w - padL - padR) / SOLAR_BARS.length) + 4;
        const hh = (v / maxY) * (h - padT - padB);
        return <rect key={i} x={x} y={y(v)} width={bw} height={hh} fill="#FCD08A" stroke="#F59E0B" strokeWidth="0.6" rx="3" />;
      })}
      <path
        d={`M ${padL + 4} ${y(0.05)} C ${padL + 80} ${y(0.3)}, ${w * 0.42} ${y(1.25)}, ${w * 0.62} ${y(1.35)} S ${w * 0.82} ${y(0.7)}, ${w - padR - 10} ${y(0.08)}`}
        fill="none" stroke="#111827" strokeWidth="1.1" strokeDasharray="5 4"
      />
      {xLabels.map((l, i) => {
        const x = padL + i * ((w - padL - padR) / (xLabels.length - 1));
        return <text key={l} x={x} y={h - 6} fontSize="9" fill="var(--text-faint)" textAnchor={i === 0 ? 'start' : i === xLabels.length - 1 ? 'end' : 'middle'}>{l}</text>;
      })}
    </svg>
  );
}

function EnergyDistribution() {
  return (
    <div className="card p-5">
      <p className="font-bold text-[15px] mb-3">Energy distribution</p>
      <div className="relative h-[240px] flex items-center justify-center overflow-hidden">
        <div className="absolute w-[88px] h-[88px] rounded-full border-2 flex flex-col items-center justify-center bg-white shadow-sm" style={{ borderColor: '#F59E0B', left: '38%', top: 12 }}>
          <span className="text-[9px] text-faint">Solar</span><span className="text-[10px] font-bold">6.86 kWh</span>
        </div>
        <div className="absolute w-[78px] h-[78px] rounded-full border-2 flex flex-col items-center justify-center bg-white shadow-sm" style={{ borderColor: '#7C2D12', right: 12, top: 28 }}>
          <span className="text-[9px] text-faint">Gas</span><span className="text-[10px] font-bold">0 m³</span>
        </div>
        <div className="absolute w-[86px] h-[86px] rounded-full border-2 flex flex-col items-center justify-center bg-white shadow-sm" style={{ borderColor: '#F59E0B', right: 24, top: 102 }}>
          <span className="text-[11px] font-bold">10.9 kWh</span><Home className="w-3.5 h-3.5 mt-0.5" />
        </div>
        <div className="absolute w-[70px] h-[70px] rounded-full border-2 flex flex-col items-center justify-center bg-white shadow-sm" style={{ borderColor: '#06B6D4', right: 28, bottom: 10 }}>
          <span className="text-[10px] font-bold">0 L</span><span className="text-[9px] text-faint">Water</span>
        </div>
        <div className="absolute w-[76px] h-[76px] rounded-full border-2 flex flex-col items-center justify-center bg-white shadow-sm" style={{ borderColor: '#14B8A6', left: '42%', bottom: 16 }}>
          <span className="text-[9px] text-faint">Battery</span><span className="text-[9px] font-bold">↓ 0 kWh</span><span className="text-[9px] font-bold">↑ 0 kWh</span>
        </div>
        <div className="absolute w-[84px] h-[84px] rounded-full border-2 flex flex-col items-center justify-center bg-white shadow-sm" style={{ borderColor: '#3B82F6', left: 6, top: 70 }}>
          <span className="text-[9px] font-bold">← 1.35 kWh</span><span className="text-[9px] font-bold">→ 5.4 kWh</span><span className="text-[9px] text-faint">Grid</span>
        </div>
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 320 240">
          <path d="M 42 112 Q 90 112 90 80" fill="none" stroke="#A78BFA" strokeWidth="1.2" />
          <path d="M 42 118 Q 110 118 110 170" fill="none" stroke="#111827" strokeWidth="1" />
          <path d="M 140 58 Q 140 110 220 110" fill="none" stroke="#F59E0B" strokeWidth="1.1" />
        </svg>
      </div>
      <div className="mt-2 p-3 rounded-xl" style={{ background: 'var(--surface-2)' }}>
        <p className="text-[12px] font-bold flex items-center gap-2">Grid energy balance</p>
        <p className="text-[11px] text-faint">5.4 kWh - 1.35 kWh = 4.05 kWh</p>
        <div className="h-6 rounded-full overflow-hidden flex mt-2" style={{ background: 'var(--border)' }}>
          <div style={{ width: '58%', background: '#93C5E8' }} />
          <div style={{ width: '18%', background: '#C9B6E4' }} />
        </div>
      </div>
    </div>
  );
}

export default function PowerSources() {
  const [tab, setTab] = useState('Electricity');
  return (
    <div className="max-w-6xl mx-auto pb-6">
      <div className="mb-4">
        <h1 className="text-2xl font-extrabold tracking-tight flex items-center gap-2"><Cable className="w-6 h-6" style={{ color: '#0891B2' }} /> Power sources</h1>
        <p className="text-[13px] text-muted mt-1">Replaces Solar — Sankey + HA-style Energy. Inspired by your screenshots.</p>
      </div>

      <div className="flex items-center gap-1 border-b mb-4 overflow-x-auto" style={{ borderColor: 'var(--border)' }}>
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-[13px] font-bold whitespace-nowrap border-b-2 -mb-px ${tab === t ? 'border-[var(--accent)] text-[var(--text)]' : 'border-transparent text-muted'}`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'Electricity' && (
        <div className="grid lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">
            <div className="card p-5">
              <div className="flex items-center justify-between mb-2">
                <p className="font-bold text-[16px]">Electricity</p>
                <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-full border" style={{ borderColor: 'var(--border)', background: 'var(--surface-2)' }}>10.91 kWh</span>
              </div>
              <ElectricityChart />
            </div>
            <div className="card p-5">
              <div className="flex items-center justify-between mb-2">
                <p className="font-bold text-[16px]">Solar production</p>
                <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-full border" style={{ borderColor: 'var(--border)', background: 'var(--surface-2)' }}>6.86 kWh</span>
              </div>
              <SolarChart />
            </div>
          </div>
          <div className="space-y-4">
            <EnergyDistribution />
            <div className="grid grid-cols-2 gap-3">
              <div className="card p-4 text-center">
                <div className="w-20 h-20 mx-auto rounded-full border-[8px] flex items-center justify-center" style={{ borderColor: '#3B82F6', borderRightColor: '#A78BFA', borderBottomColor: '#E5E7EB', transform: 'rotate(-90deg)' }}><span className="text-[12px] font-black" style={{ transform: 'rotate(90deg)' }}>4.05 kWh</span></div>
                <p className="text-[11px] font-bold mt-2">Net imported from the grid</p>
              </div>
              <div className="card p-4 text-center">
                <div className="w-20 h-20 mx-auto rounded-full border-[8px] flex items-center justify-center" style={{ borderColor: '#22C55E', borderRightColor: '#E5E7EB', borderBottomColor: '#E5E7EB', borderLeftColor: '#E5E7EB', transform: 'rotate(-90deg)' }}><span className="text-[13px] font-black" style={{ transform: 'rotate(90deg)' }}>80%</span></div>
                <p className="text-[11px] font-bold mt-2">Self-consumed solar energy</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab !== 'Electricity' && (
        <div className="card p-8 text-center">
          <BarChart3 className="w-8 h-8 mx-auto text-muted mb-3" />
          <p className="font-bold">Power sources — {tab}</p>
          <p className="text-[13px] text-muted mt-1">Electricity tab is finished as per your screenshot. {tab} uses same data — switch to Electricity to see the design.</p>
          <button onClick={() => setTab('Electricity')} className="btn btn-primary mt-4">Open Electricity</button>
        </div>
      )}
    </div>
  );
}
