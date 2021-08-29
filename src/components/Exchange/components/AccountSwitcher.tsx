import React from 'react';
import { FormControl, Grid, MenuItem, Select } from '@material-ui/core';

interface AccountSwitcherProps {
  account: string;
  list: string[];
  restrictedList: string[];
  onRestrictedItemClick: () => void;
  onChange: (value: string) => void;
}

const AccountSwitcher: React.FC<AccountSwitcherProps> = props => {
  const [account, setAccount] = React.useState(props.account);

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const value = event.target.value as string;
    if (props.restrictedList.includes(value)) {
      props.onRestrictedItemClick();
      return;
    }
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
          {props.list.map(account => (
            <MenuItem key={`index-${account}`} value={account} >
              {account}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Grid>
  );
};

export default AccountSwitcher;
