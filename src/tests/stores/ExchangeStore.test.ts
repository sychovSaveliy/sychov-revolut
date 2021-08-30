/* eslint-disable jest/no-done-callback */
import { CurrencyAccount } from '../../common/constants';
import ExchangeApiService from '../../common/services/ExchangeApiService';
import { FFMultiFetchModel } from '../../common/typings/ExchangeApiTypes';
import { ExchangeStore } from '../../stores/ExchangeStore';

describe('ExchangeStore', () => {
  const store = new ExchangeStore(ExchangeApiService);
  const mockFFResponse: FFMultiFetchModel = {
    base: CurrencyAccount.USD,
    ms: 4,
    updated: '',
    results: {
      USD: 1,
      EUR: 0.86,
      GBP: 0.67
    }
  };

  jest.mock('../../common/services/ExchangeApiService');

  afterEach(() => {
    store.resetStore();
  });

  it('should set Current Account and Second Account', () => {
    const account = CurrencyAccount.GBP;
    const account2 = CurrencyAccount.USD;

    expect(store.currentCurrencyAccount).toBe(CurrencyAccount.USD);
    expect(store.secondCurrencyAccount).toBe(CurrencyAccount.EUR);

    store.setCurrentAccount(account);
    store.setSecondAccount(account2);

    expect(store.currentCurrencyAccount).toBe(CurrencyAccount.GBP);
    expect(store.secondCurrencyAccount).toBe(CurrencyAccount.USD);
  });

  it('should load FF rates and set to ffMultiFetchModel', done => {
    jest
      .spyOn(ExchangeApiService, 'fetchMulti')
      .mockImplementation((base: CurrencyAccount) => {
        return Promise.resolve(mockFFResponse);
      });

    store.loadFFRates().then(() => {
      expect(ExchangeApiService.fetchMulti).toBeCalledWith(CurrencyAccount.USD);
      expect(store.ffMultiFetchModel?.base).toBe(CurrencyAccount.USD);
      expect(store.ffMultiFetchModel?.results).toEqual(mockFFResponse.results);
      done();
    });
  });

  describe('updateCalculations', () => {
    it('should apply FX rates to second account', () => {
      store.ffMultiFetchModel = mockFFResponse;
      const value = 100;
      const coefficient = store.ffMultiFetchModel.results[store.secondCurrencyAccount];

      store.updateCalculations(CurrencyAccount.USD, value);

      expect(store.firstAccountCalculation).toBe(value);
      expect(store.secondAccountCalculation).toBe(value * coefficient);
    });

    it('should apply FX rates to first account', () => {
      store.ffMultiFetchModel = mockFFResponse;
      const value = 100;
      const coefficient = 1 / store.ffMultiFetchModel.results[store.secondCurrencyAccount];

      store.updateCalculations(CurrencyAccount.EUR, value);

      expect(store.firstAccountCalculation).toBe(value * coefficient);
      expect(store.secondAccountCalculation).toBe(value);
    });

    it('should reset calculations if value is 0', () => {
      store.firstAccountCalculation = 200;

      store.updateCalculations(CurrencyAccount.EUR, 0);

      expect(store.firstAccountCalculation).toBe(0);
      expect(store.secondAccountCalculation).toBe(0);
    });
  });
});
