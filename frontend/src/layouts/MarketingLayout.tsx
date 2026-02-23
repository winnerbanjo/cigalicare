import { useEffect, useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils/cn';

export const MarketingLayout = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-transparent text-slate-900">
      <header
        className={cn(
          'sticky top-0 z-40 transition-all duration-300',
          isScrolled
            ? 'border-b border-slate-200/80 bg-white/80 backdrop-blur-xl'
            : 'border-b border-transparent bg-transparent'
        )}
      >
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 md:px-6">
          <Link to="/" className="text-lg font-semibold tracking-tight text-slate-900">
            CIGALI
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            <a href="/#features" className="rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900">
              Features
            </a>
            <a href="/#pricing" className="rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900">
              Pricing
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <Link to="/login">
              <Button variant="ghost" className="hidden md:inline-flex">
                Login
              </Button>
            </Link>
            <Link to="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="border-t border-slate-200/80 bg-white/70 py-12 backdrop-blur-sm">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 md:grid-cols-4 md:px-6">
          <div>
            <p className="text-base font-semibold tracking-tight text-slate-900">CIGALI</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Healthcare operations platform for clinics, pharmacies, and medical centers.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-900">Product</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li><a className="hover:text-slate-900" href="/#features">Features</a></li>
              <li><a className="hover:text-slate-900" href="/#pricing">Pricing</a></li>
              <li><Link className="hover:text-slate-900" to="/login">Login</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-900">Company</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li>About</li>
              <li>Careers</li>
              <li>Contact</li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-900">Legal</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li>Privacy</li>
              <li>Terms</li>
              <li>Security</li>
            </ul>
          </div>
        </div>

        <div className="mx-auto mt-10 w-full max-w-7xl px-4 text-sm text-slate-500 md:px-6">© 2026 CIGALI</div>
      </footer>
    </div>
  );
};
