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
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary text-lg font-bold text-white shadow-lg shadow-primary/30">
            G
          </div>
          <h1 className="text-xl font-semibold text-text-primary">GLT Healthcare</h1>
          <p className="mt-1 text-sm text-text-secondary">Sign in to the Admin Panel</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-danger">{error}</p>
          )}
          <Button type="submit" fullWidth loading={loading}>
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
}