import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

import { StudentHeader } from '../assets';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    courseDropdown: {
      padding: '0',
      width: '19em',
      border: '1px solid transparent',
      borderRadius: 8,
      boxShadow:
        '0px 0px 0px 1px rgba(0, 0, 0, 0.05), 0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05)',

      '& $courseDetail': {
        paddingLeft: '7px',
      },

      '@media(max-width: 400px)': {
        width: '20em',
      },

      '@media(max-width: 340px)': {
        width: '17em',
      },
    },

    topContainer: {
      backgroundImage: `url(${StudentHeader})`,
      backgroundSize: 'cover',
      backgroundPosition: 'right bottom',
      maxHeight: 600,
      '& img': {
        visibility: 'hidden',
      },
    },

    popperStyleProfile: {
      zIndex: 5,
      top: '5px !important',
      left: '-96px !important',
      [theme.breakpoints.down('sm')]: {
        left: '-13px !important',
      },
    },

    userAvatar: {
      border: '1px solid white',
      borderRadius: '50%',
    },

    iconBtn: {
      '&:hover': {
        backgroundColor: 'transparent',
      },
    },
    footerLogo: {
      [theme.breakpoints.down('xs')]: {
        width: '100%',
      },
    },
  }),
);

export default useStyles;
