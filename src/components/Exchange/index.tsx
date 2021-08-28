import { Button, Card, CardActions, CardContent, Grid, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import AppConfig from '../../common/configs/AppConfig';
import { CurrencyAccount } from '../../common/constants';
import { SRStyles } from '../../common/utils/SRStyles';
import ExchangeStore from '../../stores/ExchangeStore';
import AmountInput from './components/AmountInput';
import ExchangeDirectionSwitcher from './components/ExchangeDirectionSwitcher';
import RatesRatio from './components/RatesRatio';
import SellBuyTitle from './components/SellBuyTitle';

export interface IParticipants {
  firstAccount: CurrencyAccount;
  secondAccount: CurrencyAccount;
}

export enum ExchangeDirection {
  FirstToSecond,
  SecondToFirst,
}

const useStyles = makeStyles({
  sellActionButton: {
    textTransform: 'initial'
  }
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
    return () => {
    };
  }, []);

  useEffect(() => {
    let participantsOrder = [firstAccount, secondAccount];
    if (exDirection === ExchangeDirection.SecondToFirst) {
      // or participantsOrder.reverse()
      participantsOrder = [secondAccount, firstAccount];
    }

    setParticipants(participantsOrder);
  }, [exDirection]);

  const onChangeDirection = useCallback(() => {
    const newExDirection = exDirection === ExchangeDirection.FirstToSecond
      ? ExchangeDirection.SecondToFirst
      : ExchangeDirection.FirstToSecond;
    setExDirection(newExDirection);
  }, [exDirection]);

  return (
    <Grid container item xs={6}>
      <Card>
        <CardContent>
          <SellBuyTitle
            exDirection={exDirection}
          />
          <RatesRatio
            ffResults={exchangeStore.ffMultiFetchModel?.results}
            secondCurrencyAccount={secondAccount}
          />
          <Grid container direction={'column'} alignItems={'center'}>
            <AmountInput balance={150} currency={firstAccount}/>
            <ExchangeDirectionSwitcher onClick={onChangeDirection} />
            <AmountInput balance={250} currency={secondAccount}/>
          </Grid>
        </CardContent>
        <CardActions>
          <Button className={classes.sellActionButton} size="small" variant="contained" color="primary">
            Sell {firstAccount} for {secondAccount}
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );
});
export default Exchange;
