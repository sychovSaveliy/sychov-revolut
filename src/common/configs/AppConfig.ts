import { CurrencyAccount } from '../constants';

export default {
  supportedCurrencies: [
    CurrencyAccount.USD,
    CurrencyAccount.EUR,
    CurrencyAccount.GBP
  ],
  defaultCurrencyAccount: CurrencyAccount.USD,
  fxApi: {
    domain: 'https://api.fastforex.io'
  }
};
