export interface ICreateStore {
  name: string;
  description: string;
  phone: string;
  email: string;
  address: string;
  province: string;
  district: string;
  ward: string;
  provinceName: string;
  districtName: string;
  wardName: string;
  avatar: string;
  banner: string;
}

export type ICreateStoreError = Partial<Record<keyof ICreateStore, string>>;

export interface IStore {
  id: number;
  name: string;
  description: string;
  phone: string;
  email: string;
  address: string;
  province: string;
  district: string;
  ward: string;
  provinceName: string;
  districtName: string;
  wardName: string;
  avatar: string;
  banner: string;
}