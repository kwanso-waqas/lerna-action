import { FC } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { CustomBreadcrumbs } from '@illumidesk/common-ui';

import { Assignment } from '../../../common/types';
import { BreadcrumbIcon } from '../../../assets';

interface CrumbsLink {
  title: string;
  redirectAction: () => void;
}

export const ContentBreadcrumbs: FC<{
  courseId: string;
  assignment: Assignment;
  filepath: string;
}> = ({ assignment, filepath }): JSX.Element => {
  let parts = filepath.split('/');
  parts = parts.filter((p) => p !== '');

  const location = useLocation();
  const history = useHistory();

  const partsData: CrumbsLink[] = [];
  parts.map((p, i) => {
    partsData.push({
      title: p,
      redirectAction: () =>
        history.push(
          i !== parts.length - 1 ? `/assignment/${assignment.name}/${p}` : location.pathname,
        ),
    });
  });

  return (
    <>
      <CustomBreadcrumbs
        separator={BreadcrumbIcon}
        bCrumbsList={[
          {
            title: 'Assignments',
            redirectAction: () => history.push('/manage-assignments'),
          },
          {
            title: assignment.name,
            redirectAction: () => history.push(`/assignment/${assignment.name}`),
          },
          ...partsData,
        ]}
      />
    </>
  );
};
