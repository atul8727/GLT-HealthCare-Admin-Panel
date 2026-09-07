import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import patientService from "../../services/patients/patientService";
import PatientForm from "../../components/patients/PatientForm";
import Card from "../../components/ui/Card";
import { FiUserPlus } from "react-icons/fi";

export default function CreatePatient() {
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    const patient = await patientService.createPatient(values);
    toast.success(`${patient.name} registered! Let's add their vitals next.`);
    // Jump straight to the Vitals tab and pop the Add Vitals form open so
    // the next logical step is right there — no extra clicking around.
    navigate(`/patients/${patient.id}?tab=vitals&new=1`);
  };

  return (
    <div className="mx-auto max-w-2xl">
      <Card title="Register Patient" icon={FiUserPlus}>
        <PatientForm onSubmit={handleSubmit} submitLabel="Create Patient" />
      </Card>
    </div>
  );
}
