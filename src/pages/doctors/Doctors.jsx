import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiPlus } from "react-icons/fi";
import toast from "react-hot-toast";
import doctorService from "../../services/doctors/doctorService";
import {
  DataTable,
  Button,
  SearchInput,
  StatusBadge,
  Pagination,
  ConfirmDialog,
  Modal,
  Input,
  ToggleSwitch,
} from "../../components/ui";
import { useDebounce } from "../../hooks/useDebounce";
import { formatDate } from "../../utils/helpers";

const PAGE_LIMIT = 10;

export default function Doctors() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [statusLoadingId, setStatusLoadingId] = useState(null);

  const [passwordDoctor, setPasswordDoctor] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  // View details modal — fetched fresh via GET /api/doctors/:id each time.
  const [viewDoctorId, setViewDoctorId] = useState(null);
  const [viewDoctor, setViewDoctor] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const { doctors: data, pagination } = await doctorService.getDoctors({
        page,
        limit: PAGE_LIMIT,
        search: debouncedSearch.trim(),
      });
      setDoctors(data);
      setTotalPages(pagination?.totalPages || 1);
    } catch (err) {
      toast.error(err.message || "Failed to load doctors.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, debouncedSearch]);

  // Reset to page 1 whenever the search term changes.
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  useEffect(() => {
    if (!viewDoctorId) {
      setViewDoctor(null);
      return;
    }
    setViewLoading(true);
    doctorService
      .getDoctorById(viewDoctorId)
      .then(setViewDoctor)
      .catch((err) => {
        toast.error(err.message || "Failed to load doctor details.");
        setViewDoctorId(null);
      })
      .finally(() => setViewLoading(false));
  }, [viewDoctorId]);

  const handleToggleStatus = async (doctor, nextChecked) => {
    setStatusLoadingId(doctor.id);
    try {
      const nextStatus = nextChecked ? "Active" : "Inactive";
      await doctorService.updateStatus(doctor.id, nextStatus);
      toast.success(`${doctor.name} marked ${nextStatus}`);
      load();
    } catch (err) {
      toast.error(err.message || "Failed to update status.");
    } finally {
      setStatusLoadingId(null);
    }
  };

  const handleDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await doctorService.deleteDoctor(toDelete.id);
      toast.success("Doctor deleted");
      setToDelete(null);
      load();
    } catch (err) {
      toast.error(err.message || "Failed to delete doctor.");
    } finally {
      setDeleting(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!passwordDoctor) return;
    setSavingPassword(true);
    try {
      await doctorService.updatePassword(passwordDoctor.id, newPassword);
      toast.success("Password reset");
      setPasswordDoctor(null);
      setNewPassword("");
    } catch (err) {
      toast.error(err.message || "Failed to reset password.");
    } finally {
      setSavingPassword(false);
    }
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
              <div className="flex flex-wrap items-center gap-4">
                <button
                  className="text-sm font-medium text-sky-600 hover:underline"
                  onClick={() => setViewDoctorId(row.id)}
                >
                  View Details
                </button>
                <button
                  className="text-sm font-medium text-green-600 hover:underline"
                  onClick={() => navigate(`/doctors/${row.id}/edit`)}
                >
                  Edit
                </button>
                <button
                  className="text-sm font-medium text-amber-600 hover:underline"
                  onClick={() => {
                    setPasswordDoctor(row);
                    setNewPassword("");
                  }}
                >
                  Reset Password
                </button>
                <div className="flex items-center gap-2">
                  <ToggleSwitch
                    checked={row.status === "Active"}
                    loading={statusLoadingId === row.id}
                    onChange={(nextChecked) => handleToggleStatus(row, nextChecked)}
                  />
                  <span className="text-xs text-text-secondary">
                    {row.status === "Active" ? "On" : "Off"}
                  </span>
                </div>
                <button
                  className="text-sm font-medium text-danger hover:underline"
                  onClick={() => setToDelete(row)}
                >
                  Delete
                </button>
              </div>
            ),
          },
        ]}
        rows={doctors}
      />

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      <ConfirmDialog
        isOpen={Boolean(toDelete)}
        onClose={() => setToDelete(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete doctor"
        message={`Are you sure you want to delete ${toDelete?.name}? This cannot be undone.`}
      />

      <Modal
        isOpen={Boolean(passwordDoctor)}
        onClose={() => setPasswordDoctor(null)}
        title={`Reset password — ${passwordDoctor?.name || ""}`}
        footer={
          <>
            <Button variant="outline" onClick={() => setPasswordDoctor(null)}>
              Cancel
            </Button>
            <Button type="submit" form="reset-doctor-password" loading={savingPassword}>
              Save
            </Button>
          </>
        }
      >
        <form id="reset-doctor-password" onSubmit={handlePasswordSubmit} className="space-y-4">
          <Input
            label="New Password"
            type="password"
            required
            minLength={6}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </form>
      </Modal>

      {/* View Details — backed by GET /api/doctors/:id */}
      <Modal
        isOpen={Boolean(viewDoctorId)}
        onClose={() => setViewDoctorId(null)}
        title="Doctor Details"
        size="md"
        footer={
          <Button variant="outline" onClick={() => setViewDoctorId(null)}>
            Close
          </Button>
        }
      >
        {viewLoading || !viewDoctor ? (
          <p className="py-6 text-center text-sm text-text-secondary">Loading...</p>
        ) : (
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[
              ["Name", viewDoctor.name],
              ["Specialization", viewDoctor.specialization],
              ["Email", viewDoctor.email],
              ["Mobile", viewDoctor.mobile],
              ["Status", <StatusBadge key="status" status={viewDoctor.status} />],
              ["Created At", formatDate(viewDoctor.createdAt)],
              ["Updated At", formatDate(viewDoctor.updatedAt)],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="text-xs font-medium uppercase tracking-wide text-text-muted">
                  {label}
                </dt>
                <dd className="mt-1 text-sm text-text-primary">{value ?? "-"}</dd>
              </div>
            ))}
          </dl>
        )}
      </Modal>
    </div>
  );
}