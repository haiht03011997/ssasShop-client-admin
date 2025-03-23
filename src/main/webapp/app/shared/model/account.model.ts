export interface IAccount {
  id?: string;
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
  activated?: boolean;
  email?: string | null;
  IsDeleted?: boolean;
  roleId?: string | number
}

export const defaultValue: Readonly<IAccount> = {
  IsDeleted: false,
};
