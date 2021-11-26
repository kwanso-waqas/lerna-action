import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { colors } from '@illumidesk/common-ui';

const { WHITE_COLOR, GREY_BORDER_COLOR } = colors;

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    pageTitleContainer: {
      backgroundColor: WHITE_COLOR,
      borderBottom: `1px solid ${GREY_BORDER_COLOR}`,
      padding: '20.5px 24px',

      [theme.breakpoints.down('xs')]: {
        padding: '16px',
      },
    },

    pageTitleContainerOnEmpty: {
      padding: '23px 24px',
      [theme.breakpoints.down('xs')]: {
        padding: '18px 16px',
      },
    },

    textRight: {
      display: 'flex',
      justifyContent: 'flex-end',

      [theme.breakpoints.down('xs')]: {
        marginTop: '19px',
        justifyContent: 'flex-start',
      },
    },
  }),
);
