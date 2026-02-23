import mongoose from 'mongoose';
import { AppointmentModel } from './models/Appointment';
import { InvoiceModel } from './models/Invoice';
import { MedicationModel } from './models/Medication';
import { PatientModel } from './models/Patient';
import { ProviderModel } from './models/Provider';
import { StaffModel } from './models/Staff';
import { UserModel } from './models/User';
import { isDbConnected } from './config/db';
import { authService } from './services/auth.service';
import { hashPassword } from './utils/password';

const DEMO_PROVIDER_EMAIL = 'demo-provider@cigali.com';

const firstNames = ['Ava', 'Noah', 'Liam', 'Mia', 'Emma', 'Ethan', 'Olivia', 'James', 'Sophia', 'Lucas', 'Amara', 'Ezra', 'Elena', 'Zion', 'Nora', 'Mason', 'Ivy', 'Mila', 'Leo', 'Aria', 'Roman', 'Isla', 'Kai', 'Ruby', 'Levi'];
const lastNames = ['Anderson', 'Patel', 'Mensah', 'Okafor', 'Reed', 'Johnson', 'Williams', 'Clarke', 'Nguyen', 'Davis', 'Thompson', 'Martin', 'White', 'Moore', 'Taylor', 'Khan', 'Adams', 'Coleman', 'Bennett', 'James'];
const allergiesList = ['Penicillin', 'Peanuts', 'Latex', 'Dust', 'None'];
const conditionsList = ['Hypertension', 'Diabetes Type 2', 'Asthma', 'Arthritis', 'None'];
const insuranceList = ['BlueCross Health', 'Aetna Care', 'Cigna Plus', 'United Health', 'MediTrust'];
const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const appointmentTypes: Array<'consultation' | 'follow_up' | 'surgery' | 'lab_test'> = ['consultation', 'follow_up', 'surgery', 'lab_test'];
const appointmentStatuses: Array<'scheduled' | 'completed' | 'cancelled'> = ['scheduled', 'completed', 'cancelled'];
const medicationCategories = ['Antibiotic', 'Pain Relief', 'Cardiology', 'Diabetes', 'Respiratory', 'Vitamins'];
const suppliers = ['MedSupply One', 'Prime Pharma', 'Apex Labs', 'HealthBridge Supply', 'CoreMed'];
const staffRoles: Array<'doctor' | 'nurse' | 'admin' | 'pharmacist'> = ['doctor', 'doctor', 'doctor', 'nurse', 'nurse', 'nurse', 'admin', 'admin', 'pharmacist', 'pharmacist'];

const randomItem = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const randomDateInPastYears = (years: number): Date => {
  const now = new Date();
  const past = new Date(now.getFullYear() - years, now.getMonth(), now.getDate());
  return new Date(past.getTime() + Math.random() * (now.getTime() - past.getTime()));
};

const randomDateAroundNow = (daysPast: number, daysFuture: number): Date => {
  const now = Date.now();
  const start = now - daysPast * 24 * 60 * 60 * 1000;
  const end = now + daysFuture * 24 * 60 * 60 * 1000;
  return new Date(start + Math.random() * (end - start));
};

const avatarUrl = (seed: string): string => `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(seed)}`;

const ensureDemoProvider = async () => {
  return ProviderModel.findOneAndUpdate(
    { email: DEMO_PROVIDER_EMAIL },
    {
      $set: {
        name: 'CIGALI Advanced Medical Center',
        email: DEMO_PROVIDER_EMAIL,
        phone: '+1 555 110 2026',
        subscriptionPlan: 'growth'
      }
    },
    { upsert: true, new: true }
  );
};

const ensureDemoUser = async (params: {
  providerId: string;
  name: string;
  email: string;
  role: 'doctor' | 'admin';
}) => {
  const hashedPassword = await hashPassword('password123');

  await UserModel.findOneAndUpdate(
    { email: params.email },
    {
      $set: {
        providerId: params.providerId,
        name: params.name,
        role: params.role,
        password: hashedPassword,
        isActive: true
      }
    },
    { upsert: true, new: true }
  );
};

