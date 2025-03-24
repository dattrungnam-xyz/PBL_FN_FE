export interface ICreateStore {
  name: string;
  description: string;
  phone: string;
  email: string;
  address: string;
  province: string;
  district: string;
  ward: string;
  avatar: string;
  banner: string;
}

export type ICreateStoreError = Partial<Record<keyof ICreateStore, string>>;
