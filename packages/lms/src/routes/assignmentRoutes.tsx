import { FC } from 'react';
import { Switch, Route } from 'react-router-dom';

import { RouteProps } from '../common/types';
import AssignmentExplorer from '../containers/assignmentExplorer';
import ManageAssignments from '../containers/manageAssignments';
import AssignmentAutoGrading from '../containers/assignmentGrading';
import { AssignmentProvider } from '../context/assignments';

const AssignmentRoutes: FC<RouteProps> = ({ path }): JSX.Element => {
  return (
    <AssignmentProvider>
      <Switch>
        <Route path="/assignment/:assignmentId/:filepath+" component={AssignmentExplorer} />
        <Route path="/assignment/:assignmentId" component={AssignmentExplorer} />
        <Route path={`${path}/:assignmentId`} component={AssignmentAutoGrading} />
        <Route path="/" component={ManageAssignments} />
      </Switch>
    </AssignmentProvider>
  );
};

export default AssignmentRoutes;
