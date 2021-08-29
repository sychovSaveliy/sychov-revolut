import { makeStyles } from '@material-ui/core/styles';
import { ArrowDownward } from '@material-ui/icons';
import clsx from 'clsx';
import React, { useCallback } from 'react';
import { Grid, IconButton } from '@material-ui/core';

interface ExchangeDirectionSwitcherProps {
  classes?: {
    root?: string;
  },
  onClick?: () => void;
}

const useStyles = makeStyles({
  iconButtonRoot: {
    width: 50,
    transition: 'transform .2s'
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
    <IconButton className={clsx(classes.iconButtonRoot, props.classes?.root)} onClick={onClickHandler}>
      <ArrowDownward />
    </IconButton>
  );
};

export default ExchangeDirectionSwitcher;
