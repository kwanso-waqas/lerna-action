import { ModalStyles } from '@illumidesk/common-ui';
import { Box, Grid, InputLabel, TextField, Typography } from '@material-ui/core';
import React, { FC } from 'react';

const LTI3Form: FC = (): JSX.Element => {
  const classes = ModalStyles();
  return (
    <>
      <Box>
        <Grid container direction="row" className={classes.extraMargins}>
          <Grid item md={4} sm={4} xs={12}>
            <InputLabel required={true}>Client ID</InputLabel>
          </Grid>
          <Grid item md={8} sm={8} xs={12}>
            <TextField required variant="outlined" />
          </Grid>
        </Grid>
        <Box className={classes.extraMargins}>
          <hr />
        </Box>
        <Grid container direction="row" alignItems="flex-start">
          <Grid item md={4} sm={4} xs={12}>
            <Box pt={1}>
              <Typography variant="body1">Redirect URL</Typography>
            </Box>
          </Grid>
          <Grid item md={8} sm={8} xs={12}>
            <TextField required variant="outlined" />
          </Grid>
        </Grid>
        <Box className={classes.extraMargins}>
          <hr />
        </Box>
        <Grid container direction="row" alignItems="flex-start">
          <Grid item md={4} sm={4} xs={12}>
            <Box pt={1}>
              <Typography variant="body1">Token URL</Typography>
            </Box>
          </Grid>
          <Grid item md={8} sm={8} xs={12}>
            <TextField required variant="outlined" />
          </Grid>
        </Grid>
        <Box className={classes.extraMargins}>
          <hr />
        </Box>
        <Grid container direction="row" alignItems="flex-start">
          <Grid item md={4} sm={4} xs={12}>
            <Box pt={1}>
              <Typography variant="body1">Authorization URL</Typography>
            </Box>
          </Grid>
          <Grid item md={8} sm={8} xs={12}>
            <TextField required variant="outlined" />
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default LTI3Form;
