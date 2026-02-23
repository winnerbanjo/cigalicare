import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { medicationsApi } from '@/api/medications.api';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';
import { Table } from '@/components/ui/Table';
import { useCigaliData } from '@/hooks/useCigaliData';
import { Medication, MedicationInput } from '@/types/medication';

const initialForm: MedicationInput = {
  name: '',
  category: '',
  supplier: '',
  stock: 0,
  costPrice: 0,
  sellingPrice: 0,
  price: 0,
  expiryDate: '',
  description: ''
};

export const InventoryPage = () => {
  const { loading, medications: seedMedications } = useCigaliData();
  const [medications, setMedications] = useState<Medication[]>([]);
  const [isBusy, setIsBusy] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Medication | null>(null);
  const [form, setForm] = useState<MedicationInput>(initialForm);

  const loadMedications = async () => {
    setIsBusy(true);
    try {
      const fresh = await medicationsApi.getAll();
      setMedications(fresh);
    } catch {
      setMedications(seedMedications);
    } finally {
      setIsBusy(false);
    }
  };

  useEffect(() => {
    if (!loading) {
      void loadMedications();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  const alerts = useMemo(() => medications.filter((m) => m.stock <= 20), [medications]);
  const inventoryProfit = useMemo(
    () => medications.reduce((sum, med) => sum + (med.sellingPrice ?? med.price - (med.costPrice ?? 0)) * med.stock, 0),
    [medications]
  );

  const categoryData = useMemo(() => {
    const map = new Map<string, number>();
    medications.forEach((m) => {
      const key = m.category || 'Uncategorized';
      map.set(key, (map.get(key) ?? 0) + 1);
    });
    return [...map.entries()].map(([name, value]) => ({ name, value }));
  }, [medications]);

  const openCreate = () => {
    setEditing(null);
    setForm(initialForm);
    setIsModalOpen(true);
  };

  const openEdit = (medication: Medication) => {
    setEditing(medication);
    setForm({
      name: medication.name,
      category: medication.category,
      supplier: medication.supplier,
      stock: medication.stock,
      price: medication.price,
      costPrice: medication.costPrice,
      sellingPrice: medication.sellingPrice,
      expiryDate: medication.expiryDate?.slice(0, 10),
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

    const payload: MedicationInput = {
      ...form,
      price: form.sellingPrice ?? form.price
    };

    if (editing) {
      await medicationsApi.update(editing._id, payload);
    } else {
      await medicationsApi.create(payload);
    }

    closeModal();
    await loadMedications();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Pharmacy Inventory</h2>
        <Button onClick={openCreate}>Add Medication</Button>
      </div>

      <section className="grid gap-4 md:grid-cols-5">
        <div className="glass p-4"><p className="text-sm text-slate-500">Medication SKUs</p><p className="mt-1 text-2xl font-semibold text-slate-900">{medications.length}</p></div>
        <div className="glass p-4"><p className="text-sm text-slate-500">Low Stock Alerts</p><p className="mt-1 text-2xl font-semibold text-slate-900">{alerts.length}</p></div>
        <div className="glass p-4"><p className="text-sm text-slate-500">Inventory Value</p><p className="mt-1 text-2xl font-semibold text-slate-900">${medications.reduce((s, m) => s + m.stock * (m.sellingPrice ?? m.price), 0).toLocaleString()}</p></div>
        <div className="glass p-4"><p className="text-sm text-slate-500">Projected Profit</p><p className="mt-1 text-2xl font-semibold text-slate-900">${inventoryProfit.toLocaleString()}</p></div>
        <div className="glass p-4"><p className="text-sm text-slate-500">Expiry Warnings (90d)</p><p className="mt-1 text-2xl font-semibold text-slate-900">{medications.filter((m) => m.expiryDate && new Date(m.expiryDate).getTime() < Date.now() + 90 * 24 * 60 * 60 * 1000).length}</p></div>
      </section>

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="glass p-4 xl:col-span-1">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Medication Categories</h3>
          <div className="mt-3 h-60">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#3F7A80" label />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass p-4 xl:col-span-2">
          {loading || isBusy ? (
            <p className="text-sm text-slate-500">Loading inventory...</p>
          ) : (
            <Table headers={['Medication', 'Category', 'Supplier', 'Stock', 'Selling', 'Expiry', 'Status', 'Actions']}>
              {medications.map((medication) => (
                <tr key={medication._id}>
                  <td className="px-4 py-3 text-slate-800">{medication.name}</td>
                  <td className="px-4 py-3 text-slate-600">{medication.category || '-'}</td>
                  <td className="px-4 py-3 text-slate-600">{medication.supplier || '-'}</td>
                  <td className="px-4 py-3 text-slate-600">{medication.stock}</td>
                  <td className="px-4 py-3 text-slate-600">${(medication.sellingPrice ?? medication.price).toFixed(2)}</td>
                  <td className="px-4 py-3 text-slate-600">{medication.expiryDate ? new Date(medication.expiryDate).toLocaleDateString() : '-'}</td>
                  <td className="px-4 py-3">
                    <Badge variant={medication.stock <= 20 ? 'warning' : 'success'}>{medication.stock <= 20 ? 'Low stock' : 'Healthy'}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Button variant="secondary" onClick={() => openEdit(medication)}>Edit</Button>
                  </td>
                </tr>
              ))}
            </Table>
          )}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editing ? 'Edit Medication' : 'Add Medication'}
        footer={
          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={closeModal}>Cancel</Button>
            <Button type="submit" form="medication-form">{editing ? 'Update' : 'Create'}</Button>
          </div>
        }
      >
        <form id="medication-form" className="grid gap-6" onSubmit={onSubmit}>
          <section className="grid gap-4">
            <h4 className="text-sm font-semibold uppercase tracking-wide text-black/60">Medication Details</h4>
            <Input label="Medication name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required />
            <div className="grid gap-4 md:grid-cols-2">
              <Input label="Category" value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))} />
              <Input label="Supplier" value={form.supplier} onChange={(e) => setForm((p) => ({ ...p, supplier: e.target.value }))} />
            </div>
          </section>

          <section className="grid gap-4">
            <h4 className="text-sm font-semibold uppercase tracking-wide text-black/60">Stock & Pricing</h4>
            <div className="grid gap-4 md:grid-cols-2">
              <Input label="Stock" type="number" value={String(form.stock ?? 0)} onChange={(e) => setForm((p) => ({ ...p, stock: Number(e.target.value) }))} min={0} required />
              <Input label="Cost Price" type="number" value={String(form.costPrice ?? 0)} onChange={(e) => setForm((p) => ({ ...p, costPrice: Number(e.target.value) }))} min={0} step="0.01" required />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Input label="Selling Price" type="number" value={String(form.sellingPrice ?? 0)} onChange={(e) => setForm((p) => ({ ...p, sellingPrice: Number(e.target.value), price: Number(e.target.value) }))} min={0} step="0.01" required />
              <Input label="Expiry Date" type="date" value={form.expiryDate || ''} onChange={(e) => setForm((p) => ({ ...p, expiryDate: e.target.value }))} />
            </div>
          </section>

          <section className="grid gap-4">
            <h4 className="text-sm font-semibold uppercase tracking-wide text-black/60">Notes</h4>
            <label className="text-sm">
              <span className="font-medium text-black/80">Description</span>
              <textarea className="mt-2 min-h-20 w-full rounded-[20px] border border-white/30 bg-white/70 px-3 py-3 outline-none transition-all duration-500 [transition-timing-function:cubic-bezier(0.25,1,0.5,1)] focus:border-primary-500 focus:ring-2 focus:ring-primary-200" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
            </label>
          </section>
        </form>
      </Modal>
    </div>
  );
};
