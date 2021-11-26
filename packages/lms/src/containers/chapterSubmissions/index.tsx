import { FC, useContext, useEffect, useReducer, Reducer, ChangeEvent } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Grid, Box, TableContainer, TextField, InputAdornment, Button } from '@material-ui/core';
import { Search, Cancel, Close } from '@material-ui/icons';
import {
  Pagination,
  CustomBreadcrumbs,
  colors,
  ContainerStyles,
  LoadingDialog,
  EmptyView,
} from '@illumidesk/common-ui/lib';

import { AssignmentContext } from '../../context/assignments';
import { NOTEBOOKS_AGAINST_CHAPTERS_HEAD, TableName, PAGE_SIZE } from '../../common/constants';
import { ChapterSubmission } from '../../common/types';

import SubHeader from '../../components/subHeader';
import TableComp from '../../components/tableComp';

import { SyncIcon, BreadcrumbIcon } from '../../assets';

type Params = {
  assignmentId: string;
  chapterId: string;
};

interface State {
  paginatedSubmissions: ChapterSubmission[];
  filteredSubmissions: ChapterSubmission[];

  page: number;
  totalSubmissions: number;
  totalSubmissionPages: number;

  searchTerm: string;
  compErrorMessage: string;

  isManualGrading: boolean;
  loadingDialog: boolean;
}

enum ActionType {
  SET_PAGINATED_SUBMISSIONS = 'setPaginatedSubmissions',
  SET_FILTERED_SUBMISSIONS = 'setFilteredSubmissions',

  SET_PAGE = 'setPage',
  SET_TOTAL_SUBMISSIONS = 'setTotalSubmissions',
  SET_TOTAL_SUBMISSION_PAGES = 'setTotalSubmissionsPages',

  SET_SEARCH_TERM = 'setSearchTerm',
  SET_ERROR_MESSAGE = 'setErrorMessage',

  SET_MANUAL_GRADING = 'setManualGrading',
  SET_LOADING_DIALOG = 'setLoadingDialog',
}

type Action =
  | {
      type: ActionType.SET_PAGINATED_SUBMISSIONS;
      paginatedSubmissions: ChapterSubmission[];
    }
  | {
      type: ActionType.SET_FILTERED_SUBMISSIONS;
      filteredSubmissions: ChapterSubmission[];
    }
  | { type: ActionType.SET_PAGE; page: number }
  | { type: ActionType.SET_TOTAL_SUBMISSIONS; totalSubmissions: number }
  | {
      type: ActionType.SET_TOTAL_SUBMISSION_PAGES;
      totalSubmissionPages: number;
    }
  | { type: ActionType.SET_SEARCH_TERM; searchTerm: string }
  | { type: ActionType.SET_ERROR_MESSAGE; compErrorMessage: string }
  | { type: ActionType.SET_MANUAL_GRADING; isManualGrading: boolean }
  | { type: ActionType.SET_LOADING_DIALOG; loadingDialog: boolean };

