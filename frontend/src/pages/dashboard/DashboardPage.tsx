import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useCigaliData } from '@/hooks/useCigaliData';

const priorityStyle = {
  high: 'warning',
  medium: 'info',
  low: 'neutral'
} as const;

export const DashboardPage = () => {
  const {
    loading,
    appointments,
    medications,
    notifications,
    patientGrowthSeries,
    revenueSeries,
    appointmentTimeline,
    doctorTasks,
    workspaceStats,
    riskAlerts,
    labResults,
    patients,
    invoices
  } = useCigaliData();

  const upcomingAppointments = appointments
    .filter((a) => new Date(a.date).getTime() > Date.now() && a.status === 'scheduled')
    .slice(0, 8);

  const recentActivity = [...appointments]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 8);

  const lowStock = medications.filter((m) => m.stock <= 20).slice(0, 8);
  const topServices = ['Consultation', 'Follow-up', 'Lab Diagnostics', 'Chronic Care Plan'];

  const retentionRate = Math.round((patients.filter((p) => (p.notes ?? '').toLowerCase().includes('follow')).length / Math.max(patients.length, 1)) * 100);
  const monthlyRevenue = revenueSeries.at(-1)?.revenue ?? 0;
  const paidInvoices = invoices.filter((i) => i.status === 'paid').length;

  if (loading) {
    return <p className="text-sm text-slate-500">Loading doctor workspace...</p>;
  }

  return (
    <div className="space-y-4">
      <section className="glass mesh-surface p-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">Doctor Mission Control</p>
            <h2 className="text-2xl font-semibold text-slate-900">Daily Workspace</h2>
            <p className="text-sm text-slate-600">Clinical operations, risk monitoring, and business performance in one view.</p>
          </div>
          <Badge variant="info">Live Operational View</Badge>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        <Card><p className="text-xs uppercase text-slate-500">Today's Schedule</p><p className="mt-2 text-3xl font-semibold text-slate-900">{workspaceStats.todaysAppointments}</p></Card>
        <Card><p className="text-xs uppercase text-slate-500">Unread Labs</p><p className="mt-2 text-3xl font-semibold text-slate-900">{workspaceStats.unreadLabs}</p></Card>
        <Card><p className="text-xs uppercase text-slate-500">Urgent Patients</p><p className="mt-2 text-3xl font-semibold text-amber-600">{workspaceStats.urgentPatients}</p></Card>
        <Card><p className="text-xs uppercase text-slate-500">Follow-up Required</p><p className="mt-2 text-3xl font-semibold text-slate-900">{workspaceStats.followUpsRequired}</p></Card>
        <Card><p className="text-xs uppercase text-slate-500">Revenue Today</p><p className="mt-2 text-3xl font-semibold text-slate-900">${workspaceStats.revenueToday.toLocaleString()}</p></Card>
        <Card><p className="text-xs uppercase text-slate-500">Missed Loss Today</p><p className="mt-2 text-3xl font-semibold text-rose-600">${workspaceStats.missedLossToday.toLocaleString()}</p></Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-1">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Patient Growth</h3>
          <div className="mt-3 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={patientGrowthSeries}>
                <defs>
                  <linearGradient id="patientGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3F7A80" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3F7A80" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="patients" stroke="#3F7A80" fillOpacity={1} fill="url(#patientGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="xl:col-span-1">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Revenue Trend</h3>
          <div className="mt-3 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueSeries}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#3F7A80" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="xl:col-span-1">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Appointments Timeline</h3>
          <div className="mt-3 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={appointmentTimeline}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="scheduled" stroke="#3F7A80" strokeWidth={2} />
                <Line type="monotone" dataKey="completed" stroke="#16a34a" strokeWidth={2} />
                <Line type="monotone" dataKey="cancelled" stroke="#f59e0b" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-4">
        <Card>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Today's Schedule</h3>
          <div className="mt-3 space-y-2">
            {upcomingAppointments.map((appt) => (
              <div key={appt._id} className="rounded-super border border-white/40 bg-white/40 p-3">
                <p className="text-sm font-medium text-slate-800">{new Date(appt.date).toLocaleString()}</p>
                <p className="text-sm text-slate-600">{appt.reason}</p>
                <p className="text-xs text-slate-500">Doctor: {appt.doctorAssigned || 'Assigned on arrival'}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Pending Tasks</h3>
          <div className="mt-3 space-y-2">
            {doctorTasks.map((task) => (
              <div key={task.id} className="rounded-super border border-white/40 bg-white/40 p-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-800">{task.label}</p>
                  <Badge variant={priorityStyle[task.priority]}>{task.priority}</Badge>
                </div>
                <p className="text-xs text-slate-500">Due {new Date(task.dueAt).toLocaleTimeString()}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Risk Alerts</h3>
          <div className="mt-3 space-y-2">
            {riskAlerts.slice(0, 8).map((alert) => (
              <div key={alert.id} className="rounded-super border border-white/40 bg-white/40 p-3">
                <p className="text-sm font-medium text-slate-800">Patient #{alert.patientId}</p>
                <p className="text-xs text-slate-600">{alert.reason}</p>
                <Badge variant={alert.severity === 'critical' ? 'warning' : 'info'}>{alert.severity}</Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Clinic BI</h3>
          <div className="mt-3 space-y-2 text-sm text-slate-700">
            <div className="flex items-center justify-between"><span>Revenue this month</span><strong>${monthlyRevenue.toLocaleString()}</strong></div>
            <div className="flex items-center justify-between"><span>Paid invoices</span><strong>{paidInvoices}</strong></div>
            <div className="flex items-center justify-between"><span>Retention rate</span><strong>{retentionRate}%</strong></div>
            <div className="rounded-super border border-white/40 bg-white/40 p-3">
              <p className="text-xs uppercase tracking-wide text-slate-500">Most profitable services</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {topServices.map((service) => (
                  <Badge key={service} variant="neutral">{service}</Badge>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <Card>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Recent Activity</h3>
          <div className="mt-3 space-y-2">
            {recentActivity.map((item) => (
              <div key={item._id} className="rounded-super border border-white/40 bg-white/40 p-3">
                <p className="text-sm font-medium text-slate-800">{item.reason}</p>
                <p className="text-xs text-slate-500">{new Date(item.updatedAt).toLocaleString()}</p>
                <Badge variant={item.status === 'completed' ? 'success' : item.status === 'cancelled' ? 'warning' : 'info'}>
                  {item.status}
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Notifications</h3>
          <div className="mt-3 space-y-2">
            {notifications.map((n) => (
              <div key={n.id} className="rounded-super border border-white/40 bg-white/40 p-3">
                <p className="text-sm font-medium text-slate-800">{n.title}</p>
                <p className="text-sm text-slate-600">{n.description}</p>
                <p className="text-xs text-slate-500">{new Date(n.createdAt).toLocaleTimeString()}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Clinical Alerts</h3>
          <div className="mt-3 space-y-2">
            {labResults.filter((lab) => lab.flagged).slice(0, 8).map((lab) => (
              <div key={lab._id} className="rounded-super border border-white/40 bg-white/40 p-3">
                <p className="text-sm font-medium text-slate-800">{lab.testName}</p>
                <p className="text-xs text-slate-600">{lab.value}</p>
                <Badge variant={lab.status === 'critical' ? 'warning' : 'info'}>{lab.status}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <Card>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Low Stock Alerts</h3>
          <div className="mt-3 space-y-2">
            {lowStock.map((item) => (
              <div key={item._id} className="rounded-super border border-white/40 bg-white/40 p-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-800">{item.name}</p>
                  <Badge variant="warning">{item.stock} left</Badge>
                </div>
                <p className="text-xs text-slate-500">{item.category} • {item.supplier}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Revenue By Service Mix</h3>
          <div className="mt-3 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topServices.map((name, index) => ({ name, revenue: 12000 + index * 3800 }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#9EC7C2" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </section>
    </div>
  );
};
