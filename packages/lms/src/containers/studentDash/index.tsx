import React, { FC } from 'react';
import { Box, Grid, Typography, Card, CardContent, Avatar } from '@material-ui/core';
import { ArrowRightAlt } from '@material-ui/icons';
import { colors } from '@illumidesk/common-ui';

import { useStyles } from '../common/style';
import localStyles from './style';

const StudentDashboard: FC = (): JSX.Element => {
  const contClasses = useStyles();
  const classes = localStyles();

  return (
    <Box p={1}>
      <Grid container>
        <Grid item sm={1} lg={1}></Grid>
        <Grid item lg={10}>
          <Box className={contClasses.profileTitleContainer}>
            <Card className={classes.studentDashCard}>
              <CardContent>
                <Grid container>
                  <Grid item lg={1}></Grid>
                  <Grid item lg={10}>
                    <Typography variant="h6" color="textPrimary">
                      Welcome to
                    </Typography>
                    <Box mb={2}>
                      <Typography variant="h3" color="primary">
                        Demo Campus Site
                      </Typography>
                    </Box>
                    <Typography variant="body1" color="textPrimary">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Et amet dolor
                      pellentesque gravida. Phasellus venenatis orci tellus lacus, morbi.
                      Pellentesque mattis mattis tortor sollicitudin. Consequat, neque, mauris
                      mauris pulvinar turpis sed. Duis montes, a rutrum est faucibus. Et praesent
                      nullam est integer et nibh. Enim, nulla venenatis dictum posuere leo
                      pellentesque ut lorem elementum.
                    </Typography>
                  </Grid>
                  <Grid item lg={1}></Grid>
                </Grid>
              </CardContent>
            </Card>
          </Box>
        </Grid>
        <Grid item sm={1} lg={1}></Grid>
      </Grid>

      <Grid container>
        <Grid item sm={1} lg={1}></Grid>
        <Grid item lg={10}>
          <Box mb={4} mt={1} className={classes.featuredCourses}>
            <hr />
            <Typography variant="h4" color="textPrimary">
              Featured Courses
            </Typography>
          </Box>
          <Box mb={14.5}>
            <Grid container spacing={2}>
              <Grid item md={4}>
                <Card className={classes.customDashCard}>
                  <Box bgcolor={colors.GREEN_5}>
                    <CardContent>
                      <Grid
                        container
                        direction="row"
                        alignItems="center"
                        justifyContent="flex-start"
                      >
                        <Avatar />
                        <Box ml={1.88}>
                          <Typography variant="body1">Darlene Robertson</Typography>
                        </Box>
                      </Grid>
                      <Box my={1.5}>
                        <Typography variant="h4">Introduction to Laravel 8.0</Typography>
                      </Box>
                      <Box fontSize={18}>
                        Laravel is a PHP based web framework for building high-end web applications
                        using its significant and graceful syntaxes.
                      </Box>
                      <Box mt={2}>
                        <Grid container alignItems="center">
                          <Typography variant="h5">Learn More</Typography>
                          <ArrowRightAlt fontSize="large" style={{ marginLeft: 10 }} />
                        </Grid>
                      </Box>
                    </CardContent>
                  </Box>
                </Card>
              </Grid>
              <Grid item md={4}>
                <Card className={classes.customDashCard}>
                  <Box bgcolor="#FBBF24">
                    <CardContent>
                      <Grid
                        container
                        direction="row"
                        alignItems="center"
                        justifyContent="flex-start"
                      >
                        <Avatar />
                        <Box ml={1.88}>
                          <Typography variant="body1">Darlene Robertson</Typography>
                        </Box>
                      </Grid>
                      <Box my={1.5}>
                        <Typography variant="h4">Introduction to Laravel 8.0</Typography>
                      </Box>
                      <Box fontSize={18}>
                        Laravel is a PHP based web framework for building high-end web applications
                        using its significant and graceful syntaxes.
                      </Box>
                      <Box mt={2}>
                        <Grid container alignItems="center">
                          <Typography variant="h5">Learn More</Typography>
                          <ArrowRightAlt fontSize="large" style={{ marginLeft: 10 }} />
                        </Grid>
                      </Box>
                    </CardContent>
                  </Box>
                </Card>
              </Grid>
              <Grid item md={4}>
                <Card className={classes.customDashCard}>
                  <Box bgcolor="#60A5FA">
                    <CardContent>
                      <Grid
                        container
                        direction="row"
                        alignItems="center"
                        justifyContent="flex-start"
                      >
                        <Avatar />
                        <Typography style={{ marginLeft: 15 }} variant="body1">
                          Darlene Robertson
                        </Typography>
                      </Grid>
                      <Box my={1.5}>
                        <Typography variant="h4">Introduction to Laravel 8.0</Typography>
                      </Box>
                      <Box fontSize={18}>
                        Laravel is a PHP based web framework for building high-end web applications
                        using its significant and graceful syntaxes.
                      </Box>
                      <Box mt={2}>
                        <Grid container alignItems="center">
                          <Typography variant="h5">Learn More</Typography>
                          <ArrowRightAlt fontSize="large" style={{ marginLeft: 10 }} />
                        </Grid>
                      </Box>
                    </CardContent>
                  </Box>
                </Card>
              </Grid>
              <Grid item md={4}>
                <Card className={classes.customDashCard}>
                  <Box bgcolor="#F87171">
                    <CardContent>
                      <Grid
                        container
                        direction="row"
                        alignItems="center"
                        justifyContent="flex-start"
                      >
                        <Avatar />
                        <Typography style={{ marginLeft: 15 }} variant="body1">
                          Darlene Robertson
                        </Typography>
                      </Grid>
                      <Box my={1.5}>
                        <Typography variant="h4">Introduction to Laravel 8.0</Typography>
                      </Box>
                      <Box fontSize={18}>
                        Laravel is a PHP based web framework for building high-end web applications
                        using its significant and graceful syntaxes.
                      </Box>
                      <Box mt={2}>
                        <Grid container alignItems="center">
                          <Typography variant="h5">Learn More</Typography>
                          <ArrowRightAlt fontSize="large" style={{ marginLeft: 10 }} />
                        </Grid>
                      </Box>
                    </CardContent>
                  </Box>
                </Card>
              </Grid>
              <Grid item md={4}>
                <Card className={classes.customDashCard}>
                  <Box bgcolor="#EF5DA8">
                    <CardContent>
                      <Grid
                        container
                        direction="row"
                        alignItems="center"
                        justifyContent="flex-start"
                      >
                        <Avatar />
                        <Typography style={{ marginLeft: 15 }} variant="body1">
                          Darlene Robertson
                        </Typography>
                      </Grid>
                      <Box my={1.5}>
                        <Typography variant="h4">Introduction to Laravel 8.0</Typography>
                      </Box>
                      <Box fontSize={18}>
                        Laravel is a PHP based web framework for building high-end web applications
                        using its significant and graceful syntaxes.
                      </Box>
                      <Box mt={2}>
                        <Grid container alignItems="center">
                          <Typography variant="h5">Learn More</Typography>
                          <ArrowRightAlt fontSize="large" style={{ marginLeft: 10 }} />
                        </Grid>
                      </Box>
                    </CardContent>
                  </Box>
                </Card>
              </Grid>
              <Grid item md={4}>
                <Card className={classes.customDashCard}>
                  <Box bgcolor="#34D399">
                    <CardContent>
                      <Grid
                        container
                        direction="row"
                        alignItems="center"
                        justifyContent="flex-start"
                      >
                        <Avatar />
                        <Typography style={{ marginLeft: 15 }} variant="body1">
                          Darlene Robertson
                        </Typography>
                      </Grid>
                      <Box my={1.5}>
                        <Typography variant="h4">Introduction to Laravel 8.0</Typography>
                      </Box>
                      <Box fontSize={18}>
                        Laravel is a PHP based web framework for building high-end web applications
                        using its significant and graceful syntaxes.
                      </Box>
                      <Box mt={2}>
                        <Grid container alignItems="center">
                          <Typography variant="h5">Learn More</Typography>
                          <ArrowRightAlt fontSize="large" style={{ marginLeft: 10 }} />
                        </Grid>
                      </Box>
                    </CardContent>
                  </Box>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </Grid>
        <Grid item sm={1} lg={1}></Grid>
      </Grid>
    </Box>
  );
};

export default StudentDashboard;
