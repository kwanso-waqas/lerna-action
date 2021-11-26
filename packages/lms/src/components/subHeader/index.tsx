import { FC, MouseEventHandler } from 'react';
import { Grid, Typography, Button, useMediaQuery } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import clsx from 'clsx';

import { useStyles } from './styles';
import InstructionAlert from '../alerts/instruction';

interface SubHeaderPropType {
  title: string;
  openInstruction?: boolean;
  btnAction?: MouseEventHandler;
  btnText?: string;
  emptyData: boolean;
}

const SubHeader: FC<SubHeaderPropType> = ({
  title,
  openInstruction,
  btnAction,
  btnText,
  emptyData,
}): JSX.Element => {
  const classes = useStyles();
  const matches = useMediaQuery('(max-width:600px)');

  return (
    <>
      <Grid
        container
        alignItems="center"
        className={clsx(classes.pageTitleContainer, {
          [classes.pageTitleContainerOnEmpty]: !btnText || emptyData,
        })}
      >
        <Grid item xs={12} sm={!btnText || emptyData ? 12 : 6}>
          <Typography variant="h1" color="textPrimary" data-cy="pageTitle">
            {title}
            {openInstruction ? <InstructionAlert /> : ''}
          </Typography>
        </Grid>
        {btnText && !emptyData ? (
          <Grid container item xs={12} sm={6} className={classes.textRight}>
            <Button
              size={matches ? 'small' : 'medium'}
              variant="outlined"
              color="primary"
              onClick={btnAction}
              data-cy="addNewRecordBtn"
            >
              <Add /> <span className="btnText"> {btnText} </span>
            </Button>
          </Grid>
        ) : (
          ''
        )}
      </Grid>
    </>
  );
};

export default SubHeader;
