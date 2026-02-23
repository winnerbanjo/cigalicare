import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { patientsApi } from '@/api/patients.api';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';
import { Table } from '@/components/ui/Table';
import { useCigaliData } from '@/hooks/useCigaliData';
import { Patient, PatientInput } from '@/types/patient';

const initialState: PatientInput = {
  firstName: '',
  lastName: '',
  photoUrl: '',
  phone: '',
  email: '',
  dateOfBirth: '',
  gender: 'female',
  bloodGroup: 'O+',
  allergies: [],
  chronicConditions: [],
  insuranceProvider: '',
  tier: 'standard',
  emergencyContact: { name: '', relationship: '', phone: '' },
  notes: ''
};

const splitCsv = (value: string): string[] =>
  value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

export const PatientsPage = () => {
  const { loading, patients: seedPatients } = useCigaliData();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isBusy, setIsBusy] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Patient | null>(null);
  const [form, setForm] = useState<PatientInput>(initialState);
  const [allergiesText, setAllergiesText] = useState('');
  const [conditionsText, setConditionsText] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'withEmail' | 'withPhone'>('all');

  const loadPatients = async () => {
    setIsBusy(true);
    try {
      const data = await patientsApi.getAll();
      setPatients(data);
    } catch {
      setPatients(seedPatients);
    } finally {
      setIsBusy(false);
    }
  };

  useEffect(() => {
    if (!loading) {
      void loadPatients();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  const closeModal = () => {
    setIsModalOpen(false);
    setEditing(null);
    setForm(initialState);
    setAllergiesText('');
    setConditionsText('');
  };

  const openCreate = () => {
    setEditing(null);
    setForm(initialState);
    setAllergiesText('');
    setConditionsText('');
    setIsModalOpen(true);
  };

  const openEdit = (patient: Patient) => {
    setEditing(patient);
    setForm({
      firstName: patient.firstName,
      lastName: patient.lastName,
      photoUrl: patient.photoUrl ?? '',
      phone: patient.phone ?? '',
      email: patient.email ?? '',
      dateOfBirth: patient.dateOfBirth ? patient.dateOfBirth.split('T')[0] : '',
      gender: patient.gender,
      bloodGroup: patient.bloodGroup,
      allergies: patient.allergies ?? [],
      chronicConditions: patient.chronicConditions ?? [],
      insuranceProvider: patient.insuranceProvider ?? '',
      tier: patient.tier ?? 'standard',
      emergencyContact: {
        name: patient.emergencyContact?.name ?? '',
        relationship: patient.emergencyContact?.relationship ?? '',
        phone: patient.emergencyContact?.phone ?? ''
      },
      notes: patient.notes ?? ''
    });
    setAllergiesText((patient.allergies ?? []).join(', '));
    setConditionsText((patient.chronicConditions ?? []).join(', '));
    setIsModalOpen(true);
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload: PatientInput = {
      ...form,
      photoUrl:
        form.photoUrl?.trim() ||
        `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(`${form.firstName}-${form.lastName}`)}`,
      allergies: splitCsv(allergiesText),
      chronicConditions: splitCsv(conditionsText)
    };

    if (editing) {
      await patientsApi.update(editing._id, payload);
    } else {
      await patientsApi.create(payload);
    }

    closeModal();
    await loadPatients();
  };

  const onDelete = async (id: string) => {
    await patientsApi.remove(id);
    await loadPatients();
  };

  const visiblePatients = useMemo(() => {
    const term = search.trim().toLowerCase();

    return patients.filter((patient) => {
      const matchesSearch =
        !term ||
        `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(term) ||
        (patient.email ?? '').toLowerCase().includes(term) ||
        (patient.phone ?? '').toLowerCase().includes(term) ||
        (patient.insuranceProvider ?? '').toLowerCase().includes(term);

      const matchesFilter =
        filter === 'all' ||
        (filter === 'withEmail' && Boolean(patient.email)) ||
        (filter === 'withPhone' && Boolean(patient.phone));

      return matchesSearch && matchesFilter;
    });
  }, [patients, search, filter]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Patients</h2>
        <div className="flex flex-col gap-2 md:flex-row">
          <Input
            className="md:w-64"
            placeholder="Search patients"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <Select value={filter} onChange={(event) => setFilter(event.target.value as 'all' | 'withEmail' | 'withPhone')}>
            <option value="all">All</option>
            <option value="withEmail">With Email</option>
            <option value="withPhone">With Phone</option>
          </Select>
          <Button onClick={openCreate}>Add Patient</Button>
        </div>
      </div>

      {loading || isBusy ? (
        <p className="text-sm text-slate-500">Loading patients...</p>
      ) : (
        <Table headers={['Patient', 'Tier', 'Contact', 'DOB', 'Insurance', 'Profile', 'Actions']}>
          {visiblePatients.map((patient) => (
            <tr key={patient._id}>
              <td className="px-4 py-3 text-slate-800">
                <div className="flex items-center gap-3">
                  <img
                    src={patient.photoUrl}
                    alt={`${patient.firstName} ${patient.lastName}`}
                    className="h-10 w-10 rounded-full border border-borderSoft object-cover"
                  />
                  <div>
                    <p className="font-medium">{patient.firstName} {patient.lastName}</p>
                    <p className="text-xs text-slate-500">{patient.bloodGroup || '-'} {patient.gender ? `• ${patient.gender}` : ''}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3">
                <Badge variant={patient.tier === 'vip' ? 'warning' : patient.tier === 'priority' ? 'info' : 'neutral'}>
                  {(patient.tier || 'standard').toUpperCase()}
                </Badge>
              </td>
              <td className="px-4 py-3 text-slate-600">{patient.email || patient.phone || '-'}</td>
              <td className="px-4 py-3 text-slate-600">
                {patient.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString() : '-'}
              </td>
              <td className="px-4 py-3 text-slate-600">{patient.insuranceProvider || '-'}</td>
              <td className="px-4 py-3 text-slate-600">
                <Link to={`/app/patients/${patient._id}`} className="font-medium text-primary-600 hover:text-primary-700">
                  View
                </Link>
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <Button variant="secondary" onClick={() => openEdit(patient)}>
                    Edit
                  </Button>
                  <Button variant="danger" onClick={() => void onDelete(patient._id)}>
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </Table>
      )}

      <Modal isOpen={isModalOpen} onClose={closeModal} title={editing ? 'Edit Patient' : 'New Patient'}>
        <form className="grid gap-3" onSubmit={onSubmit}>
          <div className="grid gap-3 md:grid-cols-2">
            <Input
              label="First name"
              value={form.firstName}
              onChange={(event) => setForm((prev) => ({ ...prev, firstName: event.target.value }))}
              required
            />
            <Input
              label="Last name"
              value={form.lastName}
              onChange={(event) => setForm((prev) => ({ ...prev, lastName: event.target.value }))}
              required
            />
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <Input
              label="Email"
              type="email"
              value={form.email}
              onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
            />
            <Input
              label="Phone"
              value={form.phone}
              onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
            />
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <Input
              label="Date of birth"
              type="date"
              value={form.dateOfBirth}
              onChange={(event) => setForm((prev) => ({ ...prev, dateOfBirth: event.target.value }))}
            />
            <Select label="Gender" value={form.gender || ''} onChange={(event) => setForm((prev) => ({ ...prev, gender: event.target.value as PatientInput['gender'] }))}>
              <option value="">Select</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="non_binary">Non-binary</option>
            </Select>
            <Select label="Blood Group" value={form.bloodGroup || ''} onChange={(event) => setForm((prev) => ({ ...prev, bloodGroup: event.target.value }))}>
              <option value="">Select</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </Select>
          </div>

          <Input
            label="Insurance provider"
            value={form.insuranceProvider}
            onChange={(event) => setForm((prev) => ({ ...prev, insuranceProvider: event.target.value }))}
          />
          <Select label="Patient Tier" value={form.tier || 'standard'} onChange={(event) => setForm((prev) => ({ ...prev, tier: event.target.value as PatientInput['tier'] }))}>
            <option value="standard">Standard</option>
            <option value="priority">Priority</option>
            <option value="vip">VIP</option>
          </Select>

          <div className="grid gap-3 md:grid-cols-2">
            <Input
              label="Allergies (comma separated)"
              value={allergiesText}
              onChange={(event) => setAllergiesText(event.target.value)}
            />
            <Input
              label="Chronic conditions (comma separated)"
              value={conditionsText}
              onChange={(event) => setConditionsText(event.target.value)}
            />
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <Input
              label="Emergency contact name"
              value={form.emergencyContact?.name || ''}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  emergencyContact: { ...prev.emergencyContact, name: event.target.value }
                }))
              }
            />
            <Input
              label="Relationship"
              value={form.emergencyContact?.relationship || ''}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  emergencyContact: { ...prev.emergencyContact, relationship: event.target.value }
                }))
              }
            />
            <Input
              label="Emergency phone"
              value={form.emergencyContact?.phone || ''}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  emergencyContact: { ...prev.emergencyContact, phone: event.target.value }
                }))
              }
            />
          </div>

          <Input
            label="Photo URL"
            value={form.photoUrl}
            onChange={(event) => setForm((prev) => ({ ...prev, photoUrl: event.target.value }))}
            placeholder="Auto-generated from name if empty"
          />

          <label className="flex flex-col gap-2 text-sm">
            <span className="font-medium text-slate-700">Notes</span>
            <textarea
              className="min-h-24 rounded-xl border border-borderSoft px-3 py-2 outline-none focus:border-primary-500"
              value={form.notes}
              onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))}
            />
          </label>

          <div className="mt-2 flex items-center justify-between gap-2">
            <Badge variant="neutral">Multi-tenant patient record</Badge>
            <div className="flex gap-2">
              <Button type="button" variant="secondary" onClick={closeModal}>
                Cancel
              </Button>
              <Button type="submit">{editing ? 'Update' : 'Create'}</Button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};
