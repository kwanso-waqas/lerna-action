import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  Grid,
  Typography,
  Box,
} from '@material-ui/core';
import { ModalStyles, colors } from '@illumidesk/common-ui';

import { useStyles } from '../../common/style';

interface ReviewDetailsProps {
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
}
const ReviewDetails: FC<ReviewDetailsProps> = ({ setActiveStep }): JSX.Element => {
  const history = useHistory();
  const classes = ModalStyles();
  const commonClasses = useStyles();

  return (
    <>
      <Card>
        <Box className={classes.gcDialog} style={{ width: '100%' }}>
          <CardHeader
            className={commonClasses.stepperContent}
            title="Review your Course Details"
            subheader="Please verify your details before adding new course"
          />
          <CardContent>
            <Box>
              <Grid
                container
                direction="row"
                justifyContent="space-between"
                alignItems="flex-start"
              >
                <Grid item>
                  <Typography variant="body1">Course Title</Typography>
                </Grid>
                <Grid item>
                  <Typography variant="body1">Introduction to Laravel 8.0</Typography>
                </Grid>
              </Grid>
              <Box className={classes.extraMargins}>
                <hr style={{ borderColor: colors.GREY_BORDER_COLOR, opacity: 0.7 }} />
              </Box>
              <Grid
                container
                direction="row"
                justifyContent="space-between"
                alignItems="flex-start"
              >
                <Grid item xs={6}>
                  <Typography variant="body1">Course Description</Typography>
                </Grid>
                <Grid item xs={6} container justifyContent="space-evenly">
                  <Typography variant="body1">
                    Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit
                    officia consequat duis enim velit mollit. Exercitation veniam consequat sunt
                    nostrud amet.
                  </Typography>
                </Grid>
              </Grid>
              <Box className={classes.extraMargins}>
                <hr style={{ borderColor: colors.GREY_BORDER_COLOR, opacity: 0.7 }} />
              </Box>
              <Grid
                container
                direction="row"
                justifyContent="space-between"
                alignItems="flex-start"
              >
                <Grid item>
                  <Typography variant="body1">Invite Emails</Typography>
                </Grid>
                <Grid item className={commonClasses.studentChips}>
                  <Chip label="faizan.saleem@kwanso.com" variant="outlined" />
                  <Chip label="hamid.rasool@kwanso.com" variant="outlined" />
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Box>
        <CardActions className={classes.gcDialogFooter}>
          <Grid container alignItems="center">
            <Grid item xs={3}>
              <Button onClick={() => history.goBack()}>Cancel</Button>
            </Grid>
            <Grid item xs={9} container justifyContent="flex-end">
              <Box mr={1.5} style={{ display: 'inline' }}>
                <Button variant="outlined" onClick={() => setActiveStep(1)}>
                  Previous
                </Button>
              </Box>
              <Button variant="contained" onClick={() => history.push('/courses')} color="primary">
                Finish
              </Button>
            </Grid>
          </Grid>
        </CardActions>
      </Card>
    </>
  );
};

export default ReviewDetails;
