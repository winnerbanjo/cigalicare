import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { providersApi } from '@/api/providers.api';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useAuthStore } from '@/store/auth.store';
import { ProviderProfile } from '@/types/provider';

const toBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

export const SettingsPage = () => {
  const authProvider = useAuthStore((state) => state.provider);
  const [profile, setProfile] = useState<ProviderProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const data = await providersApi.getMyProfile();
        setProfile(data);
      } catch {
        if (authProvider) {
          setProfile({
            _id: authProvider.id,
            name: authProvider.name,
            email: authProvider.email,
            phone: authProvider.phone,
            subscriptionPlan: authProvider.subscriptionPlan,
            logoUrl: undefined,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    void load();
  }, [authProvider]);

  const onSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!profile) return;

    setIsSaving(true);
    setMessage(null);
    try {
      const updated = await providersApi.updateMyProfile(profile);
      setProfile(updated);
      setMessage('Profile updated successfully.');
    } catch {
      setMessage('Saved locally for demo mode.');
    } finally {
      setIsSaving(false);
    }
  };

  const onLogoUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !profile) return;

    setMessage(null);
    try {
      const base64 = await toBase64(file);
      const updated = await providersApi.uploadLogo(base64);
      setProfile(updated);
      setMessage('Logo uploaded.');
    } catch {
      const base64 = await toBase64(file);
      setProfile((prev) => (prev ? { ...prev, logoUrl: base64 } : prev));
      setMessage('Logo applied in demo mode.');
    }
  };

  if (isLoading) return <p className="text-sm text-slate-500">Loading settings...</p>;
  if (!profile) return <p className="text-sm text-slate-500">Settings unavailable.</p>;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-slate-900">Settings</h2>

      <Card>
        <form className="grid gap-3" onSubmit={onSave}>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Clinic Profile</h3>
          <Input label="Clinic name" value={profile.name} onChange={(e) => setProfile((p) => (p ? { ...p, name: e.target.value } : p))} />
          <Input label="Email" value={profile.email} onChange={(e) => setProfile((p) => (p ? { ...p, email: e.target.value } : p))} />
          <Input label="Phone" value={profile.phone ?? ''} onChange={(e) => setProfile((p) => (p ? { ...p, phone: e.target.value } : p))} />

          <Select
            label="Subscription"
            value={profile.subscriptionPlan}
            onChange={(e) => setProfile((p) => (p ? { ...p, subscriptionPlan: e.target.value as ProviderProfile['subscriptionPlan'] } : p))}
          >
            <option value="starter">Starter</option>
            <option value="growth">Growth</option>
            <option value="enterprise">Enterprise</option>
          </Select>

          <div>
            <p className="mb-2 text-sm font-medium text-slate-700">Clinic logo</p>
            <input type="file" accept="image/*" onChange={onLogoUpload} />
            {profile.logoUrl && <img src={profile.logoUrl} alt="Clinic logo" className="mt-3 h-16 rounded-xl border border-borderSoft object-cover" />}
          </div>

          <div className="mt-2 flex items-center gap-3">
            <Button type="submit" disabled={isSaving}>{isSaving ? 'Saving...' : 'Save Settings'}</Button>
            {message && <span className="text-sm text-slate-600">{message}</span>}
          </div>
        </form>
      </Card>

      <Card>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Staff Management Snapshot</h3>
        <div className="mt-3 space-y-2">
          <div className="flex items-center justify-between rounded-xl border border-borderSoft bg-slate-50 p-3"><p className="text-sm text-slate-700">Demo Admin</p><Badge variant="info">admin</Badge></div>
          <div className="flex items-center justify-between rounded-xl border border-borderSoft bg-slate-50 p-3"><p className="text-sm text-slate-700">Demo Doctor</p><Badge variant="neutral">doctor</Badge></div>
        </div>
      </Card>
    </div>
  );
};
