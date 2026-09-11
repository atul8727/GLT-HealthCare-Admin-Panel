import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import AdminLayout from "../components/layout/AdminLayout";

import Login from "../pages/auth/Login";
import Dashboard from "../pages/dashboard/Dashboard";

import Enquiries from "../pages/enquiries/Enquiries";

import Patients from "../pages/patients/Patients";
import CreatePatient from "../pages/patients/CreatePatient";
import PatientDetails from "../pages/patients/PatientDetails";
import EditPatient from "../pages/patients/EditPatient";

import Doctors from "../pages/doctors/Doctors";
import CreateDoctor from "../pages/doctors/CreateDoctor";
import EditDoctor from "../pages/doctors/EditDoctor";

import Consultations from "../pages/consultations/Consultations";
import CreateConsultation from "../pages/consultations/CreateConsultation";
import ConsultationDetails from "../pages/consultations/ConsultationDetails";
import MedicalRecords from "../pages/medicalRecords/MedicalRecords";
import Prescriptions from "../pages/prescriptions/Prescriptions";
import PrescriptionDetails from "../pages/prescriptions/PrescriptionDetails";
import Profile from "../pages/profile/Profile";
import NotFound from "../pages/NotFound";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/patients" element={<Patients />} />
          <Route path="/patients/create" element={<CreatePatient />} />
          <Route path="/patients/:id" element={<PatientDetails />} />
          <Route path="/patients/:id/edit" element={<EditPatient />} />

          <Route path="/doctors" element={<Doctors />} />
          <Route path="/doctors/create" element={<CreateDoctor />} />
          <Route path="/doctors/:id/edit" element={<EditDoctor />} />

          <Route path="/consultations" element={<Consultations />} />
          <Route path="/consultations/create" element={<CreateConsultation />} />
          <Route path="/consultations/:id" element={<ConsultationDetails />} />
          <Route path="/medical-records" element={<MedicalRecords />} />
          <Route path="/prescriptions" element={<Prescriptions />} />
          <Route path="/prescriptions/:id" element={<PrescriptionDetails />} />
          
          <Route path="/enquiries" element={<Enquiries />} />

          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
