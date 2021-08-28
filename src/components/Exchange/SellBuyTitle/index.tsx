import { Grid } from '@material-ui/core';
import React from 'react';
import { CurrencyAccount } from '../../../common/constants';
import { ExchangeDirection } from '../index';

interface SellBuyTitleProps {
  exDirection: ExchangeDirection;
  currentCurrencyAccount: CurrencyAccount;
}

const SellBuyTitle: React.FC<SellBuyTitleProps> = (props) => {
  const title = props.exDirection === ExchangeDirection.FirstToSecond ? 'Sell' : 'Buy';
  return (
    <Grid item xs={12}>
      {title} {props.currentCurrencyAccount}
    </Grid>
  );
};

export default SellBuyTitle;
