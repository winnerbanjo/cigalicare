import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useAuthStore } from '@/store/auth.store';

const featureCards = [
  {
    icon: '🧑‍⚕️',
    title: 'Patient Management',
    description: 'Create and manage patient records with provider-scoped data boundaries and clean workflows.'
  },
  {
    icon: '🗓️',
    title: 'Appointments',
    description: 'Coordinate care schedules, updates, and visit status with a fast timeline-ready system.'
  },
  {
    icon: '💊',
    title: 'Pharmacy & Inventory',
    description: 'Track medication stock and operational inventory in a unified healthcare operations workspace.'
  },
  {
    icon: '🔐',
    title: 'Multi-tenant Security',
    description: 'Every core record is isolated by provider with role-based controls and strict access boundaries.'
  }
];

const pricingPlans = [
  {
    name: 'Starter',
    price: '$49',
    description: 'Small practices starting digital care operations.'
  },
  {
    name: 'Growth',
    price: '$129',
    description: 'Clinics scaling patient volume and team operations.'
  },
  {
    name: 'Pro',
    price: '$249',
    description: 'Advanced operational controls and premium support.',
    highlighted: true
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'Network-scale deployments with tailored onboarding.'
  }
];

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
      setDemoError('Demo login unavailable. Verify MongoDB and seeded users.');
    } finally {
      setDemoLoadingType(null);
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-20 pt-8 md:px-6 md:pt-14">
      <section className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
        <div className="space-y-5">
          <Badge variant="info">Healthcare SaaS Infrastructure</Badge>
          <h1 className="text-4xl font-semibold leading-tight tracking-tight text-slate-900 md:text-5xl">
            The operating system for modern healthcare.
          </h1>
          <p className="max-w-xl text-base leading-7 text-slate-600">
            CIGALI unifies patients, appointments, pharmacy, and operations in one secure platform designed for
            multi-tenant healthcare providers.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link to="/register">
              <Button className="h-11 px-5">Start Free</Button>
            </Link>
            <a href="#demo">
              <Button variant="secondary" className="h-11 px-5">
                View Demo
              </Button>
            </a>
          </div>
        </div>

        <Card className="border-white/70 bg-gradient-to-b from-white to-slate-50/70 p-4 md:p-5">
          <div className="rounded-xl border border-borderSoft bg-white p-4 shadow-soft">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-900">CIGALI Dashboard</p>
              <Badge variant="neutral">Live Preview</Badge>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-borderSoft bg-slate-50 p-3">
                <p className="text-xs text-slate-500">Patients</p>
                <p className="mt-1 text-xl font-semibold text-slate-900">1,284</p>
              </div>
              <div className="rounded-xl border border-borderSoft bg-slate-50 p-3">
                <p className="text-xs text-slate-500">Appointments</p>
                <p className="mt-1 text-xl font-semibold text-slate-900">342</p>
              </div>
              <div className="rounded-xl border border-borderSoft bg-slate-50 p-3">
                <p className="text-xs text-slate-500">Medication</p>
                <p className="mt-1 text-xl font-semibold text-slate-900">98%</p>
              </div>
            </div>

            <div className="mt-3 rounded-xl border border-borderSoft bg-slate-50 p-3">
              <p className="text-xs text-slate-500">Today</p>
              <div className="mt-2 grid gap-2">
                <div className="flex items-center justify-between rounded-lg bg-white px-3 py-2">
                  <p className="text-sm text-slate-700">09:30 • Patient Follow-up</p>
                  <Badge variant="success">Confirmed</Badge>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-white px-3 py-2">
                  <p className="text-sm text-slate-700">12:00 • Pharmacy Stock Check</p>
                  <Badge variant="info">In Progress</Badge>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </section>

      <section className="mt-16">
        <p className="text-center text-sm font-medium text-slate-500">
          Trusted by forward-thinking healthcare providers
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {['Clinics', 'Pharmacies', 'Medical Centers'].map((label) => (
            <div
              key={label}
              className="flex h-14 items-center justify-center rounded-xl border border-borderSoft bg-white text-sm font-semibold text-slate-600 shadow-soft"
            >
              {label}
            </div>
          ))}
        </div>
      </section>

      <section id="features" className="mt-16">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900">Built for real healthcare operations</h2>
          <p className="mt-2 text-slate-600">
            A premium operational surface for providers who need reliability, clarity, and speed.
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {featureCards.map((feature) => (
            <Card key={feature.title} className="transition-all duration-200 hover:-translate-y-px hover:shadow-elevate">
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-borderSoft bg-slate-50 text-lg">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-slate-900">{feature.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{feature.description}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <Card className="overflow-hidden p-0">
          <div className="grid gap-0 md:grid-cols-2">
            <div className="border-b border-slate-100 p-6 md:border-b-0 md:border-r">
              <p className="text-xs font-semibold uppercase tracking-wide text-primary-600">Security</p>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">Security by architecture, not add-ons.</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                CIGALI follows a tenant-first model that keeps provider data isolated with role-based controls and
                secure session handling.
              </p>
            </div>

            <div className="space-y-3 p-6">
              <div className="rounded-xl border border-borderSoft bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">Tenant isolation</p>
                <p className="mt-1 text-sm text-slate-600">Every resource is scoped to providerId for strict account boundaries.</p>
              </div>
              <div className="rounded-xl border border-borderSoft bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">JWT authentication</p>
                <p className="mt-1 text-sm text-slate-600">Access tokens secure API sessions with middleware-based verification.</p>
              </div>
              <div className="rounded-xl border border-borderSoft bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">Encrypted storage</p>
                <p className="mt-1 text-sm text-slate-600">Passwords are hashed before storage and secrets are environment-managed.</p>
              </div>
            </div>
          </div>
        </Card>
      </section>

      <section id="demo" className="mt-16">
        <Card>
          <div className="grid gap-6 md:grid-cols-[1.3fr_1fr] md:items-center">
            <div>
              <h3 className="text-2xl font-semibold tracking-tight text-slate-900">Try the live demo instantly</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Use demo accounts to explore the product experience without setup.
              </p>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-borderSoft bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Doctor Demo</p>
                  <p className="mt-2 text-sm font-medium text-slate-900">email: demo@cigali.com</p>
                  <p className="text-sm font-medium text-slate-900">password: password123</p>
                </div>
                <div className="rounded-xl border border-borderSoft bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Admin Demo</p>
                  <p className="mt-2 text-sm font-medium text-slate-900">email: admin@cigali.com</p>
                  <p className="text-sm font-medium text-slate-900">password: password123</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Button className="h-11 w-full" onClick={() => void handleDemoLogin('doctor')} disabled={demoLoadingType !== null}>
                {demoLoadingType === 'doctor' ? 'Signing in...' : 'Login as Demo Doctor'}
              </Button>
              <Button
                className="h-11 w-full"
                variant="secondary"
                onClick={() => void handleDemoLogin('admin')}
                disabled={demoLoadingType !== null}
              >
                {demoLoadingType === 'admin' ? 'Signing in...' : 'Login as Demo Admin'}
              </Button>
              {demoError && <p className="mt-2 text-sm text-rose-600">{demoError}</p>}
            </div>
          </div>
        </Card>
      </section>

      <section id="pricing" className="mt-16">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900">Pricing for every stage of care delivery</h2>
          <p className="mt-2 text-slate-600">Simple plans with enterprise-grade architecture from day one.</p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {pricingPlans.map((plan) => (
            <Card
              key={plan.name}
              className={plan.highlighted ? 'border-primary-200 bg-primary-50/50 shadow-elevate' : ''}
            >
              {plan.highlighted && <Badge variant="info">Most Popular</Badge>}
              <h3 className="mt-2 text-lg font-semibold text-slate-900">{plan.name}</h3>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">{plan.price}</p>
              <p className="mt-3 text-sm leading-6 text-slate-600">{plan.description}</p>
              <Button className="mt-6 w-full" variant={plan.highlighted ? 'primary' : 'secondary'}>
                Choose {plan.name}
              </Button>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <Card className="border-primary-100 bg-gradient-to-r from-primary-50 to-white">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
                Start running your healthcare practice on modern infrastructure.
              </h2>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/register">
                <Button className="h-11 px-5">Start Free</Button>
              </Link>
              <a href="mailto:sales@cigali.com">
                <Button variant="secondary" className="h-11 px-5">
                  Book Demo
                </Button>
              </a>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
};
