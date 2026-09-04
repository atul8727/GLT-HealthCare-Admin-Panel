import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiPlus, FiEye, FiEdit2, FiTrash2 } from "react-icons/fi";
import vitalService from "../../services/vitals/vitalService";
import { Button, Modal, ConfirmDialog, StatusBadge } from "../ui";
import { formatDate } from "../../utils/helpers";
import VitalForm from "./VitalForm";

export default function VitalsPanel({ patientId }) {
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
    return (
      <div className="flex justify-center py-8">
        <div className="text-text-secondary">Loading vitals...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with Add Button */}
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium text-text-secondary">
          {vitals.length} {vitals.length === 1 ? "record" : "records"}
        </h3>
        <Button icon={FiPlus} onClick={() => setShowCreate(true)}>
          Add Vitals
        </Button>
      </div>

      {/* Vitals Table */}
      {vitals.length === 0 ? (
        <div className="text-center py-8 text-text-secondary border border-dashed border-gray-300 rounded-lg">
          <p className="text-sm">No vitals recorded yet</p>
          <p className="text-xs mt-1">
            Click "Add Vitals" to record the first vitals for this patient
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                  BP
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                  Pulse
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                  Temp
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                  SpO₂
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                  Weight
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                  BMI
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-2 text-center text-xs font-medium text-text-muted uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {vitals
                .slice()
                .reverse()
                .map((vital) => (
                  <tr key={vital.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-2 text-text-secondary text-xs">
                      {formatDate(vital.createdAt)}
                    </td>
                    <td className="px-4 py-2 font-medium text-text-primary">
                      {vital.bp || "-"}
                    </td>
                    <td className="px-4 py-2 text-text-primary">
                      {vital.pulse ?? "-"}
                    </td>
                    <td className="px-4 py-2 text-text-primary">
                      {vital.temperature ?? "-"}
                    </td>
                    <td className="px-4 py-2 text-text-primary">
                      {vital.spo2 ?? "-"}%
                    </td>
                    <td className="px-4 py-2 text-text-primary">
                      {vital.weight ?? "-"} kg
                    </td>
                    <td className="px-4 py-2 font-medium text-text-primary">
                      {vital.bmi ?? "-"}
                    </td>
                    <td className="px-4 py-2">
                      <StatusBadge status={vital.status || "Active"} />
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={FiEye}
                          onClick={() => setViewing(vital)}
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={FiEdit2}
                          onClick={() => setEditing(vital)}
                          className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={FiTrash2}
                          onClick={() => setToDelete(vital)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-text-muted">
                  Recorded On
                </dt>
                <dd className="mt-1 text-sm text-text-primary">
                  {formatDate(viewing.createdAt)}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-text-muted">
                  Status
                </dt>
                <dd className="mt-1">
                  <StatusBadge status={viewing.status || "Active"} />
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-text-muted">
                  Blood Pressure
                </dt>
                <dd className="mt-1 text-sm text-text-primary">
                  {viewing.bp || "-"}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-text-muted">
                  Pulse (bpm)
                </dt>
                <dd className="mt-1 text-sm text-text-primary">
                  {viewing.pulse ?? "-"}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-text-muted">
                  Temperature (°F)
                </dt>
                <dd className="mt-1 text-sm text-text-primary">
                  {viewing.temperature ?? "-"}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-text-muted">
                  SpO₂ (%)
                </dt>
                <dd className="mt-1 text-sm text-text-primary">
                  {viewing.spo2 ?? "-"}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-text-muted">
                  Weight (kg)
                </dt>
                <dd className="mt-1 text-sm text-text-primary">
                  {viewing.weight ?? "-"}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-text-muted">
                  Height (cm)
                </dt>
                <dd className="mt-1 text-sm text-text-primary">
                  {viewing.height ?? "-"}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-text-muted">
                  BMI
                </dt>
                <dd className="mt-1 text-sm font-medium text-text-primary">
                  {viewing.bmi ?? "-"}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-text-muted">
                  Recorded By
                </dt>
                <dd className="mt-1 text-sm text-text-primary">
                  {viewing.recordedBy ?? "-"}
                </dd>
              </div>
            </div>
            {viewing.updatedAt !== viewing.createdAt && (
              <div className="pt-4 border-t border-gray-200">
                <p className="text-xs text-text-muted">
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