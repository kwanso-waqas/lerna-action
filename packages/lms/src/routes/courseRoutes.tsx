import React, { FC } from 'react';
import { Switch, Route } from 'react-router-dom';

import AddCourse from '../containers/newCourse';

import { RouteProps } from '../common/types';

const CourseRoutes: FC<RouteProps> = (): JSX.Element => {
  return (
    <Switch>
      <Route path="/" component={AddCourse} />
    </Switch>
  );
};

export default CourseRoutes;
