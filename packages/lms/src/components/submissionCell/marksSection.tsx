import { FC, useEffect, useContext, useReducer, Reducer } from 'react';
import { Grid, Hidden, IconButton, Tooltip, Button, useMediaQuery } from '@material-ui/core';
import { Add, Remove } from '@material-ui/icons';
import { colors } from '@illumidesk/common-ui';

import { SubmissionCell } from '../../common/types';
import { SubmissionContext } from '../../context/submissions';

import MarksDialog from '../alerts/marksDialog';

import useStyles from '../../containers/manualGradingAssignment/styles';
import increasePointsIcon from '../../assets/img/increasePoints.svg';
import decreasePointsIcon from '../../assets/img/decreasePoints.svg';
import feedbackIcon from '../../assets/img/feedback.svg';

interface SubmissionCellGradeProps {
  cellData: SubmissionCell;
}

interface State {
  totalMarks: number;
  calculatedMarks: number;
  credit: number;
  extraMarks: number;
  marksId: string;
  openCountModal: boolean;
  loading: boolean;
}

enum ActionType {
  SET_TOTAL_MARKS = 'setTotalMarks',
  ADD_MARKS = 'addMarks',
  ADD_CREDIT = 'addCredit',
  ADD_EXTRA_CREDIT = 'addExtraCredit',
  SET_MARKS_ID = 'setMarksId',
  SET_COUNT_MODAL = 'setCountModal',
  SET_LOADING = 'setLoading',
}

type Action =
  | { type: ActionType.SET_TOTAL_MARKS; totalMarks: number }
  | { type: ActionType.ADD_MARKS; calculatedMarks: number }
  | { type: ActionType.ADD_CREDIT; credit: number }
  | { type: ActionType.ADD_EXTRA_CREDIT; extraMarks: number }
  | { type: ActionType.SET_MARKS_ID; marksId: string }
  | { type: ActionType.SET_COUNT_MODAL; openCountModal: boolean }
  | { type: ActionType.SET_LOADING; loading: boolean };

const initialState: State = {
  totalMarks: 0,
  calculatedMarks: 0,
  credit: 0,
  extraMarks: 0,
  marksId: '',
  openCountModal: false,
  loading: false,
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionType.SET_TOTAL_MARKS:
      return {
        ...state,
        totalMarks: action.totalMarks,
      };
    case ActionType.ADD_MARKS:
      return {
        ...state,
        calculatedMarks: action.calculatedMarks,
      };
    case ActionType.ADD_CREDIT:
      return {
        ...state,
        credit: action.credit,
      };
    case ActionType.ADD_EXTRA_CREDIT:
      return {
        ...state,
        extraMarks: action.extraMarks,
      };
    case ActionType.SET_MARKS_ID:
      return {
        ...state,
        marksId: action.marksId,
      };
    case ActionType.SET_COUNT_MODAL:
      return {
        ...state,
        openCountModal: action.openCountModal,
      };
    case ActionType.SET_LOADING:
      return {
        ...state,
        loading: action.loading,
      };
    default:
      return state;
  }
};