const seedPatients = async (providerId: string) => {
  const existing = await PatientModel.countDocuments({ providerId });
  if (existing >= 250) {
    return;
  }

  await PatientModel.deleteMany({ providerId });

  const docs = Array.from({ length: 250 }, (_, i) => {
    const firstName = firstNames[i % firstNames.length];
    const lastName = randomItem(lastNames);
    const full = `${firstName}-${lastName}-${i}`;

    return {
      providerId,
      firstName,
      lastName,
      photoUrl: avatarUrl(full),
      phone: `+1-555-${String(100000 + i).slice(-6)}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@cigali-demo.com`,
      dateOfBirth: randomDateInPastYears(75),
      gender: (['male', 'female', 'non_binary'] as const)[i % 3],
      bloodGroup: randomItem(bloodGroups),
      allergies: [randomItem(allergiesList)].filter((v) => v !== 'None'),
      chronicConditions: [randomItem(conditionsList)].filter((v) => v !== 'None'),
      insuranceProvider: randomItem(insuranceList),
      emergencyContact: {
        name: `${randomItem(firstNames)} ${randomItem(lastNames)}`,
        relationship: ['Parent', 'Spouse', 'Sibling', 'Friend'][i % 4],
        phone: `+1-555-${String(200000 + i).slice(-6)}`
      },
      notes: 'Patient monitored in comprehensive outpatient care program.'
    };
  });

  await PatientModel.insertMany(docs);
};

const seedStaff = async (providerId: string) => {
  const existing = await StaffModel.countDocuments({ providerId });
  if (existing >= 10) {
    return;
  }

  await StaffModel.deleteMany({ providerId });

  const staffDocs = Array.from({ length: 10 }, (_, i) => {
    const role = staffRoles[i];
    const name = `${randomItem(firstNames)} ${randomItem(lastNames)}`;

    return {
      providerId,
      fullName: name,
      email: `${name.toLowerCase().replace(/\s+/g, '.')}@cigali-demo.com`,
      role,
      permissions:
        role === 'admin'
          ? ['read:all', 'write:all', 'billing:manage']
          : role === 'doctor'
            ? ['patients:read', 'appointments:write', 'labs:read']
            : role === 'pharmacist'
              ? ['inventory:read', 'inventory:write']
              : ['patients:read', 'appointments:read'],
      activityScore: 70 + Math.floor(Math.random() * 30)
    };
  });

  await StaffModel.insertMany(staffDocs);
};

const seedAppointments = async (providerId: string) => {
  const existing = await AppointmentModel.countDocuments({ providerId });
  if (existing >= 400) {
    return;
  }

  await AppointmentModel.deleteMany({ providerId });

  const patients = await PatientModel.find({ providerId }).select('_id').lean();
  if (patients.length === 0) {
    return;
  }

  const doctorNames = (await StaffModel.find({ providerId, role: 'doctor' }).select('fullName').lean()).map((s) => s.fullName);

  const docs = Array.from({ length: 400 }, (_, i) => {
    const type = appointmentTypes[i % appointmentTypes.length];
    const status = appointmentStatuses[i % appointmentStatuses.length];

    return {
      providerId,
      patientId: randomItem(patients)._id,
      date: randomDateAroundNow(120, 60),
      reason:
        type === 'consultation'
          ? 'General consultation'
          : type === 'follow_up'
            ? 'Post-treatment follow-up'
            : type === 'surgery'
              ? 'Minor surgical procedure'
              : 'Comprehensive lab diagnostics',
      type,
      doctorAssigned: doctorNames.length ? randomItem(doctorNames) : 'Dr. Demo',
      status
    };
  });

  await AppointmentModel.insertMany(docs);
};

