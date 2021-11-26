import { FC, useEffect, useContext, useReducer, Reducer, Fragment } from 'react';
import { useParams, useLocation, useHistory } from 'react-router-dom';
import { Grid, Typography, Button, Divider, Box, useMediaQuery } from '@material-ui/core';
import {
  NotFound,
  CustomBreadcrumbs,
  ContainerStyles,
  CustomAlert,
  LoadingDialog,
} from '@illumidesk/common-ui';
import clsx from 'clsx';

import { SubmissionContext } from '../../context/submissions';
import { CourseContext } from '../../context/courses';
import { AssignmentContext } from '../../context/assignments';
import { CompProps, SubmissionCell } from '../../common/types';

import SubmissionCellComp from '../../components/submissionCell';

import useStyles from './styles';
import {
  BreadcrumbIcon,
  leftArrowIcon,
  leftArrowDisabledIcon,
  rightArrowIcon,
  rightArrowDisabledIcon,
  CheckCircle,
  ErrorIcon,
} from '../../assets';

type Params = {
  assignmentId: string;
  chapterId: string;
  submissionId: string;
};

interface State {
  submissionNo: string;
  cells: SubmissionCell[];
  successBar: boolean;
  errorBar: boolean;
  maxSubmissions: number;
  leftPaginationBtn: boolean;
  rightPaginationBtn: boolean;
  openLoadingModal: boolean;
}

enum ActionType {
  SET_PAGINATION_BTN = 'setPaginationBtn',
  SET_SUBMISSION_NO = 'setSubmissionNo',
  SET_CELLS = 'setCells',
  SET_SUCCESS_BAR = 'setSuccessBar',
  SET_ERROR_BAR = 'setErrorBar',
  SET_MAX_SUBMISSIONS = 'setMaxSubmissions',
  SET_LEFT_PAGINATION_BTN = 'setLeftPaginationBtn',
  SET_RIGHT_PAGINATION_BTN = 'setRightPaginationBtn',
  OPEN_LOADING_MODAL = 'openLoadingModal',
}

type Action =
  | { type: ActionType.SET_CELLS; cells: SubmissionCell[] }
  | { type: ActionType.SET_SUBMISSION_NO; submissionNo: string }
  | { type: ActionType.SET_ERROR_BAR; errorBar: boolean }
  | { type: ActionType.SET_SUCCESS_BAR; successBar: boolean }
  | { type: ActionType.SET_PAGINATION_BTN; paginationBtn: boolean[] }
  | { type: ActionType.SET_MAX_SUBMISSIONS; maxSubmissions: number }
  | { type: ActionType.SET_LEFT_PAGINATION_BTN; leftPaginationBtn: boolean }
  | { type: ActionType.SET_RIGHT_PAGINATION_BTN; rightPaginationBtn: boolean }
  | { type: ActionType.OPEN_LOADING_MODAL; openLoadingModal: boolean };

const initialState: State = {
  submissionNo: '',
  cells: [],
  successBar: false,
  errorBar: false,
  maxSubmissions: 0,
  leftPaginationBtn: false,
  rightPaginationBtn: false,
  openLoadingModal: false,
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionType.SET_CELLS:
      return {
        ...state,
        cells: action.cells,
      };
    case ActionType.SET_SUBMISSION_NO:
      return {
        ...state,
        submissionNo: action.submissionNo,
      };
    case ActionType.SET_SUCCESS_BAR:
      return {
        ...state,
        successBar: action.successBar,
      };
    case ActionType.SET_ERROR_BAR:
      return {
        ...state,
        errorBar: action.errorBar,
      };
    case ActionType.SET_MAX_SUBMISSIONS:
      return {
        ...state,
        maxSubmissions: action.maxSubmissions,
      };
    case ActionType.SET_LEFT_PAGINATION_BTN:
      return {
        ...state,
        leftPaginationBtn: action.leftPaginationBtn,
      };
    case ActionType.SET_RIGHT_PAGINATION_BTN:
      return {
        ...state,
        rightPaginationBtn: action.rightPaginationBtn,
      };
    case ActionType.OPEN_LOADING_MODAL:
      return {
        ...state,
        openLoadingModal: action.openLoadingModal,
      };
    default:
      return state;
  }
};

