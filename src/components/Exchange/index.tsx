import { Grid, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useState } from 'react';
import AppConfig from '../../common/configs/AppConfig';
import { CurrencyAccount } from '../../common/constants';
import { SRStyles } from '../../common/utils/SRStyles';
import ExchangeStore from '../../stores/ExchangeStore';
import AmountInput from './AmountInput';
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

const useStyles = makeStyles({
  firstParticipantRoot: {},
  secondParticipantRoot: {}
});

const Exchange: React.FC = observer(() => {
  // Styles
  const classes = useStyles();
  // Store
  const exchangeStore = useContext(ExchangeStore);
  // State
  const [participants, setParticipants] = useState<CurrencyAccount[]>([
    exchangeStore.currentCurrencyAccount,
    exchangeStore.secondCurrencyAccount
  ]);
  const [exDirection, setExDirection] = useState<ExchangeDirection>(ExchangeDirection.FirstToSecond);
  const [firstAccount, secondAccount] = participants;

  useEffect(() => {
    exchangeStore.loadFFRates();
    return () => {};
  }, []);

  useEffect(() => {
    let participantsOrder = [firstAccount, secondAccount];
    if (exDirection === ExchangeDirection.SecondToFirst) {
      // or participantsOrder.reverse()
      participantsOrder = [secondAccount, firstAccount];
    }

    setParticipants(participantsOrder);
  }, [exDirection]);

  return (
    <Grid container item xs={6}>
      first - {firstAccount}
      second - {secondAccount}
      <SellBuyTitle
        exDirection={exDirection}
      />
      <RatesRatio
        ffResults={exchangeStore.ffMultiFetchModel?.results}
        secondCurrencyAccount={secondAccount}
      />
      <Grid container direction={'column'}>
        <AmountInput balance={150} currency={firstAccount} />
        <AmountInput balance={250} currency={secondAccount} />
      </Grid>
    </Grid>
  );
});
export default Exchange;
