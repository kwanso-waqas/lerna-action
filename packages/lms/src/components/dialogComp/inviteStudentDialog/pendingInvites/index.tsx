import { Pagination } from '@illumidesk/common-ui';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
  ListItemSecondaryAction,
  Grid,
  Button,
} from '@material-ui/core';
import React, { ChangeEvent, FC } from 'react';

import { SentIcon } from '../../../../assets';
import useStyles from '../style';

const InviteList: FC = (): JSX.Element => {
  const classes = useStyles();
  return (
    <>
      <Box className={classes.pendingInvitesTitle}>
        <Typography variant="h4">
          Pending Invites{' '}
          <Typography variant="h6" component="span">
            4
          </Typography>
        </Typography>
      </Box>
      <Box>
        <List className={classes.pendingInvitesList}>
          {[1, 2, 3, 4, 5, 6].map((value) => (
            <ListItem key={value}>
              <ListItemText
                primary={
                  <>
                    <Typography variant="body1" component="p">
                      faizan{value}@gmail.com{' '}
                      {value === 6 && (
                        <Chip
                          label={<Typography variant="body2">Expired</Typography>}
                          size="small"
                        />
                      )}
                    </Typography>
                  </>
                }
              />
              <ListItemSecondaryAction>
                <Grid
                  container
                  direction="row"
                  justifyContent="flex-start"
                  alignItems="flex-start"
                  spacing={1}
                >
                  <Grid item>
                    <Button variant="outlined" size="small">
                      Delete
                    </Button>
                  </Grid>
                  <Grid item>
                    {value === 1 && (
                      <Button color="primary" variant="outlined" disabled>
                        <Typography variant="body2" color="primary">
                          <img src={SentIcon} alt="green-tick" /> Sent
                        </Typography>
                      </Button>
                    )}
                    {value > 1 && (
                      <Button variant="contained" color="primary" size="small">
                        {value === 6 ? 'Resend' : 'Invite'}
                      </Button>
                    )}
                  </Grid>
                </Grid>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
        <Pagination
          page={1}
          onChangePage={function (event: ChangeEvent<unknown>, page: number): void {
            console.log(event.target);
            console.log(page);
          }}
          PAGE_SIZE={6}
          isMobilePaginator={true}
        />
      </Box>
    </>
  );
};

export default InviteList;
