import { CurrencyAccount } from '../../common/constants';
import { BalanceStore, CalculationsPayload } from '../../stores/BalanceStore';

describe('BalanceStore', () => {
  const store = new BalanceStore();

  it('should return entries of balances', () => {
    const entriesList = store.getCurrencies();
    const [firstCurrency] = entriesList[0];
    expect(firstCurrency).toBe(CurrencyAccount.EUR);
  });

  describe('appendCurrency', () => {
    it('should register new currency with amount 250', () => {
      store.test_deleteCurrency(CurrencyAccount.EUR);

      expect(store.getBalance(CurrencyAccount.EUR)).toBe(0);

      store.appendCurrency(CurrencyAccount.EUR, 250);

      expect(store.getBalance(CurrencyAccount.EUR)).toBe(250);
    });

    it('should throw warning if currency already exist', () => {
      store.updateAmount(CurrencyAccount.EUR, 100);
      store.appendCurrency(CurrencyAccount.EUR, 360);

      expect(store.getBalance(CurrencyAccount.EUR)).toBe(100);
    });

    it('should throw warning if amount < 0', () => {
      store.test_deleteCurrency(CurrencyAccount.EUR);
      store.appendCurrency(CurrencyAccount.EUR, -360);

      expect(store.getBalance(CurrencyAccount.EUR)).toBe(0);
    });
  });

  describe('updateAmount', () => {
    it('should update amount for currency', () => {
      store.updateAmount(CurrencyAccount.EUR, 120);

      expect(store.getBalance(CurrencyAccount.EUR)).toBe(120);
    });

    it('should not update amount for currency if amount < 0', () => {
      store.updateAmount(CurrencyAccount.EUR, 120);
      expect(store.getBalance(CurrencyAccount.EUR)).toBe(120);
      store.updateAmount(CurrencyAccount.EUR, -10);
      expect(store.getBalance(CurrencyAccount.EUR)).toBe(120);
    });
  });

  describe('calculateAmount', () => {
    it('should calculate new amount for currency', () => {
      store.updateAmount(CurrencyAccount.EUR, 120);

      store.calculateAmount(CurrencyAccount.EUR, 20);

      expect(store.getBalance(CurrencyAccount.EUR)).toBe(140);
    });

    it('should throw warning if new amount < 0', () => {
      store.updateAmount(CurrencyAccount.EUR, 120);

      store.calculateAmount(CurrencyAccount.EUR, -200);

      expect(store.getBalance(CurrencyAccount.EUR)).toBe(120);
    });

    it('should throw warning if currency does not exist', () => {
      store.test_deleteCurrency(CurrencyAccount.EUR);

      store.calculateAmount(CurrencyAccount.EUR, -200);

      expect(store.getBalance(CurrencyAccount.EUR)).toBe(0);
    });
  });

  describe('getBalance', () => {
    it('should return amount of currency', () => {
      store.updateAmount(CurrencyAccount.EUR, 120);

      expect(store.getBalance(CurrencyAccount.EUR)).toBe(120);
    });

    it('should return 0 if currency does not exist', () => {
      store.test_deleteCurrency(CurrencyAccount.EUR);

      expect(store.getBalance(CurrencyAccount.EUR)).toBe(0);
    });
  });

  describe('applyCalculations', () => {
    it('should apply calculations, coefficient - 1', () => {
      const firstPayload: CalculationsPayload = { currency: CurrencyAccount.EUR, amount: 10 };
      const secondPayload: CalculationsPayload = { currency: CurrencyAccount.USD, amount: 20 };

      store.updateAmount(CurrencyAccount.EUR, 50);
      store.updateAmount(CurrencyAccount.USD, 50);

      store.applyCalculations(firstPayload, secondPayload, 1);

      expect(store.getBalance(CurrencyAccount.EUR)).toBe(40);
      expect(store.getBalance(CurrencyAccount.USD)).toBe(70);
    });

    it('should apply calculations, coefficient - -1', () => {
      const firstPayload: CalculationsPayload = { currency: CurrencyAccount.EUR, amount: 10 };
      const secondPayload: CalculationsPayload = { currency: CurrencyAccount.USD, amount: 20 };

      store.updateAmount(CurrencyAccount.EUR, 50);
      store.updateAmount(CurrencyAccount.USD, 50);

      store.applyCalculations(firstPayload, secondPayload, -1);

      expect(store.getBalance(CurrencyAccount.EUR)).toBe(60);
      expect(store.getBalance(CurrencyAccount.USD)).toBe(30);
    });
  });
});
