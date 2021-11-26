import { FC, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { TableRow, TableCell, Typography, IconButton, Button, Chip, Box } from '@material-ui/core';
import { Visibility, VisibilityOff, FiberManualRecord } from '@material-ui/icons';
import { BootstrapTooltip, ContainerStyles } from '@illumidesk/common-ui';
import moment from 'moment';
import clsx from 'clsx';

import autogradeIcon from '../../assets/img/assignmentTableIcons/autograde.svg';

import { TableName } from '../../common/constants';
import {
  Assignment,
  AssignmentChapter,
  Student,
  StudentAssignment,
  ChapterSubmission,
  AssignmentSubmissionAutograde,
} from '../../common/types';

import EditMenu from '../menus/editMenu';

import TrueStatus from '../../assets/img/assignmentTableIcons/trueStatus.svg';
import FalseStatus from '../../assets/img/assignmentTableIcons/falseStatus.svg';

interface TableRowProps {
  redirectAction: (dataToAppend: string, studentId?: string, index?: number) => void;
  type: string;
  parentNode: boolean;
  singleData: Assignment | AssignmentChapter | Student | StudentAssignment | ChapterSubmission;
  // eslint-disable-next-line @typescript-eslint/ban-types
  updateAction?: Function;
}

const TableRowComp: FC<TableRowProps> = ({
  redirectAction,
  type,
  parentNode,
  singleData,
  updateAction,
}): JSX.Element => {
  const [userName, setUserNameVisibility] = useState<boolean>(false);
  const classes = ContainerStyles();
  const history = useHistory();

  useEffect(() => {
    setUserNameVisibility(parentNode);
  }, [parentNode]);

  const changeVisibility = (): void => {
    setUserNameVisibility((prevState) => !prevState);
  };

  let columnData: JSX.Element = <></>;

  switch (type) {
    case TableName.MANAGE_ASSIGNMENTS:
      const { name, duedate_notimezone, status, num_submissions } = singleData as Assignment;
      columnData = (
        <>
          <TableCell variant="body">
            <BootstrapTooltip title={name} placement="bottom" charlength={25}>
              <Box onClick={() => redirectAction(name)} className={classes.cursorPointer}>
                <Typography variant="body1">
                  {name.length > 25 ? `${name.substr(0, 25)}...` : name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Due Date:
                  {duedate_notimezone ? (
                    moment(duedate_notimezone).format('DD/MM/yyyy')
                  ) : (
                    <Typography variant="caption" display="inline" color="error">
                      NONE
                    </Typography>
                  )}
                </Typography>
              </Box>
            </BootstrapTooltip>
          </TableCell>
          <TableCell variant="body">
            {status === 'released' ? (
              <Chip color="primary" icon={<FiberManualRecord />} label="Released" />
            ) : (
              <Chip color="secondary" icon={<FiberManualRecord />} label="Draft" />
            )}
          </TableCell>
          <TableCell variant="body">
            <Box
              className={clsx(classes.counterTd, {
                [classes.cursorPointer]: num_submissions > 0,
                [classes.counterTdActive]: num_submissions > 0,
              })}
              onClick={() => history.push(`/manage-assignments/${name}`)}
            >
              {num_submissions}
            </Box>
          </TableCell>
          <TableCell variant="body">
            {updateAction ? (
              <Button
                variant="outlined"
                color="secondary"
                onClick={(event) => updateAction(event, name)}
                data-cy={`editAssignmentBtn`}
              >
                Edit
              </Button>
            ) : (
              ''
            )}
          </TableCell>
          <TableCell variant="body">
            <EditMenu assignmentName={name} />
          </TableCell>
        </>
      );
      break;

    case TableName.MANUAL_GRADING:
      const {
        name: assignmentName,
        duedate_notimezone: date_grading,
        num_submissions: assignmentSubmissions,
        max_score: totalAssignmentMarks,
        average_score,
      } = singleData as Assignment;
      columnData = (
        <>
          <TableCell variant="body">
            <BootstrapTooltip title={assignmentName} placement="bottom" charlength={25}>
              <Box
                onClick={() => redirectAction(encodeURI(assignmentName))}
                className={classes.cursorPointer}
                data-cy="onClickManualGradingToAssignmentNotebooks"
              >
                <Typography variant="body1">
                  {assignmentName.length > 25
                    ? `${assignmentName.substring(0, 25)}...`
                    : assignmentName}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Due Date:
                  {date_grading ? (
                    moment(date_grading).format('DD/MM/yyyy').toUpperCase()
                  ) : (
                    <Typography variant="caption" display="inline" color="error">
                      NONE
                    </Typography>
                  )}
                </Typography>
              </Box>
            </BootstrapTooltip>
          </TableCell>
          <TableCell variant="body">
            <div className={classes.counterTd}> {assignmentSubmissions} </div>
          </TableCell>
          <TableCell variant="body">
            <div className={classes.counterTd}>
              {average_score}/{totalAssignmentMarks}
            </div>
          </TableCell>
        </>
      );
      break;
    case TableName.ASSIGNMENT_CHAPTERS:
      const {
        name: chapterName,
        average_score: avg_chapter_score,
        max_score: max_chapter_score,
        average_code_score,
        max_code_score: max_chapter_code_score,
        average_task_score,
        max_task_score: max_chapter_task_score,
        average_written_score,
        max_written_score: max_chapter_written_score,
        needs_manual_grade,
      } = singleData as AssignmentChapter;
      columnData = (
        <>
          <TableCell>
            <Box
              onClick={() => redirectAction(encodeURI(chapterName))}
              className={classes.cursorPointer}
              data-cy="notebookClickEle"
            >
              <Typography variant="body1" color="textPrimary">
                {chapterName}
              </Typography>
            </Box>
          </TableCell>
          <TableCell>
            <div className={classes.counterTd}>
              {avg_chapter_score}/{max_chapter_score}
            </div>
          </TableCell>
          <TableCell>
            <div className={classes.counterTd}>
              {average_code_score}/{max_chapter_code_score}
            </div>
          </TableCell>
          <TableCell>
            <div className={classes.counterTd}>
              {average_written_score}/{max_chapter_written_score}
            </div>
          </TableCell>
          <TableCell>
            <div className={classes.counterTd}>
              {average_task_score}/{max_chapter_task_score}
            </div>
          </TableCell>
          <TableCell>
            {needs_manual_grade ? (
              <img src={TrueStatus} alt="needs manual grading" />
            ) : (
              <img src={FalseStatus} alt="not need manual grading" />
            )}
          </TableCell>
        </>
      );
      break;
    case TableName.NOTBOOKS_AGAINST_CHAPTERS:
      const {
        id: submission_id,
        student: studentId,
        first_name: student_first,
        last_name: student_last,
        score: submission_score,
        max_score: submission_max_score,
        code_score: submission_code_score,
        max_code_score: submission_max_code_score,
        task_score: submission_task_score,
        max_task_score: submission_max_task_score,
        written_score: submission_written_score,
        max_written_score: submission_max_written_score,
        failed_tests,
        needs_manual_grade: submission_manual_grade,
        flagged,
        index: submissionNo,
      } = singleData as ChapterSubmission;
      columnData = (
        <>
          <TableCell>
            <IconButton size="small" onClick={changeVisibility}>
              {userName ? <Visibility fontSize="small" /> : <VisibilityOff fontSize="small" />}
            </IconButton>
          </TableCell>
          <TableCell>
            <div className={classes.cursorPointer} data-cy="submissionNameDisplay">
              <Typography
                onClick={() => redirectAction(submission_id, studentId, submissionNo + 1)}
                style={{ display: 'inline' }}
                color={userName ? 'primary' : 'textPrimary'}
              >
                {userName
                  ? `${student_first || 'None'} ${student_last || 'None'}`
                  : `Submission #${('0' + (submissionNo + 1)).slice(-2)}`}
              </Typography>
            </div>
          </TableCell>
          <TableCell>
            <div className={classes.counterTd}>
              {submission_score}/{submission_max_score}
            </div>
          </TableCell>
          <TableCell>
            <div className={classes.counterTd}>
              {submission_code_score}/{submission_max_code_score}
            </div>
          </TableCell>
          <TableCell>
            <div className={classes.counterTd}>
              {submission_written_score}/{submission_max_written_score}
            </div>
          </TableCell>
          <TableCell>
            <div className={classes.counterTd}>
              {submission_task_score}/{submission_max_task_score}
            </div>
          </TableCell>
          <TableCell>
            {submission_manual_grade ? (
              <img src={TrueStatus} alt="needs manual grading" />
            ) : (
              <img src={FalseStatus} alt="not need manual grading" />
            )}
          </TableCell>
          <TableCell>
            {!failed_tests ? (
              <img src={TrueStatus} alt="needs manual grading" />
            ) : (
              <img src={FalseStatus} alt="not need manual grading" />
            )}
          </TableCell>
          <TableCell>
            {flagged ? (
              <img src={TrueStatus} alt="needs manual grading" />
            ) : (
              <img src={FalseStatus} alt="not need manual grading" />
            )}
          </TableCell>
        </>
      );
      break;

    case TableName.MANAGE_STUDENTS:
      const { id, first_name, last_name, email, max_score, score } = singleData as Student;
      columnData = (
        <>
          <TableCell>
            <Box
              className={classes.cursorPointer}
              onClick={() => redirectAction(id)}
              data-cy="studentLinkToAssignmentDetails"
            >
              <Typography variant="body1">
                {`${first_name || 'None'} ${last_name || 'None'}`}
              </Typography>
              {email ? (
                <Typography variant="caption"> {email} </Typography>
              ) : (
                <Typography variant="caption" color="error">
                  None
                </Typography>
              )}
            </Box>
          </TableCell>
          <TableCell>
            <BootstrapTooltip title={id} placement="bottom" charlength={15}>
              <Typography variant="body1">
                {id.length > 15 ? `${id.substring(0, 15)}...` : id}
              </Typography>
            </BootstrapTooltip>
          </TableCell>
          <TableCell>
            <div className={classes.counterTd}>
              {score}/{max_score}
            </div>
          </TableCell>
          <TableCell>
            {updateAction ? (
              <Button
                variant="outlined"
                color="secondary"
                onClick={(event) => updateAction(event, singleData as Student)}
              >
                Edit
              </Button>
            ) : (
              ''
            )}
          </TableCell>
        </>
      );
      break;
    case TableName.STUDENT_ASSIGNMENTS:
      const {
        submitted,
        name: submittedAssignmentName,
        timestamp,
        score: marks,
        max_score: max_marks,
        code_score,
        max_code_score,
        written_score,
        max_written_score,
        task_score,
        max_task_score,
        needs_manual_grade: student_manual_grade,
      } = singleData as StudentAssignment;
      columnData = (
        <>
          <TableCell>
            <div>
              <BootstrapTooltip title={submittedAssignmentName} placement="bottom" charlength={25}>
                <Typography color="textPrimary">
                  {submittedAssignmentName.length > 25
                    ? `${submittedAssignmentName.substr(0, 25)}...`
                    : submittedAssignmentName}
                </Typography>
              </BootstrapTooltip>
              {submitted ? (
                <Typography variant="caption" color="primary">
                  Submitted: {moment(timestamp).format('DD/MM/yyyy')}
                </Typography>
              ) : (
                <></>
              )}
            </div>
          </TableCell>
          <TableCell>
            <div className={classes.counterTd}>
              {marks}/{max_marks}
            </div>
          </TableCell>
          <TableCell>
            <div className={classes.counterTd}>
              {code_score}/{max_code_score}
            </div>
          </TableCell>
          <TableCell>
            <div className={classes.counterTd}>
              {written_score}/{max_written_score}
            </div>
          </TableCell>
          <TableCell>
            <div className={classes.counterTd}>
              {task_score}/{max_task_score}
            </div>
          </TableCell>
          <TableCell>
            {student_manual_grade ? (
              <img src={TrueStatus} alt="needs manual grading" />
            ) : (
              <img src={FalseStatus} alt="not need manual grading" />
            )}
          </TableCell>
        </>
      );
      break;

    case TableName.ASSIGNMENT_SUBMISSIONS:
      const {
        name: autoAssignmentName,
        student: autoStudentId,
        display_timestamp,
        score: autograde_score,
        max_score: max_autograde_score,
        autograded,
        needs_manual_grade: auto_needs_manual_grade,
        submitted: auto_submitted,
      } = singleData as AssignmentSubmissionAutograde;
      columnData = (
        <>
          <TableCell variant="body">
            <BootstrapTooltip title={autoStudentId} placement="bottom" charlength={25}>
              <Box>
                <Typography variant="body1">
                  {autoStudentId.length > 25 ? `${autoStudentId.substr(0, 25)}...` : autoStudentId}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Due Date:
                  {display_timestamp ? (
                    moment(display_timestamp).format('DD/MM/yyyy')
                  ) : (
                    <Typography variant="caption" display="inline" color="error">
                      NONE
                    </Typography>
                  )}
                </Typography>
              </Box>
            </BootstrapTooltip>
          </TableCell>
          <TableCell>
            <div className={classes.counterTd}>
              {autograde_score}/{max_autograde_score}
            </div>
          </TableCell>
          <TableCell variant="body">
            {autograded && auto_needs_manual_grade && auto_submitted ? (
              <Chip color="secondary" icon={<FiberManualRecord />} label="Needs Manual Grading" />
            ) : (
              <></>
            )}
            {autograded && !auto_needs_manual_grade && auto_submitted ? (
              <Chip color="default" icon={<FiberManualRecord />} label="Graded" />
            ) : (
              <></>
            )}
            {!autograded && !auto_needs_manual_grade && auto_submitted ? (
              <Chip color="primary" icon={<FiberManualRecord />} label="Needs Auto Grading" />
            ) : (
              <></>
            )}
          </TableCell>
          <TableCell variant="body">
            {updateAction ? (
              <Button
                variant="outlined"
                color="primary"
                onClick={() => updateAction(autoAssignmentName, autoStudentId)}
                data-cy={`editAssignmentBtn`}
              >
                <img src={autogradeIcon} alt="autograde icon" /> Autograde
              </Button>
            ) : (
              <></>
            )}
          </TableCell>
        </>
      );
      break;

    default:
      break;
  }

  return <TableRow>{columnData}</TableRow>;
};

export default TableRowComp;
