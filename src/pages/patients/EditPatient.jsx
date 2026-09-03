import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import patientService from "../../services/patients/patientService";
import PatientForm from "../../components/patients/PatientForm";
import Card from "../../components/ui/Card";
import Loader from "../../components/ui/Loader";

export default function EditPatient() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    patientService.getPatientById(id).then((data) => {
      setPatient(data);
      setLoading(false);
    });
  }, [id]);

  const handleSubmit = async (values) => {
    await patientService.updatePatient(id, values);
    toast.success("Patient updated");
    navigate(`/patients/${id}`);
  };

  if (loading) return <Loader label="Loading patient..." />;
  if (!patient) return <p className="text-text-secondary">Patient not found.</p>;

  return (
    <div className="mx-auto max-w-2xl">
      <Card title={`Edit ${patient.name}`}>
        <PatientForm initialValues={patient} onSubmit={handleSubmit} submitLabel="Save Changes" />
      </Card>
    </div>
  );
}
