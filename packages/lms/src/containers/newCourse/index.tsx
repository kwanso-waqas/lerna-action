import React, { FC, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { CustomBreadcrumbs, colors } from '@illumidesk/common-ui';
import {
  Box,
  Grid,
  Step,
  StepConnector,
  StepLabel,
  Stepper,
  Typography,
  StepIconProps,
} from '@material-ui/core';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import { Check } from '@material-ui/icons';
import clsx from 'clsx';

import { BreadcrumbIcon } from '../../assets';
import { useStyles } from '../common/style';

import CourseDetailForm from './forms/courseDetail';
import InviteStudent from './forms/inviteStudent';
import ReviewDetails from './forms/reviewDetails';
import SubHeader from '../../components/subHeader';

const CustomConnector = withStyles({
  alternativeLabel: {
    top: 22,
  },
  active: {
    '& $line': {
      backgroundColor: colors.GREEN_COLOR,
      width: 2,
    },
  },
  completed: {
    '& $line': {
      backgroundColor: colors.GREEN_COLOR,
      width: 2,
    },
  },
  line: {
    flexDirection: 'column',
    height: 70,
    border: 0,
    backgroundColor: colors.LIGHT_GREY_BORDER_COLOR,
    borderRadius: 1,
    width: 2,
  },
})(StepConnector);

const useColorlibStepIconStyles = makeStyles({
  root: {
    backgroundColor: colors.LIGHT_GREY_BG_COLOR,
    zIndex: 1,
    color: colors.LIGHT_GREY_BG_COLOR,
    display: 'flex',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    '& .MuiStepLabel-LabelContainer': {
      position: 'absolute',
      left: 60,
    },
    '& div': {
      backgroundColor: colors.LIGHT_GREY_BORDER_COLOR,
      width: 10,
      height: 10,
      borderRadius: '50%',
      marginLeft: 8,
    },
  },
  active: {
    backgroundColor: 'hsl(90, 27%, 85%)',
    width: 25,
    height: 25,
    zIndex: 1,
    fontSize: 18,
    '& div': {
      backgroundColor: colors.GREEN_COLOR,
      width: 10,
      height: 10,
      borderRadius: '50%',
      marginLeft: 0,
    },
  },
  completed: {
    backgroundColor: colors.GREEN_COLOR,
    zIndex: 1,
    fontSize: 18,
    '& div': {
      backgroundColor: colors.GREEN_COLOR,
      width: 10,
      height: 10,
      borderRadius: '50%',
      marginLeft: 0,
    },
  },
});

const CustomStepIcon: FC<StepIconProps> = (props): JSX.Element => {
  const classes = useColorlibStepIconStyles();
  const { active, completed } = props;

  return (
    <div
      className={clsx(classes.root, {
        [classes.active]: active,
        [classes.completed]: completed,
      })}
    >
      {completed ? <Check style={{ padding: 5 }} /> : <div></div>}
    </div>
  );
};

const getSteps = (): string[] => {
  return ['Course Details', 'Invite Students', 'Review'];
};

const NewCourse: FC = (): JSX.Element => {
  const history = useHistory();
  const classes = useStyles();
  const steps = getSteps();

  const [activeStep, setActiveStep] = useState<number>(0);

  const getStepContent = (step: number): JSX.Element => {
    switch (step) {
      case 0:
        return <CourseDetailForm setActiveStep={setActiveStep} />;
      case 1:
        return <InviteStudent setActiveStep={setActiveStep} />;
      case 2:
        return <ReviewDetails setActiveStep={setActiveStep} />;
      default:
        return <> </>;
    }
  };

  return (
    <>
      <SubHeader title={'Create New Course'} emptyData={false} />
      <Box className={classes.pageTitleContainer}>
        <CustomBreadcrumbs
          separator={BreadcrumbIcon}
          bCrumbsList={[
            { title: 'Courses', redirectAction: () => history.push('/courses') },
            { title: 'Creat A New Course' },
          ]}
        />
      </Box>
      <Box p={4}>
        <Grid container justifyContent="center">
          {/* <Grid item xl={1} lg={1}></Grid> */}
          <Grid item xl={8} lg={10} container>
            <Grid item sm={12} xs={12} lg={3}>
              <Stepper
                className={classes.customStepper}
                activeStep={activeStep}
                connector={<CustomConnector />}
                orientation="vertical"
                style={{ position: 'relative' }}
              >
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel StepIconComponent={CustomStepIcon}>
                      <Typography variant="body1" color="textPrimary">
                        {label}
                      </Typography>
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Grid>

            <Grid item sm={12} xs={12} lg={9}>
              <Box>{getStepContent(activeStep)}</Box>
            </Grid>
          </Grid>
          <Grid item xl={2} lg={1}></Grid>
        </Grid>
      </Box>
    </>
  );
};

export default NewCourse;
