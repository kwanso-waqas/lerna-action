import React, { FC } from 'react';
import { Switch, Route } from 'react-router-dom';

import Settings from '../containers/settings';
import NewIntegration from '../containers/newIntegration';

import { RouteProps } from '../common/types';

const SettingRoutes: FC<RouteProps> = ({ path }): JSX.Element => {
  return (
    <Switch>
      <Route path={`${path}/new-integration`} component={NewIntegration} />
      <Route path="/" component={Settings} />
    </Switch>
  );
};

export default SettingRoutes;
