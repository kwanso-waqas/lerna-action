import { makeStyles, createStyles } from '@material-ui/core/styles';
import { colors } from '@illumidesk/common-ui';

const useStyles = makeStyles(() =>
  createStyles({
    accordianCard: {
      boxShadow: 'none',
      border: `0.5px solid ${colors.GREY_BORDER_COLOR}`,
      borderRadius: 10,
      width: '100%',
      margin: 8,
      '& hr': {
        border: `0.5px solid ${colors.GREY_BORDER_COLOR}`,
      },
    },

    customCardBody: {
      padding: 0,
    },

    customTabs: {
      backgroundColor: colors.WHITE_COLOR,
      color: colors.GREEN_COLOR,
      borderBottom: `0.5px solid ${colors.GREY_BORDER_COLOR}`,
    },
  }),
);

export default useStyles;
