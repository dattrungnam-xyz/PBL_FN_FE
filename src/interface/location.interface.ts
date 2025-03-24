interface ILocation {
  id: string;
  name: string;
  type: number;
  typeText: string;
}

export interface IProvince extends ILocation {
  slug: string;
}

export interface IDistrict extends ILocation {
  provinceId: string;
}

export interface IWard extends ILocation {
  districtId: string;
}
