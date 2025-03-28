import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';
import User from './account';
import Categories from './category';
import Products from './product';
import Durations from './duration';
import Campaigns from './campaign';

/* jhipster-needle-add-route-import - JHipster will add routes here */

export default () => {
  return (
    <div>
      <ErrorBoundaryRoutes>
        {/* prettier-ignore */}
        <Route path="accounts/*" element={<User />} />
        <Route path="categories/*" element={<Categories />} />
        <Route path="products/*" element={<Products />} />
        <Route path="durations/*" element={<Durations />} />
        <Route path="campaigns/*" element={<Campaigns />} />
        {/* jhipster-needle-add-route-path - JHipster will add routes here */}
      </ErrorBoundaryRoutes>
    </div>
  );
};
