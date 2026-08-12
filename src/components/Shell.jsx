import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Plug, Cpu, BarChart3, ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/connect', label: 'Connect', icon: Plug },
  { to: '/devices', label: 'Devices', icon: Cpu },
  { to: '/insights', label: 'Insights', icon: BarChart3 },
];

export default function Shell({ pro, setPro, activeColor, glowClass }) {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const linkClass = ({ isActive }) =>
    `flex items-center gap-2 px-3 py-2 rounded-xl text-[13px] font-semibold transition-all ${
      isActive
        ? `${activeColor} bg-white/5 border border-white/10`
        : 'text-slate-400 hover:text-white hover:bg-white/5'
    }`;

  return (
    <div className="min-h-screen text-[#F8FAFC]">
      <div className="fixed inset-0 bg-lattice-grid pointer-events-none" />
      <div
        className="fixed -top-40 -left-40 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(225,29,72,0.12) 0%, transparent 70%)' }}
      />
      <div
        className="fixed -bottom-40 -right-40 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(14,165,233,0.10) 0%, transparent 70%)' }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pb-24 md:pb-10 pt-4">
        <nav
          className={`sticky top-0 z-40 mb-6 transition-all ${
            scrolled ? 'rug-glass' : ''
          }`}
        >
          <div className="glass-panel rounded-2xl px-4 py-3 flex items-center gap-3">
            <button onClick={() => navigate('/')} className="flex items-center gap-2.5 shrink-0">
              <div className={`w-9 h-9 rounded-xl ${activeColor} ${glowClass} flex items-center justify-center transition-all duration-300`}>
                <img src="/lattice-mark.svg" alt="LATTICE" className="w-5 h-5" draggable="false" />
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-[15px] font-extrabold leading-none tracking-tight">LATTICE</p>
                <p className="text-[9px] text-slate-500 uppercase tracking-[0.18em]">Smart Energy</p>
              </div>
            </button>

            <div className="hidden md:flex items-center gap-1 flex-1 justify-center">
              {navItems.map(it => (
                <NavLink key={it.to} to={it.to} end={it.end} className={linkClass}>
                  <it.icon className="w-4 h-4" />
                  {it.label}
                </NavLink>
              ))}
            </div>

            <div className="flex-1 md:hidden" />

            <button
              onClick={() => setPro(p => !p)}
              className={`glass-button flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                pro ? 'text-sky-300 border-sky-400/30' : 'text-white'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${pro ? 'bg-sky-400' : 'bg-slate-600'}`} />
              <span className="hidden xs:inline sm:inline">{pro ? 'PRO' : 'PRO FREE'}</span>
            </button>
          </div>

          <div className="md:hidden fixed bottom-4 left-4 right-4 z-50">
            <div className="glass-panel rounded-2xl px-2 py-2 flex justify-around">
              {navItems.map(it => (
                <NavLink key={it.to} to={it.to} end={it.end} className={linkClass}>
                  <it.icon className="w-5 h-5" />
                  <span className="text-[10px]">{it.label}</span>
                </NavLink>
              ))}
            </div>
          </div>
        </nav>

        <div className="md:hidden flex items-center gap-2 mb-4">
          <button onClick={() => navigate(-1)} className="glass-button rounded-xl p-2">
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>

        <Outlet context={{ pro, setPro, activeColor, glowClass }} />
      </div>
    </div>
  );
}