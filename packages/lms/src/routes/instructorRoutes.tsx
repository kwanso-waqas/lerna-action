import { FC } from 'react';
import { Switch, Route } from 'react-router-dom';

import { RouteProps } from '../common/types';
import { StudentProvider } from '../context/students';

import ManageInstructors from '../containers/manageInstructors';

const InstructorRoutes: FC<RouteProps> = (): JSX.Element => {
  return (
    <StudentProvider>
      <Switch>
        <Route path="/" component={ManageInstructors} />
      </Switch>
    </StudentProvider>
  );
};

export default InstructorRoutes;
