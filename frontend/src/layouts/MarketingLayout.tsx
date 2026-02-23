import { Link, Outlet } from 'react-router-dom';
import { Portal } from '@/components/Portal';
import { Button } from '@/components/ui/Button';

export const MarketingLayout = () => {
  return (
    <div className="mesh-surface min-h-screen text-black">
      <Portal>
        <header className="fixed left-1/2 top-6 z-[1000] isolate w-[min(980px,calc(100%-32px))] -translate-x-1/2 rounded-[28px] border border-white/40 bg-white/70 px-4 py-3 shadow-[0_10px_40px_rgba(0,0,0,0.1)] backdrop-blur-[20px]">
          <div className="flex items-center justify-between gap-3">
            <Link to="/" className="text-lg font-semibold tracking-[0.4px] text-black">
              CIGALI
            </Link>

            <nav className="hidden items-center gap-1 md:flex">
              <a href="/#features" className="rounded-full px-3 py-2 text-sm font-medium text-black/60 transition-all duration-500 [transition-timing-function:cubic-bezier(0.25,1,0.5,1)] hover:bg-white hover:text-black">
                Features
              </a>
              <a href="/#pricing" className="rounded-full px-3 py-2 text-sm font-medium text-black/60 transition-all duration-500 [transition-timing-function:cubic-bezier(0.25,1,0.5,1)] hover:bg-white hover:text-black">
                Pricing
              </a>
              <Link to="/about" className="rounded-full px-3 py-2 text-sm font-medium text-black/60 transition-all duration-500 [transition-timing-function:cubic-bezier(0.25,1,0.5,1)] hover:bg-white hover:text-black">
                About
              </Link>
              <Link to="/login" className="rounded-full px-3 py-2 text-sm font-medium text-black/60 transition-all duration-500 [transition-timing-function:cubic-bezier(0.25,1,0.5,1)] hover:bg-white hover:text-black">
                Login
              </Link>
            </nav>

            <Link to="/register">
              <Button className="h-10">Get Started</Button>
            </Link>
          </div>
        </header>
      </Portal>

      <main className="pt-28">
        <Outlet />
      </main>

      <footer className="mt-12 border-t border-white/40 bg-white/60 py-12 backdrop-blur-xl">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 md:grid-cols-4 md:px-6">
          <div>
            <p className="text-base font-semibold tracking-tight text-black">CIGALI</p>
            <p className="mt-2 text-sm leading-6 text-black/60">
              Healthcare operations platform for clinics, pharmacies, and medical centers.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-black">Product</p>
            <ul className="mt-3 space-y-2 text-sm text-black/60">
              <li><a className="hover:text-black" href="/#features">Features</a></li>
              <li><a className="hover:text-black" href="/#pricing">Pricing</a></li>
              <li><Link className="hover:text-black" to="/login">Login</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-black">Company</p>
            <ul className="mt-3 space-y-2 text-sm text-black/60">
              <li><Link className="hover:text-black" to="/about">About</Link></li>
              <li>Careers</li>
              <li>Contact</li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-black">Legal</p>
            <ul className="mt-3 space-y-2 text-sm text-black/60">
              <li>Privacy</li>
              <li>Terms</li>
              <li>Security</li>
            </ul>
          </div>
        </div>

        <div className="mx-auto mt-10 w-full max-w-7xl px-4 text-sm text-black/50 md:px-6">© 2026 CIGALI</div>
      </footer>
    </div>
  );
};
