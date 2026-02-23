import { Appointment } from '@/types/appointment';
import { BillingSummary, Invoice } from '@/types/billing';
import { LabResult, Prescription, RiskAlert, SoapNote, DoctorTask } from '@/types/clinical';
import { Medication } from '@/types/medication';
import { AppNotification } from '@/types/notification';
import { Patient } from '@/types/patient';
import { StaffMember } from '@/types/staff';
import { WorkspaceStats } from '@/types/workspace';

const providerId = 'offline-demo-provider';

const firstNames = ['Ava', 'Noah', 'Liam', 'Mia', 'Emma', 'Ethan', 'Olivia', 'James', 'Sophia', 'Lucas', 'Amara', 'Ezra'];
const lastNames = ['Anderson', 'Patel', 'Mensah', 'Okafor', 'Reed', 'Johnson', 'Williams', 'Clarke', 'Nguyen', 'Davis'];
const blood = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const allergies = ['Penicillin', 'Peanuts', 'Latex', 'Dust', 'Seafood'];
const conditions = ['Hypertension', 'Diabetes Type 2', 'Asthma', 'Arthritis', 'Thyroid Disorder'];
const insurance = ['BlueCross Health', 'Aetna Care', 'Cigna Plus', 'United Health'];
const types: Array<Appointment['type']> = ['consultation', 'follow_up', 'surgery', 'lab_test'];
const statuses: Array<Appointment['status']> = ['scheduled', 'completed', 'cancelled'];
const categories = ['Antibiotic', 'Pain Relief', 'Cardiology', 'Diabetes', 'Respiratory', 'Vitamins'];
const suppliers = ['MedSupply One', 'Prime Pharma', 'Apex Labs', 'HealthBridge Supply'];

const dayMs = 24 * 60 * 60 * 1000;
const now = Date.now();

