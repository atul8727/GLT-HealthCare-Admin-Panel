import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiPlus } from "react-icons/fi";
import toast from "react-hot-toast";
import doctorService from "../../services/doctors/doctorService";
import { DataTable, Button, SearchInput, StatusBadge } from "../../components/ui";
import { useDebounce } from "../../hooks/useDebounce";

export default function Doctors() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 250);

  const load = async () => {
    setLoading(true);
    const data = await doctorService.getDoctors();
    setDoctors(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    if (!debouncedSearch.trim()) return doctors;
    const q = debouncedSearch.trim().toLowerCase();
    return doctors.filter(
      (d) =>
        d.name?.toLowerCase().includes(q) || d.specialization?.toLowerCase().includes(q)
    );
  }, [doctors, debouncedSearch]);

  const handleToggleStatus = async (doctor) => {
    await doctorService.toggleStatus(doctor.id);
    toast.success(`${doctor.name} marked ${doctor.status === "Active" ? "Inactive" : "Active"}`);
    load();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search by doctor name or specialization"
        />
        <Button icon={FiPlus} onClick={() => navigate("/doctors/create")}>
          Add Doctor
        </Button>
      </div>

      <DataTable
        loading={loading}
        emptyTitle="No doctors found"
        emptyDescription="Add your first doctor to get started."
        columns={[
          { key: "name", header: "Doctor Name" },
          { key: "specialization", header: "Specialization" },
          { key: "mobile", header: "Mobile" },
          { key: "email", header: "Email" },
          {
            key: "status",
            header: "Status",
            render: (row) => <StatusBadge status={row.status} />,
          },
          {
            key: "actions",
            header: "Actions",
            render: (row) => (
              <Button variant="ghost" size="sm" onClick={() => handleToggleStatus(row)}>
                {row.status === "Active" ? "Deactivate" : "Activate"}
              </Button>
            ),
          },
        ]}
        rows={filtered}
      />
    </div>
  );
}
