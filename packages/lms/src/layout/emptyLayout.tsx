import { FC } from 'react';

import { CompProps } from '../common/types';

const EmptyLayout: FC<CompProps> = ({ children }): JSX.Element => {
  return <>{children}</>;
};

export default EmptyLayout;
