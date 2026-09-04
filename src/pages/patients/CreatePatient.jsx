import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import patientService from "../../services/patients/patientService";
import PatientForm from "../../components/patients/PatientForm";
import Card from "../../components/ui/Card";

export default function CreatePatient() {
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    const patient = await patientService.createPatient(values);
    toast.success(`Patient created — #${patient.id}`);
    navigate(`/patients/${patient.id}`);
  };

  return (
    <div className="mx-auto max-w-2xl">
      <Card title="Register Patient">
        <PatientForm onSubmit={handleSubmit} submitLabel="Create Patient" />
      </Card>
    </div>
  );
}
