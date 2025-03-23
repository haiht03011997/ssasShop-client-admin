export interface IProduct {
  id?: string;
  name?: string;
  description?: string;
  imageUrl?: string;
  stock?: number;
  price?: number;
  isDeleted?: boolean;
}

export const defaultValue: Readonly<IProduct> = {
  isDeleted: false,
};
