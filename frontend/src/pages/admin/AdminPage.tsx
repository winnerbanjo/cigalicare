import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Table } from '@/components/ui/Table';
import { useCigaliData } from '@/hooks/useCigaliData';

const AdminPage = () => {
  const { loading, patients, appointments, invoices, staff } = useCigaliData();

  const clinics = [
    { name: 'CIGALI Advanced Medical Center', plan: 'Growth', status: 'Active', staff: staff.length, patients: patients.length },
    { name: 'CIGALI Concierge Downtown', plan: 'Pro', status: 'Active', staff: Math.max(4, Math.floor(staff.length / 2)), patients: Math.max(72, Math.floor(patients.length / 3)) },
    { name: 'CIGALI Family Care North', plan: 'Starter', status: 'Onboarding', staff: 5, patients: 118 }
  ];

  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.paidAmount, 0);

  const userRows = [
    { name: 'Demo Admin', email: 'admin@cigali.com', role: 'admin', status: 'active' },
    { name: 'Demo Doctor', email: 'demo@cigali.com', role: 'doctor', status: 'active' },
    ...staff.slice(0, 8).map((member) => ({
      name: member.fullName,
      email: member.email,
      role: member.role,
      status: member.activityScore > 75 ? 'active' : 'idle'
    }))
  ];

  const activity = [
    ...appointments.slice(0, 5).map((a) => ({
      title: `${a.reason} updated`,
      detail: `Appointment ${a.status} • ${new Date(a.updatedAt).toLocaleString()}`
    })),
    ...invoices.slice(0, 4).map((inv) => ({
      title: `Invoice ${inv.invoiceNumber}`,
      detail: `${inv.status.toUpperCase()} • $${inv.amount.toLocaleString()}`
    }))
  ].slice(0, 8);

  if (loading) {
    return <p className="text-sm text-slate-500">Loading admin portal...</p>;
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Admin Portal</h2>
        <p className="text-sm text-slate-600">System-wide operations, clinics, and user governance.</p>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card><p className="text-xs uppercase tracking-wide text-slate-500">Total Clinics</p><p className="mt-2 text-3xl font-semibold text-slate-900">{clinics.length}</p></Card>
        <Card><p className="text-xs uppercase tracking-wide text-slate-500">Total Patients</p><p className="mt-2 text-3xl font-semibold text-slate-900">{patients.length}</p></Card>
        <Card><p className="text-xs uppercase tracking-wide text-slate-500">Total Revenue</p><p className="mt-2 text-3xl font-semibold text-slate-900">${totalRevenue.toLocaleString()}</p></Card>
        <Card><p className="text-xs uppercase tracking-wide text-slate-500">Total Appointments</p><p className="mt-2 text-3xl font-semibold text-slate-900">{appointments.length}</p></Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-1">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Recent Activity</h3>
          <div className="mt-3 space-y-2">
            {activity.map((item, idx) => (
              <div key={`${item.title}-${idx}`} className="rounded-[20px] border border-white/40 bg-white/70 p-3">
                <p className="text-sm font-medium text-slate-800">{item.title}</p>
                <p className="text-xs text-slate-600">{item.detail}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="xl:col-span-2">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Clinic List</h3>
          <Table headers={['Clinic', 'Plan', 'Staff', 'Patients', 'Status']} className="mt-3">
            {clinics.map((clinic) => (
              <tr key={clinic.name}>
                <td className="px-4 py-3 text-slate-800">{clinic.name}</td>
                <td className="px-4 py-3 text-slate-600">{clinic.plan}</td>
                <td className="px-4 py-3 text-slate-600">{clinic.staff}</td>
                <td className="px-4 py-3 text-slate-600">{clinic.patients}</td>
                <td className="px-4 py-3">
                  <Badge variant={clinic.status === 'Active' ? 'success' : 'info'}>{clinic.status}</Badge>
                </td>
              </tr>
            ))}
          </Table>
        </Card>
      </section>

      <Card>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">User Management</h3>
        <Table headers={['Name', 'Email', 'Role', 'Status']} className="mt-3">
          {userRows.map((user) => (
            <tr key={`${user.email}-${user.role}`}>
              <td className="px-4 py-3 text-slate-800">{user.name}</td>
              <td className="px-4 py-3 text-slate-600">{user.email}</td>
              <td className="px-4 py-3 text-slate-600">{user.role}</td>
              <td className="px-4 py-3">
                <Badge variant={user.status === 'active' ? 'success' : 'neutral'}>{user.status}</Badge>
              </td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  );
};

export default AdminPage;
