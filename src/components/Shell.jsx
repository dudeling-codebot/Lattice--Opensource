import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Plug, Cpu, BarChart3, TrendingUp, Sun, Moon, Crown, User, BookOpen } from 'lucide-react';
import { useEffect, useState } from 'react';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/usage', label: 'Usage', icon: TrendingUp },
  { to: '/connect', label: 'Connect', icon: Plug },
  { to: '/devices', label: 'Devices', icon: Cpu },
  { to: '/insights', label: 'Insights', icon: BarChart3 },
  { to: '/profile', label: 'Profile', icon: User },
  { to: '/logbook', label: 'Logbook', icon: BookOpen },
];

export default function Shell({ pro, setPro, theme, setTheme, activeColor, glowClass }) {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <div className={scrolled ? 'h-16' : ''}>
        <header
          className="fixed top-0 left-0 right-0 z-40 transition-all duration-200"
          style={{
            background: scrolled ? 'var(--surface)' : 'var(--bg)',
            borderBottom: '1px solid var(--border)',
          }}
        >
          <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-3">
            <button onClick={() => navigate('/')} className="flex items-center gap-2.5 shrink-0">
              <img
                src="/brand/logo.png"
                alt="LATTICE logo"
                className="w-8 h-8 rounded-[9px] object-cover"
                draggable="false"
              />
              <div className="hidden sm:block text-left">
                <p className="text-[15px] font-extrabold leading-none tracking-tight">LATTICE</p>
                <p className="text-[9px] text-faint uppercase tracking-[0.18em] mt-0.5">Smart Energy</p>
              </div>
            </button>

            <nav className="hidden md:flex items-center gap-1 flex-1 justify-center overflow-x-auto">
              {navItems.map(it => (
                <NavLink key={it.to} to={it.to} end={it.end} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''} shrink-0`}>
                  <it.icon className="w-4 h-4" />
                  {it.label}
                </NavLink>
              ))}
            </nav>

            <div className="flex-1 md:hidden" />

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setTheme(t => (t === 'dark' ? 'light' : 'dark'))}
                className="btn-ghost btn !px-2.5 !py-2"
                title="Toggle light/dark mode"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setPro(p => !p)}
                className={`btn !px-3 !py-2 ${pro ? 'bg-sky-500 text-white' : 'btn-ghost'}`}
                title={pro ? 'PRO active' : 'Try PRO for free'}
              >
                <Crown className="w-4 h-4" />
                <span className={`hidden sm:inline ${pro ? '' : activeColor}`}>{pro ? 'PRO' : 'PRO FREE'}</span>
              </button>
            </div>
          </div>
        </header>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-20 pb-24 md:pb-12">
        <Outlet context={{ pro, setPro, theme, setTheme, activeColor, glowClass }} />
      </div>

      <nav className="md:hidden fixed bottom-4 left-1 right-1 z-50 card !rounded-2xl px-1 py-1.5 flex gap-0.5 overflow-x-auto scrollbar-none justify-between">
        {navItems.map(it => (
          <NavLink
            key={it.to}
            to={it.to}
            end={it.end}
            className={({ isActive }) => `flex flex-col items-center gap-0.5 rounded-xl px-2 py-1.5 text-[9px] font-bold transition-all shrink-0 ${isActive ? 'nav-item active' : 'nav-item'}`}
          >
            <it.icon className="w-4 h-4" />
            {it.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}