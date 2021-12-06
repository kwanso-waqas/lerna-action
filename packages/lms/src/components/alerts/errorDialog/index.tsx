import { FC, useState, useEffect, useContext } from 'react';
import { Dialog, Grid, DialogTitle, Typography, IconButton, Divider, Box } from '@material-ui/core';
import { Alert, Color } from '@material-ui/lab';
import { Close } from '@material-ui/icons';
import { ModalStyles } from '@illumidesk/common-ui';

import { AssignmentContext } from '../../../context/assignments';

import { alertStyles } from './styles';

interface IMessage {
  type: string;
  message: string;
}

const ErrorDialog: FC = (): JSX.Element => {
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const classes = ModalStyles();
  const alertClasses = alertStyles();

  const { successMessage, errorMessage } = useContext(AssignmentContext);

  useEffect(() => {
    if (!openDialog) {
      if (errorMessage?.charAt(0) === '[' || successMessage?.charAt(0) === '[') {
        let allStrings: string[] = [];

        if (errorMessage && errorMessage.length > 0)
          allStrings = errorMessage ? errorMessage.split('[') : [];
        else if (successMessage && successMessage.length > 0)
          allStrings = successMessage ? successMessage.split('[') : [];

        const localMessages: IMessage[] = [];

        allStrings.forEach((msgs: string) => {
          if (msgs.length > 0) {
            const furtherString = msgs.split(']');
            const msgType = localMessages.filter((msg: IMessage) => msg.type === furtherString[0]);

            if (furtherString.length > 1)
              if (msgType.length > 0) {
                const index = localMessages.findIndex(
                  (msg: IMessage) => msg.type === furtherString[0],
                );

                if (index > -1)
                  localMessages[index].message =
                    localMessages[index].message.trim() + '\n' + furtherString[1].trim();
              } else {
                localMessages.push({
                  type: furtherString[0],
                  message: furtherString[1].trim(),
                });
              }
          }
        });
        setOpenDialog(true);
        setMessages(localMessages);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [successMessage, errorMessage]);

  const closeModal = () => {
    setMessages([]);
    setOpenDialog(false);
  };

  return (
    <Dialog
      onClose={closeModal}
      aria-labelledby="assignment-post-dialog"
      open={openDialog}
      data-cy="assignmentLogDialog"
    >
      <div className={classes.gcDialog}>
        {/* Dialog Header */}
        <Grid container direction="row" alignItems="center">
          <Grid item sm={11} xs={10}>
            <DialogTitle disableTypography id="simple-dialog-title">
              <Typography variant="h6" color="textPrimary">
                Assignment Action Log
              </Typography>
            </DialogTitle>
          </Grid>
          <Grid container alignItems="flex-end" item sm={1} xs={2}>
            <IconButton
              aria-label="close"
              className="closeButton"
              onClick={closeModal}
              data-cy="assignmentLogDialogCloseBtn"
            >
              <Close />
            </IconButton>
          </Grid>
        </Grid>

        {/* Dialog Body and Form Body */}
        <div>
          <Divider style={{ marginBottom: 25 }} />
          {messages.length > 0
            ? messages.map((msg: IMessage, index: number) => {
                return (
                  <Box my={2} key={index}>
                    <Alert
                      variant="outlined"
                      className={alertClasses.customAlert}
                      severity={msg.type.toLowerCase() as unknown as Color}
                    >
                      {msg.message}
                    </Alert>
                  </Box>
                );
              })
            : ''}
        </div>
      </div>
    </Dialog>
  );
};

export default ErrorDialog;
