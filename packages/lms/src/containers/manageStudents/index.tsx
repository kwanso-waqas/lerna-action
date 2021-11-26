import { FC, ChangeEvent, useEffect, useContext, useReducer, Reducer, MouseEvent } from 'react';
import { Grid, TextField, InputAdornment, Box, TableContainer, Button } from '@material-ui/core';
import { Search, Cancel } from '@material-ui/icons';
import {
  Pagination,
  ContainerStyles,
  CustomAlert,
  LoadingDialog,
  EmptyView,
} from '@illumidesk/common-ui';

import { StudentContext } from '../../context/students';
import { Student } from '../../common/types';
import { STUDENT_TABLE_HEAD, TableName, PAGE_SIZE, ERROR_MESSAGES } from '../../common/constants';

import SubHeader from '../../components/subHeader';
import TableComp from '../../components/tableComp';
import StudentDialog from '../../components/alerts/studentDialog';

import { SyncIcon, CheckCircle, ErrorIcon } from '../../assets';

interface State {
  paginatedStudents: Student[];
  filteredStudents: Student[];
  selectedStudent: Student | null;
  page: number;
  totalStudents: number;
  totalStudentPages: number;
  searchTerm: string;
  compErrorMessage: string;
  studentModal: boolean;
  successBar: boolean;
  errorBar: boolean;
  loadingDialog: boolean;
}

enum ActionType {
  SET_PAGINATED_STUDENTS = 'setPaginatedStudents',
  SET_FILTERED_STUDENTS = 'setFilteredStudents',
  SET_SELECTED_STUDENT = 'setSelectedStudent',

  SET_PAGE = 'setPage',
  SET_TOTAL_STUDENTS = 'setTotalStudents',
  SET_TOTAL_STUDENT_PAGES = 'setTotalStudentPages',

  SET_SEARCH_TERM = 'setSearchTerm',
  SET_ERROR_MESSAGE = 'setErrorMessage',

  OPEN_STUDENT_DIALOG = 'openStudentDialog',
  SET_SUCCESS_BAR = 'setSuccessBar',
  SET_ERROR_BAR = 'setErrorBar',
  SET_LOADING_DIALOG = 'setLoadingDialog',
}

type Action =
  | { type: ActionType.SET_PAGINATED_STUDENTS; paginatedStudents: Student[] }
  | { type: ActionType.SET_FILTERED_STUDENTS; filteredStudents: Student[] }
  | { type: ActionType.SET_SELECTED_STUDENT; selectedStudent: Student | null }
  | { type: ActionType.SET_PAGE; page: number }
  | { type: ActionType.SET_TOTAL_STUDENTS; totalStudents: number }
  | { type: ActionType.SET_TOTAL_STUDENT_PAGES; totalStudentPages: number }
  | { type: ActionType.SET_SEARCH_TERM; searchTerm: string }
  | { type: ActionType.SET_ERROR_MESSAGE; compErrorMessage: string }
  | { type: ActionType.OPEN_STUDENT_DIALOG; studentModal: boolean }
  | { type: ActionType.SET_ERROR_BAR; errorBar: boolean }
  | { type: ActionType.SET_SUCCESS_BAR; successBar: boolean }
  | { type: ActionType.SET_LOADING_DIALOG; loadingDialog: boolean };

const initialStudentState: State = {
  paginatedStudents: [],
  filteredStudents: [],
  selectedStudent: null,
  page: 1,
  totalStudents: 0,
  totalStudentPages: 0,
  searchTerm: '',
  compErrorMessage: '',
  studentModal: false,
  successBar: false,
  errorBar: false,
  loadingDialog: false,
};

/**
 * ManageStudents Reducer Function
 * @param state
 * @param action
 * @returns updatedState
 */
const studentReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionType.SET_PAGINATED_STUDENTS:
      return {
        ...state,
        paginatedStudents: action.paginatedStudents,
      };
    case ActionType.SET_FILTERED_STUDENTS:
      return {
        ...state,
        filteredStudents: action.filteredStudents,
      };
    case ActionType.SET_SELECTED_STUDENT:
      return {
        ...state,
        selectedStudent: action.selectedStudent,
      };

    case ActionType.SET_PAGE:
      return {
        ...state,
        page: action.page,
      };
    case ActionType.SET_TOTAL_STUDENTS:
      return {
        ...state,
        totalStudents: action.totalStudents,
      };
    case ActionType.SET_TOTAL_STUDENT_PAGES:
      return {
        ...state,
        totalStudentPages: action.totalStudentPages,
      };

    case ActionType.SET_SEARCH_TERM:
      return {
        ...state,
        searchTerm: action.searchTerm,
      };
    case ActionType.SET_ERROR_MESSAGE:
      return {
        ...state,
        compErrorMessage: action.compErrorMessage,
      };

    case ActionType.OPEN_STUDENT_DIALOG:
      return {
        ...state,
        studentModal: action.studentModal,
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
    case ActionType.SET_LOADING_DIALOG:
      return {
        ...state,
        loadingDialog: action.loadingDialog,
      };
    default:
      return state;
  }
};

