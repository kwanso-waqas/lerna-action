import { FC, useState } from 'react';
import { Button, Dialog, DialogTitle, IconButton, Grid, Typography, Box } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { BootstrapTooltip, ModalStyles } from '@illumidesk/common-ui';

import infoIcon from '../../../assets/img/info.svg';

const InstructionAlert: FC = (): JSX.Element => {
  const [open, setOpen] = useState<boolean>(false);
  const classes = ModalStyles();

  const handleClose = (): void => setOpen(false);
  const handleOpen = (): void => setOpen(true);

  return (
    <>
      <BootstrapTooltip title="Instruction" placement="right" charlength={0}>
        <Button
          onClick={handleOpen}
          className={classes.infoBtn}
          data-cy="openAssignmentInstructionDialog"
        >
          <img src={infoIcon} alt="info icon" />
        </Button>
      </BootstrapTooltip>
      <Dialog
        onClose={handleClose}
        aria-labelledby="simple-dialog-title"
        open={open}
        data-cy="assignmentInstructionDialog"
      >
        <div className={classes.gcDialog}>
          <Grid container direction="row" alignItems="center">
            <Grid item sm={11} xs={10}>
              <DialogTitle disableTypography id="simple-dialog-title">
                <Typography variant="h6" color="textPrimary">
                  Manage Assignment Instructions
                </Typography>
              </DialogTitle>
            </Grid>
            <Grid container alignItems="flex-end" item sm={1} xs={2}>
              <IconButton
                aria-label="close"
                className="closeButton"
                onClick={handleClose}
                data-cy="closeAssignmentInstructionHeaderBtn"
              >
                <Close />
              </IconButton>
            </Grid>
          </Grid>
          <div className={classes.instructionBody}>
            <ol className={classes.instructions}>
              <li>
                <span>
                  To <b>create</b> an assignment, click the {`"Add New Assignment"`}
                  button.
                </span>
              </li>
              <li>
                <span>
                  To <b>edit assignment files</b>, click on the name of the assignment.
                </span>
              </li>
              <li>
                <span>
                  To <b>edit assignment metadata</b>, click on edit button.
                </span>
              </li>
              <li>
                <span>
                  To <b>generate</b> the student version of an assignment, click on the generate
                  button.
                </span>
              </li>
              <li>
                <span>
                  To <b>preview</b> the student version of an assignment, click on the preview
                  button.
                </span>
              </li>
              <li>
                <span>
                  To <b>collect</b> the assingnments, click on the collect button.
                </span>
              </li>
              <li>
                <span>
                  To <b>autograde</b> submissions, click on the number of collect submissions. You
                  must run the autograder on the submissions before you can manually grade them.
                </span>
              </li>
            </ol>
          </div>
        </div>
        <Box className={classes.gcDialogFooter}>
          <Button
            className={classes.closeBtn}
            onClick={handleClose}
            data-cy="closeAssignmentInstructionFooterBtn"
          >
            Close
          </Button>
        </Box>
      </Dialog>
    </>
  );
};

export default InstructionAlert;
