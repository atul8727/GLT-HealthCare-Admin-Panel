import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiFileText } from "react-icons/fi";
import patientService from "../../services/patients/patientService";
import { DataTable, Button, SearchInput, Avatar } from "../../components/ui";
import { useDebounce } from "../../hooks/useDebounce";
import { useMemo } from "react";

export default function MedicalRecords() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 250);

  useEffect(() => {
    patientService.getPatients().then((data) => {
      setPatients(data);
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() => {
    if (!debouncedSearch.trim()) return patients;
    const q = debouncedSearch.trim().toLowerCase();
    return patients.filter(
      (p) => p.name?.toLowerCase().includes(q) || String(p.id ?? "").toLowerCase().includes(q)
    );
  }, [patients, debouncedSearch]);

  return (
    <div className="rounded-[20px] border border-[#E2E8F0] bg-white p-4 shadow-[0_8px_24px_rgba(79,70,229,0.08)] sm:p-6">
      <div className="mb-5">
        <SearchInput value={search} onChange={setSearch} placeholder="Search patient to view history" />
      </div>

      <DataTable
        loading={loading}
        emptyTitle="No patient records yet"
        columns={[
          {
            key: "name",
            header: "Name",
            render: (row) => (
              <div className="flex items-center gap-3">
                <Avatar name={row.name} />
                <span className="text-sm font-bold text-[#14142B]">{row.name}</span>
              </div>
            ),
          },
          { key: "mobile", header: "Mobile" },
          {
            key: "actions",
            header: "Actions",
            render: (row) => (
              <Button
                variant="actionView"
                size="sm"
                icon={FiFileText}
                onClick={() => navigate(`/patients/${row.id}`)}
              >
                View History
              </Button>
            ),
          },
        ]}
        rows={filtered}
      />
    </div>
  );
}