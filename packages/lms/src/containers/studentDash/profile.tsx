import React, { FC, useState } from 'react';
import { Box, Grid, Typography, Button, Avatar, TextField } from '@material-ui/core';
import { DropzoneDialog } from 'material-ui-dropzone';

import { EditIcon } from '../../assets';
import { useStyles } from '../common/style';

const StudentDashboardProfile: FC = (): JSX.Element => {
  const [updateProfile, setUpdateProfile] = useState<boolean>(false);
  const [files, setFiles] = useState<unknown[]>([]);
  const [open, setOpen] = useState<boolean>(false);

  const classes = useStyles();

  const handleSave = (image: unknown[]) => {
    console.log(image, '<<<<<IMAGE');
    setFiles(image);
    setOpen(!open);
    console.log(files, '<<<<FILES');
  };

  return (
    <>
      <Box className={classes.profileTitleContainer} pl={3}>
        <Grid container>
          <Grid item xl={3} lg={2}></Grid>
          <Grid item xl={6} lg={8} sm={10} container alignItems="flex-end">
            <Grid
              item
              md={2}
              xs={12}
              sm={3}
              container
              justifyContent="flex-end"
              className={classes.profileTitle}
            >
              <Avatar className={classes.customAvatarSimpleProfile} />
              <DropzoneDialog
                open={open}
                onSave={handleSave}
                acceptedFiles={['image/jpeg', 'image/png', 'image/bmp']}
                showPreviews={true}
                maxFileSize={5000000}
                onClose={() => setOpen(!open)}
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
              sm={7}
              container
              justifyContent="flex-start"
              className={classes.profileTitle}
            >
              <Box ml={2}>
                <Box mb={1}>
                  <Typography variant="h1" color="textPrimary">
                    Ricardo Cooper
                  </Typography>
                </Box>
                <Typography variant="body1" color="textSecondary">
                  ricardocooper@gmail.com
                </Typography>
              </Box>
            </Grid>
            <Grid
              item
              md={3}
              sm={2}
              xs={12}
              container
              justifyContent="flex-end"
              className={classes.profileTitle}
            >
              <Box pt={1}>
                {updateProfile ? (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setUpdateProfile(!updateProfile)}
                  >
                    Update
                  </Button>
                ) : (
                  <Button
                    variant="outlined"
                    color="default"
                    onClick={() => setUpdateProfile(!updateProfile)}
                  >
                    <img src={EditIcon} alt="Edit icon" />
                    Edit
                  </Button>
                )}
              </Box>
            </Grid>
          </Grid>
          <Grid item xl={3} lg={2}></Grid>
        </Grid>
      </Box>

      <Box mr={3} ml={3}>
        <Grid container>
          <Grid item xl={3} lg={2}></Grid>
          <Grid item xl={6} lg={8} container>
            <Grid item md={12}>
              <Typography variant="h5" color="textPrimary">
                Account Details
              </Typography>
            </Grid>

            <Grid item md={12} xs={12}>
              <Box my={3}>
                <hr style={{ border: '0.5px solid #E5E7EB' }} />
              </Box>
            </Grid>

            <Grid item md={1}></Grid>
            <Grid item md={11} container alignItems="center">
              <Grid item md={6} sm={6} xs={12}>
                <Typography variant="body1" color="textPrimary">
                  First Name
                </Typography>
              </Grid>
              <Grid item md={6} sm={6} xs={12}>
                {updateProfile ? (
                  <TextField variant="outlined" placeholder="First Name" defaultValue="Ricardo" />
                ) : (
                  <Typography variant="body1" color="textPrimary">
                    Ricardo
                  </Typography>
                )}
              </Grid>
            </Grid>

            <Grid item md={12} xs={12}>
              <Box my={3}>
                <hr style={{ border: '0.5px solid #E5E7EB' }} />
              </Box>
            </Grid>

            <Grid item md={1}></Grid>
            <Grid item md={11} container alignItems="center">
              <Grid item md={6} sm={6} xs={12}>
                <Typography variant="body1" color="textPrimary">
                  Last Name
                </Typography>
              </Grid>
              <Grid item md={6} sm={6} xs={12}>
                {updateProfile ? (
                  <TextField variant="outlined" placeholder="LastName" defaultValue="Cooper" />
                ) : (
                  <Typography variant="body1" color="textPrimary">
                    Cooper
                  </Typography>
                )}
              </Grid>
            </Grid>

            <Grid item md={12} xs={12}>
              <Box my={3}>
                <hr style={{ border: '0.5px solid #E5E7EB' }} />
              </Box>
            </Grid>
          </Grid>
          <Grid item xl={3} lg={2}></Grid>
        </Grid>
      </Box>
    </>
  );
};

export default StudentDashboardProfile;
