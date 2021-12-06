import React, { FC } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Grid,
  IconButton,
  Typography,
  DialogTitle,
  TextField,
} from '@material-ui/core';
import { ModalStyles, colors } from '@illumidesk/common-ui';
import { Close } from '@material-ui/icons';
import clsx from 'clsx';

import { DangerIcon } from '../../../assets';
import { useStyles } from '../../../containers/common/style';

interface DialogComponentProps {
  primaryTitle: string;
  secondaryTitle?: string;
  description: string;
  buttonText: string;
  primaryBtnAction: () => void;
  secondaryBtnAction?: () => void;
  onClose: () => void;
  open: boolean;
  type: string;
}

interface DialogTitleProps {
  title: string;
  onClose: () => void;
}

const CustomDialogTitle: FC<DialogTitleProps> = ({ title, onClose }): JSX.Element => {
  return (
    <DialogTitle>
      <Grid container justifyContent="flex-start" alignItems="center">
        <Grid item sm={1} xs={2}>
          <img alt="danger icon" src={DangerIcon} />
        </Grid>
        <Grid item sm={10} xs={8}>
          <Box pl={2}>
            <Typography variant="h5">{title}</Typography>
          </Box>
        </Grid>
        <Grid item sm={1} xs={2} container justifyContent="flex-end">
          <IconButton aria-label="close" onClick={onClose}>
            <Close />
          </IconButton>
        </Grid>
      </Grid>
    </DialogTitle>
  );
};

const DialogComponent: FC<DialogComponentProps> = ({
  primaryTitle,
  secondaryTitle,
  description,
  primaryBtnAction,
  secondaryBtnAction,
  onClose,
  open,
  buttonText,
  type,
}): JSX.Element => {
  const classes = ModalStyles();
  const btnClasses = useStyles();

  return (
    <>
      <Dialog open={open}>
        <Box className={classes.gcDialog}>
          <CustomDialogTitle title={primaryTitle} onClose={onClose} />
          <DialogContent>
            {(type === 'deleteStudent' || type === 'deleteInstructor') && (
              <Grid container justifyContent="flex-start" alignItems="center">
                <Grid item sm={1} xs={2}></Grid>
                <Grid item sm={11} xs={10}>
                  <DialogContentText>{description}</DialogContentText>
                </Grid>
              </Grid>
            )}
            {(type === 'deleteCourse' || type === 'deleteIntegration') && (
              <>
                <DialogContentText>{description}</DialogContentText>
                <Box mb={1.5}>
                  <Box mb={1.5}>
                    <Typography variant="body1">Please type Delete to confirm</Typography>
                  </Box>
                  <TextField variant="outlined" />
                </Box>
                <hr style={{ borderBottom: `0.5px solid ${colors.GREY_BORDER_COLOR}` }} />
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
            <Button
              variant="contained"
              onClick={primaryBtnAction}
              className={btnClasses.tableBtnDelBg}
            >
              {buttonText}
            </Button>
          </DialogActions>
          {(type === 'deleteStudent' || type === 'deleteInstructor') && (
            <Box mt={1.5} className={clsx(classes.gcDialogFooter, btnClasses.gcDialogFooter)}>
              <Grid container alignItems="center">
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1">{secondaryTitle}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Grid container justifyContent="flex-end">
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={secondaryBtnAction}
                      className={clsx(btnClasses.tableBtn, btnClasses.tableBtnDel)}
                    >
                      Remove from Campus
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          )}
        </Box>
      </Dialog>
    </>
  );
};

export default DialogComponent;
