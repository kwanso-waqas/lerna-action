import React, { FC, useContext, useEffect, useReducer, Reducer } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Box, Button, Grid, InputAdornment, TableContainer, TextField } from '@material-ui/core';
import { Cancel, Search } from '@material-ui/icons';
import {
  Pagination,
  CustomBreadcrumbs,
  ContainerStyles,
  LoadingDialog,
  EmptyView,
} from '@illumidesk/common-ui';

import { AssignmentContext } from '../../context/assignments';
import { AssignmentSubmissionAutograde } from '../../common/types';
import {
  PAGE_SIZE,
  ASSIGNMENT_AUTOGRADING_HEAD,
  TableName,
  ERROR_MESSAGES,
} from '../../common/constants';

import SubHeader from '../../components/subHeader';
import TableComp from '../../components/tableComp';
import ErrorDialog from '../../components/alerts/errorDialog';

import { SyncIcon, BreadcrumbIcon } from '../../assets';

interface Params {
  assignmentId: string;
}

interface State {
  paginatedSubmissions: AssignmentSubmissionAutograde[];
  filteredSubmissions: AssignmentSubmissionAutograde[];
  page: number;
  totalSubmissions: number;
  totalSubmissionPages: number;
  searchTerm: string;
  compErrorMessage: string;
  loadingDialog: boolean;
}

enum ActionType {
  SET_PAGINATED_SUBMISSIONS = 'setPaginatedSubmissions',
  SET_FILTERED_SUBMISSIONS = 'setFilteredSubmissions',
  SET_PAGE = 'setPage',
  SET_TOTAL_SUBMISSIONS = 'setTotalSubmissions',
  SET_TOTAL_SUBMISSION_PAGES = 'setTotalSubmissionPages',
  SET_ERROR_MESSAGE = 'setErrorMessage',
  SET_SEARCH_TERM = 'setSearchTerm',
  SET_LOADING_DIALOG = 'setLoadingDialog',
}

type Action =
  | {
      type: ActionType.SET_PAGINATED_SUBMISSIONS;
      paginatedSubmissions: AssignmentSubmissionAutograde[];
    }
  | {
      type: ActionType.SET_FILTERED_SUBMISSIONS;
      filteredSubmissions: AssignmentSubmissionAutograde[];
    }
  | { type: ActionType.SET_PAGE; page: number }
  | { type: ActionType.SET_TOTAL_SUBMISSIONS; totalSubmissions: number }
  | {
      type: ActionType.SET_TOTAL_SUBMISSION_PAGES;
      totalSubmissionPages: number;
    }
  | { type: ActionType.SET_SEARCH_TERM; searchTerm: string }
  | { type: ActionType.SET_ERROR_MESSAGE; compErrorMessage: string }
  | { type: ActionType.SET_LOADING_DIALOG; loadingDialog: boolean };

/**
 * @Type LocalState
 */
const initialState: State = {
  paginatedSubmissions: [],
  filteredSubmissions: [],
  page: 1,
  totalSubmissions: 0,
  totalSubmissionPages: 0,
  searchTerm: '',
  compErrorMessage: '',
  loadingDialog: false,
};

/**
 * Student Assignments Reducer Function
 * @param state
 * @param action
 * @return state
 */
const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionType.SET_PAGINATED_SUBMISSIONS:
      return {
        ...state,
        paginatedSubmissions: action.paginatedSubmissions,
      };
    case ActionType.SET_FILTERED_SUBMISSIONS:
      return {
        ...state,
        filteredSubmissions: action.filteredSubmissions,
      };
    case ActionType.SET_SEARCH_TERM:
      return {
        ...state,
        searchTerm: action.searchTerm,
      };
    case ActionType.SET_PAGE:
      return {
        ...state,
        page: action.page,
      };
    case ActionType.SET_TOTAL_SUBMISSIONS:
      return {
        ...state,
        totalSubmissions: action.totalSubmissions,
      };
    case ActionType.SET_TOTAL_SUBMISSION_PAGES:
      return {
        ...state,
        totalSubmissionPages: action.totalSubmissionPages,
      };
    case ActionType.SET_ERROR_MESSAGE:
      return {
        ...state,
        compErrorMessage: action.compErrorMessage,
      };
    case ActionType.SET_LOADING_DIALOG:
      return {
        ...state,
        loadingDialog: action.loadingDialog,
      };
    default:
      return state;
  }
};

