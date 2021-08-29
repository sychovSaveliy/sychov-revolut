import { reaction } from 'mobx';
import { useContext, useEffect, useState } from 'react';
import { CurrencyAccount } from '../../../common/constants';
import ExchangeStore from '../../../stores/ExchangeStore';

export const useCurrentAccount = () => {
  const exchangeStore = useContext(ExchangeStore);
  const [currentAccount, setCurrentAccount] = useState<CurrencyAccount>(exchangeStore.currentCurrencyAccount);

  // useEffect(() => {
  //   setCurrentAccount(exchangeStore.currentCurrencyAccount);
  // }, [
  //   exchangeStore.currentCurrencyAccount
  // ]);

  reaction(() => exchangeStore.currentCurrencyAccount, (updatedCurrentCurrencyAccount) => {
    setCurrentAccount(updatedCurrentCurrencyAccount);
  });

  return currentAccount;
};
