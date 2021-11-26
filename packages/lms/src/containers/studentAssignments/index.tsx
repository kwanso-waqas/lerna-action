import { FC, useContext, useEffect, useReducer, Reducer, ChangeEvent } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Grid, TextField, InputAdornment, TableContainer, Box, Button } from '@material-ui/core';
import { Search, Cancel } from '@material-ui/icons';
import {
  Pagination,
  CustomBreadcrumbs,
  ContainerStyles,
  LoadingDialog,
  EmptyView,
} from '@illumidesk/common-ui';

import { StudentContext } from '../../context/students';
import { StudentAssignment, Student } from '../../common/types';
import {
  PAGE_SIZE,
  STUDENT_ASSIGNMENT_HEAD,
  TableName,
  ERROR_MESSAGES,
} from '../../common/constants';

import { SyncIcon, BreadcrumbIcon } from '../../assets';

import SubHeader from '../../components/subHeader';
import StudentDialog from '../../components/alerts/studentDialog';
import TableComp from '../../components/tableComp';

interface Params {
  studentId: string;
}

interface State {
  paginatedAssignments: StudentAssignment[];
  filteredAssignments: StudentAssignment[];
  currentStudent: Student | null;
  page: number;
  totalAssignments: number;
  totalAssignmentPages: number;
  searchTerm: string;
  compErrorMessage: string;
  studentDialog: boolean;
  loadingDialog: boolean;
}

enum ActionType {
  SET_PAGINATED_ASSIGNMENTS = 'setPaginatedAssignments',
  SET_FILTERED_ASSIGNMENTS = 'setFilteredAssignments',
  SET_PAGE = 'setPage',
  SET_TOTAL_ASSIGNMENTS = 'setTotalAssignments',
  SET_TOTAL_ASSIGNMENT_PAGES = 'setTotalAssignmentPages',
  SET_STUDENT_DIALOG = 'setStudentDialog',
  SET_ERROR_MESSAGE = 'setErrorMessage',
  SET_SEARCH_TERM = 'setSearchTerm',
  SET_CURRENT_STUDENT = 'setCurrentStudent',
  SET_LOADING_DIALOG = 'setLoadingDialog',
  CLEAR_STATE = 'clearState',
}

type Action =
  | {
      type: ActionType.SET_PAGINATED_ASSIGNMENTS;
      paginatedAssignments: StudentAssignment[];
    }
  | {
      type: ActionType.SET_FILTERED_ASSIGNMENTS;
      filteredAssignments: StudentAssignment[];
    }
  | { type: ActionType.SET_CURRENT_STUDENT; currentStudent: Student | null }
  | { type: ActionType.SET_PAGE; page: number }
  | { type: ActionType.SET_TOTAL_ASSIGNMENTS; totalAssignments: number }
  | {
      type: ActionType.SET_TOTAL_ASSIGNMENT_PAGES;
      totalAssignmentPages: number;
    }
  | { type: ActionType.SET_SEARCH_TERM; searchTerm: string }
  | { type: ActionType.SET_ERROR_MESSAGE; compErrorMessage: string }
  | { type: ActionType.SET_STUDENT_DIALOG; studentDialog: boolean }
  | { type: ActionType.SET_LOADING_DIALOG; loadingDialog: boolean }
  | { type: ActionType.CLEAR_STATE };

/**
 * @Type LocalState
 */
const initialState: State = {
  paginatedAssignments: [],
  filteredAssignments: [],
  currentStudent: null,
  page: 1,
  totalAssignments: 0,
  totalAssignmentPages: 0,
  searchTerm: '',
  compErrorMessage: '',
  studentDialog: false,
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
    case ActionType.SET_PAGINATED_ASSIGNMENTS:
      return {
        ...state,
        paginatedAssignments: action.paginatedAssignments,
      };
    case ActionType.SET_FILTERED_ASSIGNMENTS:
      return {
        ...state,
        filteredAssignments: action.filteredAssignments,
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
    case ActionType.SET_TOTAL_ASSIGNMENTS:
      return {
        ...state,
        totalAssignments: action.totalAssignments,
      };
    case ActionType.SET_TOTAL_ASSIGNMENT_PAGES:
      return {
        ...state,
        totalAssignmentPages: action.totalAssignmentPages,
      };
    case ActionType.SET_STUDENT_DIALOG:
      return {
        ...state,
        studentDialog: action.studentDialog,
      };
    case ActionType.SET_ERROR_MESSAGE:
      return {
        ...state,
        compErrorMessage: action.compErrorMessage,
      };
    case ActionType.SET_CURRENT_STUDENT:
      return {
        ...state,
        currentStudent: action.currentStudent,
      };
    case ActionType.SET_LOADING_DIALOG:
      return {
        ...state,
        loadingDialog: action.loadingDialog,
      };
    case ActionType.CLEAR_STATE:
      return initialState;
    default:
      return state;
  }
};

