import { Grid } from '@material-ui/core';
import React from 'react';
import { CurrencyAccount } from '../../../common/constants';
import ExchangeApiService from '../../../common/services/ExchangeApiServiceClass';

const RatesRatio: React.FC = () => {
  return (
    <Grid item xs={12}>
      Rates ratio
    </Grid>
  );
};

export default RatesRatio;
