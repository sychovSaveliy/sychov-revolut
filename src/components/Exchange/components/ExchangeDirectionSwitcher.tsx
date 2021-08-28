import { makeStyles } from '@material-ui/core/styles';
import { ArrowDownward } from '@material-ui/icons';
import React, { useCallback } from 'react';
import { Grid, IconButton } from '@material-ui/core';

interface ExchangeDirectionSwitcherProps {
  onClick?: () => void;
}

const useStyles = makeStyles({
  iconButtonRoot: {
    width: 50
  }
});

const ExchangeDirectionSwitcher: React.FC<ExchangeDirectionSwitcherProps> = props => {
  const classes = useStyles();

  const onClickHandler = useCallback(() => {
    if (props.onClick) {
      props.onClick();
    }
  }, [props.onClick]);

  return (
    <IconButton className={classes.iconButtonRoot} onClick={onClickHandler}>
      <ArrowDownward />
    </IconButton>
  );
};

export default ExchangeDirectionSwitcher;
