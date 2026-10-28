import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login({ ...form, role: "admin" });
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm rounded-[20px] border border-[#E2E8F0] bg-white p-6 shadow-[0_8px_24px_rgba(79,70,229,0.08)] sm:p-8">
        <div className="mb-7 flex flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#4F46E5] to-[#6D5BF0] text-xl font-bold text-white shadow-lg shadow-[#4F46E5]/30">
            G
          </div>
          <h1 className="text-2xl font-bold text-[#14142B]">GLT Healthcare</h1>
          <p className="mt-1 text-sm text-[#64748B]">Sign in to the Admin Panel</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Email"
            type="email"
            name="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="admin@glthealthcare.com"
          />
          <Input
            label="Password"
            type="password"
            name="password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="••••••••"
          />
          {error && (
            <p
              role="alert"
              className="rounded-xl border border-[#FECDD3] bg-[#FFE4E6] px-3.5 py-2.5 text-sm font-medium text-[#BE123C]"
            >
              {error}
            </p>
          )}
          <Button type="submit" fullWidth loading={loading}>
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
}