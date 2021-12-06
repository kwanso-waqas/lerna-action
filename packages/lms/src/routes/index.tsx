import { FC } from 'react';
import { BrowserRouter, Switch, Redirect, Route } from 'react-router-dom';
import { NotFound } from '@illumidesk/common-ui';

import AssignmentRoutes from './assignmentRoutes';
import GradingRoutes from './gradingRoutes';
import StudentRoutes from './studentsRoutes';
import InstructorRoutes from './instructorRoutes';
import CourseRoutes from './courseRoutes';
import SettingRoutes from './settingsRoutes';
import StudentDashboardRoutes from './studentDashRoutes';

import AppLayout from '../layout';
import Profile from '../containers/profile';

import { getBaseUrl, getBaseUrlSuffix } from '../common/graderConstants';

const Router: FC = (): JSX.Element => {
  return (
    <BrowserRouter basename={`${getBaseUrl()}${getBaseUrlSuffix()}`}>
      <AppLayout>
        <Switch>
          <Route exact path="/">
            <Redirect to="/manage-assignments" />
          </Route>
          <AssignmentRoutes path="/manage-assignments" />
          <AssignmentRoutes path="/assignment" />
          <GradingRoutes path="/manual-grading" />
          <StudentRoutes path="/manage-students" />
          <InstructorRoutes path="/manage-instructors" />
          <CourseRoutes path="/add-course" />
          <SettingRoutes path="/settings" />
          <StudentDashboardRoutes path="/students" />
          <Route path="/profile" component={Profile} />
          <Route component={NotFound} />
        </Switch>
      </AppLayout>
    </BrowserRouter>
  );
};

export default Router;