const initialState: State = {
  paginatedSubmissions: [],
  filteredSubmissions: [],

  page: 1,
  totalSubmissions: 0,
  totalSubmissionPages: 0,

  searchTerm: '',
  compErrorMessage: '',

  isManualGrading: false,
  loadingDialog: false,
};

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

    case ActionType.SET_MANUAL_GRADING:
      return {
        ...state,
        isManualGrading: action.isManualGrading,
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

const ChapterSubmissions: FC = (): JSX.Element => {
  /**
   * @var ChapterSubmissionsState
   */
  const [state, dispatch] = useReducer<Reducer<State, Action>>(reducer, initialState);
  const {
    paginatedSubmissions,
    filteredSubmissions,
    page,
    totalSubmissions,
    totalSubmissionPages,
    searchTerm,
    compErrorMessage,
    isManualGrading,
    loadingDialog,
  } = state;

  /**
   * @var classes contain styles classes
   * @var params
   * @var AssignmentContext
   */
  const classes = ContainerStyles();
  const params: Params = useParams();
  const history = useHistory();
  const { chapterSubmissions, getChapterSubmissions, errorMessage } = useContext(AssignmentContext);

  /**
   * runs only first time and get chaptersubmissions
   */
  useEffect(() => {
    const { assignmentId, chapterId } = params;
    getChapterSubmissions(assignmentId, chapterId);

    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * runs whenever chapterSubmissions changes
   */
  useEffect(() => {
    dispatch({
      type: ActionType.SET_TOTAL_SUBMISSION_PAGES,
      totalSubmissionPages: Math.ceil(chapterSubmissions.length / PAGE_SIZE),
    });
    if (chapterSubmissions.length > 0) {
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
      type: ActionType.SET_TOTAL_SUBMISSIONS,
      totalSubmissions: chapterSubmissions.length,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapterSubmissions]);

  useEffect(() => {
    if (errorMessage?.charAt(0) !== '[') {
      if (loadingDialog)
        dispatch({
          type: ActionType.SET_LOADING_DIALOG,
          loadingDialog: !loadingDialog,
        });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errorMessage]);

  /**
   * whenever user switch submissions page
   * @param event
   * @param value
   */
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
        paginatedSubmissions: chapterSubmissions.slice(startPoint, endPoint),
      });
    }
    dispatch({ type: ActionType.SET_PAGE, page: value });
  };

  /**
   * checking for manually grading assignment tasks
   * @param null
   * @return void
   */
  const checkForManualGradingSubmissions = (): void => {
    dispatch({
      type: ActionType.SET_MANUAL_GRADING,
      isManualGrading: !isManualGrading,
    });
    const filteredSubmissions = chapterSubmissions.filter(
      (submission) => submission.needs_manual_grade === true,
    );
    if (filteredSubmissions.length > 0) {
      dispatch({
        type: ActionType.SET_FILTERED_SUBMISSIONS,
        filteredSubmissions: filteredSubmissions,
      });
      const totalPages = Math.ceil(filteredSubmissions.length / PAGE_SIZE);
      dispatch({
        type: ActionType.SET_TOTAL_SUBMISSION_PAGES,
        totalSubmissionPages: totalPages,
      });
      if (totalPages > 1) {
        dispatch({
          type: ActionType.SET_PAGINATED_SUBMISSIONS,
          paginatedSubmissions: filteredSubmissions.slice(
            (page - 1) * PAGE_SIZE,
            Number((page - 1) * PAGE_SIZE) + Number(PAGE_SIZE),
          ),
        });
      } else {
        dispatch({
          type: ActionType.SET_PAGINATED_SUBMISSIONS,
          paginatedSubmissions: filteredSubmissions,
        });
      }
      dispatch({
        type: ActionType.SET_TOTAL_SUBMISSIONS,
        totalSubmissions: filteredSubmissions.length,
      });
    } else {
      dispatch({
        type: ActionType.SET_ERROR_MESSAGE,
        compErrorMessage: 'No assignment needs manual grading',
      });
    }
  };

  /**
   * clearing check for manual grading assignment tasks
   * @param null
   * @return void
   */
  const checkForAllSubmissions = (): void => {
    dispatch({
      type: ActionType.SET_MANUAL_GRADING,
      isManualGrading: !isManualGrading,
    });
    dispatch({ type: ActionType.SET_ERROR_MESSAGE, compErrorMessage: '' });
    const totalPages = Math.ceil(chapterSubmissions.length / PAGE_SIZE);
    dispatch({ type: ActionType.SET_FILTERED_SUBMISSIONS, filteredSubmissions: [] });
    dispatch({
      type: ActionType.SET_TOTAL_SUBMISSION_PAGES,
      totalSubmissionPages: totalPages,
    });
    dispatch({
      type: ActionType.SET_PAGINATED_SUBMISSIONS,
      paginatedSubmissions: chapterSubmissions.slice(
        (page - 1) * PAGE_SIZE,
        Number((page - 1) * PAGE_SIZE) + Number(PAGE_SIZE),
      ),
    });
    dispatch({
      type: ActionType.SET_TOTAL_SUBMISSIONS,
      totalSubmissions: chapterSubmissions.length,
    });
  };

  const searchChapterSubmissions = (event: ChangeEvent<HTMLInputElement>): void => {
    dispatch({ type: ActionType.SET_ERROR_MESSAGE, compErrorMessage: '' });
    const searchTerm = event.target.value;
    if (searchTerm === '') {
      clearSearch();
      return;
    }
    dispatch({ type: ActionType.SET_SEARCH_TERM, searchTerm: searchTerm });
    const forSearch = searchTerm.toUpperCase();

    const paginatedAssignmentSearch: ChapterSubmission[] = chapterSubmissions.filter(
      (assignment) => {
        const { first_name, last_name } = assignment;
        const name = `${first_name} ${last_name}`;

        if (name.toUpperCase().indexOf(forSearch) > -1) return assignment;
        return null;
      },
    );

    if (paginatedAssignmentSearch.length > 0) {
      dispatch({
        type: ActionType.SET_FILTERED_SUBMISSIONS,
        filteredSubmissions: paginatedAssignmentSearch,
      });
      const totalPages = Math.ceil(paginatedAssignmentSearch.length / PAGE_SIZE);
      dispatch({
        type: ActionType.SET_TOTAL_SUBMISSION_PAGES,
        totalSubmissionPages: totalPages,
      });

      if (totalPages > 1) {
        dispatch({
          type: ActionType.SET_PAGINATED_SUBMISSIONS,
          paginatedSubmissions: paginatedAssignmentSearch.slice(
            (page - 1) * PAGE_SIZE,
            Number((page - 1) * PAGE_SIZE) + Number(PAGE_SIZE),
          ),
        });
      } else {
        dispatch({
          type: ActionType.SET_PAGINATED_SUBMISSIONS,
          paginatedSubmissions: paginatedAssignmentSearch,
        });
      }
      dispatch({
        type: ActionType.SET_TOTAL_SUBMISSIONS,
        totalSubmissions: paginatedAssignmentSearch.length,
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
    const totalPages = Math.ceil(chapterSubmissions.length / PAGE_SIZE);
    dispatch({
      type: ActionType.SET_TOTAL_SUBMISSION_PAGES,
      totalSubmissionPages: totalPages,
    });

    dispatch({
      type: ActionType.SET_PAGINATED_SUBMISSIONS,
      paginatedSubmissions: chapterSubmissions.slice(
        (page - 1) * PAGE_SIZE,
        Number((page - 1) * PAGE_SIZE) + Number(PAGE_SIZE),
      ),
    });
    dispatch({
      type: ActionType.SET_TOTAL_SUBMISSIONS,
      totalSubmissions: chapterSubmissions.length,
    });
    dispatch({ type: ActionType.SET_ERROR_MESSAGE, compErrorMessage: '' });
  };

  const refreshChapterSubmissions = (): void => {
    dispatch({ type: ActionType.SET_PAGINATED_SUBMISSIONS, paginatedSubmissions: [] });
    dispatch({ type: ActionType.SET_FILTERED_SUBMISSIONS, filteredSubmissions: [] });
    dispatch({ type: ActionType.SET_SEARCH_TERM, searchTerm: '' });
    dispatch({ type: ActionType.SET_ERROR_MESSAGE, compErrorMessage: '' });
    if (isManualGrading) dispatch({ type: ActionType.SET_MANUAL_GRADING, isManualGrading: false });
    dispatch({
      type: ActionType.SET_LOADING_DIALOG,
      loadingDialog: !loadingDialog,
    });
    const { assignmentId, chapterId } = params;
    getChapterSubmissions(assignmentId, chapterId);
  };

  const mainSection = (
    <>
      <div className={classes.innerSection}>
        <Box pt={1.75} pb={1.75} pl={2} pr={2} data-cy="chapterSubmissionsTableHeader">
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
                        data-cy="chapterSubmissionsTableSearchClearBtn"
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
                onChange={searchChapterSubmissions}
                data-cy="chapterSubmissionsTableSearch"
              />
            </Grid>
            <Grid item xs={12} sm={7}>
              <Box mt={{ xs: 2.4, sm: 0 }}>
                <Grid container justifyContent="flex-end" alignItems="center">
                  <Button
                    variant="outlined"
                    color="secondary"
                    style={{
                      backgroundColor: isManualGrading
                        ? colors.LIGHT_GREY_BG_COLOR
                        : colors.WHITE_COLOR,
                    }}
                    onClick={
                      isManualGrading ? checkForAllSubmissions : checkForManualGradingSubmissions
                    }
                    data-cy="checkForManualGradingBtn"
                  >
                    <span> Manual Grading </span>
                    {isManualGrading ? (
                      <>
                        &nbsp;
                        <Close fontSize="small" />
                      </>
                    ) : (
                      ''
                    )}
                  </Button>
                  <Box ml={{ xs: 1 }}>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={refreshChapterSubmissions}
                      data-cy="submissionsSyncBtn"
                    >
                      <img src={SyncIcon} alt="sync icon" /> <span className="btnName"> Sync </span>
                    </Button>
                  </Box>
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Box>

        <TableContainer
          style={{
            minHeight:
              chapterSubmissions.length > PAGE_SIZE || filteredSubmissions.length > PAGE_SIZE
                ? 428
                : 'fit-content',
          }}
          data-cy="chapterSubmissionsTable"
        >
          {compErrorMessage ? (
            <EmptyView title="Not Found!" message={compErrorMessage} height="55vh" />
          ) : (
            <TableComp
              headings={NOTEBOOKS_AGAINST_CHAPTERS_HEAD}
              type={TableName.NOTBOOKS_AGAINST_CHAPTERS}
              apiData={paginatedSubmissions}
              redirectUrl={`/manual-grading/${params.assignmentId}/${params.chapterId}`}
            />
          )}
        </TableContainer>
      </div>
      {totalSubmissions > PAGE_SIZE &&
      (searchTerm.length === 0 || filteredSubmissions.length > PAGE_SIZE) &&
      (compErrorMessage.length === 0 || filteredSubmissions.length > PAGE_SIZE) ? (
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
      <SubHeader title="Manual Grading" emptyData={chapterSubmissions.length === 0} />
      <div className={classes.mainSection}>
        <CustomBreadcrumbs
          separator={BreadcrumbIcon}
          bCrumbsList={[
            {
              title: 'Manual Grading',
              redirectAction: () => history.push('/manual-grading'),
            },
            {
              title: params.assignmentId,
              redirectAction: () => history.push(`/manual-grading/${params.assignmentId}`),
            },
            {
              title: decodeURI(params.chapterId),
            },
          ]}
          charLimitForLongString={25}
        />

        {chapterSubmissions &&
        errorMessage !== 'No data found' &&
        errorMessage !== 'Request failed with status code 500' &&
        errorMessage !== 'Something went wrong. Please try again later' ? (
          mainSection
        ) : (
          <EmptyView
            title="No Submissions!"
            message={`No submissions have been made for ${params.chapterId}`}
            height="67vh"
          />
        )}
      </div>
      <LoadingDialog loadingModal={loadingDialog} />
    </>
  );
};

export default ChapterSubmissions;
