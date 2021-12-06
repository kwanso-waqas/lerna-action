import { createStyles, makeStyles } from '@material-ui/core/styles';

export const alertStyles = makeStyles(() =>
  createStyles({
    customAlert: {
      alignItems: 'center',
      padding: 16,
      whiteSpace: 'pre-wrap',

      '& .MuiAlert-icon': {
        padding: 11,
        borderRadius: '50%',
      },

      '& .MuiAlert-message': {
        fontSize: 14,
        padding: 0,
        lineHeight: '20px',
        wordBreak: 'break-word',
      },

      '&.MuiAlert-outlinedWarning': {
        backgroundColor: '#FFFBEB',

        '& .MuiAlert-icon': {
          backgroundColor: '#FEF3C7',
        },
      },

      '&.MuiAlert-outlinedError': {
        backgroundColor: '#FEF2F2',

        '& .MuiAlert-icon': {
          backgroundColor: '#FEE2E2',
        },
      },
      '&.MuiAlert-outlinedInfo': {
        backgroundColor: '#E6F7FF',

        '& .MuiAlert-icon': {
          backgroundColor: '#CFF0FF',
        },
      },
    },
  }),
);
