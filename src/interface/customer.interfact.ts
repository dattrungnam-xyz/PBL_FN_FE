export interface ICustomerStatistic {
  totalCustomers: number;
  returningCustomers: number;
  highlyRatedCustomers: number;
  avrgRevenue: number;
}
export interface ITopCustomer {
  id: string;
  name: string;
  avatar: string;
  phone: string;
  email: string;
  orderCount: number;
  averageRating: number;
  lastOrder: string;
  totalSpent: number;
}