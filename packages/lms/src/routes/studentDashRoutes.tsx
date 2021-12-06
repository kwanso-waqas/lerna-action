import React, { FC } from 'react';
import { Switch, Route } from 'react-router-dom';

import Dashboard from '../containers/studentDash';
import Profile from '../containers/studentDash/profile';

import { RouteProps } from '../common/types';

const SettingRoutes: FC<RouteProps> = ({ path }): JSX.Element => {
  return (
    <Switch>
      <Route path={`${path}/profile`} component={Profile} />
      <Route path="/" component={Dashboard} />
    </Switch>
  );
};

export default SettingRoutes;
