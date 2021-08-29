import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { CurrencyAccount } from '../../../common/constants';
import Localization from '../../../common/services/Localization';
import { ExchangeDirection } from '../enums';

interface SellBuyButtonProps {
  currentAccount: CurrencyAccount;
  secondAccount: CurrencyAccount;
  exDirection: ExchangeDirection;
  disabled?: boolean;
  onClick: () => void;
}

const useStyles = makeStyles({
  sellActionButton: {
    textTransform: 'initial'
  }
});

const SellBuyButton: React.FC<SellBuyButtonProps> = props => {
  const classes = useStyles();

  let buttonTitleFirstPart = Localization.getString('ExchangeButton.LabelFirstPart');
  let buttonTitleSecondPart = Localization.getString('ExchangeButton.LabelSecondPart');

  if (props.exDirection === ExchangeDirection.SecondToFirst) {
    buttonTitleFirstPart = Localization.getString('ExchangeButton.LabelBuyFirstPart');
    buttonTitleSecondPart = Localization.getString('ExchangeButton.LabelBuySecondPart');
  }

  return (
    <Button
      className={classes.sellActionButton}
      size="small"
      variant="contained"
      color="primary"
      disabled={props.disabled}
      onClick={props.onClick}
    >
      {buttonTitleFirstPart} {props.currentAccount} {buttonTitleSecondPart} {props.secondAccount}
    </Button>
  );
};

export default SellBuyButton;
