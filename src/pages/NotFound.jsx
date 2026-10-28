import { Link } from "react-router-dom";
import Button from "../components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8">
      <div className="flex w-full max-w-md flex-col items-center gap-3 rounded-[20px] border border-[#E2E8F0] bg-white p-8 text-center shadow-[0_8px_24px_rgba(79,70,229,0.08)] sm:p-10">
        <h1 className="bg-gradient-to-r from-[#4F46E5] to-[#6D5BF0] bg-clip-text text-6xl font-extrabold text-transparent">
          404
        </h1>
        <p className="mb-2 font-medium text-[#64748B]">The page you're looking for doesn't exist.</p>
        <Link to="/dashboard">
          <Button>Back to Dashboard</Button>
        </Link>
      </div>
    </div>
  );
}