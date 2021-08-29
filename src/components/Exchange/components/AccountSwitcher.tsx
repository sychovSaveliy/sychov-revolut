import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { FormControl, Grid, MenuItem, Select } from '@material-ui/core';
import { SRStyles } from '../../../common/utils/SRStyles';

interface AccountSwitcherProps {
  label: string;
  list: string[];
  onChange: (value: string) => void;
}

const AccountSwitcher: React.FC<AccountSwitcherProps> = props => {
  const [account, setAccount] = React.useState(props.label);

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const value = event.target.value as string;
    setAccount(value);
    props.onChange(value);
  };
  return (
    <Grid container>
      <FormControl>
        <Select
          labelId="selected-currency-label"
          id="selected-currency"
          value={account}
          onChange={handleChange}
          disableUnderline={true}
        >
          {
            props.list
              .map(account => (<MenuItem key={`index-${account}`} value={account}>{account}</MenuItem>))
          }
        </Select>
      </FormControl>
    </Grid>
  );
};

export default AccountSwitcher;
