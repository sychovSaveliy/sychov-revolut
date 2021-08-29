import { Grid, Input, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import React, { useCallback, useEffect, useState } from 'react';
import { CurrencyAccount } from '../../../common/constants';
import ValidationService from '../../../common/services/ValidationService';
import { SRStyles } from '../../../common/utils/SRStyles';

interface AmountInputProps {
  balance: number | undefined;
  currency: CurrencyAccount;
  onChange: (event: number) => void;
  isRecipient: boolean;
  classes?: {
    root: string;
  };
}

enum Sign {
  Plus = '+',
  Minus = '-'
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
  },
  currencyTitle: {
    fontSize: SRStyles.fontSize.size18,
    fontWeight: SRStyles.fontWeight.bold
  }
});

const AmountInput: React.FC<AmountInputProps> = props => {
  if (props.balance === undefined) {
    return null;
  }
  const classes = useStyles();
  const [value, setValue] = useState<string>('');
  const [sign, setSign] = useState<'+' | '-'>(() => props.isRecipient ? Sign.Plus : Sign.Minus);

  const onChange = useCallback(value => {
    const newValue = value;
    const validationResults = ValidationService.validateAmountInput(newValue);
    if (!validationResults) {
      return console.warn(`String validation - failed. String - ${newValue}`);
    }

    const signIndex = newValue.indexOf(sign);

    if (newValue === sign) {
      setValue('');
    } else if (newValue !== '' && signIndex === -1) {
      setValue(sign + newValue);
    } else {
      setValue(newValue);
    }
    props.onChange(signIndex === -1 ? Number(newValue) : Number(newValue.slice(signIndex + 1)));
  }, [props.onChange, sign]);

  const onBlur = useCallback((event) => {
    let newValue = event.target.value;
    const [beforeDot, afterDot] = newValue.split('.');
    const signIndex = newValue.indexOf(sign);
    if (['0', '00'].includes(afterDot)) {
      newValue = `${beforeDot}.01`;

      setValue(newValue);
      props.onChange(Number(newValue.slice(signIndex + 1)));
    }
  }, []);

  useEffect(() => {
    const newSign = props.isRecipient ? Sign.Plus : Sign.Minus;
    const oldSignIndex = value.indexOf(props.isRecipient ? Sign.Minus : Sign.Plus);

    setSign(newSign);
    if (value === '') {
      return;
    }
    setValue(newSign + value.slice(oldSignIndex + 1));
  }, [props.isRecipient]);

  return (
    <Paper className={clsx(classes.participantRoot, props.classes?.root)}>
      <Grid container direction={'row'}>
        <Grid container direction={'column'} item xs={4}>
          <span className={classes.currencyTitle}>
            {props.currency}
          </span>
          <span>
            Balance: {props.balance}
          </span>
        </Grid>
        <Grid item xs />
        <Grid container item xs={5} justifyContent={'flex-end'}>
          <Input
            className={classes.inputField}
            type="string"
            placeholder={'0'}
            onChange={event => onChange(event.target.value)}
            onBlur={onBlur}
            value={value}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default AmountInput;
