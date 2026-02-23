import { FormEvent, useEffect, useMemo, useState } from 'react';
import { appointmentsApi } from '@/api/appointments.api';
import { patientsApi } from '@/api/patients.api';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';
import { Table } from '@/components/ui/Table';
import { Appointment, AppointmentInput } from '@/types/appointment';
import { Patient } from '@/types/patient';

const initialState: AppointmentInput = {
  patientId: '',
  date: '',
  reason: '',
  status: 'scheduled'
};

const statusVariant = {
  scheduled: 'info',
  completed: 'success',
  cancelled: 'warning'
} as const;

const formatDateKey = (value: string): string => new Date(value).toISOString().slice(0, 10);

export const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Appointment | null>(null);
  const [form, setForm] = useState<AppointmentInput>(initialState);

  const patientMap = useMemo(
    () =>
      new Map(
        patients.map((patient) => [patient._id, `${patient.firstName} ${patient.lastName}`])
      ),
    [patients]
  );

  const calendarMap = useMemo(() => {
    const map = new Map<string, number>();
    appointments.forEach((appointment) => {
      const key = formatDateKey(appointment.date);
      map.set(key, (map.get(key) ?? 0) + 1);
    });
    return map;
  }, [appointments]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [appointmentData, patientData] = await Promise.all([appointmentsApi.getAll(), patientsApi.getAll()]);
      setAppointments(appointmentData);
      setPatients(patientData);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const closeModal = () => {
    setIsModalOpen(false);
    setEditing(null);
    setForm(initialState);
  };

  const openCreate = () => {
    setEditing(null);
    setForm(initialState);
    setIsModalOpen(true);
  };

  const resolvePatientId = (appointment: Appointment): string => {
    if (typeof appointment.patientId === 'string') {
      return appointment.patientId;
    }
    return appointment.patientId._id;
  };

  const openEdit = (appointment: Appointment) => {
    setEditing(appointment);
    setForm({
      patientId: resolvePatientId(appointment),
      date: appointment.date.slice(0, 16),
      reason: appointment.reason,
      status: appointment.status
    });
    setIsModalOpen(true);
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (editing) {
      await appointmentsApi.update(editing._id, form);
    } else {
      await appointmentsApi.create(form);
    }

    closeModal();
    await loadData();
  };

  const onDelete = async (id: string) => {
    await appointmentsApi.remove(id);
    await loadData();
  };

  const appointmentPatientName = (appointment: Appointment): string => {
    if (typeof appointment.patientId !== 'string') {
      return `${appointment.patientId.firstName} ${appointment.patientId.lastName}`;
    }
    return patientMap.get(appointment.patientId) ?? 'Unknown';
  };

  const upcomingDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Appointments</h2>
        <Button onClick={openCreate}>New Appointment</Button>
      </div>

      <section className="grid gap-3 md:grid-cols-7">
        {upcomingDays.map((date) => {
          const key = date.toISOString().slice(0, 10);
          const count = calendarMap.get(key) ?? 0;

          return (
            <div key={key} className="rounded-xl border border-borderSoft bg-slate-50 p-3 text-center">
              <p className="text-xs text-slate-500">{date.toLocaleDateString(undefined, { weekday: 'short' })}</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">{date.getDate()}</p>
              <p className="mt-1 text-xs text-slate-600">{count} appt</p>
            </div>
          );
        })}
      </section>

      {isLoading ? (
        <p className="text-sm text-slate-500">Loading appointments...</p>
      ) : (
        <Table headers={['Patient', 'Date', 'Status', 'Reason', 'Actions']}>
          {appointments.map((appointment) => (
            <tr key={appointment._id}>
              <td className="px-4 py-3 text-slate-800">{appointmentPatientName(appointment)}</td>
              <td className="px-4 py-3 text-slate-600">{new Date(appointment.date).toLocaleString()}</td>
              <td className="px-4 py-3">
                <Badge variant={statusVariant[appointment.status]}>{appointment.status}</Badge>
              </td>
              <td className="px-4 py-3 text-slate-600">{appointment.reason}</td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <Button variant="secondary" onClick={() => openEdit(appointment)}>
                    Edit
                  </Button>
                  <Button variant="danger" onClick={() => void onDelete(appointment._id)}>
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </Table>
      )}

      <Modal isOpen={isModalOpen} onClose={closeModal} title={editing ? 'Edit Appointment' : 'New Appointment'}>
        <form className="grid gap-3" onSubmit={onSubmit}>
          <Select
            label="Patient"
            value={form.patientId}
            onChange={(event) => setForm((prev) => ({ ...prev, patientId: event.target.value }))}
            required
          >
            <option value="">Select patient</option>
            {patients.map((patient) => (
              <option key={patient._id} value={patient._id}>
                {patient.firstName} {patient.lastName}
              </option>
            ))}
          </Select>

          <Input
            label="Date"
            type="datetime-local"
            value={form.date}
            onChange={(event) => setForm((prev) => ({ ...prev, date: event.target.value }))}
            required
          />
          <Input
            label="Reason"
            value={form.reason}
            onChange={(event) => setForm((prev) => ({ ...prev, reason: event.target.value }))}
            required
          />

          <Select
            label="Status"
            value={form.status}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                status: event.target.value as 'scheduled' | 'completed' | 'cancelled'
              }))
            }
          >
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </Select>

          <div className="mt-2 flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit">{editing ? 'Update' : 'Create'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
