import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react';
import { Grid } from '@material-ui/core';
import BalanceStore from '../../stores/BalanceStore';

const AccountsMock: React.FC = observer(() => {
  // Store
  const balanceStore = useContext(BalanceStore);

  return (
    <Grid container item xs>
      <table cellPadding={25}>
        <tbody>
        {balanceStore.getCurrencies().map(([currency, amount]) => (
          <tr key={`index-${currency}`}>
            <td>{currency}</td>
            <td>{amount}</td>
          </tr>
        ))}
        </tbody>
      </table>
    </Grid>
  );
});

export default AccountsMock;