const seedMedications = async (providerId: string) => {
  const existing = await MedicationModel.countDocuments({ providerId });
  if (existing >= 120) {
    return;
  }

  await MedicationModel.deleteMany({ providerId });

  const docs = Array.from({ length: 120 }, (_, i) => {
    const category = randomItem(medicationCategories);
    const costPrice = 5 + Math.floor(Math.random() * 120);
    const sellingPrice = Number((costPrice * (1.25 + Math.random() * 0.5)).toFixed(2));

    return {
      providerId,
      name: `${category} Med ${i + 1}`,
      category,
      supplier: randomItem(suppliers),
      stock: Math.floor(Math.random() * 180),
      price: sellingPrice,
      costPrice,
      sellingPrice,
      expiryDate: randomDateAroundNow(-30, 540),
      sku: `CGM-${String(1000 + i)}`,
      unit: 'box',
      description: `${category} medication for controlled distribution.`
    };
  });

  await MedicationModel.insertMany(docs);
};

const seedInvoices = async (providerId: string) => {
  const existing = await InvoiceModel.countDocuments({ providerId });
  if (existing >= 220) {
    return;
  }

  await InvoiceModel.deleteMany({ providerId });

  const patients = await PatientModel.find({ providerId }).select('_id').lean();
  if (patients.length === 0) {
    return;
  }

  const docs = Array.from({ length: 220 }, (_, i) => {
    const amount = 80 + Math.floor(Math.random() * 1200);
    const status = (['paid', 'pending', 'overdue'] as const)[i % 3];
    const paidAmount = status === 'paid' ? amount : status === 'pending' ? Math.floor(amount * 0.35) : 0;

    return {
      providerId,
      patientId: randomItem(patients)._id,
      invoiceNumber: `INV-${new Date().getFullYear()}-${String(i + 1).padStart(4, '0')}`,
      amount,
      paidAmount,
      status,
      dueDate: randomDateAroundNow(40, 40),
      paidAt: status === 'paid' ? randomDateAroundNow(60, 0) : undefined
    };
  });

  await InvoiceModel.insertMany(docs);
};

export const ensureDemoUsers = async (): Promise<boolean> => {
  if (!isDbConnected() || mongoose.connection.readyState !== 1) {
    return false;
  }

  const provider = await ensureDemoProvider();

  await ensureDemoUser({ providerId: provider.id, name: 'Demo Doctor', email: 'demo@cigali.com', role: 'doctor' });
  await ensureDemoUser({ providerId: provider.id, name: 'Demo Admin', email: 'admin@cigali.com', role: 'admin' });

  return true;
};

export const seedIfEmpty = async (): Promise<void> => {
  if (!isDbConnected() || mongoose.connection.readyState !== 1) {
    return;
  }

  const provider = await ensureDemoProvider();
  await ensureDemoUsers();

  await seedPatients(provider.id);
  await seedStaff(provider.id);
  await seedAppointments(provider.id);
  await seedMedications(provider.id);
  await seedInvoices(provider.id);

  // eslint-disable-next-line no-console
  console.log('[CIGALI] Rich demo seed ready: 250 patients, 400 appointments, 120 medications, invoices, 10 staff.');
};

export const verifyDemoLoginPipeline = async (): Promise<void> => {
  try {
    await authService.login({ email: 'demo@cigali.com', password: 'password123' });
    // eslint-disable-next-line no-console
    console.log('[CIGALI] Demo login pipeline verified.');
    return;
  } catch (firstError) {
    // eslint-disable-next-line no-console
    console.warn(`[CIGALI] Demo login check failed. Recreating demo users. ${(firstError as Error).message}`);

    try {
      await ensureDemoUsers();
      await authService.login({ email: 'demo@cigali.com', password: 'password123' });
      // eslint-disable-next-line no-console
      console.log('[CIGALI] Demo login pipeline verified after demo user recreation.');
    } catch (secondError) {
      // eslint-disable-next-line no-console
      console.warn(`[CIGALI] Demo login pipeline still unavailable: ${(secondError as Error).message}`);
    }
  }
};