const patientAt = (i: number): Patient => {
  const firstName = firstNames[i % firstNames.length];
  const lastName = lastNames[(i * 3) % lastNames.length];
  const created = new Date(now - (300 - i) * dayMs);
  const tier: Patient['tier'] = i % 12 === 0 ? 'vip' : i % 4 === 0 ? 'priority' : 'standard';

  return {
    _id: `p-${i + 1}`,
    providerId,
    firstName,
    lastName,
    tier,
    photoUrl: `https://api.dicebear.com/7.x/adventurer/svg?seed=${firstName}-${lastName}-${i}`,
    phone: `+1-555-${String(100000 + i).slice(-6)}`,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@cigali-demo.com`,
    dateOfBirth: new Date(now - (20 + (i % 55)) * 365 * dayMs).toISOString(),
    gender: (['male', 'female', 'non_binary'] as const)[i % 3],
    bloodGroup: blood[i % blood.length],
    allergies: [allergies[i % allergies.length]],
    chronicConditions: [conditions[i % conditions.length]],
    insuranceProvider: insurance[i % insurance.length],
    emergencyContact: {
      name: `${firstNames[(i + 2) % firstNames.length]} ${lastNames[(i + 5) % lastNames.length]}`,
      relationship: ['Parent', 'Spouse', 'Sibling', 'Friend'][i % 4],
      phone: `+1-555-${String(200000 + i).slice(-6)}`
    },
    notes:
      i % 5 === 0
        ? 'Hypertension patient. Last visit 3 weeks ago. Currently on Amlodipine 5mg daily.'
        : 'Comprehensive care plan with diagnostics, medication adherence review, and follow-up check-ins.',
    createdAt: created.toISOString(),
    updatedAt: created.toISOString()
  };
};

const staffAt = (i: number): StaffMember => {
  const roles: StaffMember['role'][] = ['doctor', 'doctor', 'doctor', 'doctor', 'nurse', 'nurse', 'admin', 'admin', 'pharmacist', 'nurse'];
  const fullName = `${firstNames[(i + 3) % firstNames.length]} ${lastNames[(i + 1) % lastNames.length]}`;
  return {
    _id: `s-${i + 1}`,
    providerId,
    fullName,
    email: `${fullName.toLowerCase().replace(/\s+/g, '.')}@cigali-demo.com`,
    role: roles[i],
    permissions:
      roles[i] === 'admin'
        ? ['read:all', 'write:all', 'billing:manage']
        : roles[i] === 'doctor'
          ? ['patients:read', 'appointments:write', 'labs:read', 'notes:write']
          : roles[i] === 'pharmacist'
            ? ['inventory:read', 'inventory:write']
            : ['patients:read', 'appointments:read'],
    activityScore: 70 + (i * 3) % 30,
    createdAt: new Date(now - (120 - i) * dayMs).toISOString(),
    updatedAt: new Date(now - i * dayMs).toISOString()
  };
};

export const demoPatients: Patient[] = Array.from({ length: 300 }, (_, i) => patientAt(i));
export const demoStaff: StaffMember[] = Array.from({ length: 10 }, (_, i) => staffAt(i));

const doctorNames = demoStaff.filter((s) => s.role === 'doctor').map((s) => s.fullName);

export const demoAppointments: Appointment[] = Array.from({ length: 500 }, (_, i) => {
  const patient = demoPatients[i % demoPatients.length];
  const date = new Date(now - 120 * dayMs + i * (dayMs / 3));
  const type = types[i % types.length];
  const status = statuses[i % statuses.length];

  return {
    _id: `a-${i + 1}`,
    providerId,
    patientId: {
      _id: patient._id,
      firstName: patient.firstName,
      lastName: patient.lastName,
      email: patient.email,
      phone: patient.phone,
      photoUrl: patient.photoUrl
    },
    date: date.toISOString(),
    reason:
      type === 'consultation'
        ? 'General consultation'
        : type === 'follow_up'
          ? 'Post-care follow-up'
          : type === 'surgery'
            ? 'Minor surgery'
            : 'Lab diagnostics',
    type,
    doctorAssigned: doctorNames[i % doctorNames.length],
    status,
    createdAt: date.toISOString(),
    updatedAt: date.toISOString()
  };
});

export const demoMedications: Medication[] = Array.from({ length: 140 }, (_, i) => {
  const category = categories[i % categories.length];
  const costPrice = 8 + (i % 40);
  const sellingPrice = Number((costPrice * 1.45).toFixed(2));
  const stock = (i * 7) % 180;

  return {
    _id: `m-${i + 1}`,
    providerId,
    name: `${category} Med ${i + 1}`,
    category,
    supplier: suppliers[i % suppliers.length],
    stock,
    price: sellingPrice,
    costPrice,
    sellingPrice,
    expiryDate: new Date(now + ((i % 540) + 30) * dayMs).toISOString(),
    sku: `CGM-${String(1000 + i)}`,
    unit: 'box',
    description: `${category} medication used in outpatient and inpatient workflows.`,
    createdAt: new Date(now - (130 - i) * dayMs).toISOString(),
    updatedAt: new Date(now - (i % 20) * dayMs).toISOString()
  };
});

export const demoInvoices: Invoice[] = Array.from({ length: 260 }, (_, i) => {
  const patient = demoPatients[i % demoPatients.length];
  const amount = 90 + (i % 17) * 73;
  const status = (['paid', 'pending', 'overdue'] as const)[i % 3];
  const paidAmount = status === 'paid' ? amount : status === 'pending' ? Math.floor(amount * 0.4) : 0;
  const dueDate = new Date(now - 45 * dayMs + i * (dayMs / 2));

  return {
    _id: `inv-${i + 1}`,
    providerId,
    invoiceNumber: `INV-2026-${String(i + 1).padStart(4, '0')}`,
    amount,
    paidAmount,
    status,
    dueDate: dueDate.toISOString(),
    paidAt: status === 'paid' ? new Date(dueDate.getTime() - 2 * dayMs).toISOString() : undefined,
    patientId: { _id: patient._id, firstName: patient.firstName, lastName: patient.lastName },
    createdAt: dueDate.toISOString(),
    updatedAt: dueDate.toISOString()
  };
});

export const demoLabResults: LabResult[] = Array.from({ length: 480 }, (_, i) => {
  const patient = demoPatients[i % demoPatients.length];
  const score = i % 11;
  const status: LabResult['status'] = score === 0 ? 'critical' : score <= 2 ? 'abnormal' : 'normal';

  return {
    _id: `lab-${i + 1}`,
    patientId: patient._id,
    providerId,
    testName: ['CBC', 'HbA1c', 'Lipid Panel', 'Thyroid Profile', 'Liver Function'][i % 5],
    value:
      status === 'critical'
        ? 'Critical variance detected'
        : status === 'abnormal'
          ? 'Outside reference range'
          : 'Within reference range',
    status,
    flagged: status !== 'normal',
    createdAt: new Date(now - (160 - i) * (dayMs / 2)).toISOString()
  };
});

export const demoPrescriptions: Prescription[] = Array.from({ length: 520 }, (_, i) => {
  const patient = demoPatients[i % demoPatients.length];

  return {
    _id: `rx-${i + 1}`,
    patientId: patient._id,
    providerId,
    medicationName: demoMedications[i % demoMedications.length].name,
    dosage: ['5mg', '10mg', '20mg'][i % 3],
    frequency: ['Once daily', 'Twice daily', 'Every 8 hours'][i % 3],
    durationDays: [7, 14, 30][i % 3],
    doctorName: doctorNames[i % doctorNames.length],
    notes: i % 8 === 0 ? 'Monitor blood pressure and renal function.' : undefined,
    createdAt: new Date(now - (180 - i) * (dayMs / 3)).toISOString()
  };
});

export const demoSoapNotes: SoapNote[] = Array.from({ length: 420 }, (_, i) => {
  const patient = demoPatients[i % demoPatients.length];
  const doctor = doctorNames[i % doctorNames.length];

  return {
    _id: `note-${i + 1}`,
    patientId: patient._id,
    providerId,
    doctorName: doctor,
    subjective: 'Patient reports intermittent fatigue and mild headaches over the past week.',
    objective: 'Vitals stable. BP mildly elevated at 142/92. No acute distress.',
    assessment: i % 5 === 0 ? 'Hypertension with variable control.' : 'Stable chronic condition under treatment.',
    plan: 'Continue current medication, lifestyle reinforcement, and schedule follow-up in 2-4 weeks.',
    privateNote: i % 12 === 0 ? 'VIP communication preference: direct physician callback.' : undefined,
    createdAt: new Date(now - (200 - i) * (dayMs / 4)).toISOString()
  };
});

export const demoDoctorTasks: DoctorTask[] = [
  { id: 't-1', label: 'Review 8 abnormal lab results', priority: 'high', dueAt: new Date(now + 60 * 60 * 1000).toISOString(), done: false },
  { id: 't-2', label: 'Sign 5 pending digital prescriptions', priority: 'medium', dueAt: new Date(now + 2 * 60 * 60 * 1000).toISOString(), done: false },
  { id: 't-3', label: 'Call 3 VIP follow-up patients', priority: 'high', dueAt: new Date(now + 3 * 60 * 60 * 1000).toISOString(), done: false },
  { id: 't-4', label: 'Finalize SOAP notes for completed consults', priority: 'medium', dueAt: new Date(now + 4 * 60 * 60 * 1000).toISOString(), done: false }
];

export const demoBillingSummary: BillingSummary = {
  totalRevenue: demoInvoices.reduce((sum, inv) => sum + inv.paidAmount, 0),
  pending: demoInvoices.filter((inv) => inv.status === 'pending').length,
  overdue: demoInvoices.filter((inv) => inv.status === 'overdue').length,
  count: demoInvoices.length
};

export const demoNotifications: AppNotification[] = [
  {
    id: 'n-1',
    type: 'appointment',
    title: 'Upcoming appointment reminder',
    description: '3 consultations begin in the next 2 hours.',
    createdAt: new Date(now - 30 * 60 * 1000).toISOString()
  },
  {
    id: 'n-2',
    type: 'inventory',
    title: 'Low stock alert',
    description: '12 medications are below recommended threshold.',
    createdAt: new Date(now - 70 * 60 * 1000).toISOString()
  },
  {
    id: 'n-3',
    type: 'patient',
    title: 'New patient intake',
    description: '4 new patient profiles were added today.',
    createdAt: new Date(now - 2 * 60 * 60 * 1000).toISOString()
  }
];

export const demoRevenueSeries = Array.from({ length: 12 }, (_, i) => {
  const monthDate = new Date(now);
  monthDate.setMonth(monthDate.getMonth() - (11 - i));
  return {
    month: monthDate.toLocaleDateString(undefined, { month: 'short' }),
    revenue: 25000 + i * 1800 + ((i * 377) % 2200)
  };
});

export const demoPatientGrowthSeries = Array.from({ length: 12 }, (_, i) => {
  const monthDate = new Date(now);
  monthDate.setMonth(monthDate.getMonth() - (11 - i));
  return {
    month: monthDate.toLocaleDateString(undefined, { month: 'short' }),
    patients: 90 + i * 18
  };
});

export const demoAppointmentTimeline = Array.from({ length: 7 }, (_, i) => {
  const d = new Date(now);
  d.setDate(d.getDate() - (6 - i));

  return {
    day: d.toLocaleDateString(undefined, { weekday: 'short' }),
    scheduled: 16 + ((i * 3) % 7),
    completed: 10 + ((i * 4) % 6),
    cancelled: 1 + (i % 3)
  };
});

export const buildRiskAlerts = (patients: Patient[], appointments: Appointment[]): RiskAlert[] => {
  const alerts: RiskAlert[] = [];

  for (const patient of patients.slice(0, 90)) {
    const patientAppointments = appointments.filter((appt) => {
      if (typeof appt.patientId === 'string') return appt.patientId === patient._id;
      return appt.patientId._id === patient._id;
    });

    const missed = patientAppointments.filter((appt) => appt.status === 'cancelled').length;
    const needsFollowup = patientAppointments.some((appt) => appt.type === 'follow_up' && appt.status === 'scheduled');
    const chronic = (patient.chronicConditions ?? []).length > 0;

    if (missed >= 2) {
      alerts.push({ id: `alert-missed-${patient._id}`, patientId: patient._id, severity: 'warning', reason: 'Missed multiple appointments' });
    }
    if (chronic && missed >= 1) {
      alerts.push({ id: `alert-chronic-${patient._id}`, patientId: patient._id, severity: 'critical', reason: 'Chronic condition with missed care window' });
    }
    if (!needsFollowup && chronic) {
      alerts.push({ id: `alert-followup-${patient._id}`, patientId: patient._id, severity: 'warning', reason: 'Follow-up overdue' });
    }
  }

  return alerts.slice(0, 120);
};

export const buildWorkspaceStats = (appointments: Appointment[], invoices: Invoice[], labs: LabResult[], alerts: RiskAlert[]): WorkspaceStats => {
  const today = new Date().toISOString().slice(0, 10);
  const todaysAppointments = appointments.filter((a) => a.date.slice(0, 10) === today).length;
  const unreadLabs = labs.filter((l) => l.flagged).length;
  const urgentPatients = alerts.filter((a) => a.severity === 'critical').length;
  const followUpsRequired = alerts.filter((a) => a.reason.toLowerCase().includes('follow-up')).length;
  const revenueToday = invoices
    .filter((i) => i.paidAt?.slice(0, 10) === today)
    .reduce((acc, i) => acc + i.paidAmount, 0);
  const missedLossToday = appointments.filter((a) => a.status === 'cancelled' && a.date.slice(0, 10) === today).length * 180;

  return { todaysAppointments, unreadLabs, urgentPatients, followUpsRequired, revenueToday, missedLossToday };
};
