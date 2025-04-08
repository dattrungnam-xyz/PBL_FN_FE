type AddressType = "home" | "office" | "other";
export interface ICreateUserAddress {
  type: AddressType;
  name: string;
  phone: string;
  province: string;
  district: string;
  ward: string;
  address: string;
  textAddress: string;
}

export interface IUserAddress extends ICreateUserAddress {
  id: string;
  isDefault: boolean;
}
// export interface IUpdateUserAddress extends ICreateUserAddress {
//   id: string;
// }

export interface IAddress {
  address: string;
  createdAt: string;
  deletedAt: string | null;
  district: string;
  id: string;
  isDefault: boolean;
  name: string;
  phone: string;
  province: string;
  textAddress: string;
  type: AddressType;
  ward: string;
}
