import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { appointmentsApi } from '@/api/appointments.api';
import { patientsApi } from '@/api/patients.api';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Appointment } from '@/types/appointment';
import { Patient } from '@/types/patient';

export const PatientProfilePage = () => {
  const { id } = useParams();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!id) {
        return;
      }

      setLoading(true);
      try {
        const [patientData, allAppointments] = await Promise.all([
          patientsApi.getById(id),
          appointmentsApi.getAll()
        ]);

        setPatient(patientData);
        setAppointments(
          allAppointments.filter((appointment) => {
            if (typeof appointment.patientId === 'string') {
              return appointment.patientId === id;
            }
            return appointment.patientId._id === id;
          })
        );
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [id]);

  const groupedHistory = useMemo(() => {
    return [...appointments].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [appointments]);

  if (loading) {
    return <p className="text-sm text-slate-500">Loading patient profile...</p>;
  }

  if (!patient) {
    return <p className="text-sm text-slate-500">Patient not found.</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">
          {patient.firstName} {patient.lastName}
        </h2>
        <Link to="/app/patients" className="text-sm font-medium text-primary-600 hover:text-primary-700">
          Back to patients
        </Link>
      </div>

      <section className="grid gap-4 md:grid-cols-2">
        <Card>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Profile</h3>
          <div className="mt-3 space-y-2 text-sm text-slate-700">
            <p>Email: {patient.email || '-'}</p>
            <p>Phone: {patient.phone || '-'}</p>
            <p>DOB: {patient.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString() : '-'}</p>
          </div>
        </Card>

        <Card>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Notes</h3>
          <p className="mt-3 text-sm leading-6 text-slate-700">{patient.notes || 'No notes yet.'}</p>
        </Card>
      </section>

      <Card>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Appointment History</h3>
        {groupedHistory.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">No appointments yet.</p>
        ) : (
          <div className="mt-4 space-y-2">
            {groupedHistory.map((appointment) => (
              <div key={appointment._id} className="flex items-center justify-between rounded-xl border border-borderSoft bg-slate-50 p-3">
                <div>
                  <p className="text-sm font-medium text-slate-800">{new Date(appointment.date).toLocaleString()}</p>
                  <p className="text-sm text-slate-600">{appointment.reason}</p>
                </div>
                <Badge variant={appointment.status === 'completed' ? 'success' : appointment.status === 'cancelled' ? 'warning' : 'info'}>
                  {appointment.status}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};