const AssignmentAutoGrading: FC = (): JSX.Element => {
  const [state, dispatch] = useReducer<Reducer<State, Action>>(reducer, initialState);
  const {
    paginatedSubmissions,
    filteredSubmissions,
    page,
    totalSubmissions,
    totalSubmissionPages,
    searchTerm,
    compErrorMessage,
    loadingDialog,
  } = state;

  const classes = ContainerStyles();
  const history = useHistory();
  const { assignmentId } = useParams<Params>();
  const { assignmentSubmissions, errorMessage, getAssignmentSubmissions, autogradeAssignment } =
    useContext(AssignmentContext);

  useEffect(() => {
    getAssignmentSubmissions(assignmentId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (assignmentSubmissions.length > 0) {
      if (loadingDialog) {
        dispatch({
          type: ActionType.SET_LOADING_DIALOG,
          loadingDialog: !loadingDialog,
        });
        onChangePage(null, 1);
      } else {
        onChangePage(null, page);
      }
      dispatch({
        type: ActionType.SET_TOTAL_SUBMISSIONS,
        totalSubmissions: assignmentSubmissions.length,
      });
      dispatch({
        type: ActionType.SET_TOTAL_SUBMISSION_PAGES,
        totalSubmissionPages: Math.ceil(assignmentSubmissions.length / PAGE_SIZE),
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assignmentSubmissions]);

  const onChangePage = (event: React.ChangeEvent<unknown> | null, value: number) => {
    const startPoint: number = +((value - 1) * PAGE_SIZE);
    const endPoint: number = +startPoint + +PAGE_SIZE;

    if (filteredSubmissions.length > 0) {
      dispatch({
        type: ActionType.SET_PAGINATED_SUBMISSIONS,
        paginatedSubmissions: filteredSubmissions.slice(startPoint, endPoint),
      });
    } else {
      dispatch({
        type: ActionType.SET_PAGINATED_SUBMISSIONS,
        paginatedSubmissions: assignmentSubmissions.slice(startPoint, endPoint),
      });
    }

    dispatch({ type: ActionType.SET_PAGE, page: value });
  };

  const onChangeSearchTerm = (event: React.ChangeEvent<HTMLInputElement>): void => {
    dispatch({ type: ActionType.SET_ERROR_MESSAGE, compErrorMessage: '' });
    const searchTerm = event.target.value;
    if (searchTerm === '') {
      clearSearch();
      return;
    }
    dispatch({ type: ActionType.SET_SEARCH_TERM, searchTerm: searchTerm });
    const forSearch = searchTerm.toUpperCase();

    const paginatedSubmissionAssignments: AssignmentSubmissionAutograde[] =
      assignmentSubmissions.filter((assignment: AssignmentSubmissionAutograde) => {
        const { student } = assignment;
        if (student.toUpperCase().indexOf(forSearch) > -1) return assignment;
        return null;
      });

    if (paginatedSubmissionAssignments.length > 0) {
      dispatch({
        type: ActionType.SET_FILTERED_SUBMISSIONS,
        filteredSubmissions: paginatedSubmissionAssignments,
      });
      const totalPages = Math.ceil(paginatedSubmissionAssignments.length / PAGE_SIZE);
      dispatch({
        type: ActionType.SET_TOTAL_SUBMISSION_PAGES,
        totalSubmissionPages: totalPages,
      });

      if (totalPages > 1) {
        dispatch({
          type: ActionType.SET_PAGINATED_SUBMISSIONS,
          paginatedSubmissions: paginatedSubmissionAssignments.slice(
            (page - 1) * PAGE_SIZE,
            Number((page - 1) * PAGE_SIZE) + Number(PAGE_SIZE),
          ),
        });
      } else {
        dispatch({
          type: ActionType.SET_PAGINATED_SUBMISSIONS,
          paginatedSubmissions: paginatedSubmissionAssignments,
        });
      }

      dispatch({
        type: ActionType.SET_TOTAL_SUBMISSIONS,
        totalSubmissions: paginatedSubmissionAssignments.length,
      });
    } else {
      dispatch({
        type: ActionType.SET_ERROR_MESSAGE,
        compErrorMessage: `Search result against "${searchTerm}" not found`,
      });
    }
  };

  const clearSearch = (): void => {
    dispatch({ type: ActionType.SET_SEARCH_TERM, searchTerm: '' });
    dispatch({
      type: ActionType.SET_FILTERED_SUBMISSIONS,
      filteredSubmissions: [],
    });

    const totalPages = Math.ceil(assignmentSubmissions.length / PAGE_SIZE);

    dispatch({
      type: ActionType.SET_TOTAL_SUBMISSION_PAGES,
      totalSubmissionPages: totalPages,
    });
    dispatch({
      type: ActionType.SET_PAGINATED_SUBMISSIONS,
      paginatedSubmissions: assignmentSubmissions.slice(
        (page - 1) * PAGE_SIZE,
        Number((page - 1) * PAGE_SIZE) + Number(PAGE_SIZE),
      ),
    });
    dispatch({
      type: ActionType.SET_TOTAL_SUBMISSIONS,
      totalSubmissions: assignmentSubmissions.length,
    });
    dispatch({ type: ActionType.SET_ERROR_MESSAGE, compErrorMessage: '' });
  };

  const refreshSubmissionAssignmentsList = (): void => {
    dispatch({ type: ActionType.SET_FILTERED_SUBMISSIONS, filteredSubmissions: [] });
    dispatch({ type: ActionType.SET_PAGINATED_SUBMISSIONS, paginatedSubmissions: [] });
    dispatch({ type: ActionType.SET_SEARCH_TERM, searchTerm: '' });
    dispatch({ type: ActionType.SET_ERROR_MESSAGE, compErrorMessage: '' });
    dispatch({
      type: ActionType.SET_LOADING_DIALOG,
      loadingDialog: !loadingDialog,
    });
    getAssignmentSubmissions(assignmentId);
  };

  const autogradeAssignmentLocal = (assignmentId: string, studentId: string) => {
    dispatch({ type: ActionType.SET_LOADING_DIALOG, loadingDialog: !loadingDialog });
    autogradeAssignment(assignmentId, studentId);
    refreshSubmissionAssignmentsList();
  };

  /**
   * All JSX related variables and view
   */
  const tableView = () => (
    <>
      <div className={classes.innerSection}>
        <Box pt={1.75} pb={1.75} pl={2} pr={2}>
          <Grid
            container
            direction="row"
            justifyContent="flex-start"
            alignItems="center"
            data-cy="studentAssignmentTableHeader"
          >
            <Grid item xs={12} sm={5}>
              <TextField
                id="outlined-start-adornment"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                  endAdornment:
                    searchTerm.length > 0 ? (
                      <InputAdornment
                        position="end"
                        className={classes.cursorPointer}
                        onClick={clearSearch}
                        data-cy="autoGradeAssignmentSubmissionTableHeaderSearchClear"
                      >
                        <Cancel fontSize="small" />
                      </InputAdornment>
                    ) : (
                      ''
                    ),
                }}
                value={searchTerm}
                onChange={onChangeSearchTerm}
                placeholder="Search"
                variant="outlined"
                data-cy="autoGradeAssignmentSubmissionTableHeaderSearch"
              />
            </Grid>
            <Grid item xs={12} sm={7}>
              <Box mt={{ xs: 2.4, sm: 0 }}>
                <Grid container justifyContent="flex-end" alignItems="center">
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={refreshSubmissionAssignmentsList}
                    data-cy="autoGradeAssignmentSubmissionTableHeaderSync"
                  >
                    <img alt="sync icon" src={SyncIcon} /> <span className="btnName"> Sync </span>
                  </Button>
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Box>

        <TableContainer
          style={{
            minHeight:
              assignmentSubmissions.length > 6 || filteredSubmissions.length > 6
                ? 428
                : 'fit-content',
          }}
          data-cy="studentAssignmentTableData"
        >
          {compErrorMessage ? (
            <EmptyView title="Not Found!" message={compErrorMessage} height="55vh" />
          ) : (
            <TableComp
              headings={ASSIGNMENT_AUTOGRADING_HEAD}
              type={TableName.ASSIGNMENT_SUBMISSIONS}
              apiData={paginatedSubmissions}
              updateAction={autogradeAssignmentLocal}
            />
          )}
        </TableContainer>
      </div>
      {assignmentSubmissions.length > PAGE_SIZE &&
      (searchTerm.length === 0 || filteredSubmissions.length > PAGE_SIZE) &&
      (filteredSubmissions.length > PAGE_SIZE || compErrorMessage.length === 0) ? (
        <Pagination
          page={page}
          onChangePage={onChangePage}
          totalPages={totalSubmissionPages}
          totalRecords={totalSubmissions}
          PAGE_SIZE={PAGE_SIZE}
          isMobilePaginator={false}
        />
      ) : (
        ''
      )}
    </>
  );

  return (
    <>
      <SubHeader title="Manage Assignments" openInstruction={true} emptyData={false} />

      <Box className={classes.mainSection}>
        <CustomBreadcrumbs
          separator={BreadcrumbIcon}
          bCrumbsList={[
            {
              title: 'Manage Assignments',
              redirectAction: () => history.push('/manage-assignments'),
            },
            { title: assignmentId },
          ]}
          charLimitForLongString={20}
        />

        {assignmentSubmissions && !ERROR_MESSAGES.includes(errorMessage || '') ? (
          tableView()
        ) : (
          <EmptyView
            title="No Submission Found!"
            message="There is no submission against this assignment."
            height="67vh"
          />
        )}
      </Box>

      <ErrorDialog />
      <LoadingDialog loadingModal={loadingDialog} />
    </>
  );
};

export default AssignmentAutoGrading;
