import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import Campaigns from './view/campaigns';

const CampaignsRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<Campaigns />} />
  </ErrorBoundaryRoutes>
);

export default CampaignsRoutes;
