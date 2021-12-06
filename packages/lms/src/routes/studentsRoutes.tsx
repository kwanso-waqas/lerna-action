import { FC } from 'react';
import { Switch, Route } from 'react-router-dom';

import { RouteProps } from '../common/types';
import { StudentProvider } from '../context/students';

import ManageStudents from '../containers/manageStudents';
import StudentAssignments from '../containers/studentAssignments';

const StudentRoutes: FC<RouteProps> = ({ path }): JSX.Element => {
  return (
    <StudentProvider>
      <Switch>
        <Route path={`${path}/:studentId`} component={StudentAssignments} />
        <Route path="/" component={ManageStudents} />
      </Switch>
    </StudentProvider>
  );
};

export default StudentRoutes;
