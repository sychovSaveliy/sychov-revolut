import { Button, Card, CardActions, CardContent, Grid, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import AppConfig from '../../common/configs/AppConfig';
import { CurrencyAccount } from '../../common/constants';
import { SRStyles } from '../../common/utils/SRStyles';
import BalanceStore from '../../stores/BalanceStore';
import ExchangeStore from '../../stores/ExchangeStore';
import AmountInput from './components/AmountInput';
import ExchangeDirectionSwitcher from './components/ExchangeDirectionSwitcher';
import RatesRatio from './components/RatesRatio';
import SellBuyButton from './components/SellBuyButton';
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
  exDirectionRotated: {
    transform: 'rotate(180deg)'
  },
  cardActionsRoot: {
    justifyContent: 'center'
  }
});

const Exchange: React.FC = observer(() => {
  // Styles
  const classes = useStyles();
  // Store
  const exchangeStore = useContext(ExchangeStore);
  const balanceStore = useContext(BalanceStore);
  // State
  const [participants, setParticipants] = useState<CurrencyAccount[]>([
    exchangeStore.currentCurrencyAccount,
    exchangeStore.secondCurrencyAccount
  ]);
  // Controllers
  const currentAccountBalance = balanceStore.getBalance(exchangeStore.currentCurrencyAccount);
  const secondAccountBalance = balanceStore.getBalance(exchangeStore.secondCurrencyAccount);
  const exDirectionInit = currentAccountBalance > 0 ? ExchangeDirection.FirstToSecond : ExchangeDirection.SecondToFirst;
  const [exDirection, setExDirection] = useState<ExchangeDirection>(exDirectionInit);
  const [firstAccount, secondAccount] = participants;

  // useEffects
  useEffect(() => {
    exchangeStore.loadFFRates();
    return () => {
      exchangeStore.resetStore();
    };
  }, [exchangeStore.currentCurrencyAccount, exchangeStore.secondCurrencyAccount]);

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

  const exDirectionClasses = exDirection === ExchangeDirection.SecondToFirst
    ? classes.exDirectionRotated
    : undefined;

  const getOnAmountChange = (currency: CurrencyAccount) => (value: number) => {
    console.log(currency, value);
  };

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
            <AmountInput
              balance={currentAccountBalance}
              currency={exchangeStore.currentCurrencyAccount}
              isRecipient={exDirection === ExchangeDirection.SecondToFirst}
              onChange={getOnAmountChange(exchangeStore.currentCurrencyAccount)}
            />
            <ExchangeDirectionSwitcher
              classes={{ root: exDirectionClasses }}
              onClick={onChangeDirection}
            />
            <AmountInput
              balance={secondAccountBalance}
              currency={exchangeStore.secondCurrencyAccount}
              isRecipient={exDirection === ExchangeDirection.FirstToSecond}
              onChange={getOnAmountChange(exchangeStore.secondCurrencyAccount)}
            />
          </Grid>
        </CardContent>
        <CardActions classes={{ root: classes.cardActionsRoot }}>
          <SellBuyButton
            currentAccount={exchangeStore.currentCurrencyAccount}
            secondAccount={exchangeStore.secondCurrencyAccount}
            exDirection={exDirection}
            disabled={true}
          />
        </CardActions>
      </Card>
    </Grid>
  );
});
export default Exchange;
