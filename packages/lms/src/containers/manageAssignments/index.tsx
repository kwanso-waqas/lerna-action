import {
  FC,
  useRef,
  useContext,
  useEffect,
  useReducer,
  Reducer,
  ChangeEvent,
  MouseEvent,
} from 'react';
import {
  Button,
  TextField,
  InputAdornment,
  Chip,
  Grid,
  Popper,
  Paper,
  ClickAwayListener,
  MenuList,
  MenuItem,
  Box,
  TableContainer,
} from '@material-ui/core';
import { Search, Close, FiberManualRecord, Cancel } from '@material-ui/icons';
import {
  Pagination,
  ContainerStyles,
  CustomAlert,
  LoadingDialog,
  EmptyView,
} from '@illumidesk/common-ui';

import { AssignmentContext } from '../../context/assignments';
import { CourseContext } from '../../context/courses';
import {
  ASSIGNMENT_TABLE_HEAD,
  PAGE_SIZE,
  TableName,
  ASSIGNMENT_PATH,
  ERROR_MESSAGES,
} from '../../common/constants';
import { Assignment } from '../../common/types';
import { getBaseUrl } from '../../common/graderConstants';
import { constructUrl } from '../../common/url';

import AssignmentDialog from '../../components/alerts/assignmentDialog';
import SubHeader from '../../components/subHeader';
import TableComp from '../../components/tableComp';
import ErrorDialog from '../../components/alerts/errorDialog';

import { SyncIcon, SearchIcon, CheckCircle, ErrorIcon } from '../../assets';

interface State {
  filteredAssignments: Assignment[];
  paginatedAssignments: Assignment[];
  selectedAssignment: Assignment | null;
  page: number;
  totalAssignments: number;
  totalAssignmentPages: number;
  searchTerm: string;
  compErrorMessage: string;
  selectedStatus: string;
  assignmentModal: boolean;
  statusDropdown: boolean;
  successBar: boolean;
  errorBar: boolean;
  redirectUrl: string;
  loadingDialog: boolean;
}

enum ActionType {
  SET_FILTERED_ASSIGNMENTS = 'setFilteredAssignments',
  SET_PAGINATED_ASSIGNMENTS = 'setPaginatedAssignments',
  SET_SELECTED_ASSIGNMENT = 'setSelectedAssignment',

  SELECT_STATUS = 'selectStatus',
  SET_SEARCH_TERM = 'setSearchTerm',
  SET_ERROR_MESSAGE = 'setErrorMessage',

  SET_PAGE = 'setPage',
  SET_TOTAL_ASSIGNMENT_PAGES = 'setTotalAssignmentsPages',
  SET_TOTAL_ASSIGNMENTS = 'setTotalAssignments',

  SET_ASSIGNMENT_MODAL = 'setAssignmentModal',
  SET_STATUS_VISIBILITY = 'setStatusVisibility',
  SET_SUCCESS_SNACKBAR = 'setSuccessSnackbar',
  SET_ERROR_SNACKBAR = 'setErrorSnackbar',
  SET_LOADING_DIALOG = 'setLoadingDialog',

  SET_REDIRECT_URL = 'setRedirectUrl',
}

type Action =
  | {
      type: ActionType.SET_PAGINATED_ASSIGNMENTS;
      paginatedAssignments: Assignment[];
    }
  | {
      type: ActionType.SET_FILTERED_ASSIGNMENTS;
      filteredAssignments: Assignment[];
    }
  | { type: ActionType.SELECT_STATUS; status: string }
  | {
      type: ActionType.SET_SELECTED_ASSIGNMENT;
      selectedAssignment: Assignment | null;
    }
  | { type: ActionType.SET_PAGE; page: number }
  | {
      type: ActionType.SET_TOTAL_ASSIGNMENT_PAGES;
      totalAssignmentPages: number;
    }
  | { type: ActionType.SET_TOTAL_ASSIGNMENTS; totalAssignments: number }
  | { type: ActionType.SET_SEARCH_TERM; searchTerm: string }
  | { type: ActionType.SET_ASSIGNMENT_MODAL; assignmentModal: boolean }
  | { type: ActionType.SET_ERROR_MESSAGE; compErrorMessage: string }
  | { type: ActionType.SET_ERROR_SNACKBAR; errorBar: boolean }
  | { type: ActionType.SET_REDIRECT_URL; redirectUrl: string }
  | { type: ActionType.SET_STATUS_VISIBILITY; statusDropdown: boolean }
  | { type: ActionType.SET_SUCCESS_SNACKBAR; successBar: boolean }
  | { type: ActionType.SET_LOADING_DIALOG; loadingDialog: boolean };

