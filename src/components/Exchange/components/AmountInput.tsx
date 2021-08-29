import { Grid, Input, InputLabel, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { CurrencyAccount } from '../../../common/constants';
import Localization from '../../../common/services/Localization';
import ValidationService from '../../../common/services/ValidationService';
import { SRStyles } from '../../../common/utils/SRStyles';
import BalanceStore from '../../../stores/BalanceStore';
import ExchangeStore from '../../../stores/ExchangeStore';
import AccountSwitcher from './AccountSwitcher';

interface AmountInputProps {
  balance: number | undefined;
  currency: CurrencyAccount;
  value: number;
  onChange: (event: number) => void;
  onAccountChange: (name: string) => void;
  isRecipient: boolean;
  isExceedBalanceVisible: boolean;
  restrictedAccountList: string[];
  onRestrictedItemClick: () => void;
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
  exceedsBalanceContainer: {
    textAlign: 'right'
  },
  exceedsBalance: {
    color: SRStyles.color.primaryRed,
    userSelect: 'none'
  },
  balanceLabel: {
    userSelect: 'none'
  }
});

const AmountInput: React.FC<AmountInputProps> = observer(props => {
  if (props.balance === undefined) {
    return null;
  }
  const classes = useStyles();
  const balanceStore = useContext(BalanceStore);
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
  }, [sign]);

  useEffect(() => {
    if (props.value === 0) {
      setValue('');
      return;
    }
    const newValue = String(props.value);
    const newSign = props.isRecipient ? Sign.Plus : Sign.Minus;
    const oldSignIndex = newValue.indexOf(props.isRecipient ? Sign.Minus : Sign.Plus);

    setSign(newSign);
    if (newValue === '') {
      return;
    }
    setValue(newSign + newValue.slice(oldSignIndex + 1));
  }, [props.isRecipient, props.value]);

  const onAccountChange = useCallback((value: string) => {
    props.onAccountChange(value);
  }, []);

  return (
    <Paper className={clsx(classes.participantRoot, props.classes?.root)}>
      <Grid container direction={'row'} justifyContent={'space-between'}>
        <Grid container direction={'column'} item xs={4}>
          <AccountSwitcher
            account={props.currency}
            list={balanceStore.getCurrencyList()}
            restrictedList={props.restrictedAccountList}
            onRestrictedItemClick={props.onRestrictedItemClick}
            onChange={onAccountChange}
          />
        </Grid>
        <Grid container item xs={8} justifyContent={'flex-end'}>
          <Input
            className={classes.inputField}
            type="string"
            placeholder={'0'}
            onChange={event => onChange(event.target.value)}
            onBlur={onBlur}
            value={value}
            disableUnderline={true}
          />
        </Grid>
      </Grid>
      <Grid container direction={'row'} justifyContent={'space-between'}>
        <Grid item xs>
          <span className={classes.balanceLabel}>
            {Localization.getString('AmountInput.BalanceLabel')} {props.balance.toFixed(2)}
          </span>
        </Grid>
        <Grid className={classes.exceedsBalanceContainer} item xs>
          {props.isExceedBalanceVisible && (
            <span className={classes.exceedsBalance}>
              {Localization.getString('AmountInput.ExceedBalance')}
            </span>
          )}
        </Grid>
      </Grid>
    </Paper>
  );
});

export default AmountInput;
