import { FC, useEffect, useContext, useReducer, Reducer, ChangeEvent } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Grid, Box, TableContainer, TextField, InputAdornment, Button } from '@material-ui/core';
import { Search, Cancel } from '@material-ui/icons';
import {
  LoadingDialog,
  EmptyView,
  Pagination,
  CustomBreadcrumbs,
  ContainerStyles,
} from '@illumidesk/common-ui';

import { CourseContext } from '../../context/courses';
import { AssignmentContext } from '../../context/assignments';
import { AssignmentChapter } from '../../common/types';
import {
  ASSIGNMENT_CHAPTERS_HEAD,
  TableName,
  PAGE_SIZE,
  ASSIGNMENT_PATH,
  ERROR_MESSAGES,
} from '../../common/constants';
import { getBaseUrl } from '../../common/graderConstants';
import { constructUrl } from '../../common/url';

import SubHeader from '../../components/subHeader';
import TableComp from '../../components/tableComp';

import { BreadcrumbIcon, SyncIcon } from '../../assets';

type Params = {
  assignmentId: string;
};

interface State {
  paginatedChapters: AssignmentChapter[];
  filteredChapters: AssignmentChapter[];
  page: number;
  totalChapters: number;
  totalChapterPages: number;
  searchTerm: string;
  compErrorMessage: string;
  loadingDialog: boolean;
}

enum ActionType {
  SET_PAGINATED_CHAPTERS = 'setPaginatedChapters',
  SET_FILTERED_CHAPTERS = 'setFilteredChapters',

  SET_PAGE = 'setPage',
  SET_TOTAL_CHAPTERS = 'setTotalChapters',
  SET_TOTAL_CHAPTER_PAGES = 'setTotalChapterPages',

  SET_SEARCH_TERM = 'setSearchTerm',
  SET_ERROR_MESSAGE = 'setErrorMessage',

  SET_LOADING_DIALOG = 'setLoadingDialog',
}

type Action =
  | {
      type: ActionType.SET_PAGINATED_CHAPTERS;
      paginatedChapters: AssignmentChapter[];
    }
  | {
      type: ActionType.SET_FILTERED_CHAPTERS;
      filteredChapters: AssignmentChapter[];
    }
  | { type: ActionType.SET_PAGE; page: number }
  | { type: ActionType.SET_TOTAL_CHAPTERS; totalChapters: number }
  | { type: ActionType.SET_TOTAL_CHAPTER_PAGES; totalChapterPages: number }
  | { type: ActionType.SET_SEARCH_TERM; searchTerm: string }
  | { type: ActionType.SET_ERROR_MESSAGE; compErrorMessage: string }
  | { type: ActionType.SET_LOADING_DIALOG; loadingDialog: boolean };

const initialState: State = {
  paginatedChapters: [],
  filteredChapters: [],
  page: 1,
  totalChapters: 0,
  totalChapterPages: 0,
  searchTerm: '',
  compErrorMessage: '',
  loadingDialog: false,
};

/**
 * handling state changes
 * @param state
 * @param action
 * @return state
 */
const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionType.SET_PAGINATED_CHAPTERS:
      return {
        ...state,
        paginatedChapters: action.paginatedChapters,
      };
    case ActionType.SET_FILTERED_CHAPTERS:
      return {
        ...state,
        filteredChapters: action.filteredChapters,
      };

    case ActionType.SET_PAGE:
      return {
        ...state,
        page: action.page,
      };
    case ActionType.SET_TOTAL_CHAPTERS:
      return {
        ...state,
        totalChapters: action.totalChapters,
      };
    case ActionType.SET_TOTAL_CHAPTER_PAGES:
      return {
        ...state,
        totalChapterPages: action.totalChapterPages,
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

    case ActionType.SET_LOADING_DIALOG:
      return {
        ...state,
        loadingDialog: action.loadingDialog,
      };
    default:
      return state;
  }
};

