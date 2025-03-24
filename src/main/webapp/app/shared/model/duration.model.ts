export interface IDuration {
  id?: string;
  name?: string;
  description?: string;
  isDeleted?: boolean;
}

export const defaultValue: Readonly<IDuration> = {
  isDeleted: false,
};
