import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Grid,
  IconButton,
  TextField,
  Typography,
  InputLabel,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import React, { FC } from 'react';

import { ModalStyles } from '@illumidesk/common-ui';

interface DialogTitleProps {
  title: string;
  onClose: () => void;
}

interface DialogComponentProps {
  title: string;
  description: string;
  btnAction: () => void;
  onClose: () => void;
  btnText: string;
  open: boolean;
}

const DialogTitle: FC<DialogTitleProps> = ({ title, onClose }): JSX.Element => {
  return (
    <Grid container direction="row" alignItems="center">
      <Grid item sm={11} xs={10}>
        <Typography variant="h6" color="textPrimary">
          {title}
        </Typography>
      </Grid>
      <Grid container justify="flex-end" item sm={1} xs={2}>
        <IconButton aria-label="close" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Grid>
    </Grid>
  );
};

const DialogComponent: FC<DialogComponentProps> = ({
  title,
  description,
  btnAction,
  onClose,
  btnText,
  open,
}): JSX.Element => {
  const classes = ModalStyles();

  return (
    <>
      <Dialog open={open}>
        <Box className={classes.gcDialog} p={0}>
          <DialogTitle title={title} onClose={onClose} />
          <DialogContent style={{ padding: 0 }}>
            <DialogContentText>{description}</DialogContentText>
            <Box>
              <Grid container direction="row" className={classes.extraMargins}>
                <Grid item md={4} sm={4} xs={12}>
                  <InputLabel required={true}>Course Title</InputLabel>
                </Grid>
                <Grid item md={8} sm={8} xs={12}>
                  <TextField required variant="outlined" placeholder="illumidesk" />
                </Grid>
              </Grid>
              <Box className={classes.extraMargins}>
                <hr />
              </Box>
              <Grid container direction="row" alignItems="flex-start">
                <Grid item md={4} sm={4} xs={12}>
                  <Box pt={1}>
                    <Typography variant="body1">Course Description</Typography>
                  </Box>
                </Grid>
                <Grid item md={8} sm={8} xs={12}>
                  <TextField
                    required
                    variant="outlined"
                    multiline
                    minRows={3}
                    placeholder="Interactive learning environments - directly from your Learning Management System!"
                  />
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
        </Box>
        <DialogActions className={classes.gcDialogFooter}>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={btnAction}>
            {btnText}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DialogComponent;
