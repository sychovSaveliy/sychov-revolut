import { CurrencyAccount } from '../constants';

export default {
  supportedCurrencies: [
    CurrencyAccount.USD,
    CurrencyAccount.EUR,
    CurrencyAccount.GBP
  ],
  fxApi: {
    domain: 'https://api.fastforex.io'
  }
};
