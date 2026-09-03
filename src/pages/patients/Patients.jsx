import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiPlus } from "react-icons/fi";
import toast from "react-hot-toast";
import patientService from "../../services/patients/patientService";
import PatientTable from "../../components/patients/PatientTable";
import { Button, SearchInput, ConfirmDialog } from "../../components/ui";
import { useDebounce } from "../../hooks/useDebounce";

export default function Patients() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 250);
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadPatients = async () => {
    setLoading(true);
    const data = await patientService.getPatients();
    setPatients(data);
    setLoading(false);
  };

  useEffect(() => {
    loadPatients();
  }, []);

  const filtered = useMemo(() => {
    if (!debouncedSearch.trim()) return patients;
    const q = debouncedSearch.trim().toLowerCase();
    return patients.filter(
      (p) =>
        p.name?.toLowerCase().includes(q) ||
        p.mobile?.includes(q) ||
        p.id?.toLowerCase().includes(q)
    );
  }, [patients, debouncedSearch]);

  const handleDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await patientService.deletePatient(toDelete.id);
      toast.success("Patient deleted");
      setToDelete(null);
      loadPatients();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search by name, mobile or patient ID"
        />
        <Button icon={FiPlus} onClick={() => navigate("/patients/create")}>
          Add Patient
        </Button>
      </div>

      <PatientTable patients={filtered} loading={loading} onDelete={setToDelete} />

      <ConfirmDialog
        isOpen={Boolean(toDelete)}
        onClose={() => setToDelete(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete patient"
        message={`Are you sure you want to delete ${toDelete?.name}? This cannot be undone.`}
      />
    </div>
  );
}
