export interface IAnalystic {
  currentCycle: number;
  previousCycle: number;
  percentage: number;
}
export interface IOrdersAnalystic extends IAnalystic {
  currentCycleTotalPrice: number;
  previousCycleTotalPrice: number;
}
