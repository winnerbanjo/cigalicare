import { FormEvent, useEffect, useMemo, useState } from 'react';
import { appointmentsApi } from '@/api/appointments.api';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';
import { Table } from '@/components/ui/Table';
import { useCigaliData } from '@/hooks/useCigaliData';
import { Appointment, AppointmentInput } from '@/types/appointment';

const initialState: AppointmentInput = {
  patientId: '',
  date: '',
  reason: '',
  type: 'consultation',
  status: 'scheduled',
  doctorAssigned: ''
};

const statusVariant = {
  scheduled: 'info',
  completed: 'success',
  cancelled: 'warning'
} as const;

const roomById = (id: string) => `Room ${((Number(id.replace(/\D/g, '')) % 8) || 8)}`;

export const AppointmentsPage = () => {
  const { loading, appointments: seedAppointments, patients, staff } = useCigaliData();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isBusy, setIsBusy] = useState(true);
  const [viewMode, setViewMode] = useState<'daily' | 'weekly' | 'doctor' | 'room'>('weekly');
  const [doctorFilter, setDoctorFilter] = useState('all');
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Appointment | null>(null);
  const [form, setForm] = useState<AppointmentInput>(initialState);

  const doctorOptions = staff.filter((s) => s.role === 'doctor');

  const loadAppointments = async () => {
    setIsBusy(true);
    try {
      const fresh = await appointmentsApi.getAll();
      setAppointments(fresh);
    } catch {
      setAppointments(seedAppointments);
    } finally {
      setIsBusy(false);
    }
  };

  useEffect(() => {
    if (!loading) {
      void loadAppointments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  const resolvePatientId = (appointment: Appointment): string =>
    typeof appointment.patientId === 'string' ? appointment.patientId : appointment.patientId._id;

  const patientName = (appointment: Appointment): string => {
    if (typeof appointment.patientId !== 'string') {
      return `${appointment.patientId.firstName} ${appointment.patientId.lastName}`;
    }
    const patient = patients.find((p) => p._id === appointment.patientId);
    return patient ? `${patient.firstName} ${patient.lastName}` : 'Unknown';
  };

  const openCreate = () => {
    setEditing(null);
    setForm(initialState);
    setIsModalOpen(true);
  };

  const openEdit = (appointment: Appointment) => {
    setEditing(appointment);
    setForm({
      patientId: resolvePatientId(appointment),
      date: appointment.date.slice(0, 16),
      reason: appointment.reason,
      type: appointment.type,
      doctorAssigned: appointment.doctorAssigned,
      status: appointment.status
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditing(null);
    setForm(initialState);
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (editing) {
      await appointmentsApi.update(editing._id, form);
    } else {
      await appointmentsApi.create(form);
    }

    closeModal();
    await loadAppointments();
  };

  const createFollowUp = async (appointment: Appointment) => {
    const dt = new Date(appointment.date);
    dt.setDate(dt.getDate() + 14);

    await appointmentsApi.create({
      patientId: resolvePatientId(appointment),
      date: dt.toISOString(),
      reason: `Follow-up: ${appointment.reason}`,
      type: 'follow_up',
      status: 'scheduled',
      doctorAssigned: appointment.doctorAssigned
    });

    await loadAppointments();
  };

  const onDropToStatus = async (status: 'scheduled' | 'completed' | 'cancelled') => {
    if (!draggedId) return;
    const appointment = appointments.find((a) => a._id === draggedId);
    if (!appointment) return;

    await appointmentsApi.update(appointment._id, {
      patientId: resolvePatientId(appointment),
      date: appointment.date,
      reason: appointment.reason,
      type: appointment.type,
      doctorAssigned: appointment.doctorAssigned,
      status
    });

    await loadAppointments();
  };

  const baseDate = new Date();
  const days = viewMode === 'daily' ? [baseDate] : Array.from({ length: 7 }, (_, i) => new Date(baseDate.getTime() + i * 24 * 60 * 60 * 1000));

  const filteredAppointments = appointments.filter((appt) => doctorFilter === 'all' || appt.doctorAssigned === doctorFilter);

  const byDay = useMemo(() => {
    const map = new Map<string, Appointment[]>();
    days.forEach((d) => map.set(d.toISOString().slice(0, 10), []));
    filteredAppointments.forEach((a) => {
      const key = new Date(a.date).toISOString().slice(0, 10);
      if (map.has(key)) map.get(key)?.push(a);
    });
    return map;
  }, [filteredAppointments, days]);

  const groupedByDoctor = useMemo(() => {
    const groups = new Map<string, Appointment[]>();
    filteredAppointments.forEach((appt) => {
      const key = appt.doctorAssigned || 'Unassigned';
      groups.set(key, [...(groups.get(key) ?? []), appt]);
    });
    return [...groups.entries()];
  }, [filteredAppointments]);

  const groupedByRoom = useMemo(() => {
    const groups = new Map<string, Appointment[]>();
    filteredAppointments.forEach((appt) => {
      const key = roomById(appt._id);
      groups.set(key, [...(groups.get(key) ?? []), appt]);
    });
    return [...groups.entries()];
  }, [filteredAppointments]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Appointments</h2>
        <div className="flex flex-wrap gap-2">
          <Button variant={viewMode === 'daily' ? 'primary' : 'secondary'} onClick={() => setViewMode('daily')}>Daily</Button>
          <Button variant={viewMode === 'weekly' ? 'primary' : 'secondary'} onClick={() => setViewMode('weekly')}>Weekly</Button>
          <Button variant={viewMode === 'doctor' ? 'primary' : 'secondary'} onClick={() => setViewMode('doctor')}>Doctor view</Button>
          <Button variant={viewMode === 'room' ? 'primary' : 'secondary'} onClick={() => setViewMode('room')}>Room view</Button>
          <Button onClick={openCreate}>Create Appointment</Button>
        </div>
      </div>

      <div className="max-w-xs">
        <Select label="Filter by doctor" value={doctorFilter} onChange={(e) => setDoctorFilter(e.target.value)}>
          <option value="all">All doctors</option>
          {doctorOptions.map((doc) => (
            <option key={doc._id} value={doc.fullName}>{doc.fullName}</option>
          ))}
        </Select>
      </div>

      <section className="grid gap-3 md:grid-cols-3">
        {(['scheduled', 'completed', 'cancelled'] as const).map((status) => (
          <div
            key={status}
            className="glass rounded-super p-3"
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => void onDropToStatus(status)}
          >
            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-600">Drop to {status}</p>
            <p className="text-xs text-slate-500">Drag cards from timelines.</p>
          </div>
        ))}
      </section>

      {(viewMode === 'daily' || viewMode === 'weekly') && (
        <section className={`grid gap-3 ${viewMode === 'daily' ? 'md:grid-cols-1' : 'md:grid-cols-7'}`}>
          {days.map((day) => {
            const key = day.toISOString().slice(0, 10);
            const dayItems = byDay.get(key) ?? [];

            return (
              <div key={key} className="glass p-3">
                <p className="text-xs text-slate-500">{day.toLocaleDateString(undefined, { weekday: 'short' })}</p>
                <p className="text-sm font-semibold text-slate-900">{day.toLocaleDateString()}</p>

                <div className="mt-2 space-y-2">
                  {dayItems.slice(0, 10).map((appointment) => (
                    <button
                      type="button"
                      key={appointment._id}
                      className="w-full rounded-super border border-white/40 bg-white/45 p-2 text-left"
                      draggable
                      onDragStart={() => setDraggedId(appointment._id)}
                      onClick={() => openEdit(appointment)}
                    >
                      <p className="text-xs text-slate-500">{new Date(appointment.date).toLocaleTimeString()}</p>
                      <p className="text-sm font-medium text-slate-800">{patientName(appointment)}</p>
                      <p className="text-xs text-slate-600">{appointment.type} • {appointment.doctorAssigned || 'TBD'} • {roomById(appointment._id)}</p>
                      <div className="mt-1"><Badge variant={statusVariant[appointment.status]}>{appointment.status}</Badge></div>
                    </button>
                  ))}
                  {dayItems.length === 0 && <p className="text-xs text-slate-400">No appointments</p>}
                </div>
              </div>
            );
          })}
        </section>
      )}

      {viewMode === 'doctor' && (
        <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {groupedByDoctor.map(([doctor, items]) => (
            <div key={doctor} className="glass p-3">
              <p className="text-sm font-semibold text-slate-900">{doctor}</p>
              <p className="text-xs text-slate-500">{items.length} appointments</p>
              <div className="mt-2 space-y-2">
                {items.slice(0, 8).map((appointment) => (
                  <div key={appointment._id} className="rounded-super border border-white/40 bg-white/45 p-2">
                    <p className="text-sm text-slate-800">{patientName(appointment)}</p>
                    <p className="text-xs text-slate-500">{new Date(appointment.date).toLocaleString()}</p>
                    <Badge variant={statusVariant[appointment.status]}>{appointment.status}</Badge>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>
      )}

      {viewMode === 'room' && (
        <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {groupedByRoom.map(([room, items]) => (
            <div key={room} className="glass p-3">
              <p className="text-sm font-semibold text-slate-900">{room}</p>
              <div className="mt-2 space-y-2">
                {items.slice(0, 6).map((appointment) => (
                  <div key={appointment._id} className="rounded-super border border-white/40 bg-white/45 p-2">
                    <p className="text-sm text-slate-800">{patientName(appointment)}</p>
                    <p className="text-xs text-slate-500">{new Date(appointment.date).toLocaleTimeString()} • {appointment.doctorAssigned || 'Unassigned'}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>
      )}

      <CardTable loading={loading || isBusy} appointments={filteredAppointments} patientName={patientName} openEdit={openEdit} onFollowUp={createFollowUp} />

      <Modal isOpen={isModalOpen} onClose={closeModal} title={editing ? 'Edit Appointment' : 'New Appointment'}>
        <form className="grid gap-3" onSubmit={onSubmit}>
          <Select label="Patient" value={form.patientId} onChange={(e) => setForm((p) => ({ ...p, patientId: e.target.value }))} required>
            <option value="">Select patient</option>
            {patients.map((patient) => (
              <option key={patient._id} value={patient._id}>{patient.firstName} {patient.lastName}</option>
            ))}
          </Select>

          <Input label="Date" type="datetime-local" value={form.date} onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))} required />
          <Input label="Reason" value={form.reason} onChange={(e) => setForm((p) => ({ ...p, reason: e.target.value }))} required />

          <Select label="Appointment Type" value={form.type} onChange={(e) => setForm((p) => ({ ...p, type: e.target.value as Appointment['type'] }))}>
            <option value="consultation">Consultation</option>
            <option value="follow_up">Follow-up</option>
            <option value="surgery">Surgery</option>
            <option value="lab_test">Lab test</option>
          </Select>

          <Select label="Doctor Assignment" value={form.doctorAssigned || ''} onChange={(e) => setForm((p) => ({ ...p, doctorAssigned: e.target.value }))}>
            <option value="">Assign doctor</option>
            {doctorOptions.map((doc) => (
              <option key={doc._id} value={doc.fullName}>{doc.fullName}</option>
            ))}
          </Select>

          <Select label="Status" value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as Appointment['status'] }))}>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </Select>

          <div className="mt-2 flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={closeModal}>Cancel</Button>
            <Button type="submit">{editing ? 'Update' : 'Create'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

const CardTable = ({
  loading,
  appointments,
  patientName,
  openEdit,
  onFollowUp
}: {
  loading: boolean;
  appointments: Appointment[];
  patientName: (appointment: Appointment) => string;
  openEdit: (appointment: Appointment) => void;
  onFollowUp: (appointment: Appointment) => Promise<void>;
}) => {
  if (loading) return <p className="text-sm text-slate-500">Loading appointments...</p>;

  return (
    <Table headers={['Patient', 'Date', 'Type', 'Doctor', 'Room', 'Status', 'Actions']}>
      {appointments.slice(0, 140).map((appointment) => (
        <tr key={appointment._id}>
          <td className="px-4 py-3 text-slate-800">{patientName(appointment)}</td>
          <td className="px-4 py-3 text-slate-600">{new Date(appointment.date).toLocaleString()}</td>
          <td className="px-4 py-3 text-slate-600">{appointment.type}</td>
          <td className="px-4 py-3 text-slate-600">{appointment.doctorAssigned || '-'}</td>
          <td className="px-4 py-3 text-slate-600">{roomById(appointment._id)}</td>
          <td className="px-4 py-3"><Badge variant={statusVariant[appointment.status]}>{appointment.status}</Badge></td>
          <td className="px-4 py-3">
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => openEdit(appointment)}>Edit</Button>
              <Button variant="ghost" onClick={() => void onFollowUp(appointment)}>Follow-up</Button>
            </div>
          </td>
        </tr>
      ))}
    </Table>
  );
};
