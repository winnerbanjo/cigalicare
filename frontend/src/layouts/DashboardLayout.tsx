import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { useAuthStore } from '@/store/auth.store';
import { cn } from '@/utils/cn';

const navItems = [
  { label: 'Dashboard', to: '/app' },
  { label: 'Patients', to: '/app/patients' },
  { label: 'Appointments', to: '/app/appointments' },
  { label: 'Inventory', to: '/app/inventory' },
  { label: 'Billing', to: '/app/billing' },
  { label: 'Settings', to: '/app/settings' }
];

const pageTitleByPath: Record<string, string> = {
  '/app': 'Dashboard',
  '/app/patients': 'Patients',
  '/app/appointments': 'Appointments',
  '/app/inventory': 'Inventory',
  '/app/billing': 'Billing',
  '/app/settings': 'Settings'
};

export const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const pageTitle = pageTitleByPath[location.pathname] ?? 'Workspace';

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-4 md:grid-cols-[250px_1fr]">
        <aside className="rounded-xl border border-borderSoft bg-white p-5 shadow-soft">
          <Link to="/app" className="mb-8 block text-xl font-semibold tracking-tight text-slate-900">
            CIGALI
          </Link>

          <nav className="space-y-1.5">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/app'}
                className={({ isActive }) =>
                  cn(
                    'block rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'border border-primary-100 bg-primary-50 text-primary-700 shadow-sm'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-8 rounded-xl border border-borderSoft bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">Signed in as</p>
            <p className="mt-1 text-sm font-semibold text-slate-800">{user?.name ?? 'User'}</p>
            <p className="text-xs text-slate-500">{user?.email ?? ''}</p>
            <div className="mt-2">
              <Badge variant="info">{user?.role ?? 'member'}</Badge>
            </div>
          </div>

          <Button className="mt-4 w-full" variant="secondary" onClick={handleLogout}>
            Logout
          </Button>
        </aside>

        <div className="space-y-4">
          <header className="flex flex-col gap-3 rounded-xl border border-borderSoft bg-white px-5 py-4 shadow-soft md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">Healthcare Platform</p>
              <h1 className="text-xl font-semibold text-slate-900">{pageTitle}</h1>
            </div>

            <div className="flex w-full items-center gap-3 md:w-auto">
              <Input className="md:w-64" placeholder="Search patients, appointments..." />
              <div className="inline-flex h-10 min-w-10 items-center justify-center rounded-xl border border-borderSoft bg-slate-50 px-3 text-sm font-medium text-slate-700">
                {user?.name?.charAt(0) ?? 'U'}
              </div>
            </div>
          </header>

          <main className="rounded-xl border border-borderSoft bg-white p-5 shadow-soft md:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};
