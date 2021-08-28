import { Grid, Input, Paper } from '@material-ui/core';
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
  },
  inputField: {
    '& .MuiInput-input': {
      textAlign: 'end',
      '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
        '-webkit-appearance': 'none',
        margin: 0
      }
    }
  }
});

const AmountInput: React.FC<AmountInputProps> = props => {
  const classes = useStyles();
  return (
    <Paper className={clsx(classes.participantRoot, props.classes?.root)}>
      <Grid container direction={'row'}>
        <Grid container direction={'column'} item xs={3}>
          <span>
            {props.currency}
          </span>
          <span>
            Balance: {props.balance}
          </span>
        </Grid>
        <Grid container item xs justifyContent={'flex-end'}>
          <Input className={classes.inputField} type={'number'} placeholder={'0'} />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default AmountInput;
