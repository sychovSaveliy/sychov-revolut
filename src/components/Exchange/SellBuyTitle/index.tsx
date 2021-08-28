import { Grid } from '@material-ui/core';
import React from 'react';
import { useCurrentAccount } from '../hooks/ExchangeHooks';
import { ExchangeDirection } from '../index';

interface SellBuyTitleProps {
  exDirection: ExchangeDirection;
}

const SellBuyTitle: React.FC<SellBuyTitleProps> = (props) => {
  const currentAccount = useCurrentAccount();
  const title = props.exDirection === ExchangeDirection.FirstToSecond ? 'Sell' : 'Buy';
  return (
    <Grid item xs={12}>
      {title} {currentAccount}
    </Grid>
  );
};

export default SellBuyTitle;
