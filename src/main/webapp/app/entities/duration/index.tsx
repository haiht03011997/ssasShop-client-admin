import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import Durations from './view/durations';

const DurationsRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<Durations />} />
  </ErrorBoundaryRoutes>
);

export default DurationsRoutes;
