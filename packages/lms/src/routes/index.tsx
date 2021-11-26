import { FC } from 'react';
import { BrowserRouter, Switch, Redirect, Route } from 'react-router-dom';
import { NotFound } from '@illumidesk/common-ui';

import AssignmentRoutes from './assignmentRoutes';
import GradingRoutes from './gradingRoutes';
import StudentRoutes from './studentsRoutes';

import AppLayout from '../layout';
// import EmptyLayout from '../layout/emptyLayout';

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
          <Route component={NotFound} />
        </Switch>
      </AppLayout>
    </BrowserRouter>
  );
};

export default Router;
