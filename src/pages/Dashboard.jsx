import { useOutletContext, Link } from 'react-router-dom';
import { Bolt, Zap, Power, ChevronRight, Home, Moon, Play, AlertTriangle, Sparkles, X, SlidersHorizontal, Activity, LayoutGrid, GripVertical, RotateCcw } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useEnergy } from '../context/EnergyContext.jsx';
import { mockHome, dailyProfile, anomalies, potentialSavings } from '../data/mockData.js';
import FloorCircular from '../components/FloorCircular.jsx';
import HourlyLineGraph from '../components/HourlyLineGraph.jsx';
import EnvironmentalImpact from '../components/EnvironmentalImpact.jsx';
import BigBreakdownBar from '../components/BigBreakdownBar.jsx';
import TodaysReport from '../components/TodaysReport.jsx';
import EnergyAlerts from '../components/EnergyAlerts.jsx';
import EnergyDistribution from '../components/EnergyDistribution.jsx';
import FloorPlan from '../components/FloorPlan.jsx';

export default function Dashboard() {
  const { pro } = useOutletContext();
  const { devices, paused, setPaused, toggleDevice, toggleRoom, setAll, nightMode, setRoomState, addDevice, totalWatts, totalToday, totalMonth } = useEnergy();
  const [pendingRoom, setPendingRoom] = useState(null);
  const [widgetDrawer, setWidgetDrawer] = useState(null);
  const defaultOrder = ['spend','insights','quick','floors','usage','devices','rooms','hogs','alerts','env','report','breakdown','distribution','floorplan'];
  const [widgetOrder, setWidgetOrder] = useState(()=>{
    try{
      const s=localStorage.getItem('lattice-widget-order');
      if(s){const p=JSON.parse(s); if(Array.isArray(p)&&p.length===defaultOrder.length&&defaultOrder.every(id=>p.includes(id))) return p;}
    }catch{}
    return defaultOrder;
  });
  const [dragId, setDragId]=useState(null);
  useEffect(()=>{ localStorage.setItem('lattice-widget-order', JSON.stringify(widgetOrder)); },[widgetOrder]);
  const move = (id, dir)=>{
    setWidgetOrder(prev=>{
      const a=[...prev]; const i=a.indexOf(id); const j=dir==='up'?i-1:i+1;
      if(i===-1||j<0||j>=a.length) return prev;
      [a[i],a[j]]=[a[j],a[i]]; return a;
    });
  };
  const onDragStart = (e, id) => { setDragId(id); e.dataTransfer.effectAllowed='move'; e.dataTransfer.setData('text/plain', id); };
  const onDragOver = (e) => { e.preventDefault(); e.dataTransfer.dropEffect='move'; };
  const onDrop = (e, targetId) => {
    e.preventDefault();
    const from = dragId || e.dataTransfer.getData('text/plain');
    if (!from || from===targetId) return;
    setWidgetOrder(prev=>{
      const a=[...prev];
      const fi=a.indexOf(from), ti=a.indexOf(targetId);
      if (fi===-1||ti===-1) return prev;
      a.splice(fi,1); a.splice(ti,0,from);
      return a;
    });
    setDragId(null);
  };

  const requestToggleRoom = (roomName) => {
    const dvs = devices.filter(d => d.room === roomName);
    if (roomName === 'Guest Room' && dvs.length === 0) {
      addDevice({ name: 'Guest Light', room: 'Guest Room', baseWatts: 60 });
      return;
    }
    const anyOn = dvs.some(d => d.status === 'on');
    if (anyOn) {
      const willOff = dvs.filter(d => d.status === 'on');
      setPendingRoom({ name: roomName, devices: willOff });
    } else {
      // for Utility/Guest with paused devices, use setRoomState to force on
      if (roomName === 'Utility' || roomName === 'Guest Room') {
        setRoomState(roomName, true);
      } else {
        toggleRoom(roomName);
      }
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

  const Widget = ({ id, label, title, icon: Icon, children, pullout }) => (
    <div className="card relative overflow-hidden flex flex-col min-h-[220px] group/widget">
      <div className="flex items-center justify-between px-5 py-3 shrink-0" style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1">
            <button onClick={()=>move(id,'up')} className="p-1 rounded hover:bg-[var(--surface-2)]" title="Move up"><span style={{fontSize:10}}>▲</span></button>
            <button onClick={()=>move(id,'down')} className="p-1 rounded hover:bg-[var(--surface-2)]" title="Move down"><span style={{fontSize:10}}>▼</span></button>
          </span>
          {Icon && <span className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'var(--surface-2)' }}><Icon className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} /></span>}
          <div>
            <p className="text-[10px] font-bold tracking-widest uppercase leading-none" style={{ color: 'var(--text-faint)' }}>{label}</p>
            <p className="text-[13px] font-extrabold leading-none mt-1" style={{ color: 'var(--text)' }}>{title}</p>
          </div>
        </div>
        {pullout && (
          <button onClick={() => setWidgetDrawer(widgetDrawer === id ? null : id)} className="btn btn-ghost !p-2 !px-2.5" title="Open widget menu">
            {widgetDrawer === id ? <X className="w-4 h-4" /> : <SlidersHorizontal className="w-4 h-4" />}
          </button>
        )}
      </div>
      <div className="p-5 flex-1 no-scrollbar" style={{ overflow: 'auto' }}>
        {children}
      </div>
      {pullout && widgetDrawer === id && (
        <div className="absolute inset-0 z-10 flex">
          <div className="flex-1 bg-black/40 backdrop-blur-sm" onClick={() => setWidgetDrawer(null)} />
          <div className="w-[78%] max-w-[320px] h-full overflow-auto p-4 shadow-2xl" style={{ background: 'var(--surface)', borderLeft: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between mb-3">
              <p className="font-extrabold text-[13px] flex items-center gap-2"><LayoutGrid className="w-4 h-4" /> {title}</p>
              <button onClick={() => setWidgetDrawer(null)} className="btn btn-ghost !p-1.5"><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-3">
              {pullout}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const DragWrap = ({ id, span, children }) => (
    <div
      onDragOver={onDragOver}
      onDrop={e=>onDrop(e, id)}
      onDragEnter={e=>e.preventDefault()}
      className={`${span || ''} ${dragId===id ? 'opacity-40' : ''} transition-opacity`}
    >
      {children}
    </div>
  );

  return (
    <div className="flex flex-col gap-4 pb-6">
      <div className="flex items-center justify-between">
        <p className="text-[11px]" style={{color:'var(--text-faint)'}}>↕ Use ▲▼ on any widget to reorder — saved. All adapt to dark/light.</p>
        <button onClick={()=>{localStorage.removeItem('lattice-widget-order'); setWidgetOrder(defaultOrder);}} className="btn btn-ghost !px-3 !py-1.5 !text-[11px]"><RotateCcw className="w-3 h-3"/> Reset order</button>
      </div>
      {/* Movable widgets — flex with order, all theme-aware — movable */}
      <div className="flex flex-wrap gap-4">
        <div style={{order: widgetOrder.indexOf('spend')}} className="w-full xl:w-[calc(50%-0.5rem)]">
        {/* 1 — Spend */}
        <Widget
          id="spend"
          label={`${mockHome.name} · Home Assistant`}
          title="01 · Estimated spend today"
          icon={Zap}
          pullout={
            <>
              <p className="text-[12px] text-muted leading-relaxed">Live total updates every 300ms. Tariff ₹{mockHome.tariff}/unit.</p>
              <button onClick={() => setPaused(p => !p)} className="btn btn-ghost w-full justify-center"><Power className="w-4 h-4" /> {paused ? 'Resume live' : 'Pause live'}</button>
              <div className="rounded-xl p-3 flex items-center gap-2" style={{ background: paused ? 'rgba(100,116,139,0.15)' : 'var(--green-soft)' }}>
                <span className={`w-2 h-2 rounded-full ${paused ? 'bg-slate-500' : 'bg-emerald-400'}`} />
                <span className="text-[12px] font-bold" style={{ color: paused ? 'var(--text-muted)' : 'var(--green)' }}>{paused ? 'Paused — values frozen' : 'Live — updating'}</span>
              </div>
            </>
          }
        >
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[40px] font-black leading-none tracking-tight" style={{color:'var(--text)'}}>₹{totalToday.toLocaleString('en-IN')}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="chip" style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}><Zap className="w-3 h-3" /> {totalWatts.toLocaleString('en-IN')} W live</span>
                <span className="chip" style={{ background: 'var(--surface-2)', color:'var(--text-muted)' }}>≈ ₹{Math.round(totalMonth).toLocaleString('en-IN')}/mo</span>
                <span className="chip" style={{ background: delta > 0 ? 'var(--amber-soft)' : 'var(--green-soft)', color: delta > 0 ? 'var(--amber)' : 'var(--green)' }}>{delta > 0 ? '+' : '−'}₹{Math.abs(delta)} vs yesterday</span>
              </div>
            </div>
            <span className={`hidden sm:flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full ${paused ? 'bg-slate-500 text-white' : 'bg-emerald-500 text-white'}`}>{paused ? 'paused' : 'live'}</span>
          </div>
        </Widget>
        </div>

        <div style={{order: widgetOrder.indexOf('insights')}} className="w-full xl:w-[calc(50%-0.5rem)]">
        {/* 2 — Waste & Savings */}
        <Widget id="insights" label="Attention" title="02 · Waste & Savings" icon={Sparkles} pullout={<p className="text-[12px]" style={{color:'var(--text-muted)'}}>Insights are on the Insights tab. This widget shows top waste + potential savings.</p>}>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl p-4 border" style={{ borderColor: 'rgba(251,191,36,0.3)', background: 'var(--amber-soft)' }}>
              <p className="text-[11px] font-bold flex items-center gap-1" style={{ color: 'var(--amber)' }}><AlertTriangle className="w-3.5 h-3.5" /> Potential Waste</p>
              <p className="text-[13px] font-extrabold mt-2 leading-snug" style={{color:'var(--text)'}}>{waste.title} <span style={{ color: 'var(--amber)' }}>+{waste.aboveUsualPercent}%</span></p>
              <p className="text-[11px] mt-1" style={{color:'var(--text-muted)'}}>Extra <span className="font-bold" style={{ color: 'var(--amber)' }}>₹{waste.extraCostWeek}/wk</span></p>
              <Link to="/insights" className="text-[11px] font-bold mt-2 inline-flex items-center gap-1" style={{ color: 'var(--amber)' }}>View <ChevronRight className="w-3 h-3" /></Link>
            </div>
            <div className="rounded-xl p-4 border" style={{ borderColor: 'rgba(52,211,153,0.3)', background: 'var(--green-soft)' }}>
              <p className="text-[11px] font-bold flex items-center gap-1" style={{ color: 'var(--green)' }}><Sparkles className="w-3.5 h-3.5" /> Savings</p>
              <p className="text-[22px] font-black leading-none mt-2" style={{ color: 'var(--green)' }}>₹{savings}<span className="text-[11px] font-bold" style={{color:'var(--text-muted)'}}>/mo</span></p>
              <p className="text-[11px]" style={{color:'var(--text-muted)'}}>Unusual patterns</p>
            </div>
          </div>
        </Widget>
        </div>

        <div style={{order: widgetOrder.indexOf('quick')}} className="w-full">
        {/* 3 — Quick actions — ordered */}
        <div className="card p-4 flex flex-wrap items-center gap-2" style={{background:'var(--surface)', borderColor:'var(--border)'}}>
          <span className="label" style={{color:'var(--text-faint)'}}>03 · Quick actions</span>
          <button onClick={() => setAll('on')} className="btn btn-ghost !px-3 !py-1.5 !text-[11px]"><Play className="w-3 h-3" /> All on</button>
          <button onClick={nightMode} className="btn btn-ghost !px-3 !py-1.5 !text-[11px]"><Moon className="w-3 h-3" /> Night</button>
          <button onClick={() => setAll('off')} className="btn btn-ghost !px-3 !py-1.5 !text-[11px]"><Power className="w-3 h-3" /> All off</button>
          <span className="text-[11px] ml-auto hidden sm:inline" style={{color:'var(--text-faint)'}}>Drag ▲▼ to reorder</span>
        </div>
        </div>

        <div style={{order: widgetOrder.indexOf('floors')}} className="w-full">
        {/* 4 — Floors circular */}
        <div className="card relative overflow-hidden flex flex-col" style={{background:'var(--surface)', borderColor:'var(--border)'}}>
          <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: '1px solid var(--border)', background:'var(--surface)' }}>
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'var(--surface-2)' }}><LayoutGrid className="w-3.5 h-3.5" style={{color:'var(--text-muted)'}} /></span>
              <div>
                <p className="text-[10px] font-bold tracking-widest uppercase" style={{color:'var(--text-faint)'}}>04 · Widgets</p>
                <p className="text-[13px] font-extrabold" style={{color:'var(--text)'}}>Floors — circular</p>
              </div>
            </div>
            <button onClick={()=>setWidgetDrawer(widgetDrawer==='floors'?null:'floors')} className="btn btn-ghost !p-2"><SlidersHorizontal className="w-4 h-4" /></button>
          </div>
          <div className="p-5 xl:p-6 flex-1" style={{background:'var(--surface)'}}>
            <FloorCircular />
          </div>
          {widgetDrawer==='floors' && (
            <div className="absolute inset-0 z-10 flex">
              <div className="flex-1 bg-black/40 backdrop-blur-sm" onClick={()=>setWidgetDrawer(null)} />
              <div className="w-[78%] max-w-[320px] h-full overflow-auto p-4 shadow-2xl" style={{ background: 'var(--surface)', borderLeft:'1px solid var(--border)'}}>
                <div className="flex items-center justify-between mb-3">
                  <p className="font-extrabold text-[13px]" style={{color:'var(--text)'}}>Floors — help</p>
                  <button onClick={()=>setWidgetDrawer(null)} className="btn btn-ghost !p-1.5"><X className="w-4 h-4"/></button>
                </div>
                <p className="text-[12px] leading-relaxed" style={{color:'var(--text-muted)'}}>Each ring = one floor, distinct colour (all 4 shown in every row). Center is tiny so all 4 rings stay visible. Use day chips or tap a ring. Full logbook in Logbook → Floors.</p>
                <Link to="/logbook" onClick={()=>setWidgetDrawer(null)} className="btn btn-primary w-full justify-center mt-3">Open Logbook →</Link>
              </div>
            </div>
          )}
        </div>
        </div>

        <div style={{order: widgetOrder.indexOf('usage')}} className="w-full xl:w-[calc(50%-0.5rem)]">
        {/* 5 — Today's usage */}
        <Widget id="usage" label="Today's curve" title="05 · Whole-home watts — line" icon={Activity} pullout={
          <>
            <p className="text-[12px]" style={{color:'var(--text-muted)'}}>Line graph shows 24h watts. Hover for exact value. Full breakdown on Usage tab.</p>
            <Link to="/usage" onClick={()=>setWidgetDrawer(null)} className="btn btn-ghost w-full justify-center">Open Usage →</Link>
          </>
        }>
          <HourlyLineGraph data={hours} />
          <Link to="/usage" className="flex items-center gap-1 text-[12px] font-bold mt-3" style={{ color: 'var(--accent)' }}>Full breakdown <ChevronRight className="w-3.5 h-3.5" /></Link>
        </Widget>
        </div>

        <div style={{order: widgetOrder.indexOf('devices')}} className="w-full xl:w-[calc(50%-0.5rem)]">
        {/* 6 — Devices */}
        <Widget id="devices" label={`${onDevices.length} on · ${offDevices.length} off`} title="06 · Devices" icon={Bolt} pullout={
          <>
            <p className="text-[12px]" style={{color:'var(--text-muted)'}}>Toggle any device. New devices can be added on Devices tab.</p>
            <Link to="/devices" onClick={()=>setWidgetDrawer(null)} className="btn btn-primary w-full justify-center">Add device →</Link>
          </>
        }>
          <div className="divide-y no-scrollbar pr-1" style={{ borderColor: 'var(--border)', maxHeight: 320, overflow: 'auto' }}>
            {devices.map(d => <DeviceRow key={d.id} d={d} />)}
          </div>
          <Link to="/devices" className="flex items-center gap-1 text-[12px] font-bold mt-3" style={{ color: 'var(--accent)' }}>Manage & identify devices <ChevronRight className="w-3.5 h-3.5" /></Link>
        </Widget>
        </div>

        <div style={{order: widgetOrder.indexOf('rooms')}} className="w-full xl:w-[calc(50%-0.5rem)]">
        {/* 7 — Rooms — same red switch for all, including Utility & Guest */}
        <Widget id="rooms" label="Spaces" title="07 · Rooms — tap to toggle" icon={Home} pullout={<p className="text-[12px]" style={{color:'var(--text-muted)'}}>All rooms use the same red toggle. Guest has no devices — switch is reserved. Utility toggles via ON/OFF state.</p>}>
          <div className="grid grid-cols-2 gap-3">
            {mockHome.rooms.map(r => {
              const dvs = devices.filter(d => d.room === r.name);
              const w = dvs.reduce((s, d) => s + d.currentWatts, 0);
              const c = dvs.reduce((s, d) => s + d.monthCost, 0);
              const roomOn = dvs.some(d => d.status === 'on');
              return (
                <div key={r.id} className="rounded-xl p-4 border flex flex-col" style={{ background: 'var(--surface-2)', borderColor: 'var(--border)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="flex items-center gap-2 text-[13px] font-bold truncate" style={{color:'var(--text)'}}><Home className="w-4 h-4" style={{color:'var(--text-muted)'}} />{r.name}</span>
                    <button
                      onClick={() => requestToggleRoom(r.name)}
                      className={`switch ${roomOn ? 'on' : ''} scale-90`}
                      title={roomOn ? 'Turn off' : 'Turn on'}
                    />
                  </div>
                  <p className="text-[11px] font-mono" style={{ color: w > 0 ? 'var(--text)' : 'var(--text-faint)' }}>{w > 0 ? `${w} W` : 'idle'}</p>
                  <p className="text-[11px]" style={{color:'var(--text-faint)'}}>₹{c.toLocaleString('en-IN')}/mo · {dvs.length} device{dvs.length!==1?'s':''}</p>
                  {r.name === 'Guest Room' && dvs.length===0 && <p className="text-[10px] mt-2" style={{color:'var(--text-faint)'}}>Tap switch to add Guest Light</p>}
                </div>
              );
            })}
          </div>
        </Widget>
        </div>

        <div style={{order: widgetOrder.indexOf('hogs')}} className="w-full xl:w-[calc(50%-0.5rem)]">
        {/* 8 — Hogs */}
        <Widget id="hogs" label="Ranked by monthly cost" title="08 · Highest consumers" icon={Zap} pullout={<Link to="/usage" onClick={()=>setWidgetDrawer(null)} className="btn btn-ghost w-full justify-center">See full ranking →</Link>}>
          {hogs.map((d, i) => {
            const anom = anomalies.find(a => a.deviceId === d.id && a.kind === 'high');
            return (
              <div key={d.id} className="flex items-center gap-3 py-2.5">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: i === 0 ? 'var(--amber-soft)' : 'var(--surface-2)' }}>
                  {i === 0 ? <Bolt className="w-3.5 h-3.5" style={{color:'#F59E0B'}} /> : <Zap className="w-3.5 h-3.5" style={{color:'var(--text-muted)'}} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold truncate" style={{color:'var(--text)'}}>{d.name}</p>
                  {anom && <p className="text-[11px] font-bold flex items-center gap-1" style={{ color: 'var(--amber)' }}><AlertTriangle className="w-3 h-3" /> {anom.aboveUsualPercent}% above usual</p>}
                </div>
                <div className="w-24 h-1.5 rounded-full overflow-hidden shrink-0" style={{ background: 'var(--surface-2)' }}><div className="h-full rounded-full" style={{ width: `${Math.max(8, (d.monthCost / maxHog) * 100)}%`, background: i === 0 ? 'var(--amber)' : 'var(--accent)' }} /></div>
                <p className="text-[13px] font-bold w-[86px] text-right shrink-0" style={{ color: i === 0 ? 'var(--amber)' : 'var(--text)' }}>₹{d.monthCost.toLocaleString('en-IN')}</p>
              </div>
            );
          })}
        </Widget>
        </div>

        <div style={{order: widgetOrder.indexOf('alerts')}} className="w-full">
        {/* 09 — Alerts (spike + long-running) */}
        <div>
          <EnergyAlerts />
        </div>
        </div>

        <div style={{order: widgetOrder.indexOf('env')}} className="w-full xl:w-[calc(50%-0.5rem)]">
        {/* 10 — Today's total + environmental impact */}
        <Widget id="env" label="Planet" title="09 · Environmental Impact" icon={Sparkles} pullout={<p className="text-[12px]" style={{color:'var(--text-muted)'}}>CO₂ at 0.82 kg/kWh, trees at 21 kg/year. Renewable share is mock.</p>}>
          <EnvironmentalImpact />
        </Widget>
        </div>
        <div style={{order: widgetOrder.indexOf('report')}} className="w-full xl:w-[calc(50%-0.5rem)]">
        <Widget id="report" label="Report" title="10 · Today's Report" icon={Activity} pullout={<p className="text-[12px]" style={{color:'var(--text-muted)'}}>Daily report auto-rates Low (&lt;6 kWh) / Normal / High and suggests prevention.</p>}>
          <TodaysReport />
        </Widget>
        </div>

        <div style={{order: widgetOrder.indexOf('breakdown')}} className="w-full">
        {/* 11 — Big breakdown bar */}
        <div>
          <BigBreakdownBar />
        </div>
        </div>
      </div>

      {/* Room off warning */}
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
                <p key={d.id} className="text-[13px] font-semibold flex items-center gap-2"><span>⚠️</span> {d.name} <span className="text-[11px] font-mono text-muted">({d.currentWatts} W)</span> <span>🔌</span></p>
              ))}
              <p className="text-[11px] font-bold mt-2 flex items-center gap-1" style={{ color: 'var(--amber)' }}>⚡ All listed devices will lose power! ⚡</p>
            </div>
            <p className="text-[11px] text-faint mb-4 flex items-center gap-1.5">💡 Tip: You can turn them back on individually from Devices.</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setPendingRoom(null)} className="btn btn-ghost !px-4 !py-2">Cancel</button>
              <button onClick={() => { setRoomState(pendingRoom.name, false); setPendingRoom(null); }} className="btn btn-primary !px-5 !py-2" style={{ background: '#F59E0B', color: '#fff' }}>⚠️ Yes, turn off</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