const initialState: State = {
  filteredAssignments: [],
  paginatedAssignments: [],
  selectedAssignment: null,
  page: 1,
  totalAssignments: 0,
  totalAssignmentPages: 0,
  searchTerm: '',
  compErrorMessage: '',
  selectedStatus: '',
  assignmentModal: false,
  statusDropdown: false,
  successBar: false,
  errorBar: false,
  loadingDialog: false,
  redirectUrl: '',
};

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
    case ActionType.SET_SELECTED_ASSIGNMENT:
      return {
        ...state,
        selectedAssignment: action.selectedAssignment,
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
    case ActionType.SET_PAGE:
      return {
        ...state,
        page: action.page,
      };

    case ActionType.SET_ERROR_MESSAGE:
      return {
        ...state,
        compErrorMessage: action.compErrorMessage,
      };
    case ActionType.SET_SEARCH_TERM:
      return {
        ...state,
        searchTerm: action.searchTerm,
      };
    case ActionType.SELECT_STATUS:
      return {
        ...state,
        selectedStatus: action.status,
      };

    case ActionType.SET_ASSIGNMENT_MODAL:
      return {
        ...state,
        assignmentModal: action.assignmentModal,
      };
    case ActionType.SET_STATUS_VISIBILITY:
      return {
        ...state,
        statusDropdown: action.statusDropdown,
      };
    case ActionType.SET_SUCCESS_SNACKBAR:
      return {
        ...state,
        successBar: action.successBar,
      };
    case ActionType.SET_ERROR_SNACKBAR:
      return {
        ...state,
        errorBar: action.errorBar,
      };
    case ActionType.SET_LOADING_DIALOG:
      return {
        ...state,
        loadingDialog: action.loadingDialog,
      };

    case ActionType.SET_REDIRECT_URL:
      return {
        ...state,
        redirectUrl: action.redirectUrl,
      };
    default:
      return state;
  }
};

