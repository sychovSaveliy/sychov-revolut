import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { SRStyles } from '../../../common/utils/SRStyles';
import { ExchangeDirection } from '../enums';
import { useCurrentAccount } from '../hooks/ExchangeHooks';

interface SellBuyTitleProps {
  exDirection: ExchangeDirection;
}

const useStyles = makeStyles({
  root: {
    fontSize: SRStyles.fontSize.size24,
    fontWeight: SRStyles.fontWeight.bold
  }
});

const SellBuyTitle: React.FC<SellBuyTitleProps> = (props) => {
  const classes = useStyles();
  const currentAccount = useCurrentAccount();
  const title = props.exDirection === ExchangeDirection.FirstToSecond ? 'Sell' : 'Buy';
  return (
    <Grid className={classes.root} item xs={12}>
      {title} {currentAccount}
    </Grid>
  );
};

export default SellBuyTitle;
