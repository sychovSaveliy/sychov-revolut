import { action, makeAutoObservable, observable } from 'mobx';
import { createContext } from 'react';
import AppConfig from '../common/configs/AppConfig';
import { CurrencyAccount } from '../common/constants';
import ExchangeApiService, { ExchangeApiServiceClass } from '../common/services/ExchangeApiServiceClass';
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

class ExchangeStore implements ExchangeStoreState {
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

      // this.loadFFRates();
    }, 1000 * 10);
  }

  @action setCurrentAccount(account: CurrencyAccount): void {
    this.currentCurrencyAccount = account;
  }

  @action setSecondAccount(account: CurrencyAccount): void {
    this.secondCurrencyAccount = account;
  }

  @action loadFFRates(currencyAccount?: CurrencyAccount): void {
    const currencyAccountLocal = currencyAccount || this.currentCurrencyAccount;
    this.exchangeApiService.fetchMulti(currencyAccountLocal).then(ffResp => {
      this.ffMultiFetchModel = ffResp;
    });
  }

  @action resetStore(): void {
    this.currentCurrencyAccount = AppConfig.defaultCurrencyAccount;
    this.ffMultiFetchModel = null;
    clearInterval(this.intervalId);
  }

  // Calculations
  @action updateCalculations(currency: CurrencyAccount, value: number, exDirection: ExchangeDirection): void {
    if (value === 0) {
      this.firstAccountCalculation = 0;
      this.secondAccountCalculation = 0;

      return;
    }

    if (currency === this.currentCurrencyAccount) {
      this.firstAccountCalculation = value;

      this.applyFXRatesToSecond(exDirection);
      return;
    }

    if (currency === this.secondCurrencyAccount) {
      this.secondAccountCalculation = value;

      this.applyFXRatesToFirst(exDirection);
      return;
    }
    return console.warn(`Wrong currency - ${currency}`);
  }

  private applyFXRatesToFirst(exDirection: ExchangeDirection): void {
    if (!this.ffMultiFetchModel) {
      return console.warn('No FX rates in the store.');
    }

    let currency;
    let rateCoefficient;
    if (exDirection === ExchangeDirection.FirstToSecond) {
      currency = this.secondCurrencyAccount;
      rateCoefficient = 1 / this.ffMultiFetchModel.results[currency];
    } else {
      currency = this.secondCurrencyAccount;
      rateCoefficient = 1 / this.ffMultiFetchModel.results[currency];
    }

    this.firstAccountCalculation = this.secondAccountCalculation * rateCoefficient;
  }

  private applyFXRatesToSecond(exDirection: ExchangeDirection): void {
    if (!this.ffMultiFetchModel) {
      return console.warn('No FX rates in the store.');
    }

    let currency;
    let rateCoefficient;
    if (exDirection === ExchangeDirection.FirstToSecond) {
      currency = this.secondCurrencyAccount;
      rateCoefficient = this.ffMultiFetchModel.results[currency];
    } else {
      currency = this.secondCurrencyAccount;
      rateCoefficient = this.ffMultiFetchModel.results[currency];
    }

    this.secondAccountCalculation = this.firstAccountCalculation * rateCoefficient;
  }

  // v1 - prototype
  private applyFXRates(exDirection: ExchangeDirection): void {
    if (!this.ffMultiFetchModel) {
      return console.warn('No FX rates in the store.');
    }
    if (exDirection === ExchangeDirection.FirstToSecond) {
      if (this.ffMultiFetchModel.base !== this.currentCurrencyAccount) {
        return console.warn('Wrong currency base - need re-fetch FX rates with new base');
      }
      this.secondAccountCalculation = this.firstAccountCalculation * this.ffMultiFetchModel.results[this.secondCurrencyAccount];
    } else if (exDirection === ExchangeDirection.SecondToFirst) {
      if (this.ffMultiFetchModel.base !== this.secondCurrencyAccount) {
        return console.warn('Wrong currency base - need re-fetch FX rates with new base');
      }
      this.firstAccountCalculation = this.secondAccountCalculation * this.ffMultiFetchModel.results[this.currentCurrencyAccount];
    }
  }
}

export default createContext(new ExchangeStore(ExchangeApiService));
