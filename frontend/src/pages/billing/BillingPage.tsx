import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Table } from '@/components/ui/Table';
import { useCigaliData } from '@/hooks/useCigaliData';

const plans = [
  { name: 'Starter', price: '$49', description: 'Core operations for small care teams.' },
  { name: 'Growth', price: '$129', description: 'Expanded workflows for scaling clinics.' },
  { name: 'Pro', price: '$249', description: 'Advanced controls and premium support.', highlighted: true },
  { name: 'Enterprise', price: 'Custom', description: 'Tailored contracts for healthcare networks.' }
];

export const BillingPage = () => {
  const { loading, invoices, billingSummary, revenueSeries } = useCigaliData();

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Billing</h2>
        <p className="text-sm text-slate-600">Invoices, payment status, revenue analytics, and plan usage.</p>
      </div>

      <section className="grid gap-4 md:grid-cols-4">
        <Card><p className="text-xs uppercase text-slate-500">Total Revenue</p><p className="mt-2 text-2xl font-semibold text-slate-900">${billingSummary.totalRevenue.toLocaleString()}</p></Card>
        <Card><p className="text-xs uppercase text-slate-500">Invoices</p><p className="mt-2 text-2xl font-semibold text-slate-900">{billingSummary.count}</p></Card>
        <Card><p className="text-xs uppercase text-slate-500">Pending</p><p className="mt-2 text-2xl font-semibold text-slate-900">{billingSummary.pending}</p></Card>
        <Card><p className="text-xs uppercase text-slate-500">Overdue</p><p className="mt-2 text-2xl font-semibold text-slate-900">{billingSummary.overdue}</p></Card>
      </section>

      <Card>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Revenue Analytics</h3>
        <div className="mt-3 h-60">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueSeries}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3F7A80" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="#3F7A80" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="revenue" stroke="#3F7A80" fill="url(#revGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Plan Usage</h3>
        <div className="mt-3 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {plans.map((plan) => (
            <div key={plan.name} className={`rounded-super border p-4 ${plan.highlighted ? 'border-primary-200 bg-primary-50/40' : 'border-white/40 bg-white/40'}`}>
              {plan.highlighted && <Badge variant="info">Recommended</Badge>}
              <h4 className="mt-2 text-lg font-semibold">{plan.name}</h4>
              <p className="text-2xl font-semibold">{plan.price}</p>
              <p className="mt-2 text-sm text-slate-600">{plan.description}</p>
              <Button className="mt-4 w-full" variant={plan.highlighted ? 'primary' : 'secondary'}>Select</Button>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Invoices</h3>
        {loading ? (
          <p className="mt-3 text-sm text-slate-500">Loading invoices...</p>
        ) : (
          <Table headers={['Invoice', 'Patient', 'Amount', 'Paid', 'Status', 'Due Date']}>
            {invoices.slice(0, 120).map((inv) => (
              <tr key={inv._id}>
                <td className="px-4 py-3 text-slate-800">{inv.invoiceNumber}</td>
                <td className="px-4 py-3 text-slate-700">
                  {typeof inv.patientId === 'string' ? inv.patientId : `${inv.patientId.firstName} ${inv.patientId.lastName}`}
                </td>
                <td className="px-4 py-3 text-slate-700">${inv.amount.toLocaleString()}</td>
                <td className="px-4 py-3 text-slate-700">${inv.paidAmount.toLocaleString()}</td>
                <td className="px-4 py-3">
                  <Badge variant={inv.status === 'paid' ? 'success' : inv.status === 'overdue' ? 'warning' : 'info'}>{inv.status}</Badge>
                </td>
                <td className="px-4 py-3 text-slate-600">{new Date(inv.dueDate).toLocaleDateString()}</td>
              </tr>
            ))}
          </Table>
        )}
      </Card>
    </div>
  );
};
