import { action, makeAutoObservable, observable } from 'mobx';
import { createContext } from 'react';
import { CurrencyAccount } from '../common/constants';

export interface BalanceStoreState {
  balance: Map<CurrencyAccount, number>;
}

class BalanceStore implements BalanceStoreState {
  @observable balance: Map<CurrencyAccount, number> = new Map<CurrencyAccount, number>();
  constructor() {
    makeAutoObservable(this);

    // Mock balances
    this.appendCurrency(CurrencyAccount.EUR, 145);
    this.appendCurrency(CurrencyAccount.USD, 250);
    this.appendCurrency(CurrencyAccount.GBP, 178);
  }

  @action appendCurrency(currency: CurrencyAccount, amount: number = 0): void {
    if (this.balance.has(currency)) {
      return console.warn(`Currency - ${currency} - already exist`);
    }
    if (amount < 0) {
      return console.warn(`Amount for new currency - ${currency} - less than 0`);
    }
    this.balance.set(currency, amount);
  }

  @action updateAmount(currency: CurrencyAccount, newAmount: number): void {
    if (newAmount < 0) {
      return console.warn(`New amount for currency - ${currency} - less than 0`);
    }

    this.balance.set(currency, newAmount);
  }

  getBalance(currency: CurrencyAccount): number {
    return this.balance.get(currency) || 0;
  }
}

export default createContext(new BalanceStore());