const ManualGradingAssignment: FC<CompProps> = (): JSX.Element => {
  const [state, dispatch] = useReducer<Reducer<State, Action>>(reducer, initialState);
  const {
    submissionNo,
    successBar,
    errorBar,
    cells,
    maxSubmissions,
    leftPaginationBtn,
    rightPaginationBtn,
    openLoadingModal,
  } = state;

  const classes = useStyles();
  const themeClass = ContainerStyles();
  const params = useParams<Params>();
  const { search } = useLocation();
  const history = useHistory();
  const { allCourses } = useContext(CourseContext);
  const { chapterSubmissions, getChapterSubmissions } = useContext(AssignmentContext);
  const {
    submissionData,
    getSubmissionDetails,
    getSubmissionGrades,
    getSubmissionComments,
    successMessage,
    errorMessage,
  } = useContext(SubmissionContext);
  const matches = useMediaQuery('(max-width:600px)');

  useEffect(() => {
    if (chapterSubmissions.length > 0 && maxSubmissions === 0) {
      const { submissionId } = params;
      dispatch({
        type: ActionType.SET_MAX_SUBMISSIONS,
        maxSubmissions: chapterSubmissions.length,
      });
      updateNavigationBtnState(submissionId);
    } else if (chapterSubmissions.length === 0) {
      const { assignmentId, chapterId } = params;
      getChapterSubmissions(assignmentId, chapterId);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapterSubmissions, submissionData]);

  /**
   * runs on first time used to fetch contents of submission
   */
  useEffect(() => {
    const query = new URLSearchParams(search);
    const { assignmentId, chapterId, submissionId } = params;
    const studentId: string = query.get('id') || '';

    if (allCourses.length > 0 && submissionNo.length > 0) {
      getSubmissionDetails(allCourses[0], assignmentId, chapterId, studentId);
      getSubmissionGrades(submissionId);
      getSubmissionComments(submissionId);
    }

    if ((successMessage.length > 0 || successMessage.length === 0) && successBar) {
      dispatch({ type: ActionType.SET_SUCCESS_BAR, successBar: !successBar });
    }
    if ((errorMessage.length > 0 || errorMessage.length === 0) && errorBar) {
      dispatch({ type: ActionType.SET_ERROR_BAR, errorBar: !errorBar });
    }

    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allCourses, submissionNo]);

  useEffect(() => {
    const { cells } = submissionData;
    if (cells.length > 0) {
      if (openLoadingModal)
        dispatch({
          type: ActionType.OPEN_LOADING_MODAL,
          openLoadingModal: !openLoadingModal,
        });
      dispatch({ type: ActionType.SET_CELLS, cells: cells });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submissionData]);

  useEffect(() => {
    if (successMessage.length > 0) {
      dispatch({ type: ActionType.SET_SUCCESS_BAR, successBar: !successBar });
    }
    if (errorMessage.length > 0) {
      dispatch({ type: ActionType.SET_ERROR_BAR, errorBar: !errorBar });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [successMessage, errorMessage]);

  /**
   * Get Previous submission of assignment
   */
  const getPreviousSubmission = (): void => {
    const nextSubmission = chapterSubmissions[+submissionNo - 2];

    if (nextSubmission) {
      dispatch({
        type: ActionType.OPEN_LOADING_MODAL,
        openLoadingModal: !openLoadingModal,
      });
      const { assignmentId, chapterId } = params;
      const { student, id } = nextSubmission;
      history.push(
        `/manual-grading/${assignmentId}/${chapterId}/${id}?id=${student}&index=${
          +submissionNo - 1
        }`,
      );
      dispatch({
        type: ActionType.SET_SUBMISSION_NO,
        submissionNo:
          +submissionNo - 1 > 9 ? (+submissionNo - 1).toString() : '0' + (+submissionNo - 1),
      });
      updateNavigationBtnState(
        id,
        +submissionNo - 1 > 9 ? (+submissionNo - 1).toString() : '0' + (+submissionNo - 1),
      );
    }
  };

  /**
   * Get Next submission of assignment
   */
  const getNextSubmission = (): void => {
    const nextSubmission = chapterSubmissions[+submissionNo];

    if (nextSubmission) {
      dispatch({
        type: ActionType.OPEN_LOADING_MODAL,
        openLoadingModal: !openLoadingModal,
      });
      const { assignmentId, chapterId } = params;
      const { student, id, index } = nextSubmission;
      history.push(
        `/manual-grading/${assignmentId}/${chapterId}/${id}?id=${student}&index=${+index + 1}`,
      );
      dispatch({
        type: ActionType.SET_SUBMISSION_NO,
        submissionNo:
          +submissionNo + 1 > 9 ? (+submissionNo + 1).toString() : '0' + (+submissionNo + 1),
      });
      updateNavigationBtnState(
        id,
        +submissionNo + 1 > 9 ? (+submissionNo + 1).toString() : '0' + (+submissionNo + 1),
      );
    }
  };

  const updateNavigationBtnState = (submissionId: string, submissionNo?: string) => {
    const submissionIndex = chapterSubmissions.findIndex(
      (submission) => submission.id === submissionId,
    );

    if (submissionIndex > -1)
      dispatch({
        type: ActionType.SET_SUBMISSION_NO,
        submissionNo: submissionNo || '0' + (+submissionIndex + 1),
      });

    if (submissionIndex === 0) {
      dispatch({
        type: ActionType.SET_LEFT_PAGINATION_BTN,
        leftPaginationBtn: !leftPaginationBtn,
      });

      if (rightPaginationBtn)
        dispatch({
          type: ActionType.SET_RIGHT_PAGINATION_BTN,
          rightPaginationBtn: !rightPaginationBtn,
        });
    }
    if (submissionIndex === chapterSubmissions.length - 1) {
      dispatch({
        type: ActionType.SET_RIGHT_PAGINATION_BTN,
        rightPaginationBtn: !rightPaginationBtn,
      });

      if (leftPaginationBtn)
        dispatch({
          type: ActionType.SET_LEFT_PAGINATION_BTN,
          leftPaginationBtn: !leftPaginationBtn,
        });
    }
  };

  return (
    <>
      <Grid container direction="row" className={classes.pageTitleContainer}>
        <Grid item xs={6} sm={4}>
          <Typography variant="h1"> Submission {`#${submissionNo}`} </Typography>
        </Grid>
        <Grid container justifyContent="flex-end" alignItems="center" item xs={6} sm={8}>
          <div className={classes.totalSubmission}>
            No. {submissionNo} of {maxSubmissions < 10 ? `0${maxSubmissions}` : maxSubmissions}
            <span className={classes.toUppercase}> submissions </span>
          </div>
          <div className={classes.topPagination}>
            <Button variant="outlined" onClick={getPreviousSubmission} disabled={leftPaginationBtn}>
              {leftPaginationBtn ? (
                <img src={leftArrowDisabledIcon} alt="left arrow icon" />
              ) : (
                <img src={leftArrowIcon} alt="left arrow icon" />
              )}
            </Button>
            <Button variant="outlined" onClick={getNextSubmission} disabled={rightPaginationBtn}>
              {rightPaginationBtn ? (
                <img src={rightArrowDisabledIcon} alt="right arrow icon" />
              ) : (
                <img src={rightArrowIcon} alt="right arrow icon" />
              )}
            </Button>
          </div>
        </Grid>
      </Grid>

      <div className={clsx(themeClass.mainSection, classes.mainSection)}>
        <CustomBreadcrumbs
          separator={BreadcrumbIcon}
          bCrumbsList={[
            { title: 'Manual Grading', redirectAction: () => history.push('/manual-grading') },
            {
              title: params.assignmentId,
              redirectAction: () => history.push(`/manual-grading/${params.assignmentId}`),
            },
            {
              title: params.chapterId,
              redirectAction: () =>
                history.push(`/manual-grading/${params.assignmentId}/${params.chapterId}`),
            },
            {
              title: `Submission #${submissionNo}`,
            },
          ]}
        />

        {errorMessage && errorMessage === 'Request failed with status code 404' ? (
          <NotFound />
        ) : (
          <div className={clsx(themeClass.innerSection, classes.innerSection)}>
            <Box py={1.75} px={2}>
              <Grid container>
                <Grid item xs={12} className={classes.headings}>
                  <Typography color="textPrimary" variant="h1">
                    Autograded_{params.assignmentId}_{params.chapterId}
                    {submissionNo}
                  </Typography>
                  <Divider style={{ marginTop: `20px` }} />
                  <Typography color="textPrimary" variant="h6">
                    {params.assignmentId} with AutoGrader (nbgrader)
                  </Typography>
                </Grid>
              </Grid>
            </Box>

            {cells.length > 0
              ? cells.map((singleCell: SubmissionCell, index: number) => (
                  <Fragment key={index}>
                    <SubmissionCellComp cellData={singleCell} submissionId={params.submissionId} />
                  </Fragment>
                ))
              : ''}
          </div>
        )}
      </div>

      {!matches || successMessage !== 'Grade has been updated successfully!' ? (
        <>
          <CustomAlert
            alertType={'success'}
            alertIcon={CheckCircle}
            alertMessage={successMessage || ''}
            showAlert={successBar}
            closeAlert={() =>
              dispatch({ type: ActionType.SET_SUCCESS_BAR, successBar: !successBar })
            }
          />

          <CustomAlert
            alertType={'error'}
            alertIcon={ErrorIcon}
            alertMessage={errorMessage || ''}
            showAlert={errorBar}
            closeAlert={() => dispatch({ type: ActionType.SET_ERROR_BAR, errorBar: !errorBar })}
          />
        </>
      ) : (
        <></>
      )}

      <LoadingDialog loadingModal={openLoadingModal} />
    </>
  );
};

export default ManualGradingAssignment;
