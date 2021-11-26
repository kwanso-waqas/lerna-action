import { FC, useState, useRef, useContext, useEffect } from 'react';
import { IconButton, Popper, ClickAwayListener, MenuList, MenuItem } from '@material-ui/core';
import { MoreVert } from '@material-ui/icons';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { LoadingDialog, colors } from '@illumidesk/common-ui';
import clsx from 'clsx';

import { AssignmentEditMenuProps, Assignment } from '../../../common/types';
import { AssignmentContext } from '../../../context/assignments';

import collectIcon from '../../../assets/img/assignmentTableIcons/collect.svg';
import exportIcon from '../../../assets/img/assignmentTableIcons/export.svg';
import generateIcon from '../../../assets/img/assignmentTableIcons/generate.svg';
import feedbackIcon from '../../../assets/img/assignmentTableIcons/feedback.svg';
import releaseFeedbackIcon from '../../../assets/img/assignmentTableIcons/releaseFeedback.svg';
import draftIcon from '../../../assets/img/assignmentTableIcons/draft.svg';
// Need this in upcoming feature
// import submitGradesIcon from "../../../assets/img/assignmentTableIcons/submitGrades.svg";

const { WHITE_COLOR, LIGHT_GREY_BG_COLOR } = colors;
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    popperStyles: {
      zIndex: 5,
      backgroundColor: WHITE_COLOR,
      boxShadow:
        '0px 0px 0px 1px rgba(0, 0, 0, 0.05), 0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05)',
      borderRadius: '6px',
      minWidth: '190px',
      '& ul': {
        padding: 0,
      },
    },
    menuItem: {
      padding: `${theme.spacing(1.5)}px ${theme.spacing(2)}px`,
    },
    menuItemText: {
      paddingLeft: theme.spacing(1),
    },
    greyMenu: {
      backgroundColor: LIGHT_GREY_BG_COLOR,
    },
    hide: {
      display: 'none',
    },
  }),
);

const EditMenu: FC<AssignmentEditMenuProps> = ({ assignmentName }): JSX.Element => {
  const classes = useStyles();
  const [editButtonStatus, showEditButton] = useState<boolean>(false);
  const [selectedAssignment, selectAssignment] = useState<Assignment>();
  const [loadingDialog, setLoadingDialog] = useState<boolean>(false);

  const anchorTableRef = {
    [assignmentName]: useRef<HTMLButtonElement>(null),
  };
  const { allAssignments, actionOnAssignment } = useContext(AssignmentContext);

  useEffect(() => {
    if (assignmentName !== '') {
      const searchedAssignment = allAssignments.filter(
        (assignment) => assignment.name === assignmentName,
      );
      if (searchedAssignment) {
        selectAssignment(searchedAssignment[0]);
      }
    }
  }, [allAssignments, assignmentName]);

  // Calling Context APIs
  const takeActionOnAssignment = (action: string) => {
    setLoadingDialog(true);
    actionOnAssignment(assignmentName, action).then(() => {
      setLoadingDialog(false);
    });
    handleClose();
  };

  const toggleEditButtonInTable = (): void => showEditButton((prevEditButton) => !prevEditButton);
  const handleClose = (): void => showEditButton(false);

  return (
    <>
      <IconButton
        ref={anchorTableRef[assignmentName]}
        aria-haspopup="true"
        onClick={toggleEditButtonInTable}
        data-cy="assignmentEditMenuIcon"
      >
        <MoreVert />
      </IconButton>
      <Popper
        className={classes.popperStyles}
        open={editButtonStatus}
        anchorEl={anchorTableRef[assignmentName].current}
        transition
        disablePortal={false}
        placement="bottom-end"
        modifiers={{
          preventOverflow: {
            enabled: true,
            boundariesElement: 'scrollParent',
          },
        }}
        data-cy="assignmentEditMenu"
      >
        <ClickAwayListener onClickAway={toggleEditButtonInTable}>
          <MenuList>
            <MenuItem
              onClick={() => takeActionOnAssignment('assign')}
              disabled={selectedAssignment?.release_path !== null}
              className={classes.menuItem}
            >
              <img src={generateIcon} alt="Generate icon" />
              <span className={classes.menuItemText}> Generate </span>
            </MenuItem>

            <MenuItem
              onClick={() => takeActionOnAssignment('release')}
              disabled={selectedAssignment?.status === 'released'}
              className={
                selectedAssignment?.release_path || selectedAssignment?.status === 'released'
                  ? classes.menuItem
                  : clsx(classes.menuItem, classes.hide)
              }
            >
              <img src={exportIcon} alt="Release icon" />
              <span className={classes.menuItemText}> Release </span>
            </MenuItem>

            <MenuItem
              onClick={() => takeActionOnAssignment('unrelease')}
              className={
                selectedAssignment?.status === 'released'
                  ? classes.menuItem
                  : clsx(classes.menuItem, classes.hide)
              }
            >
              <img src={draftIcon} alt="Draft icon" />
              <span className={classes.menuItemText}> Draft </span>
            </MenuItem>

            <MenuItem
              onClick={() => takeActionOnAssignment('collect')}
              className={
                selectedAssignment?.status === 'released'
                  ? classes.menuItem
                  : clsx(classes.menuItem, classes.hide)
              }
            >
              <img src={collectIcon} alt="Collect icon" />
              <span className={classes.menuItemText}> Collect </span>
            </MenuItem>

            <div className={classes.greyMenu}>
              {selectedAssignment && selectedAssignment?.num_submissions > 0 ? (
                <>
                  <MenuItem
                    onClick={() => takeActionOnAssignment('generate_feedback')}
                    className={classes.menuItem}
                  >
                    <img src={feedbackIcon} alt="Generate Feedback icon" />
                    <span className={classes.menuItemText}> Generate Feedback </span>
                  </MenuItem>
                  <MenuItem
                    onClick={() => takeActionOnAssignment('release_feedback')}
                    className={classes.menuItem}
                  >
                    <img src={releaseFeedbackIcon} alt="Release Feedback icon" />
                    <span className={classes.menuItemText}> Release Feedback </span>
                  </MenuItem>
                </>
              ) : (
                ''
              )}
              {/* Need this in upcoming feature */}
              {/* <MenuItem onClick={handleClose} className={classes.menuItem}> <img src={submitGradesIcon} alt="Submit Grades icon" /> <span className={classes.menuItemText}> Submit Grades </span> </MenuItem> */}
            </div>
          </MenuList>
        </ClickAwayListener>
      </Popper>

      <LoadingDialog loadingModal={loadingDialog} />
    </>
  );
};

export default EditMenu;
