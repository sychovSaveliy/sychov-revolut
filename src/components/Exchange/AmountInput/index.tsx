import { Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import React from 'react';
import { CurrencyAccount } from '../../../common/constants';

interface AmountInputProps {
  balance: number;
  currency: CurrencyAccount;
  classes?: {
    root: string;
  };
}

const useStyles = makeStyles({
  participantRoot: {
    width: '100%',
    padding: 10,
    margin: '10px 0'
  }
});

const AmountInput: React.FC<AmountInputProps> = props => {
  const classes = useStyles();
  return (
    <Paper className={clsx(classes.participantRoot, props.classes?.root)}>
      <span>
        {props.currency}
      </span>
      <div>
        Balance: {props.balance}
      </div>
    </Paper>
  );
};

export default AmountInput;
