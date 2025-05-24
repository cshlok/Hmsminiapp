import React from 'react';
import { Routes, Route } from 'react-router-dom';
import BillListContainer from './BillListContainer';
import BillDetailsContainer from './BillDetailsContainer';
import AddBillContainer from './AddBillContainer';
import EditBillContainer from './EditBillContainer';
import AddPaymentContainer from './AddPaymentContainer';

const BillingRoutes: React.FC = () => {
  return (
    <Routes>
      <Route index element={<BillListContainer />} />
      <Route path=":id" element={<BillDetailsContainer />} />
      <Route path="new" element={<AddBillContainer />} />
      <Route path=":id/edit" element={<EditBillContainer />} />
      <Route path=":id/payment" element={<AddPaymentContainer />} />
    </Routes>
  );
};

export default BillingRoutes;
