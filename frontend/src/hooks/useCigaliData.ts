import { useEffect, useState } from 'react';
import { appointmentsApi } from '@/api/appointments.api';
import { billingApi } from '@/api/billing.api';
import { medicationsApi } from '@/api/medications.api';
import { patientsApi } from '@/api/patients.api';
import { staffApi } from '@/api/staff.api';
import {
  buildRiskAlerts,
  buildWorkspaceStats,
  demoAppointmentTimeline,
  demoAppointments,
  demoBillingSummary,
  demoDoctorTasks,
  demoInvoices,
  demoLabResults,
  demoMedications,
  demoNotifications,
  demoPatientGrowthSeries,
  demoPatients,
  demoPrescriptions,
  demoRevenueSeries,
  demoSoapNotes,
  demoStaff
} from '@/demo/data';
import { Appointment } from '@/types/appointment';
import { BillingSummary, Invoice } from '@/types/billing';
import { DoctorTask, LabResult, Prescription, RiskAlert, SoapNote } from '@/types/clinical';
import { Medication } from '@/types/medication';
import { AppNotification } from '@/types/notification';
import { Patient } from '@/types/patient';
import { StaffMember } from '@/types/staff';
import { WorkspaceStats } from '@/types/workspace';

interface CigaliDataState {
  loading: boolean;
  patients: Patient[];
  appointments: Appointment[];
  medications: Medication[];
  invoices: Invoice[];
  billingSummary: BillingSummary;
  staff: StaffMember[];
  notifications: AppNotification[];
  patientGrowthSeries: Array<{ month: string; patients: number }>;
  revenueSeries: Array<{ month: string; revenue: number }>;
  appointmentTimeline: Array<{ day: string; scheduled: number; completed: number; cancelled: number }>;
  labResults: LabResult[];
  prescriptions: Prescription[];
  soapNotes: SoapNote[];
  riskAlerts: RiskAlert[];
  doctorTasks: DoctorTask[];
  workspaceStats: WorkspaceStats;
}

const initialState: CigaliDataState = {
  loading: true,
  patients: [],
  appointments: [],
  medications: [],
  invoices: [],
  billingSummary: { totalRevenue: 0, pending: 0, overdue: 0, count: 0 },
  staff: [],
  notifications: [],
  patientGrowthSeries: [],
  revenueSeries: [],
  appointmentTimeline: [],
  labResults: [],
  prescriptions: [],
  soapNotes: [],
  riskAlerts: [],
  doctorTasks: [],
  workspaceStats: {
    todaysAppointments: 0,
    unreadLabs: 0,
    urgentPatients: 0,
    followUpsRequired: 0,
    revenueToday: 0,
    missedLossToday: 0
  }
};

export const useCigaliData = () => {
  const [state, setState] = useState<CigaliDataState>(initialState);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const [patients, appointments, medications, invoices, billingSummary, staff] = await Promise.all([
          patientsApi.getAll(),
          appointmentsApi.getAll(),
          medicationsApi.getAll(),
          billingApi.getInvoices(),
          billingApi.getSummary(),
          staffApi.getAll()
        ]);

        if (cancelled) {
          return;
        }

        const riskAlerts = buildRiskAlerts(patients, appointments);
        const workspaceStats = buildWorkspaceStats(appointments, invoices, demoLabResults, riskAlerts);

        setState({
          loading: false,
          patients,
          appointments,
          medications,
          invoices,
          billingSummary,
          staff,
          notifications: demoNotifications,
          patientGrowthSeries: demoPatientGrowthSeries,
          revenueSeries: demoRevenueSeries,
          appointmentTimeline: demoAppointmentTimeline,
          labResults: demoLabResults,
          prescriptions: demoPrescriptions,
          soapNotes: demoSoapNotes,
          riskAlerts,
          doctorTasks: demoDoctorTasks,
          workspaceStats
        });
      } catch {
        if (cancelled) {
          return;
        }

        const riskAlerts = buildRiskAlerts(demoPatients, demoAppointments);
        const workspaceStats = buildWorkspaceStats(demoAppointments, demoInvoices, demoLabResults, riskAlerts);

        setState({
          loading: false,
          patients: demoPatients,
          appointments: demoAppointments,
          medications: demoMedications,
          invoices: demoInvoices,
          billingSummary: demoBillingSummary,
          staff: demoStaff,
          notifications: demoNotifications,
          patientGrowthSeries: demoPatientGrowthSeries,
          revenueSeries: demoRevenueSeries,
          appointmentTimeline: demoAppointmentTimeline,
          labResults: demoLabResults,
          prescriptions: demoPrescriptions,
          soapNotes: demoSoapNotes,
          riskAlerts,
          doctorTasks: demoDoctorTasks,
          workspaceStats
        });
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
};
