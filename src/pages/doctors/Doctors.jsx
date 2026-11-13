import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiPlus, FiEye, FiEdit2, FiKey, FiTrash2 } from "react-icons/fi";
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
  Avatar,
  Loader,
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

  // Reset Password now lives inside the Doctor Details modal.
  const openResetFromDetails = () => {
    if (!viewDoctor) return;
    setPasswordDoctor(viewDoctor);
    setNewPassword("");
    setViewDoctorId(null);
  };

  return (
    <div className="rounded-[20px] border border-[#E2E8F0] bg-white p-4 shadow-[0_8px_24px_rgba(79,70,229,0.08)] sm:p-6">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search by doctor name or specialization"
          className="flex-1"
        />
        <Button icon={FiPlus} onClick={() => navigate("/doctors/create")} className="shrink-0">
          Add Doctor
        </Button>
      </div>

      <DataTable
        loading={loading}
        emptyTitle="No doctors found"
        emptyDescription="Add your first doctor to get started."
        columns={[
          {
            key: "name",
            header: "Doctor Name",
            render: (row) => (
              <div className="flex items-center gap-3">
                <Avatar name={row.name} />
                <span className="whitespace-normal font-bold text-[#14142B] [overflow-wrap:anywhere]">
                  {row.name}
                </span>
              </div>
            ),
          },
          {
            key: "specialization",
            header: "Specialization",
            render: (row) => (
              <span className="block max-w-[180px] whitespace-normal [overflow-wrap:anywhere]">
                {row.specialization}
              </span>
            ),
          },
          { key: "mobile", header: "Mobile" },
          {
            key: "email",
            header: "Email",
            render: (row) => (
              <span className="block max-w-[240px] whitespace-normal [overflow-wrap:anywhere]">
                {row.email}
              </span>
            ),
          },
          {
            key: "status",
            header: "Status",
            render: (row) => <StatusBadge status={row.status} />,
          },
          {
            key: "actions",
            header: "Actions",
            render: (row) => (
              <div className="flex items-center gap-2">
                <Button
                  variant="actionView"
                  size="sm"
                  icon={FiEye}
                  onClick={() => setViewDoctorId(row.id)}
                >
                  View Details
                </Button>
                <Button
                  variant="actionEdit"
                  size="sm"
                  icon={FiEdit2}
                  onClick={() => navigate(`/doctors/${row.id}/edit`)}
                >
                  Edit
                </Button>
                <div className="flex items-center gap-2 px-1">
                  <ToggleSwitch
                    checked={row.status === "Active"}
                    loading={statusLoadingId === row.id}
                    onChange={(nextChecked) => handleToggleStatus(row, nextChecked)}
                  />
                  <span
                    className={`w-6 text-xs font-bold ${
                      row.status === "Active" ? "text-[#16A34A]" : "text-slate-400"
                    }`}
                  >
                    {row.status === "Active" ? "On" : "Off"}
                  </span>
                </div>
                <Button
                  variant="actionDelete"
                  size="sm"
                  icon={FiTrash2}
                  onClick={() => setToDelete(row)}
                >
                  Delete
                </Button>
              </div>
            ),
          },
        ]}
        rows={doctors}
      />

      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        className="mt-5"
      />

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
          <>
            <Button
              variant="outline"
              icon={FiKey}
              disabled={viewLoading || !viewDoctor}
              onClick={openResetFromDetails}
            >
              Reset Password
            </Button>
            <Button variant="outline" onClick={() => setViewDoctorId(null)}>
              Close
            </Button>
          </>
        }
      >
        {viewLoading || !viewDoctor ? (
          <Loader />
        ) : (
          <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {[
              ["Name", viewDoctor.name],
              ["Specialization", viewDoctor.specialization],
              ["Email", viewDoctor.email],
              ["Mobile", viewDoctor.mobile],
              ["Status", <StatusBadge key="status" status={viewDoctor.status} />],
              ["Created At", formatDate(viewDoctor.createdAt)],
              ["Updated At", formatDate(viewDoctor.updatedAt)],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3"
              >
                <dt className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                  {label}
                </dt>
                <dd className="mt-1 break-words text-sm font-semibold text-[#14142B]">
                  {value ?? "-"}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </Modal>
    </div>
  );
}