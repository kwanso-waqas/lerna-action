import React, { FC, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Box,
  Button,
  Grid,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Tab,
  Tabs,
  Typography,
} from '@material-ui/core';
import { ModalStyles } from '@illumidesk/common-ui';

import LTI1Form from './forms/lti1';
import LTI3Form from './forms/lti3';

import useStyles from './style';

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`wrapped-tabpanel-${index}`}
      aria-labelledby={`wrapped-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};

const IntegrationCard: FC = (): JSX.Element => {
  const [value, setValue] = useState<string>('one');

  const classes = useStyles();
  const modalClasses = ModalStyles();
  const history = useHistory();

  const handleChange = (event: React.ChangeEvent<unknown>, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Grid container xl={6} lg={6} md={8} sm={12} xs={12}>
      <Card className={classes.accordianCard}>
        <CardHeader
          title="Add your Integrations Version Details"
          subheader="Which LTI version do you want to proceed with"
        />
        <CardContent className={classes.customCardBody}>
          <Tabs
            value={value}
            indicatorColor="primary"
            textColor="primary"
            onChange={handleChange}
            aria-label="wrapped label tabs example"
            className={classes.customTabs}
          >
            <Tab value="one" label="LTI (v1.1)" />
            <Tab value="two" label="LTI (v1.3)" />
          </Tabs>
          <TabPanel value={value} index="one">
            <LTI1Form />
          </TabPanel>
          <TabPanel value={value} index="two">
            <LTI3Form />
          </TabPanel>
        </CardContent>
        <CardActions className={modalClasses.gcDialogFooter}>
          <Grid container justifyContent="space-between">
            <Button onClick={() => history.push('/settings')}>Cancel</Button>
            <Button variant="contained" color="primary">
              Save Configuration
            </Button>
          </Grid>
        </CardActions>
      </Card>
    </Grid>
  );
};

export default IntegrationCard;
