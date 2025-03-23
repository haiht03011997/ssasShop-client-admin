import React from 'react';
import { Route } from 'react-router-dom';
import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';
import Password from './password/password';
import ResetPassword from './password-reset/init/reset-password';
import ResetPasswordFinish from './password-reset/finish/password-reset-finish';

const AccountRoutes = () => (
  <div>
    <ErrorBoundaryRoutes>
      <Route path="password" element={<Password />} />
      <Route path="reset">
        <Route path="request" element={<ResetPassword />} />
        <Route path="finish" element={<ResetPasswordFinish />} />
      </Route>
    </ErrorBoundaryRoutes>
  </div>
);

export default AccountRoutes;
