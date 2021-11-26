import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    pageTitleContainer: {
      alignItems: 'center',
      backgroundColor: '#FFF',
      borderBottom: '1px solid #E5E7EB',
      padding: '18.5px 24px',

      [theme.breakpoints.down('xs')]: {
        alignItems: 'flex-start',
      },
    },
  }),
);

export default useStyles;
