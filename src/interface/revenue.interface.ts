import { Category } from "../enums/category.enum";

export interface IAnalysticByCategory {
  category: Category;
  revenueCurrentCycle: number;
  revenuePreviousCycle: number;
  percentage: number;
}