const ManageAssignments: FC = (): JSX.Element => {
  /**
   * @var ManageAssignmentState
   */
  const [state, dispatch] = useReducer<Reducer<State, Action>>(reducer, initialState);
  const {
    paginatedAssignments,
    filteredAssignments,
    selectedAssignment,
    page,
    totalAssignments,
    totalAssignmentPages,
    compErrorMessage,
    searchTerm,
    selectedStatus,
    assignmentModal,
    successBar,
    errorBar,
    statusDropdown,
    loadingDialog,
    redirectUrl,
  } = state;

  const { allCourses } = useContext(CourseContext);
  const { allAssignments, getAllAssignments, successMessage, errorMessage } =
    useContext(AssignmentContext);
  const classes = ContainerStyles();
  const anchorRef = useRef<HTMLButtonElement>(null);

  /**
   * Execute only once and fetch assignments from API
   */
  useEffect(() => {
    getAllAssignments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Execute everytime our assignments collection from API changes
   */
  useEffect(() => {
    dispatch({
      type: ActionType.SET_TOTAL_ASSIGNMENT_PAGES,
      totalAssignmentPages: Math.ceil(allAssignments.length / PAGE_SIZE),
    });

    if (allAssignments.length > 0) {
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

    if (allAssignments.length > 0 && assignmentModal) {
      onChangePage(null, 1);
    }

    dispatch({
      type: ActionType.SET_TOTAL_ASSIGNMENTS,
      totalAssignments: allAssignments.length,
    });
    if (filteredAssignments.length > 0 && selectedStatus.length > 0) {
      const index = filteredAssignments.findIndex(
        (assignment) => assignment.status !== selectedStatus,
      );
      if (index > -1) {
        const localAssignments = [...filteredAssignments];
        localAssignments.splice(index, 1);
        dispatch({
          type: ActionType.SET_FILTERED_ASSIGNMENTS,
          filteredAssignments: localAssignments,
        });
        selectChip(selectedStatus);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allAssignments]);

  /**
   * Execute to show snackbars after add/update assignment
   */
  useEffect(() => {
    if (successMessage && successMessage.length > 0) {
      if (successMessage?.charAt(0) !== '[')
        dispatch({
          type: ActionType.SET_SUCCESS_SNACKBAR,
          successBar: !successBar,
        });
    } else if (errorMessage && errorMessage.length > 0) {
      if (errorMessage?.charAt(0) !== '[')
        dispatch({ type: ActionType.SET_ERROR_SNACKBAR, errorBar: !errorBar });
      if (loadingDialog)
        dispatch({
          type: ActionType.SET_LOADING_DIALOG,
          loadingDialog: !loadingDialog,
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [successMessage, errorMessage]);

  /**
   * Update redirect Url on change in courses array
   */
  useEffect(() => {
    if (allCourses.length > 0)
      dispatch({
        type: ActionType.SET_REDIRECT_URL,
        redirectUrl: constructUrl([
          window.location.origin,
          getBaseUrl(),
          'tree',
          allCourses[0],
          ASSIGNMENT_PATH,
        ]),
      });
  }, [allCourses]);

  const openAssignmentModal = (
    event: MouseEvent<HTMLButtonElement>,
    assignmentName?: string,
  ): void => {
    if (assignmentName) updateCurrentAssignment(assignmentName);
    else {
      if (selectedAssignment)
        dispatch({
          type: ActionType.SET_SELECTED_ASSIGNMENT,
          selectedAssignment: null,
        });
    }

    dispatch({
      type: ActionType.SET_ASSIGNMENT_MODAL,
      assignmentModal: !assignmentModal,
    });
  };
  const closeAssignmentModal = (): void => {
    dispatch({
      type: ActionType.SET_SELECTED_ASSIGNMENT,
      selectedAssignment: null,
    });
    dispatch({
      type: ActionType.SET_ASSIGNMENT_MODAL,
      assignmentModal: !assignmentModal,
    });
  };

  /**
   * Opening and closing status dropdown
   * @returns void
   */
  const toggleStatusDropdown = (): void =>
    dispatch({
      type: ActionType.SET_STATUS_VISIBILITY,
      statusDropdown: !statusDropdown,
    });

  const searchAllAssignments = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: ActionType.SET_ERROR_MESSAGE, compErrorMessage: '' });
    const searchTerm = event.target.value;
    if (searchTerm === '') {
      clearSearch();
      return;
    }
    dispatch({ type: ActionType.SET_SEARCH_TERM, searchTerm: searchTerm });
    const forSearch = searchTerm.toUpperCase();

    const paginatedAssignmentSearch: Assignment[] = allAssignments.filter(
      (assignment: Assignment) => {
        const { name } = assignment;
        if (name.toUpperCase().indexOf(forSearch) > -1) return assignment;
        return null;
      },
    );

    if (paginatedAssignmentSearch.length > 0) {
      dispatch({
        type: ActionType.SET_FILTERED_ASSIGNMENTS,
        filteredAssignments: paginatedAssignmentSearch,
      });
      const totalPages = Math.ceil(paginatedAssignmentSearch.length / PAGE_SIZE);
      dispatch({
        type: ActionType.SET_TOTAL_ASSIGNMENT_PAGES,
        totalAssignmentPages: totalPages,
      });

      if (totalPages > 1) {
        dispatch({
          type: ActionType.SET_PAGINATED_ASSIGNMENTS,
          paginatedAssignments: paginatedAssignmentSearch.slice(
            (page - 1) * PAGE_SIZE,
            Number((page - 1) * PAGE_SIZE) + Number(PAGE_SIZE),
          ),
        });
      } else {
        dispatch({
          type: ActionType.SET_PAGINATED_ASSIGNMENTS,
          paginatedAssignments: paginatedAssignmentSearch,
        });
      }
      dispatch({
        type: ActionType.SET_TOTAL_ASSIGNMENTS,
        totalAssignments: paginatedAssignmentSearch.length,
      });
      dispatch({ type: ActionType.SET_PAGE, page: 1 });
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
    const totalPages = Math.ceil(allAssignments.length / PAGE_SIZE);
    dispatch({
      type: ActionType.SET_TOTAL_ASSIGNMENT_PAGES,
      totalAssignmentPages: totalPages,
    });

    dispatch({
      type: ActionType.SET_PAGINATED_ASSIGNMENTS,
      paginatedAssignments: allAssignments.slice(
        (page - 1) * PAGE_SIZE,
        Number((page - 1) * PAGE_SIZE) + Number(PAGE_SIZE),
      ),
    });
    dispatch({
      type: ActionType.SET_TOTAL_ASSIGNMENTS,
      totalAssignments: allAssignments.length,
    });
    dispatch({ type: ActionType.SET_ERROR_MESSAGE, compErrorMessage: '' });
  };

  const selectChip = (chip: string): void => {
    dispatch({
      type: ActionType.SET_ERROR_MESSAGE,
      compErrorMessage: ``,
    });
    dispatch({ type: ActionType.SELECT_STATUS, status: chip });
    const pageNo = 1;
    dispatch({ type: ActionType.SET_PAGE, page: pageNo });
    const filteredAssignments = allAssignments.filter((assignment) => assignment.status === chip);
    if (filteredAssignments.length > 0) {
      dispatch({
        type: ActionType.SET_FILTERED_ASSIGNMENTS,
        filteredAssignments: filteredAssignments,
      });
      const totalPages = Math.ceil(filteredAssignments.length / PAGE_SIZE);
      dispatch({
        type: ActionType.SET_TOTAL_ASSIGNMENT_PAGES,
        totalAssignmentPages: totalPages,
      });
      if (totalPages > 1) {
        dispatch({
          type: ActionType.SET_PAGINATED_ASSIGNMENTS,
          paginatedAssignments: filteredAssignments.slice(
            (pageNo - 1) * PAGE_SIZE,
            Number((pageNo - 1) * PAGE_SIZE) + Number(PAGE_SIZE),
          ),
        });
      } else {
        dispatch({
          type: ActionType.SET_PAGINATED_ASSIGNMENTS,
          paginatedAssignments: filteredAssignments,
        });
      }
      dispatch({
        type: ActionType.SET_TOTAL_ASSIGNMENTS,
        totalAssignments: filteredAssignments.length,
      });
    } else {
      dispatch({
        type: ActionType.SET_ERROR_MESSAGE,
        compErrorMessage: `No assignment found matching ${chip} status`,
      });
    }
    toggleStatusDropdown();
  };

  const deleteChip = (): void => {
    dispatch({ type: ActionType.SELECT_STATUS, status: '' });
    dispatch({ type: ActionType.SET_ERROR_MESSAGE, compErrorMessage: '' });
    const totalPages = Math.ceil(allAssignments.length / PAGE_SIZE);
    dispatch({
      type: ActionType.SET_FILTERED_ASSIGNMENTS,
      filteredAssignments: [],
    });
    dispatch({
      type: ActionType.SET_TOTAL_ASSIGNMENT_PAGES,
      totalAssignmentPages: totalPages,
    });
    dispatch({
      type: ActionType.SET_PAGINATED_ASSIGNMENTS,
      paginatedAssignments: allAssignments.slice(
        (page - 1) * PAGE_SIZE,
        Number((page - 1) * PAGE_SIZE) + Number(PAGE_SIZE),
      ),
    });
    dispatch({
      type: ActionType.SET_TOTAL_ASSIGNMENTS,
      totalAssignments: allAssignments.length,
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
        paginatedAssignments: allAssignments.slice(startPoint, endPoint),
      });
    }
    dispatch({ type: ActionType.SET_PAGE, page: value });
  };

  const updateCurrentAssignment = (assignmentName: string): void => {
    const localAssignment = allAssignments.filter((a) => a.name === assignmentName);
    if (localAssignment) {
      dispatch({
        type: ActionType.SET_SELECTED_ASSIGNMENT,
        selectedAssignment: localAssignment[0],
      });
    }
  };

  const refreshAssignmentList = (): void => {
    dispatch({ type: ActionType.SELECT_STATUS, status: '' });
    dispatch({ type: ActionType.SET_SEARCH_TERM, searchTerm: '' });
    dispatch({ type: ActionType.SET_FILTERED_ASSIGNMENTS, filteredAssignments: [] });
    dispatch({ type: ActionType.SET_PAGINATED_ASSIGNMENTS, paginatedAssignments: [] });
    dispatch({ type: ActionType.SET_ERROR_MESSAGE, compErrorMessage: '' });
    if (statusDropdown)
      dispatch({ type: ActionType.SET_STATUS_VISIBILITY, statusDropdown: !statusDropdown });
    dispatch({
      type: ActionType.SET_LOADING_DIALOG,
      loadingDialog: !loadingDialog,
    });
    getAllAssignments();
  };

  const assignmentTable = (
    <div className={classes.mainSection}>
      <div className={classes.innerSection}>
        <Box pt={1.75} pb={1.75} pl={2} pr={2}>
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
                        data-cy="manageAssignmentsPageTableSearchClear"
                      >
                        <Cancel fontSize="small" />
                      </InputAdornment>
                    ) : (
                      ''
                    ),
                }}
                placeholder="Search"
                value={searchTerm}
                onChange={searchAllAssignments}
                variant="outlined"
                className={classes.tableSearch}
              />
            </Grid>
            <Grid item xs={12} sm={7}>
              <Box mt={{ xs: 2.4, sm: 0 }}>
                <Grid container justifyContent="flex-end" alignItems="center">
                  <Box marginRight={2}>
                    {selectedStatus !== '' ? (
                      <Chip
                        size="small"
                        color={selectedStatus === 'draft' ? 'secondary' : 'primary'}
                        deleteIcon={<Close />}
                        label={`${selectedStatus.charAt(0).toUpperCase()}${selectedStatus.slice(
                          1,
                        )}`}
                        onDelete={deleteChip}
                        data-cy={`${selectedStatus}DeleteableChip`}
                      />
                    ) : (
                      ''
                    )}
                  </Box>

                  <Button
                    variant="outlined"
                    color="secondary"
                    ref={anchorRef}
                    onClick={toggleStatusDropdown}
                    data-cy="selectStatusMenuBtn"
                  >
                    <img src={SearchIcon} alt="search icon" />
                    <span className="btnName"> Status </span>
                  </Button>
                  <Popper
                    open={statusDropdown}
                    anchorEl={anchorRef.current}
                    placement="bottom-end"
                    role={undefined}
                    transition
                    disablePortal
                    style={{ zIndex: 2 }}
                    data-cy="selectStatusMenu"
                  >
                    <Paper className="bgWhite">
                      <ClickAwayListener onClickAway={toggleStatusDropdown}>
                        <MenuList id="menu-list-grow">
                          <MenuItem
                            disabled={selectedStatus === 'draft'}
                            onClick={() => selectChip('draft')}
                            data-cy="selectDraftStatus"
                          >
                            <Chip color="secondary" icon={<FiberManualRecord />} label="Draft" />
                          </MenuItem>
                          <MenuItem
                            disabled={selectedStatus === 'released'}
                            onClick={() => selectChip('released')}
                            data-cy="selectReleasedStatus"
                          >
                            <Chip color="primary" icon={<FiberManualRecord />} label="Released" />
                          </MenuItem>
                        </MenuList>
                      </ClickAwayListener>
                    </Paper>
                  </Popper>

                  <Button
                    style={{ marginLeft: 8 }}
                    variant="outlined"
                    color="secondary"
                    onClick={refreshAssignmentList}
                    data-cy="assignmentSyncButton"
                  >
                    <img src={SyncIcon} alt="search icon" /> <span className="btnName"> Sync </span>
                  </Button>
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Box>

        <TableContainer
          style={{
            minHeight:
              allAssignments.length > 6 || filteredAssignments.length > 6 ? 488 : 'fit-content',
          }}
          data-cy="assignmentTableCont"
        >
          {compErrorMessage ? (
            <EmptyView title="Not Found!" message={compErrorMessage} height="55vh" />
          ) : (
            <TableComp
              headings={ASSIGNMENT_TABLE_HEAD}
              type={TableName.MANAGE_ASSIGNMENTS}
              apiData={paginatedAssignments}
              updateAction={openAssignmentModal}
              redirectUrl={redirectUrl}
            />
          )}
        </TableContainer>
      </div>
      {totalAssignments > PAGE_SIZE &&
      (searchTerm.length === 0 || filteredAssignments.length > PAGE_SIZE) &&
      (filteredAssignments.length > PAGE_SIZE || compErrorMessage.length === 0) ? (
        <Pagination
          totalPages={totalAssignmentPages}
          page={page}
          onChangePage={onChangePage}
          totalRecords={totalAssignments}
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
        title="Manage Assignments"
        openInstruction={true}
        btnAction={openAssignmentModal}
        btnText="Add New Assignment"
        emptyData={allAssignments.length === 0}
      />

      {allAssignments && !ERROR_MESSAGES.includes(errorMessage || '') ? (
        assignmentTable
      ) : (
        <EmptyView
          title="No Assignment Found!"
          message="Click on the button below to Create Assignment"
          openModal={openAssignmentModal}
          btnText="Create New Assignment"
        />
      )}

      <CustomAlert
        alertType={'success'}
        alertIcon={CheckCircle}
        alertMessage={successMessage || ''}
        showAlert={successBar}
        closeAlert={() =>
          dispatch({
            type: ActionType.SET_SUCCESS_SNACKBAR,
            successBar: !successBar,
          })
        }
      />

      <CustomAlert
        alertType={'error'}
        alertIcon={ErrorIcon}
        alertMessage={errorMessage || ''}
        showAlert={errorBar}
        closeAlert={() =>
          dispatch({
            type: ActionType.SET_ERROR_SNACKBAR,
            errorBar: !errorBar,
          })
        }
      />

      <ErrorDialog />
      <LoadingDialog loadingModal={loadingDialog} />

      {assignmentModal && (
        <AssignmentDialog
          assignmentModal={assignmentModal}
          closeAssignmentModal={closeAssignmentModal}
          assignmentData={selectedAssignment}
          setErrorMessage={(errorMessage: string) =>
            dispatch({
              type: ActionType.SET_ERROR_MESSAGE,
              compErrorMessage: errorMessage,
            })
          }
        />
      )}
    </>
  );
};

export default ManageAssignments;
