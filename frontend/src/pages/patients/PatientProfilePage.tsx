import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { useCigaliData } from '@/hooks/useCigaliData';

export const PatientProfilePage = () => {
  const { id } = useParams();
  const { loading, patients, appointments, medications, invoices, labResults, prescriptions, soapNotes, riskAlerts } = useCigaliData();

  const patient = patients.find((p) => p._id === id);

  const patientAppointments = useMemo(
    () =>
      appointments
        .filter((appointment) => {
          if (typeof appointment.patientId === 'string') return appointment.patientId === id;
          return appointment.patientId._id === id;
        })
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [appointments, id]
  );

  const patientInvoices = useMemo(
    () =>
      invoices
        .filter((inv) => {
          if (typeof inv.patientId === 'string') return inv.patientId === id;
          return inv.patientId._id === id;
        })
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [invoices, id]
  );

  const patientLabs = useMemo(
    () => labResults.filter((lab) => lab.patientId === id).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [labResults, id]
  );

  const patientPrescriptions = useMemo(
    () => prescriptions.filter((rx) => rx.patientId === id).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [prescriptions, id]
  );

  const patientNotes = useMemo(
    () => soapNotes.filter((note) => note.patientId === id).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [soapNotes, id]
  );

  const patientAlerts = riskAlerts.filter((alert) => alert.patientId === id);
  const relatedMedications = medications.slice(0, 8);

  if (loading) return <p className="text-sm text-slate-500">Loading patient profile...</p>;
  if (!patient) return <p className="text-sm text-slate-500">Patient not found.</p>;

  const lastVisit = patientAppointments[0]?.date;
  const summaryCondition = patient.chronicConditions?.[0] || 'General wellness program';
  const summaryMedication = patientPrescriptions[0]?.medicationName || 'No active medication';

  return (
    <div className="space-y-4">
      <section className="glass mesh-surface p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <img src={patient.photoUrl} alt={`${patient.firstName} ${patient.lastName}`} className="h-20 w-20 rounded-super border border-white/60 object-cover" />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-semibold text-slate-900">{patient.firstName} {patient.lastName}</h2>
                <Badge variant={patient.tier === 'vip' ? 'warning' : patient.tier === 'priority' ? 'info' : 'neutral'}>
                  {(patient.tier || 'standard').toUpperCase()}
                </Badge>
              </div>
              <p className="text-sm text-slate-600">{patient.email || '-'} • {patient.phone || '-'}</p>
            </div>
          </div>
          <Link to="/app/patients" className="glass-button inline-flex w-fit items-center justify-center">Back to patients</Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-1">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Patient Summary</h3>
          <div className="mt-3 space-y-1 text-sm text-slate-700">
            <p><strong>Condition:</strong> {summaryCondition}</p>
            <p><strong>Last visit:</strong> {lastVisit ? new Date(lastVisit).toLocaleDateString() : 'No visits yet'}</p>
            <p><strong>Current medication:</strong> {summaryMedication}</p>
            <p><strong>Blood Group:</strong> {patient.bloodGroup || '-'}</p>
            <p><strong>Insurance:</strong> {patient.insuranceProvider || '-'}</p>
          </div>

          <div className="mt-4 rounded-super border border-white/45 bg-white/40 p-3">
            <p className="text-xs uppercase tracking-wide text-slate-500">Risk Alerts</p>
            <div className="mt-2 space-y-2">
              {patientAlerts.length === 0 ? <p className="text-sm text-slate-500">No active alerts.</p> : null}
              {patientAlerts.map((alert) => (
                <div key={alert.id}>
                  <Badge variant={alert.severity === 'critical' ? 'warning' : 'info'}>{alert.reason}</Badge>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card className="md:col-span-2">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Smart Patient Timeline</h3>
          <div className="mt-3 space-y-3">
            {patientAppointments.slice(0, 10).map((appointment, idx) => (
              <div key={appointment._id} className="relative rounded-super border border-white/45 bg-white/40 p-3">
                <div className="absolute left-3 top-3 h-2 w-2 rounded-full bg-primary-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-800">{new Date(appointment.date).toLocaleString()}</p>
                  <p className="text-sm text-slate-600">{appointment.reason}</p>
                  <div className="mt-1 flex flex-wrap gap-2">
                    <Badge variant={appointment.status === 'completed' ? 'success' : appointment.status === 'cancelled' ? 'warning' : 'info'}>{appointment.status}</Badge>
                    <Badge variant="neutral">{appointment.type}</Badge>
                    {idx === 0 ? <Badge variant="info">Latest</Badge> : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <Card>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Digital Prescriptions</h3>
          <div className="mt-3 space-y-2">
            {patientPrescriptions.slice(0, 8).map((rx) => (
              <div key={rx._id} className="rounded-super border border-white/45 bg-white/40 p-3">
                <p className="text-sm font-medium text-slate-800">{rx.medicationName} • {rx.dosage}</p>
                <p className="text-xs text-slate-600">{rx.frequency} for {rx.durationDays} days</p>
                <p className="text-xs text-slate-500">{rx.doctorName}</p>
              </div>
            ))}
            <button type="button" className="glass-button mt-2">Export prescriptions PDF</button>
          </div>
        </Card>

        <Card>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Lab Results</h3>
          <div className="mt-3 space-y-2">
            {patientLabs.slice(0, 8).map((lab) => (
              <div key={lab._id} className="rounded-super border border-white/45 bg-white/40 p-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-800">{lab.testName}</p>
                  <Badge variant={lab.status === 'critical' ? 'warning' : lab.status === 'abnormal' ? 'info' : 'success'}>{lab.status}</Badge>
                </div>
                <p className="text-xs text-slate-600">{lab.value}</p>
              </div>
            ))}
            <button type="button" className="glass-button mt-2">Upload lab result</button>
          </div>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <Card>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">SOAP Notes</h3>
          <div className="mt-3 space-y-2">
            {patientNotes.slice(0, 6).map((note) => (
              <div key={note._id} className="rounded-super border border-white/45 bg-white/40 p-3 text-sm">
                <p className="font-semibold text-slate-800">{note.doctorName} • {new Date(note.createdAt).toLocaleDateString()}</p>
                <p className="mt-1 text-slate-700"><strong>S:</strong> {note.subjective}</p>
                <p className="text-slate-700"><strong>O:</strong> {note.objective}</p>
                <p className="text-slate-700"><strong>A:</strong> {note.assessment}</p>
                <p className="text-slate-700"><strong>P:</strong> {note.plan}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Billing, Insurance, Emergency</h3>
          <div className="mt-3 space-y-2">
            {patientInvoices.slice(0, 8).map((inv) => (
              <div key={inv._id} className="rounded-super border border-white/45 bg-white/40 p-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-800">{inv.invoiceNumber}</p>
                  <Badge variant={inv.status === 'paid' ? 'success' : inv.status === 'overdue' ? 'warning' : 'info'}>{inv.status}</Badge>
                </div>
                <p className="text-xs text-slate-600">Due: {new Date(inv.dueDate).toLocaleDateString()} • ${inv.amount.toLocaleString()}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-super border border-white/45 bg-white/40 p-3 text-sm">
            <p><strong>Insurance:</strong> {patient.insuranceProvider || '-'}</p>
            <p><strong>Emergency:</strong> {patient.emergencyContact?.name || '-'} • {patient.emergencyContact?.relationship || '-'} • {patient.emergencyContact?.phone || '-'}</p>
            <p><strong>Allergies:</strong> {patient.allergies?.join(', ') || 'None documented'}</p>
            <p><strong>Medications tracked:</strong> {relatedMedications.length}</p>
          </div>
        </Card>
      </section>
    </div>
  );
};
