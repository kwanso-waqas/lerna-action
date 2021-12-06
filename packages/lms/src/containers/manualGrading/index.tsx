import { FC, useContext, useEffect, useReducer, Reducer, ChangeEvent } from 'react';
import { Grid, TextField, InputAdornment, Box, TableContainer, Button } from '@material-ui/core';
import { Search, Cancel } from '@material-ui/icons';
import { Pagination, ContainerStyles, LoadingDialog, EmptyView } from '@illumidesk/common-ui';

import { MANUAL_GRADING_HEAD, TableName, PAGE_SIZE, ERROR_MESSAGES } from '../../common/constants';
import { Assignment } from '../../common/types';
import { AssignmentContext } from '../../context/assignments';

import { SyncIcon } from '../../assets';

import SubHeader from '../../components/subHeader';
import TableComp from '../../components/tableComp';

interface State {
  paginatedAssignments: Assignment[];
  filteredAssignments: Assignment[];

  page: number;
  totalAssignments: number;
  totalAssignmentPages: number;

  searchTerm: string;
  compErrorMessage: string;

  loadingDialog: boolean;
}

enum ActionType {
  SET_PAGINATED_ASSIGNMENTS = 'setPaginatedAssignments',
  SET_FILTERED_ASSIGNMENTS = 'setFilteredAssignments',

  SET_PAGE = 'setPage',
  SET_TOTAL_ASSIGNMENTS = 'setTotalAssignments',
  SET_TOTAL_ASSIGNMENT_PAGES = 'setTotalAssignmentPages',

  SET_SEARCH_TERM = 'setSearchTerm',
  SET_ERROR_MESSAGE = 'setErrorMessage',

  SET_LOADING_DIALOG = 'setLoadingDialog',
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
  | { type: ActionType.SET_PAGE; page: number }
  | { type: ActionType.SET_TOTAL_ASSIGNMENTS; totalAssignments: number }
  | {
      type: ActionType.SET_TOTAL_ASSIGNMENT_PAGES;
      totalAssignmentPages: number;
    }
  | { type: ActionType.SET_SEARCH_TERM; searchTerm: string }
  | { type: ActionType.SET_ERROR_MESSAGE; compErrorMessage: string }
  | { type: ActionType.SET_LOADING_DIALOG; loadingDialog: boolean };

const initialState: State = {
  paginatedAssignments: [],
  filteredAssignments: [],
  page: 1,
  totalAssignments: 0,
  totalAssignmentPages: 0,
  searchTerm: '',
  compErrorMessage: '',
  loadingDialog: false,
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

    case ActionType.SET_LOADING_DIALOG:
      return {
        ...state,
        loadingDialog: action.loadingDialog,
      };

    default:
      return state;
  }
};

const ManualGrading: FC = (): JSX.Element => {
  /**
   * @var ManualGradingState
   */
  const [state, dispatch] = useReducer<Reducer<State, Action>>(reducer, initialState);
  const {
    paginatedAssignments,
    filteredAssignments,
    page,
    totalAssignmentPages,
    totalAssignments,
    compErrorMessage,
    searchTerm,
    loadingDialog,
  } = state;

  const classes = ContainerStyles();

  /**
   * @var includedContextFiles
   */
  const { allAssignments, getAllAssignments, errorMessage } = useContext(AssignmentContext);

  /**
   * Execute only once and fetch assignment listing
   */
  useEffect(() => {
    getAllAssignments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Execute whenever list change and update our data
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
    dispatch({
      type: ActionType.SET_TOTAL_ASSIGNMENTS,
      totalAssignments: allAssignments.length,
    });
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allAssignments]);

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

  const searchAllAssignments = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: ActionType.SET_ERROR_MESSAGE, compErrorMessage: '' });
    const searchTerm = event.target.value;
    if (searchTerm === '') {
      clearSearch();
      return;
    }
    dispatch({ type: ActionType.SET_SEARCH_TERM, searchTerm: searchTerm });
    const forSearch = searchTerm.toUpperCase();

    const paginatedAssignmentSearch: Assignment[] = allAssignments.filter((assignment) => {
      const { name } = assignment;

      if (name.toUpperCase().indexOf(forSearch) > -1) return assignment;
      return null;
    });

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

  const refreshAssignmentList = (): void => {
    dispatch({ type: ActionType.SET_SEARCH_TERM, searchTerm: '' });
    dispatch({ type: ActionType.SET_FILTERED_ASSIGNMENTS, filteredAssignments: [] });
    dispatch({ type: ActionType.SET_PAGINATED_ASSIGNMENTS, paginatedAssignments: [] });
    dispatch({
      type: ActionType.SET_LOADING_DIALOG,
      loadingDialog: !loadingDialog,
    });
    getAllAssignments();
  };

  const tableView = (
    <div className={classes.mainSection}>
      <div className={classes.innerSection}>
        <Box pt={1.75} pb={1.75} pl={2} pr={2}>
          <Grid
            container
            direction="row"
            justifyContent="flex-start"
            alignItems="center"
            data-cy="pageHeader"
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
                        className={classes.cursorPointer}
                        onClick={clearSearch}
                        position="end"
                        data-cy="manualGradingPageTableSearchClear"
                      >
                        <Cancel fontSize="small" />
                      </InputAdornment>
                    ) : (
                      ''
                    ),
                }}
                placeholder="Search"
                variant="outlined"
                className={classes.tableSearch}
                value={searchTerm}
                onChange={searchAllAssignments}
                data-cy="manualGradingSearch"
              />
            </Grid>
            <Grid item xs={12} sm={7}>
              <Box mt={{ xs: 2.4, sm: 0 }}>
                <Grid container justifyContent="flex-end" alignItems="center">
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={refreshAssignmentList}
                    data-cy="manualGradingSyncBtn"
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
            minHeight:
              allAssignments.length > PAGE_SIZE || filteredAssignments.length > PAGE_SIZE
                ? 428
                : 'fit-content',
          }}
          data-cy="manualGradingTable"
        >
          {compErrorMessage ? (
            <EmptyView title="Not Found!" message={compErrorMessage} height="55vh" />
          ) : (
            <TableComp
              headings={MANUAL_GRADING_HEAD}
              type={TableName.MANUAL_GRADING}
              redirectUrl={`/manual-grading`}
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
    </div>
  );

  return (
    <>
      <SubHeader title="Manual Grading" emptyData={allAssignments.length === 0} />

      {allAssignments && !ERROR_MESSAGES.includes(errorMessage || '') ? (
        tableView
      ) : (
        <EmptyView
          title="No Assignment Found!"
          message="There is no Assignment added in Assignment LMS"
        />
      )}

      <LoadingDialog loadingModal={loadingDialog} />
    </>
  );
};

export default ManualGrading;
