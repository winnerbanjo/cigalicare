import { FormEvent, useEffect, useMemo, useState } from 'react';
import { medicationsApi } from '@/api/medications.api';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Table } from '@/components/ui/Table';
import { Medication, MedicationInput } from '@/types/medication';

const initialForm: MedicationInput = {
  name: '',
  stock: 0,
  price: 0,
  description: ''
};

export const InventoryPage = () => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Medication | null>(null);
  const [form, setForm] = useState<MedicationInput>(initialForm);

  const load = async () => {
    setIsLoading(true);
    try {
      const data = await medicationsApi.getAll();
      setMedications(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const alerts = useMemo(() => medications.filter((m) => m.stock <= 20), [medications]);

  const openCreate = () => {
    setEditing(null);
    setForm(initialForm);
    setIsModalOpen(true);
  };

  const openEdit = (medication: Medication) => {
    setEditing(medication);
    setForm({
      name: medication.name,
      stock: medication.stock,
      price: medication.price,
      description: medication.description ?? ''
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditing(null);
    setForm(initialForm);
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (editing) {
      await medicationsApi.update(editing._id, form);
    } else {
      await medicationsApi.create(form);
    }

    closeModal();
    await load();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Inventory</h2>
        <Button onClick={openCreate}>Add Medication</Button>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-borderSoft bg-slate-50 p-4">
          <p className="text-sm text-slate-500">Total Medications</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">{medications.length}</p>
        </div>
        <div className="rounded-xl border border-borderSoft bg-slate-50 p-4">
          <p className="text-sm text-slate-500">Low Stock Alerts</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">{alerts.length}</p>
        </div>
        <div className="rounded-xl border border-borderSoft bg-slate-50 p-4">
          <p className="text-sm text-slate-500">Inventory Value</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">
            ${medications.reduce((sum, item) => sum + item.stock * item.price, 0).toLocaleString()}
          </p>
        </div>
      </section>

      {isLoading ? (
        <p className="text-sm text-slate-500">Loading inventory...</p>
      ) : (
        <Table headers={['Medication', 'Stock', 'Price', 'Status', 'Actions']}>
          {medications.map((medication) => (
            <tr key={medication._id}>
              <td className="px-4 py-3 text-slate-800">{medication.name}</td>
              <td className="px-4 py-3 text-slate-600">{medication.stock}</td>
              <td className="px-4 py-3 text-slate-600">${medication.price.toFixed(2)}</td>
              <td className="px-4 py-3">
                <Badge variant={medication.stock <= 20 ? 'warning' : 'success'}>
                  {medication.stock <= 20 ? 'Low stock' : 'Healthy'}
                </Badge>
              </td>
              <td className="px-4 py-3">
                <Button variant="secondary" onClick={() => openEdit(medication)}>
                  Edit
                </Button>
              </td>
            </tr>
          ))}
        </Table>
      )}

      <Modal isOpen={isModalOpen} onClose={closeModal} title={editing ? 'Edit Medication' : 'Add Medication'}>
        <form className="grid gap-3" onSubmit={onSubmit}>
          <Input
            label="Medication name"
            value={form.name}
            onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
            required
          />
          <Input
            label="Stock"
            type="number"
            value={String(form.stock ?? 0)}
            onChange={(event) => setForm((prev) => ({ ...prev, stock: Number(event.target.value) }))}
            min={0}
            required
          />
          <Input
            label="Price"
            type="number"
            value={String(form.price ?? 0)}
            onChange={(event) => setForm((prev) => ({ ...prev, price: Number(event.target.value) }))}
            min={0}
            step="0.01"
            required
          />
          <Input
            label="Description"
            value={form.description}
            onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
          />

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
