import { Grid } from '@material-ui/core';
import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useState } from 'react';
import AppConfig from '../../common/configs/AppConfig';
import { CurrencyAccount } from '../../common/constants';
import ExchangeStore from '../../stores/ExchangeStore';
import RatesRatio from './RatesRatio';
import SellBuyTitle from './SellBuyTitle';

export interface IParticipants {
  firstAccount: CurrencyAccount;
  secondAccount: CurrencyAccount;
}

export enum ExchangeDirection {
  FirstToSecond,
  SecondToFirst,
}

const Exchange: React.FC = observer(() => {
  // Store
  const exchangeStore = useContext(ExchangeStore);
  // State
  const [participants, setParticipants] = useState<IParticipants>();
  const [exDirection, setExDirection] = useState<ExchangeDirection>(ExchangeDirection.FirstToSecond);

  useEffect(() => {
    exchangeStore.loadFFRates();
    setParticipants({
      firstAccount: exchangeStore.currentCurrencyAccount,
      secondAccount: exchangeStore.secondCurrencyAccount
    });

    return () => {};
  }, []);

  return (
    <Grid container item xs={6}>
      <SellBuyTitle
        exDirection={exDirection}
        currentCurrencyAccount={exchangeStore.currentCurrencyAccount}
      />
      <RatesRatio/>
    </Grid>
  );
});
export default Exchange;
