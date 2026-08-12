import { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Shell from './components/Shell.jsx';
import Welcome from './pages/Welcome.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Usage from './pages/Usage.jsx';
import Connect from './pages/Connect.jsx';
import Devices from './pages/Devices.jsx';
import DeviceDetail from './pages/DeviceDetail.jsx';
import Insights from './pages/Insights.jsx';
import { EnergyProvider } from './context/EnergyContext.jsx';

export default function App() {
  const [pro, setPro] = useState(() => localStorage.getItem('lattice-pro') === '1');
  const [theme, setTheme] = useState(() => localStorage.getItem('lattice-theme') || 'dark');
  const [started, setStarted] = useState(() => localStorage.getItem('lattice-started') === '1');

  useEffect(() => {
    localStorage.setItem('lattice-pro', pro ? '1' : '0');
  }, [pro]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('lattice-theme', theme);
  }, [theme]);

  const activeColor = pro ? 'text-sky-400' : 'text-rose-400';
  const glowClass = pro ? 'glow-blue' : 'glow-magenta';

  return (
    <HashRouter>
      <EnergyProvider>
        <Routes>
          <Route
            path="/welcome"
            element={
              started ? (
                <Navigate to="/" replace />
              ) : (
                <Welcome
                  onStart={() => {
                    localStorage.setItem('lattice-started', '1');
                    setStarted(true);
                  }}
                />
              )
            }
          />
          <Route element={<Shell pro={pro} setPro={setPro} theme={theme} setTheme={setTheme} activeColor={activeColor} glowClass={glowClass} />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/usage" element={<Usage />} />
            <Route path="/connect" element={<Connect />} />
            <Route path="/devices" element={<Devices />} />
            <Route path="/device/:id" element={<DeviceDetail />} />
            <Route path="/insights" element={<Insights />} />
          </Route>
          <Route path="*" element={<Navigate to={started ? '/' : '/welcome'} replace />} />
        </Routes>
      </EnergyProvider>
    </HashRouter>
  );
}