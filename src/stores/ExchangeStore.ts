import { action, makeAutoObservable, observable } from 'mobx';
import { createContext } from 'react';
import AppConfig from '../common/configs/AppConfig';
import { CurrencyAccount } from '../common/constants';
import ExchangeApiService, { ExchangeApiServiceClass } from '../common/services/ExchangeApiServiceClass';
import { FFCurrencyResults } from '../common/typings/ExchangeApiTypes';

export interface ExchangeStoreState {
  currentCurrencyAccount: CurrencyAccount;
}

// TODO: move to constants?
export const DEFAULT_TARGET_ACCOUNT = CurrencyAccount.EUR;

class ExchangeStore implements ExchangeStoreState {
  @observable currentCurrencyAccount: CurrencyAccount = AppConfig.defaultCurrencyAccount;
  @observable secondCurrencyAccount: CurrencyAccount = DEFAULT_TARGET_ACCOUNT;
  @observable ffCurrencyResults: FFCurrencyResults = {};

  constructor(private readonly exchangeApiService: ExchangeApiServiceClass) {
    makeAutoObservable(this);
  }

  @action setCurrentAccount(account: CurrencyAccount): void {
    this.currentCurrencyAccount = account;
  }

  @action loadFFRates(currencyAccount: CurrencyAccount = this.currentCurrencyAccount): void {
    this.exchangeApiService.fetchMulti(currencyAccount).then(ffResp => {
      this.ffCurrencyResults = ffResp.results;
    });
  }

  @action resetStore(): void {
    this.currentCurrencyAccount = AppConfig.defaultCurrencyAccount;
    this.ffCurrencyResults = {};
  }
}

export default createContext(new ExchangeStore(ExchangeApiService));
