import { Sun, Zap, ArrowLeftRight, BatteryCharging, Percent } from 'lucide-react';
import { useEnergy } from '../context/EnergyContext.jsx';
import { mockHome } from '../data/mockData.js';

export default function Solar() {
  const { totalToday } = useEnergy();
  const houseKwh = Math.max(8, totalToday / mockHome.tariff);
  const generated = Math.round(houseKwh * 1.35 * 10)/10; // mock 35% more than consumed
  const consumed = Math.round(houseKwh * 10)/10;
  const sentBack = Math.max(0, Math.round((generated - consumed*0.62)*10)/10); // 62% self-consumed
  const selfConsumed = Math.round((generated - sentBack)*10)/10;
  const contribution = Math.round((selfConsumed / consumed)*100);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight flex items-center gap-2"><Sun className="w-6 h-6" style={{color:'#F59E0B'}}/> Solar</h1>
        <p className="text-[13px] text-muted mt-1">For solar-powered homes — generation vs use. Mock data demo.</p>
      </div>

      <div className="card p-5 sm:p-6 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-9 h-9 rounded-xl flex items-center justify-center" style={{background:'rgba(245,158,11,0.14)'}}><Sun className="w-5 h-5" style={{color:'#F59E0B'}}/></span>
          <div>
            <p className="font-bold text-[14px]">Today — Solar overview</p>
            <p className="text-[11px] text-faint">House is solar powered (demo). Grid is fallback.</p>
          </div>
          <span className="ml-auto chip" style={{background:'rgba(245,158,11,0.14)', color:'#F59E0B'}}><Percent className="w-3 h-3"/> {contribution}% solar</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-xl p-3 text-center" style={{background:'var(--surface-2)'}}>
            <p className="text-[11px] text-faint flex items-center justify-center gap-1"><Sun className="w-3 h-3"/> Generated</p>
            <p className="text-[18px] font-black mt-1" style={{color:'#F59E0B'}}>{generated} kWh</p>
          </div>
          <div className="rounded-xl p-3 text-center" style={{background:'var(--surface-2)'}}>
            <p className="text-[11px] text-faint flex items-center justify-center gap-1"><Zap className="w-3 h-3"/> Consumed</p>
            <p className="text-[18px] font-black mt-1">{consumed} kWh</p>
          </div>
          <div className="rounded-xl p-3 text-center" style={{background:'var(--surface-2)'}}>
            <p className="text-[11px] text-faint flex items-center justify-center gap-1"><ArrowLeftRight className="w-3 h-3"/> Sent to grid</p>
            <p className="text-[18px] font-black mt-1" style={{color:'var(--green)'}}>{sentBack} kWh</p>
          </div>
          <div className="rounded-xl p-3 text-center" style={{background:'rgba(16,185,129,0.14)'}}>
            <p className="text-[11px] text-faint flex items-center justify-center gap-1"><BatteryCharging className="w-3 h-3"/> Contribution</p>
            <p className="text-[18px] font-black mt-1" style={{color:'var(--green)'}}>{contribution}%</p>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex justify-between text-[11px] font-bold mb-1.5"><span>Solar contribution</span><span style={{color:'var(--green)'}}>{contribution}%</span></div>
          <div className="h-3 rounded-full overflow-hidden flex" style={{background:'var(--surface-2)'}}>
            <div style={{width:`${contribution}%`, background:'#F59E0B'}} />
            <div style={{width:`${100-contribution}%`, background:'var(--surface)' , borderLeft:'1px solid var(--border)'}} />
          </div>
          <p className="text-[11px] text-faint mt-1.5">{selfConsumed} kWh of solar directly used · {sentBack} kWh exported. At tariff ₹{mockHome.tariff}, you saved ~₹{Math.round(selfConsumed*mockHome.tariff)} today.</p>
        </div>
      </div>

      <div className="card p-5">
        <p className="label mb-2">How it works</p>
        <p className="text-[12px] text-muted leading-relaxed">Solar → home first, excess → grid. On cloudy days grid fills gap. This tab is demo — connect your inverter (SMA, SolarEdge, Enphase) via Connect tab to show real data.</p>
      </div>
    </div>
  );
}
