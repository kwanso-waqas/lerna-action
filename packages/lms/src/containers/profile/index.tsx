import React, { FC, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Avatar, Box, Button, Typography, Grid, TextField, useMediaQuery } from '@material-ui/core';
import { ChevronLeft } from '@material-ui/icons';
import { DropzoneDialog } from 'material-ui-dropzone';
import { colors } from '@illumidesk/common-ui';
import { useStyles } from '../common/style';

import { EditIcon } from '../../assets';

const Profile: FC = (): JSX.Element => {
  const [updateProfile, setUpdateProfile] = useState<boolean>(false);
  const [files, setFiles] = useState<unknown[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const classes = useStyles();
  const history = useHistory();
  const xtraSmallScreen = useMediaQuery('(max-width: 600px)');
  const editBtnIssue = useMediaQuery('(max-width: 960px)');

  const handleSave = (image: unknown[]) => {
    console.log(image, '<<<<<IMAGE');
    setFiles(image);
    setOpen(!open);
    console.log(files, '<<<<FILES');
  };

  return (
    <>
      <Box height={150} bgcolor={colors.GREEN_COLOR} style={{ width: '100%' }} pt={5}>
        <Grid container>
          <Grid item xl={2} lg={1}></Grid>
          <Grid item xl={2} lg={2} md={2} sm={4} xs={3} container justifyContent="center">
            <Button onClick={() => history.goBack()} variant="text" style={{ color: 'white' }}>
              <ChevronLeft /> Back
            </Button>
          </Grid>
          <Grid item xl={2} lg={1}></Grid>
        </Grid>
      </Box>

      <Box className={classes.profileTitleContainer} pl={3}>
        <Grid container>
          <Grid item xl={2} lg={1}></Grid>
          <Grid item xl={8} lg={10} sm={12} container alignItems="flex-end">
            <Grid
              item
              md={2}
              xs={12}
              sm={3}
              container
              justifyContent={xtraSmallScreen ? 'center' : 'flex-end'}
            >
              <Avatar
                className={classes.customAvatarSimpleProfile}
                onClick={() => setOpen(!open)}
              />
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
              justifyContent={editBtnIssue ? 'flex-start' : 'flex-end'}
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
          <Grid item xl={2} lg={1}></Grid>
        </Grid>
      </Box>

      <Box mr={3} ml={3}>
        <Grid container>
          <Grid item xl={2} lg={1}></Grid>
          <Grid item xl={8} lg={10} container>
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
          <Grid item xl={2} lg={1}></Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Profile;
