import { FC, MouseEventHandler } from 'react';
import {
  Box,
  Grid,
  Typography,
  Divider,
  IconButton,
  Tooltip,
  Button,
  Dialog,
  DialogTitle,
  CircularProgress,
  useMediaQuery,
} from '@material-ui/core';
import { Add, Remove } from '@material-ui/icons';

import useStyles from '../../../containers/manualGradingAssignment/styles';

import { increasePointsIcon, decreasePointsIcon } from '../../../assets';

interface MarksDialogProps {
  openModal: boolean;
  closeModal: MouseEventHandler;

  calculatedMarks: number;
  extraMarks: number;
  totalMarks: number;
  marks: number;
  loading: boolean;
  makeMarksFull: MouseEventHandler;
  makeMarksZero: MouseEventHandler;
  calculateMarks: (newMarks: number) => void;
  calculateExtraMarks: (newExtraMarks: number) => void;
}

const MarksDialog: FC<MarksDialogProps> = ({
  openModal,
  closeModal,
  calculatedMarks,
  extraMarks,
  totalMarks,
  marks,
  loading,
  makeMarksFull,
  makeMarksZero,
  calculateMarks,
  calculateExtraMarks,
}): JSX.Element => {
  const classes = useStyles();
  const matches = useMediaQuery('(max-width:600px)');

  return (
    <Dialog onClose={closeModal} aria-labelledby="assignment-grading-dialog" open={openModal}>
      <Box p={2}>
        <Grid container justifyContent="center">
          <Grid item xs={12}>
            <DialogTitle disableTypography id="assignment-grading-title">
              <Typography variant="h5" color="textPrimary">
                Give Credits
              </Typography>
            </DialogTitle>
            <Divider style={{ marginBottom: 25, marginTop: 15 }} />
          </Grid>
          <Grid item xs={12}>
            <div className={classes.totalMarks} style={{ width: '100%', textAlign: 'center' }}>
              <Typography variant="h5"> {calculatedMarks} </Typography>
              <Typography variant="caption" color="textSecondary">
                Total Credits
              </Typography>
            </div>
            <Divider style={{ margin: '25px 0' }} />
          </Grid>

          <Box my={1.5} width="100%">
            <Grid container>
              <Grid item xs={12}>
                <Box mb={1.2}>
                  <Typography variant="h6" color="textSecondary">
                    Credits
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} className={classes.totalMarks}>
                <Grid container alignItems="center">
                  <Grid container alignItems="center" justifyContent="flex-start" item xs={4}>
                    <Box py={1} px={0} mr={0.8} className={classes.counterInput}>
                      <span className={classes.givenMarks}> {marks} </span>
                    </Box>
                    <Typography variant="body1"> {`/ ${totalMarks}`} </Typography>
                  </Grid>
                  <Grid container direction="row" justifyContent="center" item xs={4}>
                    <Tooltip title="Full Credit" placement="top">
                      <IconButton size="small" onClick={makeMarksFull}>
                        <img src={increasePointsIcon} alt="give max marks icon" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="No Credit" placement="top">
                      <IconButton size="small" onClick={makeMarksZero}>
                        <img src={decreasePointsIcon} alt="give zero marks icon" />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                  <Grid container direction="row" justifyContent="flex-end" item xs={4}>
                    <Box className={classes.counterInput}>
                      <IconButton size="small" onClick={() => calculateMarks(1)}>
                        <Add fontSize="small" />
                      </IconButton>
                    </Box>
                    <Box ml={2} className={classes.counterInput}>
                      <IconButton size="small" onClick={() => calculateMarks(-1)}>
                        <Remove fontSize="small" />
                      </IconButton>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>

          <Box my={1.5} width="100%">
            <Grid container>
              <Grid item xs={12}>
                <Box mb={1.2}>
                  <Typography variant="h6" color="textSecondary">
                    Extra Credits
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} className={classes.totalMarks}>
                <Grid container alignItems="center">
                  <Grid container justifyContent="flex-start" item xs={6}>
                    <Box py={1} px={0} className={classes.counterInput}>
                      <span className={classes.givenMarks}> {extraMarks} </span>
                    </Box>
                  </Grid>
                  <Grid container direction="row" justifyContent="flex-end" item xs={6}>
                    <Box className={classes.counterInput}>
                      <IconButton onClick={() => calculateExtraMarks(1)} size="small">
                        <Add fontSize="small" />
                      </IconButton>
                    </Box>
                    <Box ml={2} className={classes.counterInput}>
                      <IconButton onClick={() => calculateExtraMarks(-1)} size="small">
                        <Remove fontSize="small" />
                      </IconButton>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Grid>
        <Box mt={1.5}>
          <Grid container justifyContent={matches ? 'center' : 'flex-end'}>
            <Button
              style={{ width: matches ? '100%' : '30%' }}
              size="large"
              variant="contained"
              color="primary"
              onClick={closeModal}
              disabled={loading}
            >
              {loading ? <CircularProgress size={18} /> : <>Done</>}
            </Button>
          </Grid>
        </Box>
      </Box>
    </Dialog>
  );
};

export default MarksDialog;
