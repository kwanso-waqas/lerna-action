import { makeStyles, createStyles } from '@material-ui/core/styles';
import { colors } from '@illumidesk/common-ui';

const useStyles = makeStyles(() =>
  createStyles({
    customAccordian: {
      boxShadow: 'none',
      border: `0.5px solid ${colors.GREY_BORDER_COLOR}`,
      borderRadius: '10px !important',
      '& .MuiAccordionSummary-root.Mui-expanded': {
        borderBottom: `0.5px solid ${colors.GREY_BORDER_COLOR}`,
      },
      marginBottom: '10px',
      '&::before': {
        backgroundColor: 'transparent !important',
      },
      '& hr': {
        border: `1px solid ${colors.GREY_BORDER_COLOR}`,
      },
    },

    customFooter: {
      '& .MuiBox-root': {
        display: 'inline',
        '& button': {
          color: colors.RED,
          borderColor: colors.RED,
          backgroundColor: colors.WHITE_COLOR,
        },
      },
    },
  }),
);

export default useStyles;
