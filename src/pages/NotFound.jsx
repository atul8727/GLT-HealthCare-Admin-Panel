import { Link } from "react-router-dom";
import Button from "../components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-surface text-center">
      <h1 className="text-4xl font-bold text-text-primary">404</h1>
      <p className="text-text-secondary">The page you're looking for doesn't exist.</p>
      <Link to="/dashboard">
        <Button>Back to Dashboard</Button>
      </Link>
    </div>
  );
}
