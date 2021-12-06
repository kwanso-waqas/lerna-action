import React, { FC } from 'react';
import {
  Box,
  Chip,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Typography,
} from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { ModalStyles } from '@illumidesk/common-ui';
import clsx from 'clsx';

import CourseSelector from './courseSelector';
import PendingInvite from './pendingInvites/index';
import useStyles from './style';

interface DialogTitleProps {
  title: string;
  subTitle: string;
  onClose: () => void;
}

interface InviteModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subTitle: string;
  btnAction: () => void;
  courseName?: string;
}

const CustomDialogTitle: FC<DialogTitleProps> = ({ title, onClose, subTitle }): JSX.Element => {
  return (
    <DialogTitle>
      <Grid container justifyContent="flex-start" alignItems="center">
        <Grid item sm={10} xs={7}>
          <Typography variant="h6">{title}</Typography>
        </Grid>
        <Grid item sm={2} xs={5} container justifyContent="flex-end">
          <IconButton size="small" aria-label="close" onClick={onClose}>
            <Close />
          </IconButton>
        </Grid>
      </Grid>
      <Typography variant="body2" component="p">
        {subTitle}
      </Typography>
    </DialogTitle>
  );
};

const InviteModal: FC<InviteModalProps> = ({
  open,
  onClose,
  title,
  subTitle,
  btnAction,
  courseName,
}): JSX.Element => {
  const classes = useStyles();
  const modal = ModalStyles();

  return (
    <>
      <Dialog open={open} className={classes.inviteStudentDialog} scroll="body">
        <Box className={modal.gcDialog} style={{ paddingBottom: 0 }}>
          <CustomDialogTitle title={title} onClose={onClose} subTitle={subTitle} />
        </Box>
        <DialogContent>
          <CourseSelector />
          {!courseName && <PendingInvite />}
          {courseName && (
            <Box mx={2}>
              <Grid container direction="row" justifyContent="flex-start" alignItems="center">
                <Grid item>
                  <Box ml={1}>
                    <Typography variant="h6" color="textPrimary">
                      Course:
                    </Typography>
                  </Box>
                </Grid>
                <Grid item>
                  <Box ml={1}>
                    <Chip
                      color="primary"
                      label={courseName}
                      style={{ borderRadius: 5, fontSize: 12, padding: '8px 6px' }}
                    />
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions className={clsx(modal.gcDialogFooter, classes.customFooter)}>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Box mr={2.5} style={{ display: 'inline' }}>
                <Button onClick={onClose}>Cancel</Button>
              </Box>
              <Button variant="contained" color="primary" onClick={btnAction}>
                Send Invite
              </Button>
            </Grid>
          </Grid>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default InviteModal;