const ManageStudents: FC = (): JSX.Element => {
  /**
   * @var ManageStudentState
   */
  const [state, dispatch] = useReducer<Reducer<State, Action>>(studentReducer, initialStudentState);
  const {
    paginatedStudents,
    filteredStudents,
    selectedStudent,
    page,
    totalStudents,
    totalStudentPages,
    compErrorMessage,
    searchTerm,
    studentModal,
    successBar,
    errorBar,
    loadingDialog,
  } = state;

  const classes = ContainerStyles();
  const { allStudents, getAllStudents, successMessage, errorMessage } = useContext(StudentContext);

  /**
   * Execute only once and fetch students from API
   */
  useEffect(() => {
    getAllStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Get All Students and update local state
   */
  useEffect(() => {
    dispatch({
      type: ActionType.SET_TOTAL_STUDENTS,
      totalStudents: allStudents.length,
    });

    if (allStudents.length > 0) {
      if (loadingDialog) {
        dispatch({
          type: ActionType.SET_LOADING_DIALOG,
          loadingDialog: !loadingDialog,
        });
        onChangePage(null, 1);
      } else {
        onChangePage(null, page);
      }
    }

    if (allStudents.length > 0 && studentModal) {
      onChangePage(null, 1);
    }

    dispatch({
      type: ActionType.SET_TOTAL_STUDENT_PAGES,
      totalStudentPages: Math.ceil(allStudents.length / PAGE_SIZE),
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allStudents]);

  /**
   * Execute to show snackbars after add/update assignment
   */
  useEffect(() => {
    if (successMessage && successMessage.length > 0) {
      if (successMessage?.charAt(0) !== '[')
        dispatch({ type: ActionType.SET_SUCCESS_BAR, successBar: !successBar });
    } else if (errorMessage && errorMessage.length > 0) {
      if (errorMessage?.charAt(0) !== '[')
        dispatch({ type: ActionType.SET_ERROR_BAR, errorBar: !errorBar });
      if (loadingDialog)
        dispatch({ type: ActionType.SET_LOADING_DIALOG, loadingDialog: !loadingDialog });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [successMessage, errorMessage]);

  /**
   * Dealing with page shift and all students data
   * @param event
   * @param value
   * @return void
   */
  const onChangePage = (event: ChangeEvent<unknown> | null, value: number): void => {
    const startPoint: number = +((value - 1) * PAGE_SIZE);
    const endPoint: number = +startPoint + +PAGE_SIZE;

    if (filteredStudents.length > 0) {
      dispatch({
        type: ActionType.SET_PAGINATED_STUDENTS,
        paginatedStudents: filteredStudents.slice(startPoint, endPoint),
      });
    } else {
      dispatch({
        type: ActionType.SET_PAGINATED_STUDENTS,
        paginatedStudents: allStudents.slice(startPoint, endPoint),
      });
    }

    dispatch({ type: ActionType.SET_PAGE, page: value });
  };

  /**
   * @param studentData
   * @return void
   */
  const openStudentDialog = (event: MouseEvent<HTMLButtonElement>, studentData?: Student): void => {
    if (studentData)
      dispatch({
        type: ActionType.SET_SELECTED_STUDENT,
        selectedStudent: studentData,
      });
    else
      dispatch({
        type: ActionType.SET_SELECTED_STUDENT,
        selectedStudent: null,
      });
    dispatch({ type: ActionType.OPEN_STUDENT_DIALOG, studentModal: true });
  };

  /**
   * Searching students on base of their names
   * @param searchTerm
   * @return void
   */
  const onChangeSearchTerm = (event: ChangeEvent<HTMLInputElement>): void => {
    dispatch({ type: ActionType.SET_ERROR_MESSAGE, compErrorMessage: '' });
    const searchTerm = event.target.value;
    if (searchTerm === '') {
      clearSearch();
      return;
    }
    dispatch({ type: ActionType.SET_SEARCH_TERM, searchTerm: searchTerm });
    const forSearch = searchTerm.toUpperCase();

    const paginatedStudentsSearch: Student[] = allStudents.filter((student: Student) => {
      const { first_name, last_name } = student;
      const name = `${first_name} ${last_name}`;

      if (name.toUpperCase().indexOf(forSearch) > -1) return student;
      return null;
    });

    if (paginatedStudentsSearch.length > 0) {
      dispatch({
        type: ActionType.SET_FILTERED_STUDENTS,
        filteredStudents: paginatedStudentsSearch,
      });
      const totalPages = Math.ceil(paginatedStudentsSearch.length / PAGE_SIZE);
      dispatch({
        type: ActionType.SET_TOTAL_STUDENT_PAGES,
        totalStudentPages: totalPages,
      });

      if (totalPages > 1) {
        dispatch({
          type: ActionType.SET_PAGINATED_STUDENTS,
          paginatedStudents: paginatedStudentsSearch,
        });
      } else {
        dispatch({
          type: ActionType.SET_PAGINATED_STUDENTS,
          paginatedStudents: paginatedStudentsSearch,
        });
      }

      dispatch({
        type: ActionType.SET_TOTAL_STUDENTS,
        totalStudents: paginatedStudentsSearch.length,
      });
    } else {
      dispatch({
        type: ActionType.SET_ERROR_MESSAGE,
        compErrorMessage: `Search result against "${searchTerm}" not found`,
      });
    }
  };

  /**
   * Clearing search and maintaining state before search
   * @Param none
   * @Return void
   */
  const clearSearch = (): void => {
    dispatch({ type: ActionType.SET_SEARCH_TERM, searchTerm: '' });
    dispatch({ type: ActionType.SET_FILTERED_STUDENTS, filteredStudents: [] });

    const totalPages = Math.ceil(allStudents.length / PAGE_SIZE);

    dispatch({
      type: ActionType.SET_TOTAL_STUDENT_PAGES,
      totalStudentPages: totalPages,
    });
    dispatch({
      type: ActionType.SET_PAGINATED_STUDENTS,
      paginatedStudents: allStudents.slice(
        (page - 1) * PAGE_SIZE,
        Number((page - 1) * PAGE_SIZE) + Number(PAGE_SIZE),
      ),
    });
    dispatch({
      type: ActionType.SET_TOTAL_STUDENTS,
      totalStudents: allStudents.length,
    });
    dispatch({ type: ActionType.SET_ERROR_MESSAGE, compErrorMessage: '' });
  };

  const refreshStudentList = (): void => {
    dispatch({ type: ActionType.SET_SEARCH_TERM, searchTerm: '' });
    dispatch({ type: ActionType.SET_PAGINATED_STUDENTS, paginatedStudents: [] });
    dispatch({ type: ActionType.SET_FILTERED_STUDENTS, filteredStudents: [] });
    dispatch({ type: ActionType.SET_ERROR_MESSAGE, compErrorMessage: '' });
    dispatch({
      type: ActionType.SET_LOADING_DIALOG,
      loadingDialog: !loadingDialog,
    });
    getAllStudents();
  };

  /**
   * All JSX Elements used in this page
   * @Type JSX.Element
   */
  const tableView = (
    <div className={classes.mainSection}>
      <div className={classes.innerSection}>
        <Box pt={1.75} pb={1.75} pl={2} pr={2} data-cy="studentPageTableHeader">
          <Grid container direction="row" justifyContent="flex-start" alignItems="center">
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
                        className={classes.cursorPointer}
                        onClick={clearSearch}
                        position="end"
                      >
                        <Cancel fontSize="small" />
                      </InputAdornment>
                    ) : (
                      ''
                    ),
                }}
                onChange={onChangeSearchTerm}
                value={searchTerm}
                placeholder="Search"
                variant="outlined"
                className={classes.tableSearch}
                data-cy="addStudentTableHeaderSearch"
              />
            </Grid>
            <Grid item xs={12} sm={7}>
              <Box mt={{ xs: 2.4, sm: 0 }}>
                <Grid container justifyContent="flex-end" alignItems="center">
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={refreshStudentList}
                    data-cy="studentTableHeaderSyncBtn"
                  >
                    <img src={SyncIcon} alt="sync icon" /> <span className="btnName"> Sync </span>
                  </Button>
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Box>

        <TableContainer
          style={{
            minHeight: allStudents.length > 6 || filteredStudents.length > 6 ? 439 : 'fit-content',
          }}
          data-cy="studentDataTable"
        >
          {compErrorMessage ? (
            <EmptyView title="Not Found!" message={compErrorMessage} height="55vh" />
          ) : (
            <TableComp
              headings={STUDENT_TABLE_HEAD}
              type={TableName.MANAGE_STUDENTS}
              apiData={paginatedStudents}
              updateAction={openStudentDialog}
              redirectUrl="/manage-students"
            />
          )}
        </TableContainer>
      </div>
      {totalStudents > PAGE_SIZE &&
      (searchTerm.length === 0 || filteredStudents.length > PAGE_SIZE) &&
      (compErrorMessage.length === 0 || filteredStudents.length > PAGE_SIZE) ? (
        <Pagination
          page={page}
          onChangePage={onChangePage}
          totalPages={totalStudentPages}
          totalRecords={totalStudents}
          PAGE_SIZE={PAGE_SIZE}
          isMobilePaginator={false}
        />
      ) : (
        ''
      )}
    </div>
  );

  return (
    <>
      <SubHeader
        title="Manage Students"
        btnText="Add New Student"
        btnAction={openStudentDialog}
        emptyData={allStudents.length === 0}
      />

      {allStudents && !ERROR_MESSAGES.includes(errorMessage || '') ? (
        tableView
      ) : (
        <EmptyView
          title="No Student Found!"
          message="Click on the button below to Add Students"
          openModal={() =>
            dispatch({
              type: ActionType.OPEN_STUDENT_DIALOG,
              studentModal: !studentModal,
            })
          }
          btnText="Add New Student"
        />
      )}

      <CustomAlert
        alertType={'success'}
        alertIcon={CheckCircle}
        alertMessage={successMessage || ''}
        showAlert={successBar}
        closeAlert={() =>
          dispatch({
            type: ActionType.SET_SUCCESS_BAR,
            successBar: !successBar,
          })
        }
      />

      <CustomAlert
        alertType={'error'}
        alertIcon={ErrorIcon}
        alertMessage={errorMessage || ''}
        showAlert={errorBar}
        closeAlert={() => dispatch({ type: ActionType.SET_ERROR_BAR, errorBar: !errorBar })}
      />

      <LoadingDialog loadingModal={loadingDialog} />
      <StudentDialog
        studentModal={studentModal}
        closeStudentModal={() =>
          dispatch({
            type: ActionType.OPEN_STUDENT_DIALOG,
            studentModal: !studentModal,
          })
        }
        studentData={selectedStudent}
        setErrorMessage={(errorMessage: string) =>
          dispatch({
            type: ActionType.SET_ERROR_MESSAGE,
            compErrorMessage: errorMessage,
          })
        }
      />
    </>
  );
};

export default ManageStudents;
