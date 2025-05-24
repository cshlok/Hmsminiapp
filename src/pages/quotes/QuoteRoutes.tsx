import React from 'react';
import { Routes, Route } from 'react-router-dom';
import QuoteListContainer from './QuoteListContainer';
import QuoteDetailsContainer from './QuoteDetailsContainer';
import AddQuoteContainer from './AddQuoteContainer';
import EditQuoteContainer from './EditQuoteContainer';

const QuoteRoutes: React.FC = () => {
  return (
    <Routes>
      <Route index element={<QuoteListContainer />} />
      <Route path=":id" element={<QuoteDetailsContainer />} />
      <Route path="new" element={<AddQuoteContainer />} />
      <Route path=":id/edit" element={<EditQuoteContainer />} />
    </Routes>
  );
};

export default QuoteRoutes;
