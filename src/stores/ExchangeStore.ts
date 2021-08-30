import { action, makeAutoObservable, observable } from 'mobx';
import { createContext } from 'react';
import AppConfig from '../common/configs/AppConfig';
import { CurrencyAccount } from '../common/constants';
import ExchangeApiService, { ExchangeApiServiceClass } from '../common/services/ExchangeApiService';
import { FFMultiFetchModel } from '../common/typings/ExchangeApiTypes';
import { ExchangeDirection } from '../components/Exchange/enums';

export interface ExchangeStoreState {
  currentCurrencyAccount: CurrencyAccount;
  secondCurrencyAccount: CurrencyAccount;
  firstAccountCalculation: number | undefined;
  secondAccountCalculation: number | undefined;
}

// TODO: move to constants?
export const DEFAULT_TARGET_ACCOUNT = CurrencyAccount.EUR;

export class ExchangeStore implements ExchangeStoreState {
  @observable currentCurrencyAccount: CurrencyAccount = AppConfig.defaultCurrencyAccount;
  @observable secondCurrencyAccount: CurrencyAccount = DEFAULT_TARGET_ACCOUNT;
  @observable ffMultiFetchModel: FFMultiFetchModel | null = null;

  @observable firstAccountCalculation: number = 0;
  @observable secondAccountCalculation: number = 0;

  intervalId: ReturnType<typeof setInterval>;

  constructor(private readonly exchangeApiService: ExchangeApiServiceClass) {
    makeAutoObservable(this);
    const count = 0;
    this.intervalId = setInterval(() => {
      // @ts-ignore
      // this.ffMultiFetchModel.results = {
      //   EUR: 0.4,
      //   USD: 1,
      //   GBP: 1.25
      // };

      this.loadFFRates();
    }, 1000 * 10);
  }

  @action setCurrentAccount(account: CurrencyAccount): void {
    this.currentCurrencyAccount = account;
  }

  @action setSecondAccount(account: CurrencyAccount): void {
    this.secondCurrencyAccount = account;
  }

  @action loadFFRates(currencyAccount?: CurrencyAccount): Promise<void> {
    const currencyAccountLocal = currencyAccount || this.currentCurrencyAccount;
    return this.exchangeApiService.fetchMulti(currencyAccountLocal).then(ffResp => {
      this.setFFMultiFetchModel(ffResp);
    });
  }

  @action private setFFMultiFetchModel(data: FFMultiFetchModel | null): void {
    this.ffMultiFetchModel = data;
  }

  @action resetStore(): void {
    this.currentCurrencyAccount = AppConfig.defaultCurrencyAccount;
    this.secondCurrencyAccount = DEFAULT_TARGET_ACCOUNT;
    this.firstAccountCalculation = 0;
    this.secondAccountCalculation = 0;
    this.setFFMultiFetchModel(null);
    clearInterval(this.intervalId);
  }

  // Calculations
  @action updateCalculations(currency: CurrencyAccount, value: number): void {
    if (value === 0) {
      this.firstAccountCalculation = 0;
      this.secondAccountCalculation = 0;

      return;
    }

    if (currency === this.currentCurrencyAccount) {
      this.firstAccountCalculation = value;

      this.applyFXRatesToSecond();
      return;
    }

    if (currency === this.secondCurrencyAccount) {
      this.secondAccountCalculation = value;

      this.applyFXRatesToFirst();
      return;
    }

    return console.warn(`Wrong currency - ${currency}`);
  }

  private applyFXRatesToFirst(): void {
    if (!this.ffMultiFetchModel) {
      return console.warn('No FX rates in the store.');
    }

    const currency = this.secondCurrencyAccount;
    const rateCoefficient = 1 / this.ffMultiFetchModel.results[currency];

    this.firstAccountCalculation = Number((this.secondAccountCalculation * rateCoefficient).toFixed(2));
  }

  private applyFXRatesToSecond(): void {
    if (!this.ffMultiFetchModel) {
      return console.warn('No FX rates in the store.');
    }

    const currency = this.secondCurrencyAccount;
    const rateCoefficient = this.ffMultiFetchModel.results[currency];

    this.secondAccountCalculation = Number((this.firstAccountCalculation * rateCoefficient).toFixed(2));
  }
}
export const ExchangeStoreInstance = new ExchangeStore(ExchangeApiService);
export default createContext(ExchangeStoreInstance);
