import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { colors } from '@illumidesk/common-ui';

import { LandingIllustration, NoIntegrationIllustration } from '../../assets';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    pageTitleContainer: {
      margin: '13px 30px',
      borderBottom: `1px solid ${colors.GREY_BORDER_COLOR}`,

      '& .MuiBreadcrumbs-root': {
        [theme.breakpoints.down('xs')]: {
          paddingLeft: 0,
        },
      },

      [theme.breakpoints.down('xs')]: {
        margin: '16px',
      },
    },
    mainSection: {
      [theme.breakpoints.down('xs')]: {
        padding: '0',
      },
    },

    profileTitleContainer: {
      position: 'relative',
      top: '-60px',
    },

    profileTitle: {
      [theme.breakpoints.down('xs')]: {
        justifyContent: 'center',
        textAlign: 'center',
      },
    },

    lightColorPara: {
      fontSize: 16,
      fontWeight: 400,
      color: colors.LIGHT_GREY_TEXT_COLOR,
    },
    emptyCourseParent: {
      display: 'flex',
      position: 'absolute',
      top: 76,
      height: 'calc(100% - 230px)',
      margin: '5em 3em 3em 5em',
      backgroundImage: `url('${LandingIllustration}')`,
      backgroundPosition: 'right bottom',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'contain',
      [theme.breakpoints.down('sm')]: {
        margin: '2em 1em 1em 2em',
      },
    },
    emptyIntegrationParent: {
      backgroundImage: `url('${NoIntegrationIllustration}')`,
      backgroundPosition: 'right bottom',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'contain',
      height: `calc(100vh - 270px)`,
      [theme.breakpoints.down('sm')]: {
        height: 'calc(100vh - 200px)',
      },
    },
    emptyCourseIllustration: {
      minWidth: '50%',
      width: '100%',
    },
    tableSearch: {
      width: '20em',
      backgroundColor: colors.WHITE_COLOR,
      [theme.breakpoints.down('xs')]: {
        width: '100%',
      },
    },

    tableBtn: {
      marginLeft: 16,
    },
    tableBtnDel: {
      color: colors.RED,
      backgroundColor: '#FEF2F2',
      borderColor: colors.RED_BORDER_COLOR,
    },
    tableBtnDelBg: {
      backgroundColor: `${colors.RED} !important`,
      color: colors.WHITE_COLOR,
      boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
    },
    tableBtnEdit: {
      borderColor: colors.GREY_BORDER_COLOR,
    },

    gcDialogFooter: {
      backgroundColor: '#F8FAFC',
      border: `1px solid ${colors.GREY_BORDER_COLOR}`,
      borderRadius: 6,
    },

    dangerCard: {
      border: `1px solid #DC2626`,
    },

    studentList: {
      display: 'block',
      minHeight: 'calc(100vh - 305px)',
      '& .MuiBox-root': {
        height: '100%',
        '& .MuiCard-root': {
          height: '100%',
        },
      },
    },

    studentListHeader: {
      borderBottom: `1px solid ${colors.LIGHT_GREY_BORDER_COLOR}`,
    },

    studentListBody: {
      overflow: 'auto',
    },

    customStepper: {
      backgroundColor: colors.LIGHT_GREY_BG_COLOR,
      paddingTop: 0,
      '& .MuiStepConnector-root': {
        padding: 0,
      },
      '& p': {
        position: 'absolute',
        left: 60,
        lineHeight: 0,
        width: 200,
      },
    },

    stepperContent: {
      '& .MuiCardHeader-subheader': {
        marginTop: 12,
      },
    },

    studentChips: {
      '& .MuiChip-root': {
        margin: 5,
      },
    },

    autoComplete: {
      '& .MuiAutocomplete-inputRoot': {
        padding: 5,
      },
      '& .MuiAutocomplete-tag': {
        border: `1px solid ${colors.LIGHT_GREY_BORDER_COLOR}`,
        backgroundColor: colors.WHITE_COLOR,
        color: colors.DARK_GREY_COLOR,
      },
      '& .MuiChip-deleteIcon': {
        padding: 2,
        color: colors.DARK_GREY_COLOR,
      },
    },

    removeEnd: {
      [theme.breakpoints.down('xs')]: {
        justifyContent: 'flex-start ',
      },
    },
    fullWidthBtn: {
      [theme.breakpoints.down('xs')]: {
        width: '100%',
        marginTop: '12px',
      },
    },
    stdAvatar: {
      [theme.breakpoints.down('xs')]: {
        justifyContent: 'flex-start ',
      },
      [theme.breakpoints.down('sm')]: {
        justifyContent: 'flex-start ',
      },
    },

    customAvatar: {
      width: 100,
      height: 100,
      borderRadius: '50%',
      [theme.breakpoints.down('sm')]: {
        width: 80,
        height: 80,
      },
    },

    customAvatarSimpleProfile: {
      width: 150,
      height: 150,
      border: `2px solid ${colors.WHITE_COLOR}`,
      borderRadius: '50%',
      [theme.breakpoints.down('sm')]: {
        width: 120,
        height: 120,
      },
    },
  }),
);
