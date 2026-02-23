import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

const plans = [
  {
    name: 'Starter',
    price: '$49',
    description: 'For independent providers launching digital operations.'
  },
  {
    name: 'Growth',
    price: '$129',
    description: 'For clinics scaling patient volume and collaboration.'
  },
  {
    name: 'Pro',
    price: '$249',
    description: 'For advanced healthcare operations and compliance maturity.',
    highlighted: true
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'For networks with complex deployment and governance needs.'
  }
];

export const PricingPage = () => (
  <div className="mx-auto w-full max-w-7xl px-4 py-12 md:px-6 md:py-16">
    <div className="max-w-2xl">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">Simple pricing with premium infrastructure</h1>
      <p className="mt-3 text-slate-600">From startups to enterprise systems, CIGALI scales with provider growth.</p>
    </div>

    <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {plans.map((plan) => (
        <Card key={plan.name} className={plan.highlighted ? 'border-primary-200 bg-primary-50/50 shadow-elevate' : ''}>
          <h2 className="text-lg font-semibold text-slate-900">{plan.name}</h2>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">{plan.price}</p>
          <p className="mt-3 text-sm leading-6 text-slate-600">{plan.description}</p>
          <Button className="mt-6 w-full" variant={plan.highlighted ? 'primary' : 'secondary'}>
            Choose {plan.name}
          </Button>
        </Card>
      ))}
    </section>

    <div className="mt-10">
      <Link to="/register">
        <Button>Start Free</Button>
      </Link>
    </div>
  </div>
);
