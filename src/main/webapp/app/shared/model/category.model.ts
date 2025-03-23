export interface ICategory {
  id?: string;
  name?: string;
  description?: string;
  isDeleted?: boolean;
}

export const defaultValue: Readonly<ICategory> = {
  isDeleted: false,
};