const MarksSection: FC<SubmissionCellGradeProps> = ({ cellData }): JSX.Element => {
  /**
   * @section MarksSectionState
   */
  const [state, dispatch] = useReducer<Reducer<State, Action>>(reducer, initialState);
  const { totalMarks, calculatedMarks, credit, extraMarks, marksId, openCountModal, loading } =
    state;

  /**
   * @section design classes, colors and
   */
  const classes = useStyles();
  const { LIGHT_GREY_TEXT_COLOR } = colors;
  const { submissionGrades, updateSubmissionMarks, successMessage, errorMessage } =
    useContext(SubmissionContext);
  const { metadata } = cellData;
  const { nbgrader } = metadata;
  const { grade_id } = nbgrader || {};
  const matches = useMediaQuery('(max-width:600px)');

  /**
   * Getting grades data from API and setting it in local state
   */
  useEffect(() => {
    if (grade_id) {
      if (submissionGrades.length > 0) {
        const currentCell = submissionGrades.filter((grade) => {
          if (grade_id === grade.name) return grade;
          return null;
        });

        if (currentCell.length > 0) {
          const { max_score, manual_score, auto_score, extra_credit, id } = currentCell[0];
          const score = manual_score || auto_score || 0;
          const extraScore = extra_credit || 0;
          dispatch({ type: ActionType.SET_TOTAL_MARKS, totalMarks: max_score });
          dispatch({
            type: ActionType.ADD_CREDIT,
            credit: score,
          });
          dispatch({
            type: ActionType.ADD_EXTRA_CREDIT,
            extraMarks: extraScore,
          });
          dispatch({
            type: ActionType.ADD_MARKS,
            calculatedMarks: score + extraScore,
          });
          dispatch({ type: ActionType.SET_MARKS_ID, marksId: id });
        }
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submissionGrades]);

  useEffect(() => {
    if (successMessage.length > 0 && loading) {
      dispatch({ type: ActionType.SET_LOADING, loading: !loading });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [successMessage, errorMessage]);

  /**
   * Calculating task marks
   * @param mark
   */
  const calculateMarks = (mark: number): void => {
    dispatch({ type: ActionType.SET_LOADING, loading: !loading });
    const numb = credit;
    const newMark = numb + mark;
    if (newMark >= 0 && newMark <= totalMarks) {
      dispatch({ type: ActionType.ADD_CREDIT, credit: newMark });
      dispatch({
        type: ActionType.ADD_MARKS,
        calculatedMarks: extraMarks + newMark,
      });
      updateMarksInLMS(newMark, extraMarks);
    }
  };

  /**
   * Calculating bonus/extra task marks
   * @param extraMark
   */
  const calculateExtraMarks = (extraMark: number): void => {
    dispatch({ type: ActionType.SET_LOADING, loading: !loading });
    const numb = extraMarks;
    const newMark = numb + extraMark;
    if (newMark >= 0) {
      dispatch({ type: ActionType.ADD_EXTRA_CREDIT, extraMarks: newMark });
      dispatch({
        type: ActionType.ADD_MARKS,
        calculatedMarks: credit + newMark,
      });
      updateMarksInLMS(credit, newMark);
    }
  };

  /**
   * Calculating marks to it's full limit
   */
  const makeMarksFull = (): void => {
    dispatch({ type: ActionType.SET_LOADING, loading: !loading });
    dispatch({ type: ActionType.ADD_CREDIT, credit: totalMarks });
    dispatch({
      type: ActionType.ADD_MARKS,
      calculatedMarks: totalMarks + extraMarks,
    });
    updateMarksInLMS(totalMarks, extraMarks);
  };

  /**
   * Making marks zero not credit marks
   */
  const makeMarksZero = (): void => {
    dispatch({ type: ActionType.SET_LOADING, loading: !loading });
    dispatch({ type: ActionType.ADD_CREDIT, credit: 0 });
    dispatch({ type: ActionType.ADD_MARKS, calculatedMarks: extraMarks });
    updateMarksInLMS(0, extraMarks);
  };

  /**
   * Updating scores in online repository
   * @param manual_score
   * @param extra_credit
   */
  const updateMarksInLMS = async (manual_score: number, extra_credit: number): Promise<void> => {
    await updateSubmissionMarks(marksId, manual_score, extra_credit);
  };

  /**
   * Showing/hiding modal of marks update
   * @param modalStatus
   */
  const setCountModal = (modalStatus: boolean) => {
    dispatch({ type: ActionType.SET_COUNT_MODAL, openCountModal: modalStatus });
  };

  /**
   * @section JSX Elements
   */
  return (
    <Grid
      container
      justifyContent="flex-end"
      alignItems="center"
      data-cy="manualGradingAssignmentMarkingSection"
    >
      <Hidden only={['xs', 'sm']}>
        <div className={classes.counterInput}>
          <span className={classes.givenMarks} data-cy="manualGradingAssignmentGivenMarks">
            {' '}
            {credit}{' '}
          </span>
          <div className={classes.counterInputGroup}>
            <IconButton
              onClick={() => calculateMarks(1)}
              data-cy="manualGradingAssignmentAddGivenMarks"
            >
              <Add />
            </IconButton>
            <IconButton
              onClick={() => calculateMarks(-1)}
              data-cy="manualGradingAssignmentRemoveGivenMarks"
            >
              <Remove />
            </IconButton>
          </div>
        </div>
        <span className={classes.extraContent} data-cy="manualGradingAssignmentTotalMarks">
          / <span>{totalMarks}</span>
        </span>
        <Tooltip title="Full Credit" placement="top">
          <IconButton onClick={makeMarksFull} data-cy="manualGradingAssignmentMaxMarks">
            <img src={increasePointsIcon} alt="give max marks icon" />
          </IconButton>
        </Tooltip>
        <Tooltip title="No Credit" placement="top">
          <IconButton onClick={makeMarksZero} data-cy="manualGradingAssignmentMinMarks">
            <img src={decreasePointsIcon} alt="give zero marks icon" />
          </IconButton>
        </Tooltip>
        <Add style={{ color: LIGHT_GREY_TEXT_COLOR }} />
        <div className={classes.counterInput}>
          <span className={classes.givenMarks} data-cy="manualGradingAssignmentExtraMarks">
            {' '}
            {extraMarks}{' '}
          </span>
          <div className={classes.counterInputGroup}>
            <IconButton
              onClick={() => calculateExtraMarks(1)}
              data-cy="manualGradingAssignmentAddExtraMarks"
            >
              <Add />
            </IconButton>
            <IconButton
              onClick={() => calculateExtraMarks(-1)}
              data-cy="manualGradingAssignmentMinusExtraMarks"
            >
              <Remove />
            </IconButton>
          </div>
        </div>
        <span className={classes.extraContent}>
          Extra Credit <span> = </span>
        </span>
        <div className={classes.totalMarks} data-cy="manualGradingAssignmentCalculatedMarks">
          {' '}
          {calculatedMarks}{' '}
        </div>
      </Hidden>

      <Hidden mdUp>
        <Button
          style={{ width: matches ? '100%' : '50%', marginTop: matches ? 15 : 0 }}
          onClick={() => setCountModal(!openCountModal)}
          size="small"
          variant="outlined"
          color="secondary"
        >
          <img src={feedbackIcon} alt="feedback Icon" /> &nbsp; Give Credits
        </Button>
      </Hidden>
      <MarksDialog
        openModal={openCountModal}
        closeModal={() => setCountModal(!openCountModal)}
        calculatedMarks={calculatedMarks}
        extraMarks={extraMarks}
        totalMarks={totalMarks}
        marks={credit}
        loading={loading}
        makeMarksFull={makeMarksFull}
        makeMarksZero={makeMarksZero}
        calculateMarks={calculateMarks}
        calculateExtraMarks={calculateExtraMarks}
      />
    </Grid>
  );
};

export default MarksSection;
