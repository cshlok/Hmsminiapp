import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import NotFound from './NotFound';
import PatientListContainer from './PatientListContainer';
import PatientDetailsContainer from './PatientDetailsContainer';
import AddPatientContainer from './AddPatientContainer';
import EditPatientContainer from './EditPatientContainer';
import DeletePatientContainer from './DeletePatientContainer';

const PatientRoutes: React.FC = () => {
  return (
    <Routes>
      <Route index element={<PatientListContainer />} />
      <Route path="new" element={<AddPatientContainer />} />
      <Route path=":id" element={<PatientDetailsContainer />} />
      <Route path=":id/edit" element={<EditPatientContainer />} />
      <Route path=":id/delete" element={<DeletePatientContainer />} />
      <Route path="*" element={<Navigate to="/patients" replace />} />
    </Routes>
  );
};

export default PatientRoutes;
