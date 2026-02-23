import { useMemo } from 'react';
import { useCigaliData } from '@/hooks/useCigaliData';
import { Badge } from '@/components/ui/Badge';
import { Table } from '@/components/ui/Table';

export const StaffPage = () => {
  const { loading, staff, appointments } = useCigaliData();

  const doctorLoad = useMemo(() => {
    return staff
      .filter((s) => s.role === 'doctor')
      .map((doctor) => ({
        doctor: doctor.fullName,
        todays: appointments.filter((a) => a.doctorAssigned === doctor.fullName && a.date.slice(0, 10) === new Date().toISOString().slice(0, 10)).length,
        upcoming: appointments.filter((a) => a.doctorAssigned === doctor.fullName && new Date(a.date).getTime() > Date.now()).length
      }));
  }, [staff, appointments]);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Staff Management</h2>
        <p className="text-sm text-slate-600">Multi-doctor scheduling, permissions, and activity tracking.</p>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        {doctorLoad.map((item) => (
          <div key={item.doctor} className="glass p-4">
            <p className="text-sm font-semibold text-slate-900">{item.doctor}</p>
            <p className="text-xs text-slate-500">Today's consults: {item.todays}</p>
            <p className="text-xs text-slate-500">Upcoming schedule: {item.upcoming}</p>
          </div>
        ))}
      </section>

      {loading ? (
        <p className="text-sm text-slate-500">Loading staff...</p>
      ) : (
        <Table headers={['Name', 'Email', 'Role', 'Permissions', 'Activity']}>
          {staff.map((member) => (
            <tr key={member._id}>
              <td className="px-4 py-3 text-slate-800">{member.fullName}</td>
              <td className="px-4 py-3 text-slate-600">{member.email}</td>
              <td className="px-4 py-3">
                <Badge variant={member.role === 'admin' ? 'info' : member.role === 'doctor' ? 'success' : 'neutral'}>
                  {member.role}
                </Badge>
              </td>
              <td className="px-4 py-3 text-slate-600">{member.permissions.join(', ')}</td>
              <td className="px-4 py-3 text-slate-700">{member.activityScore}%</td>
            </tr>
          ))}
        </Table>
      )}
    </div>
  );
};
