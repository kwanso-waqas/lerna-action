import { makeStyles, createStyles } from '@material-ui/core/styles';
import { colors } from '@illumidesk/common-ui';

const useStyles = makeStyles(() =>
  createStyles({
    inviteStudentDialog: {
      '& .MuiDialog-paper': {
        maxWidth: 1000,
        maxHeight: 1000,
      },
      '& .MuiDialogContent-root': {
        padding: '15px 0',
      },
      '& .MuiPopover-paper, .MuiMenu-paper': {
        top: '230px !important',
        minWidth: '250px !important',
        width: '306px !important',
        borderRadius: '17px !important',
      },
    },

    customSelectBody: {
      '& .MuiInput-underline': {
        padding: 12,
        '&:before': {
          borderColor: colors.GREY_8,
        },
      },
    },

    pendingInvitesTitle: {
      backgroundColor: colors.DARK_GREY_BG_COLOR,
      borderBottom: `1px solid ${colors.LIGHT_GREY_BORDER_COLOR}`,
      padding: 20,
      '& span': {
        backgroundColor: colors.GREEN_8,
        color: colors.GREEN_COLOR,
        padding: '4px 6px',
        borderRadius: 4,
      },
    },

    pendingInvitesList: {
      '& .MuiChip-root': {
        backgroundColor: colors.RED_BG_2,
        color: colors.RED_2,
        borderRadius: 4,
      },
      '& .MuiListItem-container': {
        padding: 7,
        borderBottom: `1px solid ${colors.LIGHT_GREY_BORDER_COLOR}`,
      },
    },

    customFooter: {
      '& .MuiBox-root': {
        display: 'inline',
      },
    },
  }),
);

export default useStyles;
