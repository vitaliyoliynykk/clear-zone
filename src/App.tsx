import './App.css';

import { Spinner } from '@chakra-ui/react';
import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router';

import { Toaster } from '@/components/ui/toaster';

import { ErrorPage } from './pages/error-page/error-page';
import Layout from './shared/components/layout/layout-component';
import ProtectedRoute from './shared/components/protected-route/protected-route';
import { AuthProvider } from './shared/context/auth-provider';

const SettingsPage = lazy(() => import('./pages/settings/settings-page'));
const DeviceSettingsPage = lazy(
  () => import('./pages/device-settings/device-settings-page')
);
const SignInPage = lazy(() => import('./pages/sign-in/sign-in-page'));
const RegisterPage = lazy(() => import('./pages/register/register-page'));
const DashboardPage = lazy(() => import('./pages/dashboard/dashboard-page'));
const DeviceDashboardPage = lazy(
  () => import('./pages/device-dashboard/device-dashboard-page')
);
const DevicesPage = lazy(() => import('./pages/devices/devices-page'));

function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<Spinner />}>
        <Routes>
          <Route path="*" element={<Navigate to="/" replace />} />

          <Route path="sign-in" element={<SignInPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="error" element={<ErrorPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Layout />}>
              <Route path="/" element={<DevicesPage />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route
                path="dashboard/:deviceId"
                element={<DeviceDashboardPage />}
              />
              <Route path="settings" element={<SettingsPage />} />
              <Route
                path="device-settings/:deviceId"
                element={<DeviceSettingsPage />}
              />
            </Route>
          </Route>
        </Routes>
      </Suspense>
      <Toaster />
    </AuthProvider>
  );
}

export default App;
