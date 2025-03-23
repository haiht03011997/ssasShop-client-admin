import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import Products from './view/products';

const ProductsRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<Products />} />
  </ErrorBoundaryRoutes>
);

export default ProductsRoutes;
