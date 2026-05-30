import { Routes, Route, Navigate } from "react-router-dom";
import { NotFoundPage } from "@/features/errors/NotFoundPage";
import { useAuthStore } from "@/features/auth/store";

// Layouts
import { RootLayout } from "@/components/layouts/RootLayout";
import { AuthLayout } from "@/components/layouts/AuthLayout";

// Feature pages — placeholders, filled in per-feature phase
import { LoginPage } from "@/features/auth/components/LoginPage";
import { RegisterPage } from "@/features/auth/components/RegisterPage";
import { DashboardPage } from "@/features/dashboard/components/DashboardPage";
import { AccountsPage } from "@/features/accounts/components/AccountsPage";
import { AccountDetailPage } from "@/features/accounts/components/AccountDetailPage";
import { ProfilePage } from "@/features/profile/components/ProfilePage";

function RequireAuth({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.user !== null);
  return isAuthenticated ? (
    <>{children}</>
  ) : (
    <Navigate to="/auth/login" replace />
  );
}

function RequireGuest({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.user !== null);
  return isAuthenticated ? (
    <Navigate to="/dashboard" replace />
  ) : (
    <>{children}</>
  );
}

export function AppRouter() {
  return (
    <Routes>
      <Route
        path="/auth"
        element={
          <RequireGuest>
            <AuthLayout />
          </RequireGuest>
        }
      >
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route index element={<Navigate to="login" replace />} />
      </Route>

      <Route
        path="/"
        element={
          <RequireAuth>
            <RootLayout />
          </RequireAuth>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="accounts" element={<AccountsPage />} />
        <Route path="accounts/:id" element={<AccountDetailPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
