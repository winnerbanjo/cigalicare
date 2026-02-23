import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Portal } from '@/components/Portal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { useCigaliData } from '@/hooks/useCigaliData';
import { useAuthStore } from '@/store/auth.store';
import { cn } from '@/utils/cn';

const navItems = [
  { label: 'Workspace', to: '/app' },
  { label: 'Patients', to: '/app/patients' },
  { label: 'Appointments', to: '/app/appointments' },
  { label: 'Inventory', to: '/app/inventory' },
  { label: 'Billing', to: '/app/billing' },
  { label: 'Staff', to: '/app/staff' },
  { label: 'Settings', to: '/app/settings' }
];

const pageTitleByPath: Record<string, string> = {
  '/app': 'Doctor Workspace',
  '/app/patients': 'Patients',
  '/app/appointments': 'Appointments',
  '/app/inventory': 'Inventory',
  '/app/billing': 'Billing',
  '/app/staff': 'Staff',
  '/app/settings': 'Settings'
};

export const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const { patients, appointments, medications, staff, notifications } = useCigaliData();

  const [query, setQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchRect, setSearchRect] = useState<DOMRect | null>(null);
  const [notifRect, setNotifRect] = useState<DOMRect | null>(null);
  const searchRef = useRef<HTMLDivElement | null>(null);
  const bellRef = useRef<HTMLButtonElement | null>(null);

  const updateFloatingPositions = () => {
    if (searchRef.current) {
      setSearchRect(searchRef.current.getBoundingClientRect());
    }
    if (bellRef.current) {
      setNotifRect(bellRef.current.getBoundingClientRect());
    }
  };

  useEffect(() => {
    updateFloatingPositions();
    const onWindowChange = () => updateFloatingPositions();
    window.addEventListener('resize', onWindowChange);
    window.addEventListener('scroll', onWindowChange, true);
    return () => {
      window.removeEventListener('resize', onWindowChange);
      window.removeEventListener('scroll', onWindowChange, true);
    };
  }, []);

  useEffect(() => {
    updateFloatingPositions();
  }, [query, showNotifications, location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const pageTitle = pageTitleByPath[location.pathname] ?? 'Workspace';

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return [];

    const patientMatches = patients
      .filter((p) =>
        `${p.firstName} ${p.lastName}`.toLowerCase().includes(term) ||
        (p.phone ?? '').toLowerCase().includes(term) ||
        (p.email ?? '').toLowerCase().includes(term) ||
        (p.chronicConditions ?? []).some((c) => c.toLowerCase().includes(term))
      )
      .slice(0, 6)
      .map((p) => ({ label: `${p.firstName} ${p.lastName}`, sub: p.phone || p.chronicConditions?.[0] || 'Patient', to: `/app/patients/${p._id}`, kind: 'Patient' }));

    const appointmentMatches = appointments
      .filter((a) => a.reason.toLowerCase().includes(term) || (a.doctorAssigned ?? '').toLowerCase().includes(term))
      .slice(0, 4)
      .map((a) => ({ label: a.reason, sub: new Date(a.date).toLocaleString(), to: '/app/appointments', kind: 'Appointment' }));

    const medicationMatches = medications
      .filter((m) => m.name.toLowerCase().includes(term) || (m.category ?? '').toLowerCase().includes(term))
      .slice(0, 4)
      .map((m) => ({ label: m.name, sub: m.category || 'Medication', to: '/app/inventory', kind: 'Medication' }));

    const staffMatches = staff
      .filter((s) => s.fullName.toLowerCase().includes(term) || s.role.toLowerCase().includes(term))
      .slice(0, 4)
      .map((s) => ({ label: s.fullName, sub: s.role, to: '/app/staff', kind: 'Staff' }));

    return [...patientMatches, ...appointmentMatches, ...medicationMatches, ...staffMatches].slice(0, 10);
  }, [query, patients, appointments, medications, staff]);

  return (
    <div className="mesh-surface min-h-screen overflow-visible p-4 md:p-6">
      <div className="mx-auto grid max-w-[1560px] grid-cols-1 gap-4 overflow-visible md:grid-cols-[280px_1fr]">
        <aside className="glass-luxury overflow-visible p-5">
          <Link to="/app" className="mb-8 block text-xl font-semibold tracking-tight text-black">
            CIGALI Care
          </Link>

          <nav className="space-y-1.5">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/app'}
                className={({ isActive }) =>
                  cn(
                    'block rounded-full px-3.5 py-2.5 text-sm font-medium transition-all duration-500 [transition-timing-function:cubic-bezier(0.25,1,0.5,1)]',
                    isActive
                      ? 'cigali-glow border border-primary-100 bg-primary-50 text-primary-700'
                      : 'text-black/60 hover:bg-white/25 hover:text-black'
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-8 rounded-[24px] border border-white/20 bg-white/10 p-4">
            <p className="text-xs uppercase tracking-wide text-black/60">Signed in as</p>
            <p className="mt-1 text-sm font-semibold text-black">{user?.name ?? 'User'}</p>
            <p className="text-xs text-black/60">{user?.email ?? ''}</p>
            <div className="mt-2">
              <Badge variant="info">{user?.role ?? 'member'}</Badge>
            </div>
          </div>

          <div className="mt-3 flex gap-2">
            <Button className="flex-1" variant="secondary" onClick={handleLogout}>Logout</Button>
          </div>
        </aside>

        <div className="space-y-4 overflow-visible">
          <header className="glass-luxury overflow-visible px-5 py-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-black/60">Healthcare Operating System</p>
                <h1 className="text-xl font-semibold text-black">{pageTitle}</h1>
              </div>

              <div className="relative flex w-full items-center gap-3 md:w-auto" ref={searchRef}>
                <Input
                  className="md:w-[420px]"
                  placeholder="Search patients, phone, conditions, medications, appointments..."
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />

                <button
                  ref={bellRef}
                  type="button"
                  className="glass-button inline-flex h-10 w-10 items-center justify-center px-0"
                  onClick={() => setShowNotifications((prev) => !prev)}
                  aria-label="Notifications"
                >
                  🔔
                </button>

                <div className="glass-button inline-flex h-10 min-w-10 items-center justify-center px-3">
                  {user?.name?.charAt(0) ?? 'U'}
                </div>
              </div>
            </div>
          </header>

          <main className="glass-luxury overflow-visible p-5 md:p-6">
            <Outlet />
          </main>
        </div>
      </div>

      <Portal>
        {query && results.length > 0 && searchRect && (
          <div
            className="glass-luxury fixed z-[9999] isolate p-2"
            style={{
              top: searchRect.bottom + 8,
              left: Math.max(16, searchRect.left),
              width: Math.min(460, window.innerWidth - Math.max(16, searchRect.left) - 16)
            }}
          >
            {results.map((item, idx) => (
              <Link
                key={`${item.kind}-${idx}`}
                to={item.to}
                className="flex items-center justify-between rounded-[20px] px-3 py-2 text-sm hover:bg-white/15"
                onClick={() => setQuery('')}
              >
                <div>
                  <p className="text-black">{item.label}</p>
                  <p className="text-xs text-black/60">{item.sub}</p>
                </div>
                <Badge variant="neutral">{item.kind}</Badge>
              </Link>
            ))}
          </div>
        )}

        {showNotifications && notifRect && (
          <div
            className="glass-luxury fixed z-[9999] isolate w-[360px] p-3 max-sm:w-[calc(100vw-32px)]"
            style={{
              top: notifRect.bottom + 8,
              left: Math.max(16, notifRect.right - 360)
            }}
          >
            <p className="mb-2 text-sm font-semibold text-black">Notifications</p>
            <div className="space-y-2">
              {notifications.slice(0, 6).map((n) => (
                <div key={n.id} className="rounded-[20px] border border-white/20 bg-white/10 p-2">
                  <p className="text-sm font-medium text-black">{n.title}</p>
                  <p className="text-xs text-black/60">{n.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </Portal>
    </div>
  );
};