const StudentAssignments: FC = (): JSX.Element => {
  /**
   * @var StudentAssignmentsState
   */
  const [state, dispatch] = useReducer<Reducer<State, Action>>(reducer, initialState);
  const {
    paginatedAssignments,
    filteredAssignments,
    totalAssignments,
    totalAssignmentPages,
    page,
    compErrorMessage,
    searchTerm,
    studentDialog,
    loadingDialog,
  } = state;

  const { allStudents, getAllStudents, studentAssignments, getStudentAssignments, errorMessage } =
    useContext(StudentContext);
  const history = useHistory();
  const { studentId } = useParams<Params>();
  const classes = ContainerStyles();

  useEffect(() => {
    if (allStudents.length > 0) {
      const index = allStudents.findIndex((student) => student.id === studentId);

      if (index > -1) {
        dispatch({
          type: ActionType.SET_CURRENT_STUDENT,
          currentStudent: allStudents[index],
        });
        getStudentAssignments(studentId);
      }
    } else {
      getAllStudents();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (allStudents.length > 0) {
      const index = allStudents.findIndex((student) => student.id === studentId);

      if (index > -1) {
        dispatch({
          type: ActionType.SET_CURRENT_STUDENT,
          currentStudent: allStudents[index],
        });
        getStudentAssignments(studentId);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allStudents]);

  useEffect(() => {
    if (studentAssignments.length > 0) {
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
        type: ActionType.SET_TOTAL_ASSIGNMENTS,
        totalAssignments: studentAssignments.length,
      });
      dispatch({
        type: ActionType.SET_TOTAL_ASSIGNMENT_PAGES,
        totalAssignmentPages: Math.ceil(studentAssignments.length / PAGE_SIZE),
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentAssignments]);

  useEffect(() => {
    if (errorMessage && errorMessage.length > 0) {
      if (loadingDialog)
        dispatch({
          type: ActionType.SET_LOADING_DIALOG,
          loadingDialog: !loadingDialog,
        });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errorMessage]);

  const openStudentModal = (): void => {
    dispatch({
      type: ActionType.SET_STUDENT_DIALOG,
      studentDialog: !studentDialog,
    });
  };

  const closeStudentModal = (): void => {
    dispatch({
      type: ActionType.SET_STUDENT_DIALOG,
      studentDialog: !studentDialog,
    });
  };

  const onChangePage = (event: React.ChangeEvent<unknown> | null, value: number) => {
    const startPoint: number = +((value - 1) * PAGE_SIZE);
    const endPoint: number = +startPoint + +PAGE_SIZE;

    if (filteredAssignments.length > 0) {
      dispatch({
        type: ActionType.SET_PAGINATED_ASSIGNMENTS,
        paginatedAssignments: filteredAssignments.slice(startPoint, endPoint),
      });
    } else {
      dispatch({
        type: ActionType.SET_PAGINATED_ASSIGNMENTS,
        paginatedAssignments: studentAssignments.slice(startPoint, endPoint),
      });
    }

    dispatch({ type: ActionType.SET_PAGE, page: value });
  };

  const onChangeSearchTerm = (event: ChangeEvent<HTMLInputElement>): void => {
    dispatch({ type: ActionType.SET_ERROR_MESSAGE, compErrorMessage: '' });
    const searchTerm = event.target.value;
    if (searchTerm === '') {
      clearSearch();
      return;
    }
    dispatch({ type: ActionType.SET_SEARCH_TERM, searchTerm: searchTerm });
    const forSearch = searchTerm.toUpperCase();

    const paginatedStudentAssignments: StudentAssignment[] = studentAssignments.filter(
      (assignment: StudentAssignment) => {
        const { name } = assignment;
        if (name.toUpperCase().indexOf(forSearch) > -1) return assignment;
        return null;
      },
    );

    if (paginatedStudentAssignments.length > 0) {
      dispatch({
        type: ActionType.SET_FILTERED_ASSIGNMENTS,
        filteredAssignments: paginatedStudentAssignments,
      });
      const totalPages = Math.ceil(paginatedStudentAssignments.length / PAGE_SIZE);
      dispatch({
        type: ActionType.SET_TOTAL_ASSIGNMENT_PAGES,
        totalAssignmentPages: totalPages,
      });

      if (totalPages > 1) {
        dispatch({
          type: ActionType.SET_PAGINATED_ASSIGNMENTS,
          paginatedAssignments: paginatedStudentAssignments.slice(
            (page - 1) * PAGE_SIZE,
            Number((page - 1) * PAGE_SIZE) + Number(PAGE_SIZE),
          ),
        });
      } else {
        dispatch({
          type: ActionType.SET_PAGINATED_ASSIGNMENTS,
          paginatedAssignments: paginatedStudentAssignments,
        });
      }

      dispatch({
        type: ActionType.SET_TOTAL_ASSIGNMENTS,
        totalAssignments: paginatedStudentAssignments.length,
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
      type: ActionType.SET_FILTERED_ASSIGNMENTS,
      filteredAssignments: [],
    });

    const totalPages = Math.ceil(studentAssignments.length / PAGE_SIZE);

    dispatch({
      type: ActionType.SET_TOTAL_ASSIGNMENT_PAGES,
      totalAssignmentPages: totalPages,
    });
    dispatch({
      type: ActionType.SET_PAGINATED_ASSIGNMENTS,
      paginatedAssignments: studentAssignments.slice(
        (page - 1) * PAGE_SIZE,
        Number((page - 1) * PAGE_SIZE) + Number(PAGE_SIZE),
      ),
    });
    dispatch({
      type: ActionType.SET_TOTAL_ASSIGNMENTS,
      totalAssignments: studentAssignments.length,
    });
    dispatch({ type: ActionType.SET_ERROR_MESSAGE, compErrorMessage: '' });
  };

  const refreshStudentAssignmentsList = (): void => {
    dispatch({ type: ActionType.SET_FILTERED_ASSIGNMENTS, filteredAssignments: [] });
    dispatch({ type: ActionType.SET_PAGINATED_ASSIGNMENTS, paginatedAssignments: [] });
    dispatch({ type: ActionType.SET_SEARCH_TERM, searchTerm: '' });
    dispatch({ type: ActionType.SET_ERROR_MESSAGE, compErrorMessage: '' });
    dispatch({
      type: ActionType.SET_LOADING_DIALOG,
      loadingDialog: !loadingDialog,
    });
    getStudentAssignments(studentId);
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
                        data-cy="studentAssignmentTableHeaderSearchClear"
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
                data-cy="studentAssignmentTableHeaderSearch"
              />
            </Grid>
            <Grid item xs={12} sm={7}>
              <Box mt={{ xs: 2.4, sm: 0 }}>
                <Grid container justifyContent="flex-end" alignItems="center">
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={refreshStudentAssignmentsList}
                    data-cy="studentAssignmentTableHeaderSync"
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
              studentAssignments.length > 6 || filteredAssignments.length > 6 ? 428 : 'fit-content',
          }}
          data-cy="studentAssignmentTableData"
        >
          {compErrorMessage ? (
            <EmptyView title="Not Found!" message={compErrorMessage} height="55vh" />
          ) : (
            <TableComp
              headings={STUDENT_ASSIGNMENT_HEAD}
              type={TableName.STUDENT_ASSIGNMENTS}
              apiData={paginatedAssignments}
            />
          )}
        </TableContainer>
      </div>
      {totalAssignments > PAGE_SIZE &&
      (searchTerm.length === 0 || filteredAssignments.length > PAGE_SIZE) &&
      (filteredAssignments.length > PAGE_SIZE || compErrorMessage.length === 0) ? (
        <Pagination
          page={page}
          onChangePage={onChangePage}
          totalPages={totalAssignmentPages}
          totalRecords={totalAssignments}
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
      <SubHeader
        title="Manage Students"
        btnText="Add New Student"
        btnAction={openStudentModal}
        emptyData={studentAssignments.length === 0}
      />
      <div className={classes.mainSection}>
        <CustomBreadcrumbs
          separator={BreadcrumbIcon}
          bCrumbsList={[
            { title: 'Manage Students', redirectAction: () => history.push('/manage-students') },
            { title: studentId },
          ]}
          charLimitForLongString={20}
        />

        {studentAssignments && !ERROR_MESSAGES.includes(errorMessage || '') ? (
          tableView()
        ) : (
          <EmptyView
            title="No Assignment Found!"
            message="No assignments have yet been assigned to this student"
            height="67vh"
          />
        )}
      </div>

      <StudentDialog
        studentModal={studentDialog}
        closeStudentModal={closeStudentModal}
        studentData={null}
        setErrorMessage={(errorMessage: string) =>
          dispatch({
            type: ActionType.SET_ERROR_MESSAGE,
            compErrorMessage: errorMessage,
          })
        }
      />
      <LoadingDialog loadingModal={loadingDialog} />
    </>
  );
};

export default StudentAssignments;
