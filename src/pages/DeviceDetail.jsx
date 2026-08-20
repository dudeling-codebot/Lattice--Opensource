import { useParams, Link, useOutletContext } from 'react-router-dom';
import { BadgeCheck, Cpu, Pencil, Clock, IndianRupee, Zap, ArrowLeft } from 'lucide-react';
import { useEnergy } from '../context/EnergyContext.jsx';
import { mockHome, dailyProfile } from '../data/mockData.js';
import { useState } from 'react';
import HourlyLineGraph from '../components/HourlyLineGraph.jsx';

export default function DeviceDetail() {
  const { id } = useParams();
  const { pro, activeColor } = useOutletContext();
  const { devices, toggleDevice } = useEnergy();
  const device = devices.find(d => d.id === id);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');

  if (!device) {
    return (
      <div className="text-center py-16">
        <p className="text-muted mb-4">Device not found.</p>
        <Link to="/devices" className="font-semibold" style={{ color: 'var(--accent)' }}>← Back to devices</Link>
      </div>
    );
  }

  const hours = dailyProfile(device, device.id.charCodeAt(1) % 40);
  const todayUsed = hours.reduce((s, h) => s + h.watts, 0);
  const on = device.status === 'on';

  const save = () => {
    setEditing(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Link to="/devices" className="flex items-center gap-1.5 text-[12px] font-semibold mb-4" style={{ color: 'var(--accent)' }}>
        <ArrowLeft className="w-3.5 h-3.5" /> Back to devices
      </Link>

      <div className="card p-5 sm:p-6 mb-5">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: on ? 'var(--accent-soft)' : 'var(--surface-2)' }}>
              <Zap className="w-5 h-5" style={{ color: on ? 'var(--accent)' : 'var(--text-faint)' }} />
            </div>
            <div className="min-w-0 flex-1">
              {editing ? (
                <input
                  autoFocus
                  value={name}
                  onChange={e => setName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && save()}
                  className="input !py-1.5 w-full"
                />
              ) : (
                <h1 className="text-lg font-extrabold tracking-tight truncate">{device.name}</h1>
              )}
              <p className="text-[12px] text-faint">{device.room}</p>
            </div>
          </div>
          <button
            onClick={() => toggleDevice(device.id)}
            className={`switch ${on ? 'on' : ''}`}
            title={on ? 'Turn off' : 'Turn on'}
          />
        </div>

        <div className="flex flex-wrap gap-2 mb-5">
          {device.verified ? (
            <span className="chip" style={{ background: 'var(--green-soft)', color: 'var(--green)' }}>
              <BadgeCheck className="w-3 h-3" /> AI verified spec
            </span>
          ) : device.identified ? (
            <span className="chip" style={{ background: 'var(--amber-soft)', color: 'var(--amber)' }}>
              AI guess — confirm on Devices page
            </span>
          ) : (
            <span className="chip" style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>
              <Cpu className="w-3 h-3" /> Unidentified — run AI scan
            </span>
          )}
          <button
            onClick={() => { setEditing(true); setName(device.name); }}
            className="btn btn-ghost !px-2.5 !py-1 !text-[11px]"
          >
            <Pencil className="w-3 h-3" /> Edit
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="text-center py-3 rounded-xl" style={{ background: 'var(--surface-2)' }}>
            <p className="text-lg font-bold leading-none">{device.currentWatts}<span className="text-[10px] text-muted"> W</span></p>
            <p className="label mt-1.5">Live now</p>
          </div>
          <div className="text-center py-3 rounded-xl" style={{ background: 'var(--surface-2)' }}>
            <p className="text-lg font-bold leading-none">{Math.round(todayUsed / 100) / 10}<span className="text-[10px] text-muted"> kWh</span></p>
            <p className="label mt-1.5">Today</p>
          </div>
          <div className="text-center py-3 rounded-xl" style={{ background: 'var(--surface-2)' }}>
            <p className="text-lg font-bold leading-none">₹{device.monthCost.toLocaleString('en-IN')}</p>
            <p className="label mt-1.5">This month</p>
          </div>
        </div>
      </div>

      <div className="card p-5 mb-5">
        <div className="flex items-center justify-between mb-4">
          <p className="label">Today's usage curve</p>
          <span className="flex items-center gap-1.5 text-[11px] font-semibold text-muted">
            <Clock className="w-3.5 h-3.5" /> 24h
          </span>
        </div>
        <HourlyLineGraph data={hours} height={128} />
      </div>

      <div className="card p-5">
        <div className="flex items-center gap-2 mb-3">
          <IndianRupee className="w-4 h-4" style={{ color: 'var(--accent)' }} />
          <p className="font-bold text-[14px]">Cost math</p>
        </div>
        <div className="text-[13px] space-y-2">
          <p className="flex justify-between"><span className="text-muted">Usage today</span><span className="font-mono">{Math.round(todayUsed / 100) / 10} kWh</span></p>
          <p className="flex justify-between"><span className="text-muted">Tariff</span><span className="font-mono">₹{mockHome.tariff} / unit</span></p>
          <p className="flex justify-between pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
            <span className="font-bold">Estimated cost today</span>
            <span className="font-mono font-bold" style={{ color: 'var(--accent)' }}>≈ ₹{Math.round((todayUsed / 100) * mockHome.tariff)}</span>
          </p>
        </div>
      </div>
    </div>
  );
}