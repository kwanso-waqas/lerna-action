import { makeStyles, createStyles } from '@material-ui/core/styles';
import { colors } from '@illumidesk/common-ui';

import { BackdropEffect } from '../../assets';

const useStyles = makeStyles(() =>
  createStyles({
    studentDashCard: {
      backgroundImage: `url(${BackdropEffect})`,
      backgroundSize: 'cover',
      '& hr': {
        border: `4px solid ${colors.GREEN_COLOR}`,
        width: 80,
      },
    },

    featuredCourses: {
      '& hr': {
        border: `3px solid `,
        borderColor: colors.GREEN_COLOR,
        color: colors.GREEN_COLOR,
        width: 80,
        borderWidth: 3,
      },
      '& h4': {
        textAlign: 'center',
      },
    },

    customDashCard: {
      color: colors.WHITE_COLOR,
    },
  }),
);

export default useStyles;
