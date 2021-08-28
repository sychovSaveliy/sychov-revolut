import { action, makeAutoObservable, observable } from 'mobx';
import { createContext } from 'react';
import { CurrencyAccount } from '../common/constants';
import ExchangeApiService, { ExchangeApiServiceClass } from '../common/services/ExchangeApiServiceClass';
import { FFCurrencyResults } from '../common/typings/ExchangeApiTypes';

export interface ExchangeStoreState {
  currentCurrencyAccount: CurrencyAccount;
}

class ExchangeStore implements ExchangeStoreState {
  @observable currentCurrencyAccount: CurrencyAccount = CurrencyAccount.EUR;
  @observable ffCurrencyResults: FFCurrencyResults = {};

  constructor(private readonly exchangeApiService: ExchangeApiServiceClass) {
    makeAutoObservable(this);
  }

  @action setCurrentAccount(account: CurrencyAccount): void {
    this.currentCurrencyAccount = account;
  }

  @action loadFFRates(currencyAccount: CurrencyAccount): void {
    this.exchangeApiService.fetchMulti(currencyAccount).then(ffResp => {
      this.ffCurrencyResults = ffResp.results;
    });
  }
}

export default createContext(new ExchangeStore(ExchangeApiService));
