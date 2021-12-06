import {
  FC,
  useEffect,
  useReducer,
  useContext,
  Reducer,
  FormEvent,
  ChangeEvent,
  MouseEvent,
} from 'react';
import {
  Dialog,
  DialogTitle,
  IconButton,
  Button,
  Grid,
  TextField,
  InputLabel,
  Divider,
  Typography,
  Box,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { Close, Info } from '@material-ui/icons';
import { LoadingDialog, ModalStyles } from '@illumidesk/common-ui';

import { StudentContext } from '../../../context/students';
import {
  IStudentDialog,
  IStudentDialogState,
  IStudentDialogAction,
  StudentDialogActions,
  ErrorProps,
} from '../../../common/types';

const initialState: IStudentDialogState = {
  id: '',
  studentIdErr: '',
  first_name: '',
  first_nameErr: '',
  last_name: '',
  last_nameErr: '',
  email: '',
  emailErr: '',
  loadingDialog: false,
  updateBtn: false,
};

/**
 * Reducer for updating student dialog state
 * @param state
 * @param action
 * @return IStudentDialogState
 */
const studentDialogReducer = (
  state: IStudentDialogState,
  action: IStudentDialogAction,
): IStudentDialogState => {
  const { type, payload } = action;
  switch (type) {
    case StudentDialogActions.UPDATE_STUDENT_ID:
      return {
        ...state,
        id: payload as string,
      };
    case StudentDialogActions.SET_STUDENT_ID_ERR:
      return {
        ...state,
        studentIdErr: payload as string,
      };
    case StudentDialogActions.UPDATE_FIRST_NAME:
      return {
        ...state,
        first_name: payload as string,
      };
    case StudentDialogActions.SET_FIRST_NAME_ERR:
      return {
        ...state,
        first_nameErr: payload as string,
      };
    case StudentDialogActions.UPDATE_LAST_NAME:
      return {
        ...state,
        last_name: payload as string,
      };
    case StudentDialogActions.SET_LAST_NAME_ERR:
      return {
        ...state,
        last_nameErr: payload as string,
      };
    case StudentDialogActions.UPDATE_EMAIL:
      return {
        ...state,
        email: payload as string,
      };
    case StudentDialogActions.SET_EMAIL_ERR:
      return {
        ...state,
        emailErr: payload as string,
      };
    case StudentDialogActions.SET_LOADING_DIALOG:
      return {
        ...state,
        loadingDialog: payload as boolean,
      };
    case StudentDialogActions.SET_UPDATE_BTN:
      return {
        ...state,
        updateBtn: payload as boolean,
      };
    default:
      return state;
  }
};

const StudentDialog: FC<IStudentDialog> = ({
  closeStudentModal,
  studentModal,
  studentData,
  setErrorMessage,
}): JSX.Element => {
  /**
   * @Value Dialog State
   */
  const [state, dispatch] = useReducer<Reducer<IStudentDialogState, IStudentDialogAction>>(
    studentDialogReducer,
    initialState,
  );
  const {
    id,
    studentIdErr,
    first_name,
    first_nameErr,
    last_name,
    last_nameErr,
    email,
    emailErr,
    loadingDialog,
    updateBtn,
  } = state;

  /**
   * @Values Design Classes and Student Context
   */
  const { updateOrCreateStudent, allStudents } = useContext(StudentContext);
  const classes = ModalStyles();

  /**
   * Updating local state with provided data if present
   * @Param
   * @return
   */
  useEffect(() => {
    if (studentData) {
      const { id, first_name, last_name, email } = studentData;
      dispatch({ type: StudentDialogActions.UPDATE_STUDENT_ID, payload: id });
      dispatch({
        type: StudentDialogActions.UPDATE_FIRST_NAME,
        payload: first_name || '',
      });
      dispatch({
        type: StudentDialogActions.UPDATE_LAST_NAME,
        payload: last_name || '',
      });
      dispatch({
        type: StudentDialogActions.UPDATE_EMAIL,
        payload: email || '',
      });
      dispatch({ type: StudentDialogActions.SET_UPDATE_BTN, payload: !updateBtn });
    } else if (studentData === null || studentModal === false) {
      dispatch({ type: StudentDialogActions.UPDATE_STUDENT_ID, payload: '' });
      dispatch({ type: StudentDialogActions.UPDATE_FIRST_NAME, payload: '' });
      dispatch({ type: StudentDialogActions.UPDATE_LAST_NAME, payload: '' });
      dispatch({ type: StudentDialogActions.UPDATE_EMAIL, payload: '' });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentData, studentModal]);

  /**
   * Updating student id and checking for fields error
   * @param event
   * @return void
   */
  const updateStudentId = (event: ChangeEvent<HTMLInputElement>): void => {
    if (updateBtn) dispatch({ type: StudentDialogActions.SET_UPDATE_BTN, payload: !updateBtn });
    const { value: studentId } = event.target;
    dispatch({
      type: StudentDialogActions.UPDATE_STUDENT_ID,
      payload: studentId,
    });
    const index = allStudents.filter((student) => student.id === studentId);

    if (studentId === '') {
      dispatch({
        type: StudentDialogActions.SET_STUDENT_ID_ERR,
        payload: 'Student identifier cannot be empty',
      });
    } else {
      if (studentId.length <= 70) {
        dispatch({
          type: StudentDialogActions.SET_STUDENT_ID_ERR,
          payload: '',
        });
        if (index.length > 0) {
          dispatch({
            type: StudentDialogActions.SET_STUDENT_ID_ERR,
            payload: 'You must provide student unique indentifier',
          });
        }
      } else {
        dispatch({
          type: StudentDialogActions.SET_STUDENT_ID_ERR,
          payload: 'Provided ID must not be longer then 70 characters.',
        });
      }
    }
  };

  /**
   * Check for name field
   * @param event
   */
  const updateFirstName = (event: ChangeEvent<HTMLInputElement>): void => {
    if (updateBtn) dispatch({ type: StudentDialogActions.SET_UPDATE_BTN, payload: !updateBtn });
    const { value: firstName } = event.target;
    dispatch({
      type: StudentDialogActions.UPDATE_FIRST_NAME,
      payload: firstName,
    });

    if (firstName.length <= 0)
      dispatch({
        type: StudentDialogActions.SET_FIRST_NAME_ERR,
        payload: "You must provide student's first name.",
      });
    else dispatch({ type: StudentDialogActions.SET_FIRST_NAME_ERR, payload: '' });
  };

  /**
   * Check for name field
   * @param event
   */
  const updateLastName = (event: ChangeEvent<HTMLInputElement>): void => {
    if (updateBtn) dispatch({ type: StudentDialogActions.SET_UPDATE_BTN, payload: !updateBtn });
    const { value: lastName } = event.target;
    dispatch({
      type: StudentDialogActions.UPDATE_LAST_NAME,
      payload: lastName,
    });

    if (lastName.length <= 0)
      dispatch({
        type: StudentDialogActions.SET_LAST_NAME_ERR,
        payload: "You must provide student's last name.",
      });
    else dispatch({ type: StudentDialogActions.SET_LAST_NAME_ERR, payload: '' });
  };

  /**
   * Updating Email value
   * @param event
   */
  const updateStudentEmail = (event: ChangeEvent<HTMLInputElement>): void => {
    if (updateBtn) dispatch({ type: StudentDialogActions.SET_UPDATE_BTN, payload: !updateBtn });
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    const { value: studentEmail } = event.target;
    dispatch({
      type: StudentDialogActions.UPDATE_EMAIL,
      payload: studentEmail,
    });

    if (!emailRegex.test(studentEmail) && studentEmail.length > 0)
      dispatch({
        type: StudentDialogActions.SET_EMAIL_ERR,
        payload: 'Please enter a valid email address',
      });
    else dispatch({ type: StudentDialogActions.SET_EMAIL_ERR, payload: '' });
  };

  /**
   * Submitting student data to api
   * @param event
   * @returns void
   */
  const saveStudentData = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    if (id.length <= 0) {
      dispatch({
        type: StudentDialogActions.SET_STUDENT_ID_ERR,
        payload: 'You must provide student unique indentifier',
      });
      return;
    }
    if (studentIdErr.length > 0) return;
    if (email.length <= 0) {
      dispatch({
        type: StudentDialogActions.SET_EMAIL_ERR,
        payload: 'Please enter email address of student',
      });
      return;
    }
    if (emailErr.length > 0) return;
    if (first_name.length <= 0) {
      dispatch({
        type: StudentDialogActions.SET_FIRST_NAME_ERR,
        payload: "You must provide student's first name.",
      });
      return;
    }
    if (first_nameErr.length > 0) return;
    if (last_name.length <= 0) {
      dispatch({
        type: StudentDialogActions.SET_LAST_NAME_ERR,
        payload: "You must provide student's last name.",
      });
      return;
    }
    if (last_nameErr.length > 0) return;
    if (emailErr.length > 0) return;
    if (email.length <= 0) {
      dispatch({
        type: StudentDialogActions.SET_EMAIL_ERR,
        payload: 'Please enter email address of student',
      });
      return;
    }
    if (emailErr.length > 0) return;

    dispatch({ type: StudentDialogActions.SET_LOADING_DIALOG, payload: true });
    const student = { id, first_name, last_name, email };

    try {
      await updateOrCreateStudent(student, studentData !== null);
      dispatch({
        type: StudentDialogActions.SET_LOADING_DIALOG,
        payload: false,
      });
      closingStudentModal();
    } catch (err: unknown) {
      setErrorMessage((err as ErrorProps).message);
    }
  };

  const closingStudentModal = () => {
    dispatch({ type: StudentDialogActions.UPDATE_STUDENT_ID, payload: '' });
    dispatch({
      type: StudentDialogActions.SET_STUDENT_ID_ERR,
      payload: '',
    });
    dispatch({ type: StudentDialogActions.UPDATE_FIRST_NAME, payload: '' });
    dispatch({
      type: StudentDialogActions.SET_FIRST_NAME_ERR,
      payload: '',
    });
    dispatch({ type: StudentDialogActions.UPDATE_LAST_NAME, payload: '' });
    dispatch({
      type: StudentDialogActions.SET_LAST_NAME_ERR,
      payload: '',
    });
    dispatch({ type: StudentDialogActions.UPDATE_EMAIL, payload: '' });
    dispatch({
      type: StudentDialogActions.SET_EMAIL_ERR,
      payload: '',
    });
    if (!updateBtn && studentData)
      dispatch({ type: StudentDialogActions.SET_UPDATE_BTN, payload: !updateBtn });
    closeStudentModal(event as unknown as MouseEvent<HTMLButtonElement>);
  };

  return (
    <Dialog
      onClose={closingStudentModal}
      aria-labelledby="form-dialog-title"
      open={studentModal}
      data-cy="addNewStudentDialog"
    >
      <form onSubmit={saveStudentData}>
        <div className={classes.gcDialog}>
          <Grid container direction="row" alignItems="center">
            <Grid item sm={11} xs={10}>
              <DialogTitle disableTypography id="simple-dialog-title">
                <Typography variant="h6" color="textPrimary">
                  {studentData ? 'Student Details' : 'Add New Student'}
                </Typography>
              </DialogTitle>
            </Grid>
            <Grid container alignItems="flex-end" item sm={1} xs={2}>
              <IconButton
                aria-label="close"
                className="closeButton"
                onClick={closingStudentModal}
                data-cy="addStudentCloseDialogCrossBtn"
              >
                <Close />
              </IconButton>
            </Grid>
          </Grid>

          <div>
            <Divider />
            <Alert style={{ visibility: 'hidden', height: 0 }} icon={<Info />} severity="info">
              Please add an assignment name that only lower case characters. Refrain from using
              spaces characters. This name should be the same as the assignment name registered with
              the assignment name in your LMS.
            </Alert>
            <Grid container className={classes.extraMargins}>
              <Grid item md={3} sm={3} xs={12}>
                <InputLabel required={true}>Student ID</InputLabel>
              </Grid>
              <Grid item md={9} sm={9} xs={12}>
                <TextField
                  variant="outlined"
                  value={id}
                  onChange={updateStudentId}
                  error={studentIdErr.length > 0}
                  helperText={studentIdErr}
                  disabled={studentData !== null}
                  data-cy="addStudentStudenId"
                />
              </Grid>
            </Grid>
            <Grid container className={classes.extraMargins}>
              <Grid item md={3} sm={3} xs={12}>
                <InputLabel required={true}>First Name</InputLabel>
              </Grid>
              <Grid item md={9} sm={9} xs={12}>
                <TextField
                  variant="outlined"
                  value={first_name}
                  onChange={updateFirstName}
                  error={first_nameErr.length > 0}
                  helperText={first_nameErr}
                  data-cy="addStudentFirstName"
                />
              </Grid>
            </Grid>
            <Grid container className={classes.extraMargins}>
              <Grid item md={3} sm={3} xs={12}>
                <InputLabel required={true}>Last Name</InputLabel>
              </Grid>
              <Grid item md={9} sm={9} xs={12}>
                <TextField
                  variant="outlined"
                  value={last_name}
                  onChange={updateLastName}
                  error={last_nameErr.length > 0}
                  helperText={last_nameErr}
                  data-cy="addStudentLastName"
                />
              </Grid>
            </Grid>
            <Grid container className={classes.extraMargins}>
              <Grid item md={3} sm={3} xs={12}>
                <InputLabel required={true}>Email</InputLabel>
              </Grid>
              <Grid item md={9} sm={9} xs={12}>
                <TextField
                  variant="outlined"
                  value={email}
                  onChange={updateStudentEmail}
                  error={emailErr.length > 0}
                  helperText={emailErr}
                  data-cy="addStudentEmailText"
                />
              </Grid>
            </Grid>
          </div>
        </div>

        <Box className={classes.gcDialogFooter}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={closingStudentModal}
            data-cy="addStudentCancelBtn"
          >
            Cancel
          </Button>
          <Box ml={2}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={updateBtn}
              data-cy="addStudentSubmitBtn"
            >
              {studentData ? 'Update' : 'Add Student'}
            </Button>
          </Box>
        </Box>
      </form>

      <LoadingDialog loadingModal={loadingDialog} />
    </Dialog>
  );
};

export default StudentDialog;
