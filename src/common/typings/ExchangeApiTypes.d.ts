import { CurrencyAccount } from '../constants';

export interface FFCurrencyResults {
  [key: string]: number;
}

export interface FFMultiFetchModel {
  base: CurrencyAccount;
  ms: number;
  results: FFCurrencyResults;
  updated: string;
}
