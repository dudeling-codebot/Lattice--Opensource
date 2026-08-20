import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Calendar, Clock, Zap, IndianRupee, Download, Search, Filter, ChevronDown } from 'lucide-react';
import { mockHome, getLogbook, daysSince } from '../data/mockData.js';
import { useEnergy } from '../context/EnergyContext.jsx';

export default function Logbook() {
  const { devices } = useEnergy();
  const [selectedId, setSelectedId] = useState('all');
  const [query, setQuery] = useState('');
  const [sortDesc, setSortDesc] = useState(true);

  const selectedDevice = selectedId === 'all' ? null : devices.find(d => d.id === selectedId);

  const logs = useMemo(() => {
    if (selectedDevice) {
      return getLogbook(selectedDevice, 60).map(l => ({ ...l, device: selectedDevice }));
    }
    // all devices merged
    const all = [];
    devices.forEach(d => {
      getLogbook(d, 45).forEach(l => all.push({ ...l, device: d }));
    });
    return all.sort((a, b) => sortDesc ? b.iso.localeCompare(a.iso) : a.iso.localeCompare(b.iso));
  }, [selectedDevice, devices, sortDesc]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    let arr = logs;
    if (q) arr = arr.filter(l => l.device.name.toLowerCase().includes(q) || l.device.room.toLowerCase().includes(q) || l.iso.includes(q));
    // already sorted for 'all', for single device keep chronological desc
    if (selectedDevice) {
      arr = [...arr].sort((a, b) => sortDesc ? b.iso.localeCompare(a.iso) : a.iso.localeCompare(b.iso));
    }
    return arr;
  }, [logs, query, sortDesc, selectedDevice]);

  const totals = useMemo(() => {
    const kwh = filtered.reduce((s, l) => s + l.kwh, 0);
    const cost = filtered.reduce((s, l) => s + l.cost, 0);
    const runtime = filtered.reduce((s, l) => s + (typeof l.runtime === 'number' ? l.runtime : 0), 0);
    return { kwh: Math.round(kwh * 10) / 10, cost, runtime: Math.round(runtime * 10) / 10 };
  }, [filtered]);

  const downloadCSV = () => {
    const header = 'Date,Device,Room,Watts,kWh,RuntimeHours,Cost\n';
    const rows = filtered.map(l => `${l.iso},"${l.device.name}",${l.device.room},${l.device.baseWatts},${l.kwh},${l.runtime},${l.cost}`).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `lattice-logbook-${selectedId}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight flex items-center gap-2"><BookOpen className="w-6 h-6" style={{ color: 'var(--accent)' }} /> Logbook</h1>
        <p className="text-[13px] text-muted mt-1">All your data per device — from the day each device was registered until today.</p>
      </div>

      {/* Device filter + summary */}
      <div className="card p-4 mb-4">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Filter className="w-4 h-4 text-muted" />
          <span className="label">Filter by device</span>
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin flex-1">
            <button onClick={() => setSelectedId('all')} className={`chip shrink-0 border ${selectedId === 'all' ? 'text-white' : ''}`} style={{ background: selectedId === 'all' ? 'var(--accent)' : 'var(--surface-2)', borderColor: selectedId === 'all' ? 'var(--accent)' : 'transparent' }}>All devices</button>
            {devices.map(d => (
              <button key={d.id} onClick={() => setSelectedId(d.id)} className={`chip shrink-0 border ${selectedId === d.id ? 'text-white' : ''}`} style={{ background: selectedId === d.id ? 'var(--accent)' : 'var(--surface-2)', borderColor: selectedId === d.id ? 'var(--accent)' : 'transparent' }}>{d.name}</button>
            ))}
          </div>
        </div>

        {selectedDevice ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl p-3" style={{ background: 'var(--surface-2)' }}>
              <p className="text-[11px] text-faint flex items-center gap-1"><Calendar className="w-3 h-3" /> Registered</p>
              <p className="text-[13px] font-bold mt-1">{new Date(selectedDevice.registeredAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
              <p className="text-[11px] text-faint">{daysSince(selectedDevice.registeredAt)} days ago</p>
            </div>
            <div className="rounded-xl p-3" style={{ background: 'var(--surface-2)' }}>
              <p className="text-[11px] text-faint flex items-center gap-1"><Clock className="w-3 h-3" /> Days logged</p>
              <p className="text-[13px] font-bold mt-1">{getLogbook(selectedDevice, 60).length} days</p>
              <p className="text-[11px] text-faint">since registration</p>
            </div>
            <div className="rounded-xl p-3" style={{ background: 'var(--surface-2)' }}>
              <p className="text-[11px] text-faint flex items-center gap-1"><Zap className="w-3 h-3" /> Total use</p>
              <p className="text-[13px] font-bold mt-1">{getLogbook(selectedDevice, 60).reduce((s, l) => s + l.kwh, 0).toFixed(1)} kWh</p>
              <p className="text-[11px] text-faint">₹{getLogbook(selectedDevice, 60).reduce((s, l) => s + l.cost, 0)}</p>
            </div>
            <div className="rounded-xl p-3" style={{ background: 'var(--surface-2)' }}>
              <p className="text-[11px] text-faint flex items-center gap-1"><IndianRupee className="w-3 h-3" /> Room</p>
              <p className="text-[13px] font-bold mt-1 truncate">{selectedDevice.room}</p>
              <p className="text-[11px] text-faint">{selectedDevice.baseWatts} W</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl p-3" style={{ background: 'var(--surface-2)' }}><p className="text-[11px] text-faint">Devices</p><p className="text-[18px] font-extrabold">{devices.length}</p></div>
            <div className="rounded-xl p-3" style={{ background: 'var(--surface-2)' }}><p className="text-[11px] text-faint">Logged days (filtered)</p><p className="text-[18px] font-extrabold">{filtered.length}</p></div>
            <div className="rounded-xl p-3" style={{ background: 'var(--surface-2)' }}><p className="text-[11px] text-faint">Total kWh</p><p className="text-[18px] font-extrabold">{totals.kwh} kWh</p></div>
          </div>
        )}
      </div>

      {/* Search + actions */}
      <div className="flex flex-wrap gap-2 mb-3">
        <div className="flex items-center gap-2 rounded-xl px-3 py-2 flex-1 min-w-[200px]" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <Search className="w-4 h-4 text-muted shrink-0" />
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search device, room or date (YYYY-MM-DD)" className="bg-transparent outline-none text-[13px] w-full" style={{ color: 'var(--text)' }} />
        </div>
        <button onClick={() => setSortDesc(v => !v)} className="btn btn-ghost !px-3 !py-2"><ChevronDown className={`w-4 h-4 transition ${sortDesc ? '' : 'rotate-180'}`} /> {sortDesc ? 'Newest' : 'Oldest'}</button>
        <button onClick={downloadCSV} className="btn btn-ghost !px-3.5 !py-2"><Download className="w-4 h-4" /> Export CSV</button>
      </div>

      {/* Totals bar */}
      <div className="flex flex-wrap gap-2 mb-3 text-[12px]">
        <span className="chip" style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}><Zap className="w-3 h-3" /> {totals.kwh} kWh</span>
        <span className="chip" style={{ background: 'var(--surface-2)' }}><Clock className="w-3 h-3" /> {totals.runtime} h runtime</span>
        <span className="chip" style={{ background: 'var(--green-soft)', color: 'var(--green)' }}><IndianRupee className="w-3 h-3" /> ₹{totals.cost}</span>
        <span className="text-[11px] text-faint self-center ml-1">{filtered.length} records — from registration to today</span>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[11px] text-faint uppercase tracking-widest" style={{ borderBottom: '1px solid var(--border)' }}>
                <th className="px-4 py-3 font-bold">Date</th>
                <th className="px-4 py-3 font-bold">Device</th>
                <th className="px-4 py-3 font-bold">Room</th>
                <th className="px-4 py-3 font-bold text-right">kWh</th>
                <th className="px-4 py-3 font-bold text-right">Runtime</th>
                <th className="px-4 py-3 font-bold text-right">Cost</th>
                <th className="px-4 py-3 font-bold text-right">Registered</th>
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, 300).map((l, i) => (
                <tr key={`${l.device.id}-${l.iso}-${i}`} className="text-[13px] border-b" style={{ borderColor: 'var(--border)' }}>
                  <td className="px-4 py-2.5 font-mono text-[12px] whitespace-nowrap">{l.iso}<span className="text-faint ml-2 hidden sm:inline">{l.label}</span></td>
                  <td className="px-4 py-2.5 font-semibold truncate max-w-[180px]"><Link to={`/device/${l.device.id}`} className="hover:underline" style={{ color: 'var(--text)' }}>{l.device.name}</Link></td>
                  <td className="px-4 py-2.5 text-muted text-[12px]">{l.device.room}</td>
                  <td className="px-4 py-2.5 font-mono text-right font-bold">{l.kwh}</td>
                  <td className="px-4 py-2.5 font-mono text-right text-muted text-[12px]">{l.onHours}</td>
                  <td className="px-4 py-2.5 font-mono text-right font-bold" style={{ color: 'var(--accent)' }}>₹{l.cost}</td>
                  <td className="px-4 py-2.5 font-mono text-right text-faint text-[11px] whitespace-nowrap">{l.device.registeredAt} · {daysSince(l.device.registeredAt)}d</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-10 text-center text-muted text-[13px]">No records match your filter.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        {filtered.length > 300 && <p className="text-[11px] text-faint px-4 py-3">Showing 300 of {filtered.length} records — export CSV for full data.</p>}
        <p className="text-[11px] text-faint px-4 py-3 leading-relaxed" style={{ borderTop: '1px solid var(--border)' }}>
          Each device's log starts on its <span className="font-bold text-muted">registeredAt</span> date (shown per row) and continues daily to today. Add a new device → its logbook starts from the addition date.
        </p>
      </div>
    </div>
  );
}
