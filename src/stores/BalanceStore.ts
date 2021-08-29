import { action, makeAutoObservable, observable } from 'mobx';
import { createContext } from 'react';
import { CurrencyAccount } from '../common/constants';

export interface BalanceStoreState {
  balance: Map<CurrencyAccount, number>;
}

export interface CalculationsPayload {
  currency: CurrencyAccount;
  amount: number;
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

  getCurrencies(): [CurrencyAccount, number][] {
    return Array.from(this.balance.entries());
  }

  getCurrencyList(): CurrencyAccount[] {
    return Array.from(this.balance.keys());
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

  @action calculateAmount(currency: CurrencyAccount, amount: number): void {
    if (!this.balance.has(currency)) {
      return console.warn(`No currency - ${currency}`);
    }
    const newAmount = this.balance.get(currency)! + amount;
    if (newAmount < 0) {
      return console.warn(`Final amount for currency - ${currency} - less than 0`);
    }

    this.balance.set(currency, newAmount);
  }

  getBalance(currency: CurrencyAccount): number {
    return this.balance.get(currency) || 0;
  }

  @action applyCalculations(firstPayload: CalculationsPayload, secondPayload: CalculationsPayload, coefficient: 1 | -1) {
    // API Request - Balance changing emulation
    this.calculateAmount(firstPayload.currency, firstPayload.amount * -coefficient);
    this.calculateAmount(secondPayload.currency, secondPayload.amount * coefficient);
  }
}

export default createContext(new BalanceStore());
