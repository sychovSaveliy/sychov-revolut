import { CurrencyAccount } from '../constants';

export interface FFCurrencyResults {
  [key: CurrencyAccount]: number;
}

export interface FFApiResponse {
  base: CurrencyAccount;
  ms: number;
  results: FFCurrencyResults;
  updated: string;
}
