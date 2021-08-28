import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { SRStyles } from './common/utils/SRStyles';
import Exchange from './components/Exchange';

const useStyles = makeStyles({
  root: {
    height: '100%',
    backgroundColor: SRStyles.color.grey
  }
});

function App() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Exchange />
    </div>
  );
}

export default App;
