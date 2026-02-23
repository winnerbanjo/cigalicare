import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

const features = [
  {
    title: 'Patient Management',
    description: 'Provider-scoped patient records, quick lookup, and complete clinical context in one interface.'
  },
  {
    title: 'Appointments',
    description: 'Fast scheduling and status control that keeps care teams aligned throughout the day.'
  },
  {
    title: 'Pharmacy & Inventory',
    description: 'Medication and stock visibility designed for healthcare operations and audit readiness.'
  },
  {
    title: 'Multi-tenant Security',
    description: 'Tenant isolation, JWT-based auth, and role controls for clean provider-level data boundaries.'
  }
];

export const FeaturesPage = () => (
  <div className="mx-auto w-full max-w-7xl px-4 py-12 md:px-6 md:py-16">
    <div className="max-w-2xl">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">Designed for high-trust healthcare teams</h1>
      <p className="mt-3 text-slate-600">
        CIGALI combines premium UX with production-grade backend architecture to support real clinical operations.
      </p>
    </div>

    <section className="mt-8 grid gap-4 md:grid-cols-2">
      {features.map((feature) => (
        <Card key={feature.title}>
          <h2 className="text-lg font-semibold text-slate-900">{feature.title}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">{feature.description}</p>
        </Card>
      ))}
    </section>

    <div className="mt-10">
      <Link to="/#demo">
        <Button>Try Demo Access</Button>
      </Link>
    </div>
  </div>
);
