import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useAuthStore } from '@/store/auth.store';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const register = useAuthStore((state) => state.register);
  const isLoading = useAuthStore((state) => state.isLoading);

  const [form, setForm] = useState({
    providerName: '',
    providerPhone: '',
    name: '',
    email: '',
    password: '',
    role: 'admin' as 'doctor' | 'pharmacy' | 'admin'
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    try {
      await register(form);
      navigate('/app', { replace: true });
    } catch {
      setError('Failed to create account. Please verify your data.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-lg animate-fadeUp">
        <h1 className="text-2xl font-semibold text-slate-900">Create your CIGALI workspace</h1>
        <p className="mt-1 text-sm text-slate-500">Set up your multi-tenant healthcare environment.</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <Input
            label="Provider name"
            value={form.providerName}
            onChange={(event) => setForm((prev) => ({ ...prev, providerName: event.target.value }))}
            required
          />
          <Input
            label="Provider phone"
            value={form.providerPhone}
            onChange={(event) => setForm((prev) => ({ ...prev, providerPhone: event.target.value }))}
          />

          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Admin full name"
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              required
            />
            <Input
              label="Admin email"
              type="email"
              value={form.email}
              onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
              required
            />
          </div>

          <Input
            label="Password"
            type="password"
            value={form.password}
            onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
            required
          />

          <Select
            label="Role"
            value={form.role}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                role: event.target.value as 'doctor' | 'pharmacy' | 'admin'
              }))
            }
          >
            <option value="admin">Admin</option>
            <option value="doctor">Doctor</option>
            <option value="pharmacy">Pharmacy</option>
          </Select>

          {error && <p className="text-sm text-rose-600">{error}</p>}

          <Button className="w-full" type="submit" disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create Workspace'}
          </Button>
        </form>

        <p className="mt-4 text-sm text-slate-600">
          Already have access?{' '}
          <Link className="font-semibold text-primary-600 hover:text-primary-700" to="/login">
            Sign in
          </Link>
        </p>
      </Card>
    </div>
  );
};
