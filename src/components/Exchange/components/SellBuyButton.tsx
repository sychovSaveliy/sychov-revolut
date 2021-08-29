import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { CurrencyAccount } from '../../../common/constants';
import { ExchangeDirection } from '../index';

interface SellBuyButtonProps {
  currentAccount: CurrencyAccount;
  secondAccount: CurrencyAccount;
  exDirection: ExchangeDirection;
  disabled?: boolean;
}

const useStyles = makeStyles({
  sellActionButton: {
    textTransform: 'initial'
  }
});

const SellBuyButton: React.FC<SellBuyButtonProps> = props => {
  const classes = useStyles();

  let buttonTitleFirstPart = 'Sell';
  let buttonTitleSecondPart = 'for';

  if (props.exDirection === ExchangeDirection.SecondToFirst) {
    buttonTitleFirstPart = 'Buy';
    buttonTitleSecondPart = 'with';
  }

  return (
    <Button
      className={classes.sellActionButton}
      size="small"
      variant="contained"
      color="primary"
      disabled={props.disabled}
    >
      {buttonTitleFirstPart} {props.currentAccount} {buttonTitleSecondPart} {props.secondAccount}
    </Button>
  );
};

export default SellBuyButton;
