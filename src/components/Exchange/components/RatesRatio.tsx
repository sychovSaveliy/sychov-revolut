import { Grid } from '@material-ui/core';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { CurrencyAccount } from '../../../common/constants';
import { FFCurrencyResults } from '../../../common/typings/ExchangeApiTypes';
import { useCurrentAccount } from '../hooks/ExchangeHooks';

interface RatesRatioProps {
  ffResults: FFCurrencyResults | undefined;
  secondCurrencyAccount: CurrencyAccount;
}

const RatesRatio: React.FC<RatesRatioProps> = observer((props) => {
  const currentAccount = useCurrentAccount();

  if (!props.ffResults) {
    return null;
  }

  const sendingAccountTitle: JSX.Element = (
    <span>
      1 {currentAccount}
    </span>
  );
  const receivingAccountTitle: JSX.Element = (
    <span>
      {props.ffResults[props.secondCurrencyAccount]}
      {props.secondCurrencyAccount}
    </span>
  );

  return (
    <Grid item xs={12}>
      {sendingAccountTitle} = {receivingAccountTitle}
    </Grid>
  );
});

export default RatesRatio;
