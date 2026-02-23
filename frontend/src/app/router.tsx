import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { MarketingLayout } from '@/layouts/MarketingLayout';
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { AppointmentsPage } from '@/pages/appointments/AppointmentsPage';
import { AboutPage } from '@/pages/AboutPage';
import { BillingPage } from '@/pages/billing/BillingPage';
import { DashboardPage } from '@/pages/dashboard/DashboardPage';
import { InventoryPage } from '@/pages/inventory/InventoryPage';
import { FeaturesPage } from '@/pages/marketing/FeaturesPage';
import { HomePage } from '@/pages/marketing/HomePage';
import { PricingPage } from '@/pages/marketing/PricingPage';
import { PatientProfilePage } from '@/pages/patients/PatientProfilePage';
import { PatientsPage } from '@/pages/patients/PatientsPage';
import { SettingsPage } from '@/pages/settings/SettingsPage';
import { StaffPage } from '@/pages/staff/StaffPage';

export const router = createBrowserRouter([
  {
    element: <MarketingLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/about', element: <AboutPage /> },
      { path: '/features', element: <FeaturesPage /> },
      { path: '/pricing', element: <PricingPage /> }
    ]
  },
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    path: '/register',
    element: <RegisterPage />
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/app',
        element: <DashboardLayout />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: 'patients', element: <PatientsPage /> },
          { path: 'patients/:id', element: <PatientProfilePage /> },
          { path: 'appointments', element: <AppointmentsPage /> },
          { path: 'inventory', element: <InventoryPage /> },
          { path: 'billing', element: <BillingPage /> },
          { path: 'staff', element: <StaffPage /> },
          { path: 'settings', element: <SettingsPage /> }
        ]
      }
    ]
  },
  {
    path: '*',
    element: <Navigate to="/" replace />
  }
]);
