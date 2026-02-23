import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

const plans = [
  {
    name: 'Starter',
    price: '$49',
    description: 'Core operations for small care teams.'
  },
  {
    name: 'Growth',
    price: '$129',
    description: 'Expanded workflows for scaling clinics.'
  },
  {
    name: 'Pro',
    price: '$249',
    description: 'Advanced controls and premium support.',
    highlighted: true
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'Tailored contracts for healthcare networks.'
  }
];

export const BillingPage = () => (
  <div className="space-y-4">
    <div>
      <h2 className="text-lg font-semibold text-slate-900">Billing</h2>
      <p className="text-sm text-slate-600">Choose the plan that matches your practice growth.</p>
    </div>

    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {plans.map((plan) => (
        <Card key={plan.name} className={plan.highlighted ? 'border-primary-200 bg-primary-50/40 shadow-elevate' : ''}>
          {plan.highlighted && <Badge variant="info">Recommended</Badge>}
          <h3 className="mt-2 text-lg font-semibold text-slate-900">{plan.name}</h3>
          <p className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">{plan.price}</p>
          <p className="mt-3 text-sm text-slate-600">{plan.description}</p>
          <Button className="mt-6 w-full" variant={plan.highlighted ? 'primary' : 'secondary'}>
            Select {plan.name}
          </Button>
        </Card>
      ))}
    </section>
  </div>
);
