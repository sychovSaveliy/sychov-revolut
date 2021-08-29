import { Card, CardActions, CardContent, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { observer } from 'mobx-react-lite';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { CurrencyAccount } from '../../common/constants';
import BalanceStore, { CalculationsPayload } from '../../stores/BalanceStore';
import ExchangeStore from '../../stores/ExchangeStore';
import AmountInput from './components/AmountInput';
import ExchangeDirectionSwitcher from './components/ExchangeDirectionSwitcher';
import RatesRatio from './components/RatesRatio';
import SellBuyButton from './components/SellBuyButton';
import SellBuyTitle from './components/SellBuyTitle';
import { ExchangeDirection } from './enums';

const useStyles = makeStyles({
  root: {
    width: 400
  },
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
  // Controllers
  const currentAccountBalance = balanceStore.getBalance(exchangeStore.currentCurrencyAccount);
  const secondAccountBalance = balanceStore.getBalance(exchangeStore.secondCurrencyAccount);
  const exDirectionInit = currentAccountBalance > 0 ? ExchangeDirection.FirstToSecond : ExchangeDirection.SecondToFirst;
  const [exDirection, setExDirection] = useState<ExchangeDirection>(exDirectionInit);

  // useEffects
  useEffect(() => {
    exchangeStore.loadFFRates();
    return () => {
      exchangeStore.resetStore();
    };
  }, []);

  const onChangeDirection = useCallback(() => {
    const newExDirection = exDirection === ExchangeDirection.FirstToSecond
      ? ExchangeDirection.SecondToFirst
      : ExchangeDirection.FirstToSecond;
    setExDirection(newExDirection);
  }, [exDirection]);

  const exDirectionClasses = exDirection === ExchangeDirection.SecondToFirst
    ? classes.exDirectionRotated
    : undefined;

  const getOnAmountChange = useCallback((currency: CurrencyAccount) => (value: number) => {
    exchangeStore.updateCalculations(currency, value, exDirection);
  }, [exchangeStore.updateCalculations, exDirection]);

  const getOnAccountChange = (currency: CurrencyAccount, accountName: string) => {
    if (currency === exchangeStore.currentCurrencyAccount && accountName !== exchangeStore.secondCurrencyAccount) {
      const newCurrencyAccount = accountName as CurrencyAccount;
      exchangeStore.setCurrentAccount(newCurrencyAccount);
      exchangeStore.loadFFRates(newCurrencyAccount);

      return;
    }

    if (currency === exchangeStore.secondCurrencyAccount && accountName !== exchangeStore.currentCurrencyAccount) {
      exchangeStore.setSecondAccount(accountName as CurrencyAccount);
    }
  };

  useEffect(() => {
    if (exDirection === ExchangeDirection.FirstToSecond) {
      exchangeStore.updateCalculations(exchangeStore.currentCurrencyAccount, exchangeStore.firstAccountCalculation, exDirection);
    } else {
      exchangeStore.updateCalculations(exchangeStore.secondCurrencyAccount, exchangeStore.secondAccountCalculation, exDirection);
    }
  }, [exchangeStore.ffMultiFetchModel?.results]);

  const isFirstRecipient = exDirection === ExchangeDirection.SecondToFirst;
  const isSecondRecipient = exDirection === ExchangeDirection.FirstToSecond;

  const isFirstExceedBalance = !isFirstRecipient && (currentAccountBalance - exchangeStore.firstAccountCalculation) < 0;
  const isSecondExceedBalance = !isSecondRecipient && (secondAccountBalance - exchangeStore.secondAccountCalculation) < 0;

  const isBuySellButtonDisabled = !(exchangeStore.firstAccountCalculation || exchangeStore.secondAccountCalculation) ||
    isFirstExceedBalance || isSecondExceedBalance;

  const onSellBuyButtonClick = useCallback(() => {
    if (isFirstExceedBalance || isSecondExceedBalance) {
      return console.warn('Balance exceed');
    }
    const firstPayload: CalculationsPayload = {
      currency: exchangeStore.currentCurrencyAccount,
      amount: exchangeStore.firstAccountCalculation
    };
    const secondPayload: CalculationsPayload = {
      currency: exchangeStore.secondCurrencyAccount,
      amount: exchangeStore.secondAccountCalculation
    };
    let coefficient: 1 | -1 = 1;
    if (exDirection === ExchangeDirection.SecondToFirst) {
      coefficient = -1;
    }

    balanceStore.applyCalculations(firstPayload, secondPayload, coefficient);
  }, [exDirection]);

  const onRestrictedItemClick = onChangeDirection;

  return (
    <Grid item xs>
      <Card className={classes.root}>
        <CardContent>
          <SellBuyTitle
            exDirection={exDirection}
          />
          <RatesRatio
            ffResults={exchangeStore.ffMultiFetchModel?.results}
            secondCurrencyAccount={exchangeStore.secondCurrencyAccount}
          />
          <Grid container direction={'column'} alignItems={'center'}>
            <AmountInput
              balance={currentAccountBalance}
              currency={exchangeStore.currentCurrencyAccount}
              value={exchangeStore.firstAccountCalculation}
              isRecipient={isFirstRecipient}
              onChange={getOnAmountChange(exchangeStore.currentCurrencyAccount)}
              isExceedBalanceVisible={isFirstExceedBalance}
              onAccountChange={accountName => getOnAccountChange(exchangeStore.currentCurrencyAccount, accountName)}
              restrictedAccountList={[exchangeStore.secondCurrencyAccount]}
              onRestrictedItemClick={onRestrictedItemClick}
            />
            <ExchangeDirectionSwitcher
              classes={{ root: exDirectionClasses }}
              onClick={onChangeDirection}
            />
            <AmountInput
              balance={secondAccountBalance}
              currency={exchangeStore.secondCurrencyAccount}
              value={exchangeStore.secondAccountCalculation}
              isRecipient={isSecondRecipient}
              onChange={getOnAmountChange(exchangeStore.secondCurrencyAccount)}
              isExceedBalanceVisible={isSecondExceedBalance}
              onAccountChange={accountName => getOnAccountChange(exchangeStore.secondCurrencyAccount, accountName)}
              restrictedAccountList={[exchangeStore.currentCurrencyAccount]}
              onRestrictedItemClick={onRestrictedItemClick}
            />
          </Grid>
        </CardContent>
        <CardActions classes={{ root: classes.cardActionsRoot }}>
          <SellBuyButton
            currentAccount={exchangeStore.currentCurrencyAccount}
            secondAccount={exchangeStore.secondCurrencyAccount}
            exDirection={exDirection}
            disabled={isBuySellButtonDisabled}
            onClick={onSellBuyButtonClick}
          />
        </CardActions>
      </Card>
    </Grid>
  );
});
export default Exchange;
