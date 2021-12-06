import {
  FC,
  useState,
  useContext,
  useEffect,
  ChangeEvent,
  FormEvent,
  MouseEvent,
  MouseEventHandler,
} from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  IconButton,
  Divider,
  Grid,
  InputLabel,
  TextField,
  Typography,
  Box,
  InputAdornment,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { KeyboardDateTimePicker } from '@material-ui/pickers';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import { Close } from '@material-ui/icons';
import { LoadingDialog, BootstrapTooltip, ModalStyles } from '@illumidesk/common-ui';
import moment from 'moment';

import { AssignmentContext } from '../../../context/assignments';
import { Assignment, ErrorProps } from '../../../common/types';

import { InfoIcon, CalendarIcon } from '../../../assets';

interface AssignmentDialogProps {
  assignmentModal: boolean;
  closeAssignmentModal: MouseEventHandler;
  assignmentData: Assignment | null;
  setErrorMessage: (errorMessage: string) => void;
}

const AssignmentDialog: FC<AssignmentDialogProps> = ({
  assignmentModal,
  closeAssignmentModal,
  assignmentData,
  setErrorMessage,
}): JSX.Element => {
  const [assignmentName, setAssignmentName] = useState<string>('');
  const [assignmentNameErr, setAssignmentNameErr] = useState<string>('');
  const [assignmentDate, setAssignmentDate] = useState<string>('');
  const [assignmentDateErr, setAssignmentDateErr] = useState<string>('');
  const [assignmentTimeZone, setAssignmentTimeZone] = useState<string>('');
  const [assignmentTimeZoneErr, setAssignmentTimeZoneErr] = useState<string>('');
  const [loadingDialog, setLoadingDialog] = useState<boolean>(false);
  const [updateBtn, setUpdateBtn] = useState<boolean>(false);

  const { updateOrCreateAssignment, allAssignments } = useContext(AssignmentContext);

  const classes = ModalStyles();

  /**
   * Update state accordingly if we receive assignment data from manage assignments
   * @param
   * @return void
   */
  useEffect(() => {
    if (assignmentData !== null) {
      setAssignmentName(assignmentData.name);
      setAssignmentNameErr('');
      setAssignmentTimeZone(assignmentData.duedate_timezone);
      setAssignmentDateErr('');
      setAssignmentDate(assignmentData.duedate_notimezone);
      setUpdateBtn(!updateBtn);
    } else {
      setAssignmentName('');
      setAssignmentNameErr('');
      setAssignmentTimeZone('');
      setAssignmentDateErr('');
      setAssignmentDate('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assignmentData]);

  /**
   * Check for assignment name if it is valid name or not
   * @param event
   * @return void
   */
  const checkAssignmentName = (event: ChangeEvent<HTMLInputElement>): void => {
    if (updateBtn) setUpdateBtn(!updateBtn);
    setAssignmentName(event.target.value);
    if (event.target.value === '') {
      setAssignmentNameErr('Assignment name cannot be empty');
    } else {
      if (event.target.value.length <= 70) {
        const regexForName = /^[a-z0-9]+$/;

        if (regexForName.test(event.target.value)) {
          setAssignmentNameErr('');
          const assignmentIndex = allAssignments.filter(
            (assignment) => assignment.name === event.target.value,
          );
          if (assignmentIndex.length > 0) {
            setAssignmentNameErr('Provided name for assignment should be unique.');
          }
        } else {
          setAssignmentNameErr(
            'Provided name should not contain spaces, special characters, and uppercase letters',
          );
        }
      } else {
        setAssignmentNameErr('Assignment name cannot be more than 70 characters long');
      }
    }
  };

  const checkAssignmentDate = (date: MaterialUiPickersDate): void => {
    if (updateBtn) setUpdateBtn(!updateBtn);
    const assignmentDate = moment(date).format('yyyy/MM/DD hh:mm A');
    setAssignmentDate(assignmentDate);
    if (moment(date).isAfter(moment())) {
      setAssignmentDateErr('');
    } else {
      setAssignmentDateErr('Assignment submission date should be later then current date/time');
    }
  };

  const checkAssignmentTimeZone = (event: ChangeEvent<HTMLInputElement>): void => {
    if (updateBtn) setUpdateBtn(!updateBtn);
    setAssignmentTimeZone(event.target.value);
    const regexForName = /\+(\d){4}$/g;
    if (regexForName.test(event.target.value)) {
      setAssignmentTimeZoneErr('');
    } else if (event.target.value.length === 0) {
      setAssignmentTimeZoneErr('');
    } else {
      setAssignmentTimeZoneErr('There should only be 4 digits followed by plus sign');
    }
  };

  /**
   * Deals with form submission and related input validations
   * @param event
   * @return void
   */
  const onSubmitForm = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    if (assignmentName.length <= 0) {
      setAssignmentNameErr('Assignment name is necessary for assignment creation');
      return;
    }
    if (assignmentDate.length <= 0) {
      setAssignmentDateErr('Assignment date is necessary for assignment creation');
      return;
    }
    if (assignmentNameErr.length > 0) return;
    if (assignmentDateErr.length > 0) return;
    if (assignmentTimeZoneErr.length > 0) return;

    try {
      setLoadingDialog(true);
      await updateOrCreateAssignment(
        {
          name: assignmentName,
          duedate_notimezone: assignmentDate,
          duedate_timezone: assignmentTimeZone,
        },
        assignmentData !== null,
      );
      setLoadingDialog(false);
      closingAssignmentModal();
    } catch (err: unknown) {
      setLoadingDialog(false);
      setErrorMessage(
        (err as ErrorProps).message || 'Something went wrong. Please try again later!',
      );
    }
  };

  const closingAssignmentModal = () => {
    setAssignmentName('');
    setAssignmentNameErr('');
    setAssignmentTimeZone('');
    setAssignmentDateErr('');
    setAssignmentDate('');
    if (assignmentData !== null && updateBtn) setUpdateBtn(!updateBtn);
    closeAssignmentModal(event as unknown as MouseEvent<HTMLButtonElement>);
  };

  return (
    <Dialog
      onClose={closingAssignmentModal}
      aria-labelledby="assignment-post-dialog"
      open={assignmentModal}
      data-cy="assignmentAddDialog"
    >
      <form onSubmit={onSubmitForm}>
        <div className={classes.gcDialog}>
          {/* Dialog Header */}
          <Grid container direction="row" alignItems="center">
            <Grid item sm={11} xs={10}>
              <DialogTitle disableTypography id="simple-dialog-title">
                <Typography variant="h6" color="textPrimary">
                  {assignmentData !== null ? 'Edit Assignment' : 'Add New Assignment'}
                </Typography>
              </DialogTitle>
            </Grid>
            <Grid container justifyContent="flex-end" item sm={1} xs={2}>
              <IconButton
                aria-label="close"
                className="closeButton"
                onClick={closingAssignmentModal}
              >
                <Close />
              </IconButton>
            </Grid>
          </Grid>

          {/* Dialog Body and Form Body */}
          <div>
            <Divider style={{ marginBottom: 25 }} />
            <Alert
              icon={<img src={InfoIcon} alt="icon" />}
              className={classes.infoText}
              severity="info"
            >
              Please add an assignment name that only lower case characters. Refrain from using
              spaces characters. This name should be the same as the assignment name registered with
              the assignment name in your LMS.
            </Alert>

            <Grid container className={classes.extraMargins}>
              <Grid item md={3} sm={3} xs={12}>
                <InputLabel required={true}>Name</InputLabel>
              </Grid>
              <Grid item md={9} sm={9} xs={12}>
                <BootstrapTooltip title={assignmentName} placement="bottom" charlength={47}>
                  <TextField
                    placeholder="testassignment"
                    value={assignmentName}
                    onChange={checkAssignmentName}
                    variant="outlined"
                    error={assignmentNameErr.length > 0}
                    helperText={assignmentNameErr}
                    disabled={assignmentData !== null}
                    data-cy="assignmentName"
                  />
                </BootstrapTooltip>
              </Grid>
            </Grid>
            <Grid container className={classes.extraMargins}>
              <Grid item md={3} sm={3} xs={12}>
                <InputLabel required={true}>Due Date</InputLabel>
              </Grid>
              <Grid item md={9} sm={9} xs={12}>
                <KeyboardDateTimePicker
                  ampm={true}
                  value={assignmentDate ? assignmentDate : null}
                  onChange={checkAssignmentDate}
                  allowKeyboardControl={true}
                  disablePast={true}
                  helperText={assignmentDateErr}
                  error={assignmentDateErr.length > 0}
                  format="yyyy/MM/DD hh:mm A"
                  inputVariant="outlined"
                  className={classes.inputwithIconButtonWithoutPadding}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton>
                          <img src={CalendarIcon} alt="calendar icon" />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  data-cy="assignmentDate"
                />
              </Grid>
            </Grid>
            <Grid container className={classes.extraMargins}>
              <Grid item md={3} sm={3} xs={12}>
                <InputLabel> Time Zone as UTC </InputLabel>
              </Grid>
              <Grid item md={9} sm={9} xs={12}>
                <TextField
                  variant="outlined"
                  value={assignmentTimeZone}
                  onChange={checkAssignmentTimeZone}
                  error={assignmentTimeZoneErr.length > 0}
                  helperText={assignmentTimeZoneErr}
                  data-cy="assignmentTimeZone"
                />
              </Grid>
            </Grid>
          </div>
        </div>

        {/* Dialog Footer */}
        <Box className={classes.gcDialogFooter}>
          <Button variant="outlined" color="secondary" onClick={closingAssignmentModal}>
            Cancel
          </Button>

          <Box ml={2}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={updateBtn}
              data-cy="assignmentSubmitBtn"
            >
              {assignmentData !== null ? 'Update' : 'Create Assignment'}
            </Button>
          </Box>
        </Box>
      </form>

      <LoadingDialog loadingModal={loadingDialog} />
    </Dialog>
  );
};

export default AssignmentDialog;
