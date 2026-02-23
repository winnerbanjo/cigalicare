import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { patientsApi } from '@/api/patients.api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';
import { Table } from '@/components/ui/Table';
import { Patient, PatientInput } from '@/types/patient';

const initialState: PatientInput = {
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  dateOfBirth: '',
  notes: ''
};

export const PatientsPage = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Patient | null>(null);
  const [form, setForm] = useState<PatientInput>(initialState);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'withEmail' | 'withPhone'>('all');

  const loadPatients = async () => {
    setIsLoading(true);
    try {
      const data = await patientsApi.getAll();
      setPatients(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadPatients();
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

  const openEdit = (patient: Patient) => {
    setEditing(patient);
    setForm({
      firstName: patient.firstName,
      lastName: patient.lastName,
      phone: patient.phone ?? '',
      email: patient.email ?? '',
      dateOfBirth: patient.dateOfBirth ? patient.dateOfBirth.split('T')[0] : '',
      notes: patient.notes ?? ''
    });
    setIsModalOpen(true);
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (editing) {
      await patientsApi.update(editing._id, form);
    } else {
      await patientsApi.create(form);
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
        (patient.phone ?? '').toLowerCase().includes(term);

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

      {isLoading ? (
        <p className="text-sm text-slate-500">Loading patients...</p>
      ) : (
        <Table headers={['Name', 'Contact', 'DOB', 'Profile', 'Actions']}>
          {visiblePatients.map((patient) => (
            <tr key={patient._id}>
              <td className="px-4 py-3 text-slate-800">
                {patient.firstName} {patient.lastName}
              </td>
              <td className="px-4 py-3 text-slate-600">{patient.email || patient.phone || '-'}</td>
              <td className="px-4 py-3 text-slate-600">
                {patient.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString() : '-'}
              </td>
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
          <Input
            label="Date of birth"
            type="date"
            value={form.dateOfBirth}
            onChange={(event) => setForm((prev) => ({ ...prev, dateOfBirth: event.target.value }))}
          />

          <label className="flex flex-col gap-2 text-sm">
            <span className="font-medium text-slate-700">Notes</span>
            <textarea
              className="min-h-24 rounded-xl border border-borderSoft px-3 py-2 outline-none focus:border-primary-500"
              value={form.notes}
              onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))}
            />
          </label>

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
