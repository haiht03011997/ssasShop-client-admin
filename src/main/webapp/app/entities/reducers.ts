/* jhipster-needle-add-reducer-import - JHipster will add reducer here */
import categories from 'app/entities/category/category.reducer';
import filters from 'app/entities/filters/filters.reducer';
import accounts from 'app/entities/account/account.reducer';
import products from 'app/entities/product/product.reducer';

const entitiesReducers = {
  accounts,
  filters,
  categories,
  products
  /* jhipster-needle-add-reducer-combine - JHipster will add reducer here */
};

export default entitiesReducers;
