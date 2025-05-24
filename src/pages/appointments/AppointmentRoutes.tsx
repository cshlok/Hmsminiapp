import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AppointmentListContainer from './AppointmentListContainer';
import AppointmentDetailsContainer from './AppointmentDetailsContainer';
import AddAppointmentContainer from './AddAppointmentContainer';
import EditAppointmentContainer from './EditAppointmentContainer';
import AppointmentCalendarContainer from './AppointmentCalendarContainer';

const AppointmentRoutes: React.FC = () => {
  return (
    <Routes>
      <Route index element={<AppointmentListContainer />} />
      <Route path=":id" element={<AppointmentDetailsContainer />} />
      <Route path="new" element={<AddAppointmentContainer />} />
      <Route path=":id/edit" element={<EditAppointmentContainer />} />
      <Route path="calendar" element={<AppointmentCalendarContainer />} />
    </Routes>
  );
};

export default AppointmentRoutes;
