import { useOutletContext, Link } from 'react-router-dom';
import { Bolt, Zap, Power, ChevronRight, Home } from 'lucide-react';
import { useEnergy } from '../context/EnergyContext.jsx';
import { mockHome, dailyProfile } from '../data/mockData.js';

export default function Dashboard() {
  const { pro, activeColor } = useOutletContext();
  const { devices, paused, setPaused, toggleDevice, totalWatts, totalToday, totalMonth } = useEnergy();

  const onDevices = devices.filter(d => d.status === 'on');
  const offDevices = devices.filter(d => d.status !== 'on');
  const hours = Array.from({ length: 24 }, (_, i) => {
    const sum = devices.reduce((s, d) => s + (dailyProfile(d, i * 7)[i]?.watts ?? 0), 0);
    return { hour: i, watts: Math.round(sum) };
  });
  const maxW = Math.max(...hours.map(h => h.watts), 1);
  const hogs = [...devices].filter(d => d.monthCost > 0).sort((a, b) => b.monthCost - a.monthCost).slice(0, 3);

  const DeviceRow = ({ d }) => (
    <div className="flex items-center gap-3 py-2.5">
      <span className={`w-2 h-2 rounded-full shrink-0 ${d.status === 'on' ? 'bg-emerald-400' : 'bg-slate-500'}`} />
      <Link to={`/device/${d.id}`} className="flex-1 min-w-0 hover:underline">
        <p className="text-[13.5px] font-semibold truncate">{d.name}</p>
        <p className="text-[11px] text-faint">{d.room} · ₹{d.monthCost.toLocaleString('en-IN')}/mo</p>
      </Link>
      <p className="text-[12px] font-mono text-right w-[88px] shrink-0" style={{ color: d.status === 'on' ? 'var(--text)' : 'var(--text-faint)' }}>
        {d.currentWatts > 0 ? `${d.currentWatts} W` : '—'}
      </p>
      <button
        onClick={() => toggleDevice(d.id)}
        className={`switch ${d.status === 'on' ? 'on' : ''}`}
        title={d.status === 'on' ? 'Turn off' : 'Turn on'}
      />
    </div>
  );

  return (
    <div>
      {/* Hero */}
      <div className="card p-5 sm:p-6 mb-5">
        <div className="flex items-center justify-between mb-4">
          <span className="label">{mockHome.name} · Home Assistant</span>
          <span className="flex items-center gap-1.5 text-[11px] font-bold">
            <span className={`w-2 h-2 rounded-full ${paused ? 'bg-slate-500' : 'bg-emerald-400'}`} />
            <span className="text-muted">{paused ? 'paused' : 'live'}</span>
          </span>
        </div>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[12px] text-muted mb-1">Estimated spend today</p>
            <p className="text-[40px] sm:text-[48px] font-bold leading-none tracking-tight">
              ₹{totalToday.toLocaleString('en-IN')}
            </p>
            <div className="flex items-center gap-2 mt-2.5">
              <span className="chip" style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>
                <Zap className="w-3 h-3" /> {totalWatts.toLocaleString('en-IN')} W live
              </span>
              <span className="chip" style={{ background: 'var(--surface-2)' }}>
                ≈ ₹{Math.round(totalMonth).toLocaleString('en-IN')}/month
              </span>
            </div>
          </div>
          <button onClick={() => setPaused(p => !p)} className="btn btn-ghost !px-3 !py-2">
            <Power className="w-3.5 h-3.5" />
            {paused ? 'Resume' : 'Pause'}
          </button>
        </div>

        {/* 24h total usage */}
        <div className="mt-6">
          <p className="label mb-2">Today's usage — whole home (watts)</p>
          <div className="flex items-end gap-[3px] h-16">
            {hours.map(h => (
              <div
                key={h.hour}
                className={`bar flex-1 ${h.watts > 0 ? '' : 'off'}`}
                style={{ height: `${Math.max(5, (h.watts / maxW) * 100)}%` }}
                title={`${h.hour}:00 — ${h.watts} W`}
              />
            ))}
          </div>
          <div className="flex justify-between text-[9px] text-faint mt-1.5 font-mono">
            <span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>23:00</span>
          </div>
        </div>
      </div>

      {/* Live device control */}
      <div className="card p-5 mb-5">
        <div className="flex items-center justify-between mb-2">
          <p className="font-bold text-[15px]">Devices</p>
          <span className="text-[11px] text-muted">
            {onDevices.length} on · {offDevices.length} off
          </span>
        </div>
        <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
          {devices.map(d => <DeviceRow key={d.id} d={d} />)}
        </div>
        <Link to="/devices" className="flex items-center gap-1 text-[12px] font-bold mt-3" style={{ color: 'var(--accent)' }}>
          Manage & identify devices <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Rooms */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        {mockHome.rooms.map(r => {
          const dvs = devices.filter(d => d.room === r.name);
          const w = dvs.reduce((s, d) => s + d.currentWatts, 0);
          const c = dvs.reduce((s, d) => s + d.monthCost, 0);
          return (
            <div key={r.id} className="card card-hover p-4">
              <div className="flex items-center gap-2 mb-2">
                <Home className="w-4 h-4 text-muted" />
                <p className="text-[13px] font-bold truncate">{r.name}</p>
              </div>
              <p className="text-[11px] font-mono" style={{ color: w > 0 ? 'var(--text)' : 'var(--text-faint)' }}>
                {w > 0 ? `${w} W` : 'idle'}
              </p>
              <p className="text-[11px] text-faint">₹{c.toLocaleString('en-IN')}/mo</p>
            </div>
          );
        })}
      </div>

      {/* Energy hogs */}
      <div className="card p-5">
        <p className="font-bold text-[15px] mb-1">Energy hogs — this month</p>
        <p className="text-[11px] text-faint mb-3">The three appliances costing you the most.</p>
        {hogs.map((d, i) => (
          <div key={d.id} className="flex items-center gap-3 py-2.5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'var(--surface-2)' }}>
              {i === 0 ? <Bolt className="w-3.5 h-3.5 text-amber-400" /> : <Zap className="w-3.5 h-3.5 text-muted" />}
            </div>
            <p className="flex-1 text-[13px] font-semibold truncate">{d.name}</p>
            <p className="text-[13px] font-bold" style={{ color: i === 0 ? 'var(--accent)' : 'var(--text)' }}>
              ₹{d.monthCost.toLocaleString('en-IN')}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}