const AssignmentChapters: FC = (): JSX.Element => {
  /**
   * @var assignmentChaptersState
   */
  const [state, dispatch] = useReducer<Reducer<State, Action>>(reducer, initialState);
  const {
    paginatedChapters,
    filteredChapters,
    page,
    totalChapters,
    totalChapterPages,
    searchTerm,
    compErrorMessage,
    loadingDialog,
  } = state;

  /**
   * @var styledClasses
   * @var URLParams
   * @var AssignmentContext
   */
  const classes = ContainerStyles();
  const params: Params = useParams();
  const history = useHistory();
  const { allCourses } = useContext(CourseContext);
  const { assignmentChapters, getAssignmentChapters, errorMessage } = useContext(AssignmentContext);

  /**
   * runs only once and fetch assignment chapters/tasks
   */
  useEffect(() => {
    getAssignmentChapters(params.assignmentId);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.assignmentId]);

  /**
   * runs everytime chapters array changes and reflect those changes in DOM
   */
  useEffect(() => {
    dispatch({
      type: ActionType.SET_TOTAL_CHAPTERS,
      totalChapters: assignmentChapters.length,
    });

    if (assignmentChapters.length > 0) {
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
      type: ActionType.SET_TOTAL_CHAPTER_PAGES,
      totalChapterPages: Math.ceil(assignmentChapters.length / PAGE_SIZE),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assignmentChapters]);

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
   * Calls every time use switches to new page
   * @param event
   * @param value
   * @return void
   */
  const onChangePage = (event: React.ChangeEvent<unknown> | null, value: number): void => {
    const startPoint: number = +((value - 1) * PAGE_SIZE);
    const endPoint: number = +startPoint + +PAGE_SIZE;
    if (filteredChapters.length > 0) {
      dispatch({
        type: ActionType.SET_PAGINATED_CHAPTERS,
        paginatedChapters: filteredChapters.slice(startPoint, endPoint),
      });
    } else {
      dispatch({
        type: ActionType.SET_PAGINATED_CHAPTERS,
        paginatedChapters: assignmentChapters.slice(startPoint, endPoint),
      });
    }
    dispatch({ type: ActionType.SET_PAGE, page: value });
  };

  /**
   * searching for assignment chapters
   * @param event
   * @return void
   */
  const searchAssignmentChapter = (event: ChangeEvent<HTMLInputElement>): void => {
    dispatch({ type: ActionType.SET_ERROR_MESSAGE, compErrorMessage: '' });
    const searchTerm = event.target.value;
    if (searchTerm === '') {
      clearSearch();
      return;
    }
    dispatch({ type: ActionType.SET_SEARCH_TERM, searchTerm: searchTerm });
    const forSearch = searchTerm.toUpperCase();
    const paginatedAssignmentSearch: AssignmentChapter[] = [];

    assignmentChapters.forEach((assignment) => {
      const { name } = assignment;
      if (name.toUpperCase().indexOf(forSearch) > -1) paginatedAssignmentSearch.push(assignment);
    });

    if (paginatedAssignmentSearch.length > 0) {
      dispatch({
        type: ActionType.SET_FILTERED_CHAPTERS,
        filteredChapters: paginatedAssignmentSearch,
      });
      const totalPages = Math.ceil(paginatedAssignmentSearch.length / PAGE_SIZE);
      dispatch({
        type: ActionType.SET_TOTAL_CHAPTER_PAGES,
        totalChapterPages: totalPages,
      });

      if (totalPages > 1) {
        dispatch({
          type: ActionType.SET_PAGINATED_CHAPTERS,
          paginatedChapters: paginatedAssignmentSearch.slice(
            (page - 1) * PAGE_SIZE,
            Number((page - 1) * PAGE_SIZE) + Number(PAGE_SIZE),
          ),
        });
      } else {
        dispatch({
          type: ActionType.SET_PAGINATED_CHAPTERS,
          paginatedChapters: paginatedAssignmentSearch,
        });
      }
      dispatch({
        type: ActionType.SET_TOTAL_CHAPTERS,
        totalChapters: paginatedAssignmentSearch.length,
      });
    } else {
      dispatch({
        type: ActionType.SET_ERROR_MESSAGE,
        compErrorMessage: `Search result against "${searchTerm}" not found`,
      });
    }
  };

  /**
   * clearing search for assignment chapters
   * @param null
   * @return void
   */
  const clearSearch = (): void => {
    dispatch({ type: ActionType.SET_SEARCH_TERM, searchTerm: '' });
    dispatch({ type: ActionType.SET_FILTERED_CHAPTERS, filteredChapters: [] });
    const totalPages = Math.ceil(assignmentChapters.length / PAGE_SIZE);
    dispatch({
      type: ActionType.SET_TOTAL_CHAPTER_PAGES,
      totalChapterPages: totalPages,
    });

    dispatch({
      type: ActionType.SET_PAGINATED_CHAPTERS,
      paginatedChapters: assignmentChapters.slice(
        (page - 1) * PAGE_SIZE,
        Number((page - 1) * PAGE_SIZE) + Number(PAGE_SIZE),
      ),
    });
    dispatch({
      type: ActionType.SET_TOTAL_CHAPTERS,
      totalChapters: assignmentChapters.length,
    });
    dispatch({ type: ActionType.SET_ERROR_MESSAGE, compErrorMessage: '' });
  };

  const redirectToExternalURL = (): void => {
    window.open(
      constructUrl([
        window.location.origin,
        getBaseUrl(),
        ASSIGNMENT_PATH,
        allCourses[0],
        'source',
        params.assignmentId,
      ]),
      '_blank',
    );
  };

  const refreshAssignmentChapters = (): void => {
    dispatch({ type: ActionType.SET_PAGINATED_CHAPTERS, paginatedChapters: [] });
    dispatch({ type: ActionType.SET_FILTERED_CHAPTERS, filteredChapters: [] });
    dispatch({ type: ActionType.SET_SEARCH_TERM, searchTerm: '' });
    dispatch({ type: ActionType.SET_ERROR_MESSAGE, compErrorMessage: '' });
    dispatch({
      type: ActionType.SET_LOADING_DIALOG,
      loadingDialog: !loadingDialog,
    });
    getAssignmentChapters(params.assignmentId);
  };

  /**
   * @section all JSX related logic goes below
   */
  const mainSection = (
    <>
      <div className={classes.innerSection}>
        <Box pt={1.75} pb={1.75} pl={2} pr={2}>
          <Grid
            container
            direction="row"
            justifyContent="flex-start"
            alignItems="center"
            data-cy="notebookPageTableHead"
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
                        data-cy="notebookPageTableSearchClear"
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
                onChange={searchAssignmentChapter}
                data-cy="notebookPageTableSearch"
              />
            </Grid>
            <Grid item xs={12} sm={7}>
              <Box mt={{ xs: 2.4, sm: 0 }}>
                <Grid container justifyContent="flex-end" alignItems="center">
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={refreshAssignmentChapters}
                    data-cy="notebooksSyncButton"
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
              assignmentChapters.length > PAGE_SIZE || filteredChapters.length > PAGE_SIZE
                ? 428
                : 'fit-content',
          }}
          data-cy="assignmentChaptersTable"
        >
          {compErrorMessage ? (
            <EmptyView title="Not Found!" message={compErrorMessage} height="55vh" />
          ) : (
            <TableComp
              headings={ASSIGNMENT_CHAPTERS_HEAD}
              type={TableName.ASSIGNMENT_CHAPTERS}
              apiData={paginatedChapters}
              redirectUrl={`/manual-grading/${params.assignmentId}`}
            />
          )}
        </TableContainer>
      </div>
      {assignmentChapters.length > PAGE_SIZE &&
      (searchTerm.length === 0 || filteredChapters.length > PAGE_SIZE) &&
      (compErrorMessage.length === 0 || filteredChapters.length > PAGE_SIZE) ? (
        <Pagination
          page={page}
          onChangePage={onChangePage}
          totalPages={totalChapterPages}
          totalRecords={totalChapters}
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
      <SubHeader title="Manual Grading" emptyData={assignmentChapters.length === 0} />

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
            },
          ]}
          charLimitForLongString={25}
        />
        {assignmentChapters && !ERROR_MESSAGES.includes(errorMessage || '') ? (
          mainSection
        ) : (
          <EmptyView
            title="No Notebook Found!"
            message={`No notebooks has been created for ${params.assignmentId}.`}
            btnText="Create New Notebook"
            openModal={redirectToExternalURL}
            height="67vh"
          />
        )}
      </div>
      <LoadingDialog loadingModal={loadingDialog} />
    </>
  );
};

export default AssignmentChapters;
