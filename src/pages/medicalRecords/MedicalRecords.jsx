import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import patientService from "../../services/patients/patientService";
import { DataTable, Button, SearchInput } from "../../components/ui";
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
    return patients.filter((p) => p.name?.toLowerCase().includes(q) || p.id?.toLowerCase().includes(q));
  }, [patients, debouncedSearch]);

  return (
    <div className="space-y-4">
      <SearchInput value={search} onChange={setSearch} placeholder="Search patient to view history" />

      <DataTable
        loading={loading}
        emptyTitle="No patient records yet"
        columns={[
          { key: "id", header: "Patient ID" },
          { key: "name", header: "Name" },
          { key: "mobile", header: "Mobile" },
          {
            key: "actions",
            header: "Actions",
            render: (row) => (
              <Button variant="ghost" size="sm" onClick={() => navigate(`/patients/${row.id}`)}>
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
