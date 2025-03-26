export interface ICampaign {
  id?: string;
  name?: string;
  startDate?: Date;
  endDate?: Date;
  isDeleted?: boolean;
  isActived?: boolean;
  discount?: [];
  product?: string;
}

export const defaultValue: Readonly<ICampaign> = {
  isDeleted: false,
};
