import React, { FC, useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Sidebar, SiderbarProvider } from '@illumidesk/common-ui';

import { CourseContext } from '../context/courses';

import InviteModal from '../components/dialogComp/inviteStudentDialog';

import {
  AssignmentIcon,
  GradingIcon,
  StudentIcon,
  InstructorIcon,
  InviteIcon,
  SettingsIcon,
} from '../assets';

interface InstructorProps {
  chidlren?: React.ReactNode;
  activeUrl: string;
  setActive: (path: string) => void;
}

const Instructor: FC<InstructorProps> = ({ children, activeUrl, setActive }) => {
  const [course, setCourse] = useState<string>('');
  const [open, setOpen] = useState<boolean>(false);

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

  const onClose = () => {
    setOpen(!open);
  };

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
            title: 'Students',
            icon: StudentIcon,
            redirectAction: (path: string) => {
              history.push(`/${path}`);
              setActive(path);
            },
            url: 'manage-students',
          },
          {
            title: 'Instructors',
            icon: InstructorIcon,
            redirectAction: (path: string) => {
              history.push(`/${path}`);
              setActive(path);
            },
            url: 'manage-instructors',
          },
        ]}
        sidebarBottomLinks={[
          {
            title: 'Invite Student',
            icon: InviteIcon,
            redirectAction: () => {
              setOpen(!open);
            },
            url: '',
          },
          {
            title: 'Settings',
            icon: SettingsIcon,
            redirectAction: (path: string) => {
              history.push(`/${path}`);
              setActive(path);
            },
            url: 'settings',
          },
        ]}
        dropdownData={allCourses}
        activeDropdown={course}
        isAdminPanel={false}
        errorMessage={errorMessage}
        userData={{
          avatar: '',
          email: 'hamid@illumidesk.com',
          redirectToAcctSettings: () => history.push('/profile'),
          userSignOut: () => console.log('User signed out'),
        }}
        customNotificationFunc={function () {
          console.log('Hello');
          return {};
        }}
        addNewCourseAction={() => {
          history.push('/add-course');
        }}
      >
        <InviteModal
          open={open}
          onClose={onClose}
          title="Invite New Student"
          subTitle="Invite new student in your organization by their email address"
          btnAction={() => {
            console.log('SENT INVITE');
          }}
        />
        {children}
      </Sidebar>
    </SiderbarProvider>
  );
};

export default Instructor;
