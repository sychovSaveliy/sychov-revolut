import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { TrendingUp } from '@material-ui/icons';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { CurrencyAccount } from '../../../common/constants';
import { FFCurrencyResults } from '../../../common/typings/ExchangeApiTypes';
import { SRStyles } from '../../../common/utils/SRStyles';
import { useCurrentAccount } from '../hooks/ExchangeHooks';

interface RatesRatioProps {
  ffResults: FFCurrencyResults | undefined;
  secondCurrencyAccount: CurrencyAccount;
}

const useStyles = makeStyles({
  root: {
    fontSize: SRStyles.fontSize.size12,
    color: SRStyles.color.primaryBlue,
    fontWeight: SRStyles.fontWeight.semiBold
  },
  ratesNumbers: {
    marginLeft: 5
  }
});

const RatesRatio: React.FC<RatesRatioProps> = observer((props) => {
  const classes = useStyles();
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
      {props.ffResults[props.secondCurrencyAccount]} {props.secondCurrencyAccount}
    </span>
  );

  return (
    <Grid className={classes.root} container item xs={12} alignItems={'center'}>
      <TrendingUp fontSize={'small'}/>
      <span className={classes.ratesNumbers}>{sendingAccountTitle} = {receivingAccountTitle}</span>
    </Grid>
  );
});

export default RatesRatio;
