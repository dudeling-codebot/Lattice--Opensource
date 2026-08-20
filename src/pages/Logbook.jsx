import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Calendar, Clock, Zap, IndianRupee, Download, Search, ChevronDown, Layers, History, LayoutGrid, Table, ChevronRight } from 'lucide-react';
import { mockHome, getLogbook, daysSince } from '../data/mockData.js';
import { useEnergy } from '../context/EnergyContext.jsx';

function Sparkline({ data, color = 'var(--accent)' }) {
  if (data.length < 2) return null;
  const W = 100, H = 32, pad = 2;
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = Math.max(1, max - min);
  const step = (W - pad * 2) / (data.length - 1);
  const pts = data.map((v, i) => ({ x: pad + i * step, y: H - pad - ((v - min) / range) * (H - pad * 2) }));
  const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} className="block overflow-visible">
      <path d={d} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={pts[pts.length-1].x} cy={pts[pts.length-1].y} r="2.5" fill={color} />
    </svg>
  );
}

export default function Logbook() {
  const { devices } = useEnergy();
  const [selectedId, setSelectedId] = useState('all');
  const [query, setQuery] = useState('');
  const [sortDesc, setSortDesc] = useState(true);
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState(null);
  const pageSize = 20;

  const selectedDevice = selectedId === 'all' ? null : devices.find(d => d.id === selectedId);

  // logs
  const allLogs = useMemo(() => {
    if (selectedDevice) return getLogbook(selectedDevice, 60).map(l => ({ ...l, device: selectedDevice }));
    const merged = [];
    devices.forEach(d => getLogbook(d, 45).forEach(l => merged.push({ ...l, device: d })));
    return merged.sort((a,b) => sortDesc ? b.iso.localeCompare(a.iso) : a.iso.localeCompare(b.iso));
  }, [selectedDevice, devices, sortDesc]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    let arr = allLogs;
    if (q) arr = arr.filter(l => l.device.name.toLowerCase().includes(q) || l.device.room.toLowerCase().includes(q) || l.iso.includes(q));
    if (selectedDevice) arr = [...arr].sort((a,b) => sortDesc ? b.iso.localeCompare(a.iso) : a.iso.localeCompare(b.iso));
    return arr;
  }, [allLogs, query, sortDesc, selectedDevice]);

  const totals = useMemo(() => {
    const kwh = filtered.reduce((s,l)=>s+l.kwh,0);
    const cost = filtered.reduce((s,l)=>s+l.cost,0);
    const runtime = filtered.reduce((s,l)=>s+(typeof l.runtime==='number'?l.runtime:0),0);
    return { kwh: Math.round(kwh*10)/10, cost, runtime: Math.round(runtime*10)/10 };
  }, [filtered]);

  const paged = useMemo(() => {
    const start = (page-1)*pageSize;
    return filtered.slice(start, start+pageSize);
  }, [filtered, page]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  // grouped by device for 'all' view
  const grouped = useMemo(() => {
    if (selectedDevice) return null;
    const map = new Map();
    filtered.forEach(l => {
      if (!map.has(l.device.id)) map.set(l.device.id, []);
      map.get(l.device.id).push(l);
    });
    return Array.from(map.entries()).map(([id, rows]) => ({ device: devices.find(d=>d.id===id), rows }));
  }, [filtered, devices, selectedDevice]);

  const downloadCSV = () => {
    const header = 'Date,Device,Room,Watts,kWh,RuntimeHours,Cost,RegisteredAt\n';
    const rows = filtered.map(l => `${l.iso},"${l.device.name}",${l.device.room},${l.device.baseWatts},${l.kwh},${l.runtime},${l.cost},${l.device.registeredAt}`).join('\n');
    const blob = new Blob([header+rows], {type:'text/csv'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href=url; a.download=`lattice-logbook-${selectedId}.csv`; a.click(); URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight flex items-center gap-2"><BookOpen className="w-6 h-6" style={{color:'var(--accent)'}}/> Logbook</h1>
        <p className="text-[13px] text-muted mt-1">Organised history for every device — from its registration day to today.</p>
      </div>

      {/* Tabs: All vs Per-device */}
      <div className="card p-3 mb-4">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-thin">
          <span className="label shrink-0 flex items-center gap-1.5"><Layers className="w-3.5 h-3.5"/> View</span>
          <button onClick={()=>{setSelectedId('all'); setPage(1)}} className={`chip shrink-0 border ${selectedId==='all'?'text-white':''}`} style={{background:selectedId==='all'?'var(--accent)':'var(--surface-2)', borderColor:selectedId==='all'?'var(--accent)':'transparent'}}><LayoutGrid className="w-3 h-3"/> All devices — grouped</button>
          <button onClick={()=>{setSelectedId('all'); setPage(1)}} className={`chip shrink-0 border ${!selectedDevice && selectedId!=='all'?'text-white':''}`} style={{background:'var(--surface-2)', borderColor:'transparent', opacity:0.9}}><Table className="w-3 h-3"/> Timeline</button>
          <span className="text-faint text-[11px] hidden sm:inline">or pick a device →</span>
          {devices.map(d=>(
            <button key={d.id} onClick={()=>{setSelectedId(d.id); setPage(1)}} className={`chip shrink-0 border ${selectedId===d.id?'text-white':''}`} style={{background:selectedId===d.id?'var(--accent)':'var(--surface-2)', borderColor:selectedId===d.id?'var(--accent)':'transparent'}}>{d.name}</button>
          ))}
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <div className="card p-4">
          <p className="text-[11px] text-faint flex items-center gap-1"><Clock className="w-3 h-3"/> Days logged</p>
          <p className="text-[22px] font-extrabold leading-none mt-1">{selectedDevice ? getLogbook(selectedDevice,60).length : filtered.length}<span className="text-[11px] font-bold text-faint"> records</span></p>
          <p className="text-[11px] text-faint mt-1">{selectedDevice ? `since ${selectedDevice.registeredAt}` : `${devices.length} devices combined`}</p>
        </div>
        <div className="card p-4">
          <p className="text-[11px] text-faint flex items-center gap-1"><Zap className="w-3 h-3"/> Total energy</p>
          <p className="text-[22px] font-extrabold leading-none mt-1" style={{color:'var(--accent)'}}>{totals.kwh}<span className="text-[11px] font-bold text-muted"> kWh</span></p>
          <p className="text-[11px] text-faint mt-1">₹{totals.cost} at ₹{mockHome.tariff}/unit</p>
        </div>
        <div className="card p-4">
          <p className="text-[11px] text-faint flex items-center gap-1"><History className="w-3 h-3"/> Runtime</p>
          <p className="text-[22px] font-extrabold leading-none mt-1">{totals.runtime}<span className="text-[11px] font-bold text-muted"> h</span></p>
          <p className="text-[11px] text-faint mt-1">avg {(filtered.length? (totals.kwh/filtered.length).toFixed(2): '0')} kWh/day</p>
        </div>
        <div className="card p-4 flex flex-col justify-between">
          <div>
            <p className="text-[11px] text-faint">Actions</p>
            <p className="text-[11px] text-muted mt-1 leading-snug">From registration to today — per device.</p>
          </div>
          <button onClick={downloadCSV} className="btn btn-ghost !px-3 !py-1.5 !text-[11px] mt-2 w-fit"><Download className="w-3.5 h-3.5"/> Export CSV</button>
        </div>
      </div>

      {/* Per-device overview cards when All */}
      {!selectedDevice && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
          {devices.map(d=>{
            const logs = getLogbook(d, 14);
            const kwh14 = logs.map(l=>l.kwh);
            const total = logs.reduce((s,l)=>s+l.kwh,0);
            const isExpanded = expanded===d.id;
            return (
              <div key={d.id} className="card p-4 card-hover">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-[13px] font-bold truncate">{d.name}</p>
                    <p className="text-[11px] text-faint">{d.room} · {d.baseWatts} W</p>
                    <p className="text-[11px] font-mono text-muted mt-1"><Calendar className="w-3 h-3 inline mr-1"/> {d.registeredAt} · {daysSince(d.registeredAt)}d ago</p>
                  </div>
                  <button onClick={()=> setExpanded(isExpanded? null : d.id)} className="btn btn-ghost !px-2 !py-1 !text-[11px] shrink-0">
                    {isExpanded ? 'Hide' : 'History'} <ChevronRight className={`w-3 h-3 transition ${isExpanded?'rotate-90':''}`}/>
                  </button>
                </div>
                <div className="mt-3">
                  <Sparkline data={kwh14} />
                  <div className="flex justify-between text-[10px] font-mono text-faint mt-1"><span>{logs[0]?.iso}</span><span>{logs[logs.length-1]?.iso}</span></div>
                </div>
                <div className="flex gap-2 mt-3">
                  <span className="chip" style={{background:'var(--accent-soft)', color:'var(--accent)'}}>{total.toFixed(1)} kWh / 14d</span>
                  <span className="chip" style={{background:'var(--surface-2)'}}>{logs.length} days</span>
                </div>
                {isExpanded && (
                  <div className="mt-3 rounded-xl overflow-hidden border" style={{borderColor:'var(--border)'}}>
                    <div className="max-h-40 overflow-auto">
                      <table className="w-full text-[11px]">
                        <thead className="sticky top-0" style={{background:'var(--surface-2)'}}>
                          <tr className="text-faint"><th className="px-2 py-1 text-left">Date</th><th className="px-2 py-1 text-right">kWh</th><th className="px-2 py-1 text-right">₹</th></tr>
                        </thead>
                        <tbody>
                          {getLogbook(d, 30).slice(-10).reverse().map(l=>(
                            <tr key={l.iso} className="border-t" style={{borderColor:'var(--border)'}}><td className="px-2 py-1 font-mono">{l.iso}</td><td className="px-2 py-1 text-right font-bold">{l.kwh}</td><td className="px-2 py-1 text-right">₹{l.cost}</td></tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <button onClick={()=>{setSelectedId(d.id); window.scrollTo({top:0, behavior:'smooth'})}} className="w-full text-[11px] font-bold py-2 text-center" style={{color:'var(--accent)', background:'var(--surface-2)'}}>Open full logbook →</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Single device header */}
      {selectedDevice && (
        <div className="card p-4 mb-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[11px] text-faint uppercase tracking-widest font-bold">{selectedDevice.room}</p>
              <h3 className="text-[16px] font-extrabold">{selectedDevice.name} — Logbook</h3>
              <p className="text-[11px] text-faint mt-1">Registered <span className="font-mono font-bold text-muted">{selectedDevice.registeredAt}</span> · {daysSince(selectedDevice.registeredAt)} days · {selectedDevice.baseWatts} W</p>
            </div>
            <div className="rounded-xl px-3 py-2" style={{background:'var(--surface-2)'}}>
              <Sparkline data={getLogbook(selectedDevice, 14).map(l=>l.kwh)} />
            </div>
          </div>
        </div>
      )}

      {/* Search + sort */}
      <div className="flex flex-wrap gap-2 mb-3">
        <div className="flex items-center gap-2 rounded-xl px-3 py-2 flex-1 min-w-[200px]" style={{background:'var(--surface)', border:'1px solid var(--border)'}}>
          <Search className="w-4 h-4 text-muted shrink-0"/>
          <input value={query} onChange={e=>{setQuery(e.target.value); setPage(1)}} placeholder="Search device, room or YYYY-MM-DD" className="bg-transparent outline-none text-[13px] w-full" style={{color:'var(--text)'}}/>
        </div>
        <button onClick={()=>setSortDesc(v=>!v)} className="btn btn-ghost !px-3 !py-2"><ChevronDown className={`w-4 h-4 transition ${sortDesc?'':'rotate-180'}`}/>{sortDesc?'Newest':'Oldest'}</button>
        <span className="text-[11px] text-faint self-center ml-1">{filtered.length} records</span>
      </div>

      {/* Organised table / grouped */}
      <div className="card overflow-hidden">
        {!selectedDevice ? (
          // Grouped by device
          <div className="divide-y" style={{borderColor:'var(--border)'}}>
            {grouped.map(({device, rows})=>(
              <details key={device.id} open className="group">
                <summary className="flex items-center justify-between px-4 py-3 cursor-pointer list-none" style={{background:'var(--surface-2)'}}>
                  <span className="flex items-center gap-2 text-[13px] font-bold"><span className="w-2 h-2 rounded-full" style={{background:'var(--accent)'}}/>{device.name} <span className="text-faint font-normal">· {device.room}</span> <span className="chip hidden sm:inline-flex" style={{background:'var(--surface)'}}>{rows.length} days</span></span>
                  <ChevronRight className="w-4 h-4 text-muted group-open:rotate-90 transition"/>
                </summary>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="text-[11px] text-faint uppercase tracking-widest" style={{borderBottom:'1px solid var(--border)'}}>
                        <th className="px-4 py-2 font-bold">Date</th>
                        <th className="px-4 py-2 font-bold text-right">kWh</th>
                        <th className="px-4 py-2 font-bold text-right">Runtime</th>
                        <th className="px-4 py-2 font-bold text-right">Cost</th>
                        <th className="px-4 py-2 font-bold text-right hidden sm:table-cell">Watts</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.slice(0, 30).map(l=>(
                        <tr key={`${l.device.id}-${l.iso}`} className="text-[12px] border-b" style={{borderColor:'var(--border)'}}>
                          <td className="px-4 py-2 font-mono whitespace-nowrap">{l.iso} <span className="text-faint hidden sm:inline">{l.label}</span></td>
                          <td className="px-4 py-2 text-right font-bold">{l.kwh}</td>
                          <td className="px-4 py-2 text-right text-muted">{l.onHours}</td>
                          <td className="px-4 py-2 text-right font-bold" style={{color:'var(--accent)'}}>₹{l.cost}</td>
                          <td className="px-4 py-2 text-right text-faint hidden sm:table-cell">{l.device.baseWatts} W</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="px-4 py-2 flex justify-between text-[11px] text-faint"><span>Registered {device.registeredAt} · {daysSince(device.registeredAt)} days</span><Link to={`/device/${device.id}`} className="font-bold" style={{color:'var(--accent)'}}>View device →</Link></div>
              </details>
            ))}
            {grouped.length===0 && <p className="px-4 py-10 text-center text-muted">No records.</p>}
          </div>
        ) : (
          // Single device paginated table
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-[11px] text-faint uppercase tracking-widest" style={{borderBottom:'1px solid var(--border)'}}>
                    <th className="px-4 py-3 font-bold">Date</th>
                    <th className="px-4 py-3 font-bold text-right">kWh</th>
                    <th className="px-4 py-3 font-bold text-right">Runtime</th>
                    <th className="px-4 py-3 font-bold text-right">Cost</th>
                    <th className="px-4 py-3 font-bold text-right">Registered</th>
                  </tr>
                </thead>
                <tbody>
                  {paged.map(l=>(
                    <tr key={l.iso} className="text-[13px] border-b" style={{borderColor:'var(--border)'}}>
                      <td className="px-4 py-2.5 font-mono text-[12px] whitespace-nowrap">{l.iso}<span className="text-faint ml-2 hidden sm:inline">{l.label}</span></td>
                      <td className="px-4 py-2.5 text-right font-bold font-mono">{l.kwh}</td>
                      <td className="px-4 py-2.5 text-right text-muted font-mono text-[12px]">{l.onHours}</td>
                      <td className="px-4 py-2.5 text-right font-bold font-mono" style={{color:'var(--accent)'}}>₹{l.cost}</td>
                      <td className="px-4 py-2.5 text-right text-faint font-mono text-[11px]">{l.device.registeredAt}</td>
                    </tr>
                  ))}
                  {paged.length===0 && <tr><td colSpan={5} className="px-4 py-10 text-center text-muted">No records match filter.</td></tr>}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between px-4 py-3" style={{borderTop:'1px solid var(--border)'}}>
              <button disabled={page<=1} onClick={()=>setPage(p=>Math.max(1,p-1))} className="btn btn-ghost !px-3 !py-1 disabled:opacity-40">Prev</button>
              <span className="text-[12px] font-mono text-faint">Page {page} / {totalPages} · {filtered.length} total</span>
              <button disabled={page>=totalPages} onClick={()=>setPage(p=>Math.min(totalPages,p+1))} className="btn btn-ghost !px-3 !py-1 disabled:opacity-40">Next</button>
            </div>
          </>
        )}
        <p className="text-[11px] text-faint px-4 py-3 leading-relaxed" style={{borderTop:'1px solid var(--border)'}}>
          Each log starts on the device's <span className="font-bold text-muted">registeredAt</span> date and runs daily to today. Add a device → its logbook starts from the addition date. Use Export CSV for full data.
        </p>
      </div>
    </div>
  );
}
