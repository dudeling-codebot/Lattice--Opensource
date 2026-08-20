import { useOutletContext, Link } from 'react-router-dom';
import { Bolt, Zap, Power, ChevronRight, Home, Moon, Play, AlertTriangle, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useEnergy } from '../context/EnergyContext.jsx';
import { mockHome, dailyProfile, anomalies, potentialSavings } from '../data/mockData.js';
import FloorCircular from '../components/FloorCircular.jsx';
import HourlyLineGraph from '../components/HourlyLineGraph.jsx';

export default function Dashboard() {
  const { pro } = useOutletContext();
  const { devices, paused, setPaused, toggleDevice, toggleRoom, setAll, nightMode, totalWatts, totalToday, totalMonth } = useEnergy();
  const [pendingRoom, setPendingRoom] = useState(null);

  const requestToggleRoom = (roomName) => {
    const dvs = devices.filter(d => d.room === roomName);
    const anyOn = dvs.some(d => d.status === 'on');
    if (anyOn) {
      const willOff = dvs.filter(d => d.status === 'on');
      setPendingRoom({ name: roomName, devices: willOff });
    } else {
      toggleRoom(roomName);
    }
  };

  const onDevices = devices.filter(d => d.status === 'on');
  const offDevices = devices.filter(d => d.status !== 'on');
  const hours = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    watts: devices.reduce((s, d) => s + (dailyProfile(d, i * 7)[i]?.watts ?? 0), 0),
  }));
  const hogs = [...devices].filter(d => d.monthCost > 0).sort((a, b) => b.monthCost - a.monthCost).slice(0, 3);
  const delta = totalToday - mockHome.yesterdayTotal;
  const waste = anomalies.find(a => a.deviceId && a.kind === 'high');
  const savings = potentialSavings();
  const maxHog = hogs[0]?.monthCost || 1;

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
      <div className="card p-5 sm:p-6 mb-4">
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
              <span className="chip" style={{ background: delta > 0 ? 'var(--amber-soft)' : 'var(--green-soft)', color: delta > 0 ? 'var(--amber)' : 'var(--green)' }}>
                {delta > 0 ? '+' : '−'}₹{Math.abs(delta)} vs yesterday
              </span>
            </div>
          </div>
          <button onClick={() => setPaused(p => !p)} className="btn btn-ghost !px-3 !py-2">
            <Power className="w-3.5 h-3.5" />
            {paused ? 'Resume' : 'Pause'}
          </button>
        </div>
      </div>

      {/* Waste detection + potential savings */}
      <div className="grid sm:grid-cols-2 gap-3 mb-4">
        <div className="card p-5" style={{ borderColor: 'rgba(251,191,36,0.3)' }}>
          <span className="chip" style={{ background: 'var(--amber-soft)', color: 'var(--amber)' }}>
            <AlertTriangle className="w-3.5 h-3.5" /> Potential Energy Waste
          </span>
          <p className="text-[13.5px] leading-snug mt-3">
            <span className="font-extrabold">{waste.title}</span> is using{' '}
            <span className="font-extrabold" style={{ color: 'var(--amber)' }}>
              {waste.aboveUsualPercent}% more energy than usual.
            </span>
          </p>
          <p className="text-[12px] text-muted mt-1.5">
            Estimated extra cost:{' '}
            <span className="font-bold" style={{ color: 'var(--amber)' }}>₹{waste.extraCostWeek} this week.</span>
          </p>
          <Link to="/insights" className="flex items-center gap-1 text-[12px] font-bold mt-3" style={{ color: 'var(--amber)' }}>
            View insight <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="card p-5" style={{ borderColor: 'rgba(52,211,153,0.3)' }}>
          <span className="chip" style={{ background: 'var(--green-soft)', color: 'var(--green)' }}>
            <Sparkles className="w-3.5 h-3.5" /> Potential Savings
          </span>
          <p className="text-[32px] font-extrabold leading-none mt-3" style={{ color: 'var(--green)' }}>
            ₹{savings.toLocaleString('en-IN')}<span className="text-[13px] font-bold text-muted">/month</span>
          </p>
          <p className="text-[12px] text-muted mt-1.5">Based on unusual usage patterns.</p>
        </div>
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <p className="label mr-1">Quick actions</p>
        <button onClick={() => setAll('on')} className="btn btn-ghost !px-3 !py-1.5 !text-[11px]">
          <Play className="w-3 h-3" /> All on
        </button>
        <button onClick={nightMode} className="btn btn-ghost !px-3 !py-1.5 !text-[11px]">
          <Moon className="w-3 h-3" /> Night mode <span className="text-faint">(fridge stays)</span>
        </button>
        <button onClick={() => setAll('off')} className="btn btn-ghost !px-3 !py-1.5 !text-[11px]">
          <Power className="w-3 h-3" /> All off
        </button>
      </div>

      {/* Floor-wise circular view — day wise */}
      <div className="mb-4">
        <FloorCircular />
      </div>

      {/* Today's curve — line graph */}
      <div className="card p-5 mb-4">
        <p className="label mb-3">Today's usage — whole home (watts)</p>
        <HourlyLineGraph data={hours} />
        <Link to="/usage" className="flex items-center gap-1 text-[12px] font-bold mt-3" style={{ color: 'var(--accent)' }}>
          Full usage breakdown <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Live device control */}
      <div className="card p-5 mb-4">
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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {mockHome.rooms.map(r => {
          const dvs = devices.filter(d => d.room === r.name);
          const w = dvs.reduce((s, d) => s + d.currentWatts, 0);
          const c = dvs.reduce((s, d) => s + d.monthCost, 0);
          const roomOn = dvs.some(d => d.status === 'on');
          return (
            <div key={r.id} className="card card-hover p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 min-w-0">
                  <Home className="w-4 h-4 text-muted shrink-0" />
                  <p className="text-[13px] font-bold truncate">{r.name}</p>
                </div>
                {dvs.length > 0 && (
                  <button
                    onClick={() => requestToggleRoom(r.name)}
                    className={`switch ${roomOn ? 'on' : ''} scale-90`}
                    title={roomOn ? 'Switch off room' : 'Switch on room'}
                  />
                )}
              </div>
              <p className="text-[11px] font-mono" style={{ color: w > 0 ? 'var(--text)' : 'var(--text-faint)' }}>
                {w > 0 ? `${w} W` : 'idle'}
              </p>
              <p className="text-[11px] text-faint">₹{c.toLocaleString('en-IN')}/mo</p>
            </div>
          );
        })}
      </div>

      {/* Highest energy consumers */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-1">
          <p className="font-bold text-[15px]">Highest Energy Consumers</p>
          <Link to="/usage" className="text-[12px] font-bold" style={{ color: 'var(--accent)' }}>see all →</Link>
        </div>
        <p className="text-[11px] text-faint mb-3">Ranked by monthly cost — abnormal devices flagged.</p>
        {hogs.map((d, i) => {
          const anom = anomalies.find(a => a.deviceId === d.id && a.kind === 'high');
          return (
            <div key={d.id} className="flex items-center gap-3 py-2.5">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: i === 0 ? 'var(--amber-soft)' : 'var(--surface-2)' }}>
                {i === 0 ? <Bolt className="w-3.5 h-3.5 text-amber-400" /> : <Zap className="w-3.5 h-3.5 text-muted" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold truncate">{d.name}</p>
                {anom && (
                  <p className="text-[11px] font-bold flex items-center gap-1 mt-0.5" style={{ color: 'var(--amber)' }}>
                    <AlertTriangle className="w-3 h-3" /> {anom.aboveUsualPercent}% above usual
                  </p>
                )}
              </div>
              <div className="w-24 h-1.5 rounded-full overflow-hidden shrink-0" style={{ background: 'var(--surface-2)' }}>
                <div className="h-full rounded-full" style={{ width: `${Math.max(8, (d.monthCost / maxHog) * 100)}%`, background: i === 0 ? 'var(--amber)' : 'var(--accent)' }} />
              </div>
              <p className="text-[13px] font-bold w-[86px] text-right shrink-0" style={{ color: i === 0 ? 'var(--amber)' : 'var(--text)' }}>
                ₹{d.monthCost.toLocaleString('en-IN')}
              </p>
            </div>
          );
        })}
      </div>

      {/* ⚠️ Room off warning modal */}
      {pendingRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setPendingRoom(null)} />
          <div className="relative card p-6 w-full max-w-md shadow-2xl" style={{ borderColor: 'rgba(251,191,36,0.5)' }}>
            <div className="flex items-start gap-3 mb-4">
              <span className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-xl" style={{ background: 'var(--amber-soft)' }}>⚠️</span>
              <div>
                <h3 className="text-[16px] font-extrabold leading-tight">⚠️ Warning — Turn off {pendingRoom.name}? 🚨</h3>
                <p className="text-[12px] text-muted mt-1 leading-relaxed">You are about to turn OFF the entire room. The following device{pendingRoom.devices.length > 1 ? 's' : ''} will be turned off:</p>
              </div>
            </div>

            <div className="rounded-xl p-3 mb-4 space-y-2" style={{ background: 'var(--amber-soft)', border: '1px solid rgba(251,191,36,0.25)' }}>
              {pendingRoom.devices.map(d => (
                <p key={d.id} className="text-[13px] font-semibold flex items-center gap-2">
                  <span>⚠️</span> {d.name} <span className="text-[11px] font-mono text-muted">({d.currentWatts} W)</span> <span>🔌</span>
                </p>
              ))}
              <p className="text-[11px] font-bold mt-2 flex items-center gap-1" style={{ color: 'var(--amber)' }}>⚡ All listed devices will lose power! ⚡</p>
            </div>

            <p className="text-[11px] text-faint mb-4 flex items-center gap-1.5">💡 Tip: You can turn them back on individually from Devices.</p>

            <div className="flex justify-end gap-2">
              <button onClick={() => setPendingRoom(null)} className="btn btn-ghost !px-4 !py-2">
                Cancel
              </button>
              <button
                onClick={() => { toggleRoom(pendingRoom.name); setPendingRoom(null); }}
                className="btn btn-primary !px-5 !py-2"
                style={{ background: '#F59E0B', color: '#fff' }}
              >
                ⚠️ Yes, turn off
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}