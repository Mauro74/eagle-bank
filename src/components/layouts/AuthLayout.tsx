import { Outlet } from "react-router-dom";
import Logo from "../../assets/eagle_bank_logo.png";

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-900 via-brand-800 to-brand-500 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center flex flex-col">
          <img src={Logo} className="w-52 mx-auto" alt="Eagle Bank Logo" />
          <p className="text-brand-200 mt-1 text-sm">
            Secure. Simple. Trusted.
          </p>
        </div>
        <main className="bg-white rounded-2xl shadow-modal p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
