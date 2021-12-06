import React, { FC } from 'react';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  InputLabel,
  TextField,
  Typography,
} from '@material-ui/core';
import { ModalStyles, colors } from '@illumidesk/common-ui';
import { useHistory } from 'react-router-dom';
interface CourseDetailFormProps {
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
}

const CourseDetailForm: FC<CourseDetailFormProps> = ({ setActiveStep }): JSX.Element => {
  const classes = ModalStyles();
  const history = useHistory();
  return (
    <>
      <Card>
        <Box className={classes.gcDialog} style={{ width: '100%' }}>
          <CardHeader
            title="Add your Course Details"
            subheader="Please add your Course details to move to the next step."
          />
          <CardContent>
            <Grid container direction="row" className={classes.extraMargins}>
              <Grid item md={4} sm={4} xs={12}>
                <InputLabel required={true}>Course Title</InputLabel>
              </Grid>
              <Grid item md={8} sm={8} xs={12}>
                <TextField required variant="outlined" />
              </Grid>
            </Grid>
            <Box className={classes.extraMargins}>
              <hr style={{ borderColor: colors.GREY_BORDER_COLOR, opacity: 0.7 }} />
            </Box>
            <Grid container direction="row" alignItems="flex-start">
              <Grid item md={4} sm={4} xs={12}>
                <Box pt={1}>
                  <Typography variant="body1">Course Description</Typography>
                </Box>
              </Grid>
              <Grid item md={8} sm={8} xs={12}>
                <TextField required variant="outlined" multiline maxRows={7} />
              </Grid>
            </Grid>
          </CardContent>
        </Box>
        <CardActions className={classes.gcDialogFooter}>
          <Grid container alignItems="center">
            <Grid item xs={3}>
              <Button onClick={() => history.goBack()}>Cancel</Button>
            </Grid>
            <Grid item xs={9} container justifyContent="flex-end">
              <Box mr={1} style={{ display: 'inline' }}>
                <Button variant="outlined" disabled>
                  Previous
                </Button>
              </Box>
              <Button variant="contained" onClick={() => setActiveStep(1)} color="primary">
                Next
              </Button>
            </Grid>
          </Grid>
        </CardActions>
      </Card>
    </>
  );
};

export default CourseDetailForm;
