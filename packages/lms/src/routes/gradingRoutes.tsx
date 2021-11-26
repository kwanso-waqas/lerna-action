import { FC } from 'react';
import { Switch, Route } from 'react-router-dom';

import { RouteProps } from '../common/types';
import { AssignmentProvider } from '../context/assignments';
import { SubmissionProvider } from '../context/submissions';

import ManualGrading from '../containers/manualGrading';
import AssignmentChapters from '../containers/assignmentChapters';
import ChapterSubmissions from '../containers/chapterSubmissions';
import ManualGradingAssignment from '../containers/manualGradingAssignment';

const GradingRoutes: FC<RouteProps> = ({ path }): JSX.Element => {
  return (
    <AssignmentProvider>
      <SubmissionProvider>
        <Switch>
          <Route
            path={`${path}/:assignmentId/:chapterId/:submissionId`}
            component={ManualGradingAssignment}
          />
          <Route path={`${path}/:assignmentId/:chapterId`} component={ChapterSubmissions} />
          <Route path={`${path}/:assignmentId`} component={AssignmentChapters} />
          <Route path="/" component={ManualGrading} />
        </Switch>
      </SubmissionProvider>
    </AssignmentProvider>
  );
};

export default GradingRoutes;
