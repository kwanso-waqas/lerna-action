import { ContainerStyles, CustomBreadcrumbs } from '@illumidesk/common-ui';
import { Box, Grid, Typography } from '@material-ui/core';
import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';
import { BreadcrumbIcon } from '../../assets';
import IntegrationCard from '../../components/integrationCard';
import { useStyles } from '../common/style';

const NewIntegration: FC = (): JSX.Element => {
  const classes = useStyles();
  const history = useHistory();
  const contClasses = ContainerStyles();

  return (
    <>
      <Box className={classes.pageTitleContainer}>
        <CustomBreadcrumbs
          separator={BreadcrumbIcon}
          bCrumbsList={[
            { title: 'Courses', redirectAction: () => history.push('/courses') },
            { title: 'Settings', redirectAction: () => history.push('/settings') },
            { title: 'Add New Integration' },
          ]}
        />
        <Box py={2.5}>
          <Grid container justifyContent="flex-start" alignItems="center">
            <Grid item xs={6} sm={8}>
              <Typography variant="h1" style={{ display: 'inline' }}>
                Integrations
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Box className={contClasses.mainSection}>
        <IntegrationCard />
      </Box>
    </>
  );
};

export default NewIntegration;
