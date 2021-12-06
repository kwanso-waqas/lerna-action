import React, { FC, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import Instructor from './instructor';
import Student from './student';

const CampusLayout: FC = ({ children }): JSX.Element => {
  const [activeUrl, setActive] = useState<string>('');

  const history = useHistory();

  useEffect(() => {
    const { location } = history;
    const { pathname } = location;
    const url: string[] = pathname.split('/');
    setActive(url[1]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history]);

  if (activeUrl !== 'students') {
    return (
      <Instructor setActive={setActive} activeUrl={activeUrl}>
        {children}
      </Instructor>
    );
  } else {
    return <Student>{children}</Student>;
  }
};

export default CampusLayout;
