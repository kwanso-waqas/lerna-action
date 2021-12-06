import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Typography,
  Chip,
  Grid,
  Box,
  TextField,
  TextFieldProps,
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { Close } from '@material-ui/icons';
import { ModalStyles } from '@illumidesk/common-ui';

import { useStyles } from '../../common/style';

interface InviteStudentProps {
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
}
const dummyStudents = [
  {
    name: 'Faizan Saleem',
    email: 'faizan.saleem@kwanso.com',
  },
  {
    name: 'Waqas Ahmed',
    email: 'waqas@kwanso.com',
  },
  {
    name: 'Hamid Rasool',
    email: 'hamid.rasool@kwanso.com',
  },
];
const InviteStudent: FC<InviteStudentProps> = ({ setActiveStep }): JSX.Element => {
  const history = useHistory();
  const classes = ModalStyles();
  const compClasses = useStyles();

  return (
    <>
      <Card>
        <Box className={classes.gcDialog} style={{ width: '100%' }}>
          <CardHeader
            title="Invite Students by Email"
            subheader="Add Student to this course by sending them Email invites."
          />
          <CardContent>
            <Box mb={2.5}>
              <Typography variant="h6">Invite Email</Typography>
            </Box>
            <Autocomplete
              freeSolo
              className={compClasses.autoComplete}
              multiple={true}
              id="free-solo-2-demo"
              options={dummyStudents}
              getOptionLabel={(option) => {
                //filter value
                return option.name;
              }}
              renderOption={(option: { name: string; email: string }) => {
                //display value in Popper elements
                return (
                  <Grid container>
                    <Grid item>
                      <Avatar />
                    </Grid>
                    <Grid item>
                      <Box ml={3}>
                        <Typography variant="body1">{option.name}</Typography>
                        <Typography variant="body2">{option.email}</Typography>
                      </Box>
                    </Grid>
                  </Grid>
                );
              }}
              renderInput={(params: TextFieldProps) => (
                <TextField
                  {...params}
                  margin="none"
                  variant="outlined"
                  InputProps={{ ...params.InputProps, type: 'search' }}
                />
              )}
              renderTags={(tagValue, getTagProps) =>
                tagValue.map((option, index) => (
                  <Chip
                    key={index}
                    label={option.name}
                    deleteIcon={<Close />}
                    {...getTagProps({ index })}
                  />
                ))
              }
            />
          </CardContent>
        </Box>
        <CardActions className={classes.gcDialogFooter}>
          <Grid container alignItems="center">
            <Grid item xs={3}>
              <Button onClick={() => history.goBack()}>Cancel</Button>
            </Grid>
            <Grid item xs={9} container justifyContent="flex-end">
              <Box mr={1} style={{ display: 'inline' }}>
                <Button variant="outlined" onClick={() => setActiveStep(0)}>
                  Previous
                </Button>
              </Box>
              <Button variant="contained" onClick={() => setActiveStep(2)} color="primary">
                Next
              </Button>
            </Grid>
          </Grid>
        </CardActions>
      </Card>
    </>
  );
};

export default InviteStudent;
