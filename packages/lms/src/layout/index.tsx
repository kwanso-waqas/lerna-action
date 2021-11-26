import React, { FC, useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Sidebar, SiderbarProvider } from '@illumidesk/common-ui';

import { CourseContext } from '../context/courses';

import { AssignmentIcon, GradingIcon, StudentIcon } from '../assets';

const AppLayout: FC = ({ children }): JSX.Element => {
  const [course, setCourse] = useState<string>('');
  const [activeUrl, setActive] = useState<string>('');

  const { allCourses, getAllCourses, errorMessage } = useContext(CourseContext);

  const history = useHistory();

  useEffect(() => {
    getAllCourses();
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const { location } = history;
    const { pathname } = location;
    const url: string[] = pathname.split('/');
    setActive(url[1]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history]);

  useEffect(() => {
    if (allCourses.length > 0) {
      setCourse(`${allCourses[0].charAt(0).toUpperCase()}${allCourses[0].slice(1)}`);
    }
  }, [allCourses]);

  return (
    <SiderbarProvider>
      <Sidebar
        activeUrl={activeUrl}
        sidebarLinks={[
          {
            title: 'Manage Assignments',
            icon: AssignmentIcon,
            redirectAction: (path: string) => {
              history.push(`/${path}`);
              setActive(path);
            },
            url: 'manage-assignments',
          },
          {
            title: 'Manual Grading',
            icon: GradingIcon,
            redirectAction: (path: string) => {
              history.push(`/${path}`);
              setActive(path);
            },
            url: 'manual-grading',
          },
          {
            title: 'Manage Students',
            icon: StudentIcon,
            redirectAction: (path: string) => {
              history.push(`/${path}`);
              setActive(path);
            },
            url: 'manage-students',
          },
        ]}
        sidebarBottomLinks={[]}
        dropdownData={allCourses}
        activeDropdown={course}
        isAdminPanel={false}
        errorMessage={errorMessage}
        userData={{
          email: 'email@example.com',
          avatar: '',
          redirectToAcctSettings: () => {
            console.log('heeloo');
          },
          userSignOut: () => {
            console.log('user logged out');
          },
        }}
        customNotificationFunc={function () {
          return { message: console.log('custom notification challenge') };
        }}
      >
        {children}
      </Sidebar>
    </SiderbarProvider>
  );
};

export default AppLayout;
