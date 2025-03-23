import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import User from './view/accounts';

const UserRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<User />} />
  </ErrorBoundaryRoutes>
);

export default UserRoutes;
