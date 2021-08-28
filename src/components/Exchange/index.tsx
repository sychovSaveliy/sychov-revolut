import { Grid } from '@material-ui/core';
import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect } from 'react';
import { CurrencyAccount } from '../../common/constants';
import ExchangeStore from '../../stores/ExchangeStore';
import RatesRatio from './RatesRatio';

const Exchange: React.FC = observer(() => {
  const exchangeStore = useContext(ExchangeStore);
  useEffect(() => {
    exchangeStore.loadFFRates(CurrencyAccount.GBP);
  }, []);

  const sellBuyTitle: JSX.Element = (
    <Grid item xs={12}>
      Sell {exchangeStore.currentCurrencyAccount}
      Rates - {Object.keys(exchangeStore.ffCurrencyResults)}
    </Grid>
  );

  return (
    <Grid container item xs={6}>
      {sellBuyTitle}
      <RatesRatio />
    </Grid>
  );
});
export default Exchange;
