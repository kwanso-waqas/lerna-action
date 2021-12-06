import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Grid, Typography, Button } from '@material-ui/core';
import { CustomBreadcrumbs, ContainerStyles } from '@illumidesk/common-ui';
import clsx from 'clsx';

import { BreadcrumbIcon } from '../../assets';
import { useStyles } from '../common/style';

import IntegrationView from '../../components/integrationAccordion';

const Settings: FC = (): JSX.Element => {
  const emptyScreen = false;

  const classes = useStyles();
  const contClasses = ContainerStyles();
  const history = useHistory();

  return (
    <>
      <Box className={classes.pageTitleContainer}>
        <CustomBreadcrumbs
          separator={BreadcrumbIcon}
          bCrumbsList={[
            { title: 'Courses', redirectAction: () => history.push('/manage-assignments') },
            { title: 'Settings' },
          ]}
        />
      </Box>
      <Box
        className={clsx({
          [classes.pageTitleContainer]: !emptyScreen,
        })}
      >
        {emptyScreen ? (
          <Box className={clsx(contClasses.mainSection, classes.emptyIntegrationParent)}>
            <Grid container>
              <Grid item xs={12} md={5}>
                <Grid container alignItems="center">
                  <Box my={1.2} mx={2}>
                    <Typography variant="h1">Configure your Campus</Typography>
                    <Typography variant="h1">
                      Integration with{' '}
                      <Typography style={{ display: 'inline' }} variant="inherit" color="primary">
                        illumiDesk
                      </Typography>
                    </Typography>
                  </Box>
                  <Box my={{ xs: 0, md: 2 }} mx={2}>
                    <Typography
                      className={classes.lightColorPara}
                      variant="body1"
                      color="textPrimary"
                    >
                      Hit the add New integration button to select and configure desired integration
                      for your campus.
                    </Typography>
                  </Box>
                  <Box my={1.2} mx={2}>
                    <Button
                      type="button"
                      variant="contained"
                      color="primary"
                      onClick={() => history.push('/settings/new-integration')}
                    >
                      Add New Integration
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        ) : (
          <>
            <Box py={2.5}>
              <Grid container justifyContent="flex-start" alignItems="center">
                <Grid item xs={12} sm={8}>
                  <Typography variant="h1" style={{ display: 'inline' }}>
                    Integrations
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={4}
                  container
                  justifyContent="flex-end"
                  className={classes.removeEnd}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => history.push('/settings/new-integration')}
                    className={classes.fullWidthBtn}
                  >
                    Add New Integration
                  </Button>
                </Grid>
              </Grid>
            </Box>
            <Box py={2.6} px={1}>
              <IntegrationView />
            </Box>
          </>
        )}
      </Box>
    </>
  );
};

export default Settings;
