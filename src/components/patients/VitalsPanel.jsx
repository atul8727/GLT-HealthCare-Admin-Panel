import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiPlus, FiEye, FiEdit2, FiTrash2 } from "react-icons/fi";
import vitalService from "../../services/vitals/vitalService";
import { Button, Modal, ConfirmDialog, StatusBadge, Loader } from "../ui";
import { formatDate } from "../../utils/helpers";
import VitalForm from "./VitalForm";

const TH =
  "whitespace-nowrap px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-[0.06em] text-[#64748B]";
const TD = "whitespace-nowrap px-5 py-4 align-middle text-sm text-[#14142B]";

function Field({ label, children }) {
  return (
    <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3">
      <dt className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">{label}</dt>
      <dd className="mt-1 text-sm font-semibold text-[#14142B]">{children}</dd>
    </div>
  );
}

export default function VitalsPanel({ patientId, autoOpenCreate = false }) {
  const [vitals, setVitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [viewing, setViewing] = useState(null);
  const [editing, setEditing] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadVitals = async () => {
    setLoading(true);
    try {
      const data = await vitalService.getByPatient(patientId);
      setVitals(data);
    } catch (err) {
      toast.error(err.message || "Failed to load vitals.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (patientId) {
      loadVitals();
    }
  }, [patientId]);

  // Right after registering a brand-new patient, jump straight into the
  // Add Vitals form so recording the first vitals is a one-click next step.
  useEffect(() => {
    if (autoOpenCreate) {
      setShowCreate(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoOpenCreate]);

  const handleCreate = async (form) => {
    try {
      await vitalService.create(patientId, form);
      toast.success("Vitals recorded successfully");
      setShowCreate(false);
      loadVitals();
    } catch (err) {
      toast.error(err.message || "Failed to save vitals.");
      throw err;
    }
  };

  const handleUpdate = async (form) => {
    try {
      await vitalService.update(editing.id, patientId, form);
      toast.success("Vitals updated successfully");
      setEditing(null);
      loadVitals();
    } catch (err) {
      toast.error(err.message || "Failed to update vitals.");
      throw err;
    }
  };

  const handleDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await vitalService.remove(toDelete.id);
      toast.success("Vitals record deleted");
      setToDelete(null);
      loadVitals();
    } catch (err) {
      toast.error(err.message || "Failed to delete vitals record.");
    } finally {
      setDeleting(false);
    }
  };

  const toFormValues = (record) => ({
    bp: record.bp ?? "",
    pulse: record.pulse ?? "",
    temperature: record.temperature ?? "",
    spo2: record.spo2 ?? "",
    weight: record.weight ?? "",
    height: record.height ?? "",
    bmi: record.bmi ?? "",
  });

  // Loading state
  if (loading) {
    return <Loader label="Loading vitals..." />;
  }

  return (
    <div className="space-y-5">
      {/* Header with Add Button */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="rounded-full bg-indigo-50 px-3.5 py-1.5 text-sm font-semibold text-[#4F46E5]">
          {vitals.length} {vitals.length === 1 ? "record" : "records"}
        </h3>
        <Button icon={FiPlus} onClick={() => setShowCreate(true)}>
          Add Vitals
        </Button>
      </div>

      {/* Vitals Table */}
      {vitals.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] px-4 py-12 text-center">
          <p className="text-base font-bold text-[#14142B]">No vitals recorded yet</p>
          <p className="mt-1 text-sm text-[#64748B]">
            Click "Add Vitals" to record the first vitals for this patient
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[#E2E8F0] bg-white shadow-xs">
          <table className="min-w-full border-collapse">
            <thead className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
              <tr>
                <th className={TH}>Date</th>
                <th className={TH}>BP</th>
                <th className={TH}>Pulse</th>
                <th className={TH}>Temp</th>
                <th className={TH}>SpO₂</th>
                <th className={TH}>Weight</th>
                <th className={TH}>BMI</th>
                <th className={TH}>Status</th>
                <th className={`${TH} text-center`}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {vitals
                .slice()
                .reverse()
                .map((vital) => (
                  <tr key={vital.id} className="transition-colors hover:bg-slate-50/80">
                    <td className={`${TD} text-[#64748B]`}>{formatDate(vital.createdAt)}</td>
                    <td className={`${TD} font-bold`}>{vital.bp || "-"}</td>
                    <td className={TD}>{vital.pulse ?? "-"}</td>
                    <td className={TD}>{vital.temperature ?? "-"}</td>
                    <td className={TD}>{vital.spo2 ?? "-"}%</td>
                    <td className={TD}>{vital.weight ?? "-"} kg</td>
                    <td className={`${TD} font-bold`}>{vital.bmi ?? "-"}</td>
                    <td className={TD}>
                      <StatusBadge status={vital.status || "Active"} />
                    </td>
                    <td className={TD}>
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="actionView"
                          size="sm"
                          icon={FiEye}
                          aria-label="View"
                          onClick={() => setViewing(vital)}
                        />
                        <Button
                          variant="actionEdit"
                          size="sm"
                          icon={FiEdit2}
                          aria-label="Edit"
                          onClick={() => setEditing(vital)}
                        />
                        <Button
                          variant="actionDelete"
                          size="sm"
                          icon={FiTrash2}
                          aria-label="Delete"
                          onClick={() => setToDelete(vital)}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Modal */}
      <Modal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        title="Add Vitals"
        size="lg"
      >
        <VitalForm
          onSubmit={handleCreate}
          onCancel={() => setShowCreate(false)}
          submitLabel="Save Vitals"
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={Boolean(editing)}
        onClose={() => setEditing(null)}
        title="Edit Vitals"
        size="lg"
      >
        {editing && (
          <VitalForm
            initialValues={toFormValues(editing)}
            onSubmit={handleUpdate}
            onCancel={() => setEditing(null)}
            submitLabel="Update Vitals"
          />
        )}
      </Modal>

      {/* View Modal */}
      <Modal
        isOpen={Boolean(viewing)}
        onClose={() => setViewing(null)}
        title="Vitals Detail"
        size="md"
      >
        {viewing && (
          <div className="space-y-4">
            <dl className="grid grid-cols-2 gap-3">
              <Field label="Recorded On">{formatDate(viewing.createdAt)}</Field>
              <Field label="Status">
                <StatusBadge status={viewing.status || "Active"} />
              </Field>
              <Field label="Blood Pressure">{viewing.bp || "-"}</Field>
              <Field label="Pulse (bpm)">{viewing.pulse ?? "-"}</Field>
              <Field label="Temperature (°F)">{viewing.temperature ?? "-"}</Field>
              <Field label="SpO₂ (%)">{viewing.spo2 ?? "-"}</Field>
              <Field label="Weight (kg)">{viewing.weight ?? "-"}</Field>
              <Field label="Height (cm)">{viewing.height ?? "-"}</Field>
              <Field label="BMI">{viewing.bmi ?? "-"}</Field>
            </dl>
            {viewing.updatedAt !== viewing.createdAt && (
              <div className="border-t border-[#E2E8F0] pt-4">
                <p className="text-xs text-[#64748B]">
                  Last Updated: {formatDate(viewing.updatedAt)}
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Delete Confirm Dialog */}
      <ConfirmDialog
        isOpen={Boolean(toDelete)}
        onClose={() => setToDelete(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Vitals Record"
        message={`Are you sure you want to delete this vitals record from ${formatDate(toDelete?.createdAt)}? This cannot be undone.`}
      />
    </div>
  );
}