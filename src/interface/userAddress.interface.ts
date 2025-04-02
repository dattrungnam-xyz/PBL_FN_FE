export interface ICreateUserAddress {
  type: "home" | "office" | "other";
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