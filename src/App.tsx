import { makeStyles } from '@material-ui/core/styles';
import React from 'react';

const useStyles = makeStyles({
  root: {

  }
});

function App () {
  const classes = useStyles();
  return (
        <div className={classes.root}>
            Test
        </div>
  );
}

export default App;
