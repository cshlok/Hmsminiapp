import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SettingsContainer from './SettingsContainer';

const SettingsRoutes: React.FC = () => {
  return (
    <Routes>
      <Route index element={<SettingsContainer />} />
    </Routes>
  );
};

export default SettingsRoutes;
