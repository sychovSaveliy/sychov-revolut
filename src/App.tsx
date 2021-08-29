import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { SRStyles } from './common/utils/SRStyles';
import AccountsMock from './components/AccountsMock';
import Exchange from './components/Exchange';

const useStyles = makeStyles({
  root: {
    backgroundColor: SRStyles.color.grey
  }
});

function App() {
  const classes = useStyles();
  return (
    <Grid className={classes.root} container direction={'row'} spacing={4}>
      <Exchange />
      <AccountsMock />
    </Grid>
  );
}

export default App;
