import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import Categories from './view/categories';

const CategoriesRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<Categories />} />
  </ErrorBoundaryRoutes>
);

export default CategoriesRoutes;
