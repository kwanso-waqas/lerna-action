import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { colors } from '@illumidesk/common-ui';

const {
  WHITE_COLOR,
  GREY_BORDER_COLOR,
  LIGHT_GREY_TEXT_COLOR,
  LIGHT_GREY_BG_COLOR,
  GREY_8,
  GREEN_COLOR,
  GREEN_BG_COLOR,
  BLACK_COLOR,
} = colors;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    pageTitleContainer: {
      alignItems: 'center',
      backgroundColor: WHITE_COLOR,
      borderBottom: `1px solid ${GREY_BORDER_COLOR}`,
      padding: '18.5px 24px',

      [theme.breakpoints.down('xs')]: {
        alignItems: 'flex-start',
      },
    },

    mainSection: {
      padding: '21px',
      [theme.breakpoints.down('sm')]: {
        paddingRight: 0,
      },
    },

    headings: {
      '& h2': {
        padding: `${theme.spacing(1.8)}px 0`,
      },
      '& h6': {
        marginTop: theme.spacing(2.5),
        padding: `${theme.spacing(2.1)}px 0`,
        [theme.breakpoints.down('xs')]: {
          padding: `${theme.spacing(1)}px 0 0 0`,
        },
      },
    },

    toUppercase: {
      textTransform: 'uppercase',
    },

    totalSubmission: {
      color: LIGHT_GREY_TEXT_COLOR,
      backgroundColor: LIGHT_GREY_BG_COLOR,
      border: `1px solid ${GREY_BORDER_COLOR}`,
      borderRadius: '4px',
      padding: theme.spacing(0.4),
      height: 'fit-content',
    },

    topPagination: {
      padding: `0 ${theme.spacing(1.2)}px`,

      [theme.breakpoints.down('xs')]: {
        paddingTop: theme.spacing(1),
        paddingRight: 0,
      },

      '& button': {
        margin: 0,
        padding: `${theme.spacing(1.8)}px ${theme.spacing(0.9)}px`,

        [theme.breakpoints.down('xs')]: {
          minWidth: '44px',
          padding: `${theme.spacing(1.2)}px 0`,
        },

        backgroundColor: WHITE_COLOR,
        border: `1px solid ${GREY_BORDER_COLOR}`,
        borderRadius: 0,

        '&:first-of-type': {
          borderTopLeftRadius: '6px',
          borderBottomLeftRadius: '6px',
        },

        '&:last-of-type': {
          borderTopRightRadius: '6px',
          borderBottomRightRadius: '6px',
        },

        '&:disabled': {
          border: `1px solid ${GREY_BORDER_COLOR}`,
          backgroundColor: GREY_8,
          cursor: 'not-allowed',
          pointerEvents: 'all',
          '&:hover': {
            backgroundColor: GREY_8,
          },
        },
      },
    },

    innerSection: {
      maxHeight: '70vh',
      height: '80%',
      overflowY: 'auto',
      '&::-webkit-scrollbar': {
        width: 6,
      },

      '&::-webkit-scrollbar-thumb': {
        backgroundColor: colors.GREEN_COLOR,
      },
    },

    answers: {
      margin: `${theme.spacing(2)}px 0`,

      '& p': {
        fontSize: 16,
        fontWeight: 600,
        color: GREEN_COLOR,
        [theme.breakpoints.down('sm')]: {
          fontSize: 14,
        },
      },
    },

    studentOutput: {
      padding: '15px 24px',
      marginTop: 10,
      border: `1px solid ${GREY_BORDER_COLOR}`,
      borderRadius: '8px',
      backgroundColor: LIGHT_GREY_BG_COLOR,
    },

    studentAns: {
      padding: '15px 24px',
      border: `1px solid ${GREY_BORDER_COLOR}`,
      borderLeft: `10px solid ${GREEN_COLOR}`,
      borderRadius: '8px',
      backgroundColor: LIGHT_GREY_BG_COLOR,

      '& h6': {
        color: BLACK_COLOR,
        fontSize: '18px',
        fontWeight: 600,
        marginBottom: '5px',
      },
    },

    ansResponse: {
      backgroundColor: WHITE_COLOR,
      marginTop: theme.spacing(3),
      '& input': {
        overflow: 'auto',
        overscrollBehavior: 'contain',
      },
    },

    lowerCell: {
      color: GREEN_COLOR,
      fontSize: 14,
      padding: 8,
      backgroundColor: GREEN_BG_COLOR,
      border: '1px solid transparent',
      borderRadius: 15,
      display: 'inline',
    },

    counterInput: {
      border: `1px solid ${GREY_BORDER_COLOR}`,
      borderRadius: 4,
      backgroundColor: WHITE_COLOR,
      display: 'inline-flex',
      alignItems: 'center',
      height: 'fit-content',
    },

    givenMarks: {
      width: 34,
      padding: `0 ${theme.spacing(1.5)}px`,
      fontSize: 12,
      fontWeight: 500,
    },

    counterInputGroup: {
      display: 'flex',
      flexDirection: 'column',

      '& button': {
        padding: 4,
        backgroundColor: LIGHT_GREY_BG_COLOR,
        border: `1px solid ${GREY_BORDER_COLOR}`,
        borderRadius: 0,

        '&:first-of-type': {
          borderTopRightRadius: 3,
        },

        '&:last-of-type': {
          borderBottomRightRadius: 3,
        },

        '& svg': {
          fontSize: 9,
          color: BLACK_COLOR,
        },
      },
    },

    extraContent: {
      fontSize: 12,
      padding: `0 ${theme.spacing(1.5)}px`,
      fontWeight: 600,
      color: LIGHT_GREY_TEXT_COLOR,

      '& span': {
        paddingLeft: theme.spacing(1),
      },
    },

    totalMarks: {
      width: 40,
      padding: '11px 14px',
      backgroundColor: LIGHT_GREY_BG_COLOR,
      border: `1px solid ${GREY_BORDER_COLOR}`,
      borderRadius: 4,
      lineHeight: '16px',
      fontSize: 12,
      fontWeight: 500,
    },

    textRight: {
      [theme.breakpoints.down('xs')]: {
        marginTop: 0,
      },
    },

    preTag: {
      whiteSpace: 'pre-wrap',
      margin: 0,
      fontFamily: 'inter',
      '& p': {
        fontSize: 15,
        fontWeight: 400,
        color: colors.DARK_GREY_COLOR,
        margin: 0,
      },
      '& div': {
        maxHeight: 'fit-content',
      },
      '& .MathJax': {
        textAlign: 'left !important',
      },
    },

    singleLine: {
      lineHeight: '0px',
    },

    output: {
      '& pre': {
        whiteSpace: 'pre-wrap',
        fontFamily: 'inter',
        fontSize: 15,
        fontWeight: 400,
        margin: 0,
      },
      '& p': {
        marginTop: 15,
        marginBottom: 8,
        color: colors.DARK_GREY_COLOR,
      },
    },

    studentCode: {
      '& code': {
        whiteSpace: 'pre-wrap',
      },
    },
  }),
);

export default useStyles;
