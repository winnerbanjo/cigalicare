import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useAuthStore } from '@/store/auth.store';

const featureCards = [
  {
    title: 'Smart Patient Timeline',
    description: 'Chronological clinical intelligence across visits, labs, notes, diagnoses, and prescriptions.'
  },
  {
    title: 'Doctor Mission Control',
    description: 'Daily schedule, urgent alerts, follow-up automation, and financial visibility in one cockpit.'
  },
  {
    title: 'Operational BI',
    description: 'Revenue trend analysis, retention indicators, and missed-visit loss tracking for clinic performance.'
  },
  {
    title: 'Concierge Workflows',
    description: 'VIP tiering, priority scheduling, direct care coordination, and private medical operations.'
  }
];

const pricingPlans = [
  { name: 'Starter', price: '$49', description: 'Small practices starting digital care operations.' },
  { name: 'Growth', price: '$129', description: 'Clinics scaling patient volume and team operations.' },
  { name: 'Pro', price: '$249', description: 'Advanced operational controls and premium support.', highlighted: true },
  { name: 'Enterprise', price: 'Custom', description: 'Network-scale deployments with tailored onboarding.' }
];

const services = ['Concierge Care', 'Diagnostics', 'Preventive Health', 'Chronic Care'];

export const HomePage = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [demoLoadingType, setDemoLoadingType] = useState<'doctor' | 'admin' | null>(null);
  const [demoError, setDemoError] = useState<string | null>(null);

  const handleDemoLogin = async (type: 'doctor' | 'admin') => {
    setDemoLoadingType(type);
    setDemoError(null);

    try {
      await login({
        email: type === 'doctor' ? 'demo@cigali.com' : 'admin@cigali.com',
        password: 'password123'
      });
      navigate('/app', { replace: true });
    } catch {
      setDemoError('Demo login unavailable. Verify backend connectivity.');
    } finally {
      setDemoLoadingType(null);
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-20 md:px-6">
      <section className="grid items-center gap-10 py-10 md:grid-cols-2 md:py-14">
        <div className="space-y-6">
          <Badge variant="info">Flagship Healthcare OS</Badge>
          <h1 className="text-4xl font-bold leading-tight tracking-[0.5px] text-black [text-shadow:0_0_30px_rgba(255,255,255,0.3)] md:text-6xl">
            The operating system for modern healthcare
          </h1>
          <p className="max-w-xl text-base leading-7 text-black/70">
            CIGALI unifies doctors, patients, labs, prescriptions, scheduling, and clinic economics in one intelligent,
            multi-tenant platform designed for premium care providers.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link to="/register">
              <Button className="h-11 px-6">Start Free</Button>
            </Link>
            <a href="#demo">
              <Button variant="secondary" className="h-11 px-6">View Demo</Button>
            </a>
          </div>
        </div>

        <div className="relative min-h-[380px] [transform:perspective(2000px)_rotateX(8deg)]">
          <div className="glass-luxury absolute left-2 top-8 w-[64%] p-4 shadow-depth1 animate-floating">
            <p className="text-xs uppercase tracking-wide text-black/60">Doctor Workspace</p>
            <p className="mt-2 text-2xl font-semibold text-black">28 appointments</p>
            <p className="mt-1 text-sm text-black/70">Urgent alerts: 4</p>
          </div>
          <div className="glass-luxury absolute right-0 top-20 w-[58%] p-4 shadow-depth2 [animation:floating_11s_ease-in-out_infinite]">
            <p className="text-xs uppercase tracking-wide text-black/60">Revenue</p>
            <p className="mt-2 text-2xl font-semibold text-black">$128,430</p>
            <div className="mt-3 h-16 rounded-[18px] border border-white/40 bg-white/70 p-2">
              <div className="h-full w-full rounded-[14px] border border-white/40 bg-gradient-to-r from-cobalt/40 via-secondary-500/20 to-primary-500/40" />
            </div>
          </div>
          <div className="glass-luxury absolute bottom-2 left-[18%] w-[72%] p-4 shadow-depth3 [animation:floating_13s_ease-in-out_infinite]">
            <p className="text-xs uppercase tracking-wide text-black/60">Clinical Timeline</p>
            <div className="mt-3 space-y-2">
              <div className="flex items-center justify-between rounded-[18px] border border-white/40 bg-white/70 px-3 py-2">
                <span className="text-sm text-black">CBC Result</span>
                <span className="text-xs text-cobalt">Abnormal</span>
              </div>
              <div className="flex items-center justify-between rounded-[18px] border border-white/40 bg-white/70 px-3 py-2">
                <span className="text-sm text-black">Follow-up Scheduled</span>
                <span className="text-xs text-secondary-600">In 4 days</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-3">
        {['Clinics', 'Pharmacies', 'Medical Centers'].map((label) => (
          <div key={label} className="glass-luxury rounded-[32px] px-5 py-4 text-center text-sm font-semibold text-black/85">{label}</div>
        ))}
      </section>

      <section id="features" className="mt-16">
        <div className="mb-6 max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight text-black">Luxury-grade clinical operations, engineered for speed</h2>
          <p className="mt-2 text-black/65">Designed for practices that demand medical precision and business clarity.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {featureCards.map((feature) => (
            <Card key={feature.title} className="rounded-[32px] bg-white/70 p-6">
              <h3 className="text-lg font-semibold text-black">{feature.title}</h3>
              <p className="mt-2 text-sm leading-6 text-black/70">{feature.description}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-16 grid gap-4 md:grid-cols-2">
        <Card className="rounded-[32px] p-6">
          <p className="text-xs uppercase tracking-wide text-black/60">Holographic Analytics</p>
          <h3 className="mt-2 text-2xl font-semibold text-black">Clinical and business telemetry in one signal plane</h3>
          <div className="mt-5 rounded-[24px] border border-white/40 bg-white/70 p-4">
            <svg viewBox="0 0 360 120" className="h-28 w-full">
              <polyline fill="none" stroke="rgba(17,24,39,0.65)" strokeWidth="1.5" points="0,90 40,72 80,76 120,56 160,62 200,42 240,50 280,32 320,40 360,22" />
              {[40, 120, 200, 280, 360].map((x) => (
                <circle key={x} cx={x} cy={x === 360 ? 22 : x === 280 ? 32 : x === 200 ? 42 : x === 120 ? 56 : 72} r="3" fill="#2563EB" />
              ))}
            </svg>
          </div>
        </Card>

        <Card className="rounded-[32px] p-6">
          <p className="text-xs uppercase tracking-wide text-black/60">Security</p>
          <h3 className="mt-2 text-2xl font-semibold text-black">Trusted architecture for regulated healthcare operations</h3>
          <div className="mt-4 space-y-2">
            <div className="rounded-[20px] border border-white/40 bg-white/70 p-3 text-sm text-black/80">Tenant isolation by provider scope</div>
            <div className="rounded-[20px] border border-white/40 bg-white/70 p-3 text-sm text-black/80">JWT auth with role-based permissions</div>
            <div className="rounded-[20px] border border-white/40 bg-white/70 p-3 text-sm text-black/80">Encrypted credential storage and secret-managed configs</div>
          </div>
        </Card>
      </section>

      <section id="demo" className="mt-16">
        <Card className="rounded-[32px] p-6">
          <div className="grid gap-6 md:grid-cols-[1.2fr_1fr] md:items-center">
            <div>
              <h3 className="text-2xl font-semibold text-black">Instant demo access</h3>
              <p className="mt-2 text-sm text-black/65">Use seeded accounts to enter the full CIGALI experience immediately.</p>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-[20px] border border-white/40 bg-white/70 p-4">
                  <p className="text-xs uppercase tracking-wide text-black/60">Doctor Demo</p>
                  <p className="mt-2 text-sm font-medium text-black">demo@cigali.com</p>
                  <p className="text-sm font-medium text-black">password123</p>
                </div>
                <div className="rounded-[20px] border border-white/40 bg-white/70 p-4">
                  <p className="text-xs uppercase tracking-wide text-black/60">Admin Demo</p>
                  <p className="mt-2 text-sm font-medium text-black">admin@cigali.com</p>
                  <p className="text-sm font-medium text-black">password123</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Button className="h-11 w-full" onClick={() => void handleDemoLogin('doctor')} disabled={demoLoadingType !== null}>
                {demoLoadingType === 'doctor' ? 'Signing in...' : 'Login as Demo Doctor'}
              </Button>
              <Button className="h-11 w-full" variant="secondary" onClick={() => void handleDemoLogin('admin')} disabled={demoLoadingType !== null}>
                {demoLoadingType === 'admin' ? 'Signing in...' : 'Login as Demo Admin'}
              </Button>
              {demoError && <p className="mt-2 text-sm text-rose-600">{demoError}</p>}
            </div>
          </div>
        </Card>
      </section>

      <section id="pricing" className="mt-16">
        <div className="mb-6 max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight text-black">Plans for elite care teams and healthcare networks</h2>
          <p className="mt-2 text-black/65">Start lean, scale to multi-site operations without changing platforms.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {pricingPlans.map((plan) => (
            <Card key={plan.name} className={plan.highlighted ? 'cigali-glow rounded-[32px] border-cobalt/40' : 'rounded-[32px]'}>
              {plan.highlighted && <Badge variant="info">Most Popular</Badge>}
              <h3 className="mt-2 text-lg font-semibold text-black">{plan.name}</h3>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-black">{plan.price}</p>
              <p className="mt-3 text-sm leading-6 text-black/70">{plan.description}</p>
              <Button className="mt-6 w-full" variant={plan.highlighted ? 'primary' : 'secondary'}>Choose {plan.name}</Button>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <Card className="rounded-[32px] p-6">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-black">Start running your healthcare practice on modern infrastructure.</h2>
              <p className="mt-2 text-sm text-black/65">Premium clinical operations, concierge-ready workflows, and business intelligence built in.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/register"><Button className="h-11 px-5">Start Free</Button></Link>
              <a href="mailto:sales@cigali.com"><Button variant="secondary" className="h-11 px-5">Book Demo</Button></a>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {services.map((service) => (
              <Badge key={service} variant="neutral">{service}</Badge>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
};
