/* jhipster-needle-add-reducer-import - JHipster will add reducer here */
import categories from 'app/entities/category/category.reducer';
import filters from 'app/entities/filters/filters.reducer';
import accounts from 'app/entities/account/account.reducer';
import products from 'app/entities/product/product.reducer';
import durations from 'app/entities/duration/duration.reducer';

const entitiesReducers = {
  accounts,
  filters,
  categories,
  products,
  durations
  /* jhipster-needle-add-reducer-combine - JHipster will add reducer here */
};

export default entitiesReducers;
