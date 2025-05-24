import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ServiceListContainer from './ServiceListContainer';
import ServiceDetailsContainer from './ServiceDetailsContainer';
import AddServiceContainer from './AddServiceContainer';
import EditServiceContainer from './EditServiceContainer';
import CategoryListContainer from './CategoryListContainer';

const ServiceRoutes: React.FC = () => {
  return (
    <Routes>
      <Route index element={<ServiceListContainer />} />
      <Route path=":id" element={<ServiceDetailsContainer />} />
      <Route path="new" element={<AddServiceContainer />} />
      <Route path=":id/edit" element={<EditServiceContainer />} />
      <Route path="categories" element={<CategoryListContainer />} />
    </Routes>
  );
};

export default ServiceRoutes;
