import { useEffect, useMemo, useState } from 'react';
import { appointmentsApi } from '@/api/appointments.api';
import { medicationsApi } from '@/api/medications.api';
import { patientsApi } from '@/api/patients.api';
import { Card } from '@/components/ui/Card';

interface Metrics {
  patients: number;
  appointments: number;
  revenue: number;
  lowStock: number;
}

interface Activity {
  id: string;
  text: string;
  time: string;
}

export const DashboardPage = () => {
  const [metrics, setMetrics] = useState<Metrics>({ patients: 0, appointments: 0, revenue: 0, lowStock: 0 });
  const [activity, setActivity] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [patients, appointments, meds] = await Promise.all([
          patientsApi.getAll(),
          appointmentsApi.getAll(),
          medicationsApi.getAll()
        ]);

        const completed = appointments.filter((item) => item.status === 'completed').length;
        const lowStock = meds.filter((item) => item.stock <= 20).length;

        setMetrics({
          patients: patients.length,
          appointments: appointments.length,
          revenue: completed * 120,
          lowStock
        });

        const nextActivity: Activity[] = [
          ...appointments.slice(0, 3).map((a) => ({
            id: a._id,
            text: `Appointment ${a.status}: ${new Date(a.date).toLocaleString()}`,
            time: new Date(a.updatedAt).toLocaleTimeString()
          })),
          ...meds.slice(0, 2).map((m) => ({
            id: m._id,
            text: `Medication updated: ${m.name} (${m.stock} in stock)`,
            time: new Date(m.updatedAt).toLocaleTimeString()
          }))
        ];

        setActivity(nextActivity);
      } catch {
        setMetrics({ patients: 0, appointments: 0, revenue: 0, lowStock: 0 });
        setActivity([]);
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  const cards = useMemo(
    () => [
      { label: 'Patients', value: metrics.patients },
      { label: 'Appointments', value: metrics.appointments },
      { label: 'Revenue', value: `$${metrics.revenue.toLocaleString()}` },
      { label: 'Inventory Alerts', value: metrics.lowStock }
    ],
    [metrics]
  );

  return (
    <div className="space-y-4">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.label}>
            <p className="text-sm text-slate-500">{card.label}</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">{card.value}</p>
          </Card>
        ))}
      </section>

      <Card>
        <h2 className="text-lg font-semibold text-slate-900">Recent activity</h2>
        {loading ? (
          <p className="mt-3 text-sm text-slate-500">Loading activity...</p>
        ) : activity.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">No recent activity yet.</p>
        ) : (
          <div className="mt-4 space-y-2">
            {activity.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-xl border border-borderSoft bg-slate-50 p-3">
                <p className="text-sm text-slate-700">{item.text}</p>
                <span className="text-xs text-slate-500">{item.time}</span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};
