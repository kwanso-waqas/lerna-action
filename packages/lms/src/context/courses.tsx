import { FC, createContext, useState } from 'react';
import { AxiosResponse } from 'axios';

import { CompProps, ErrorProps } from '../common/types';
import { GET_COURSES_API } from '../common/constants';
import { api } from '../common/requests';
import { getUrlPrefix } from '../common/graderConstants';

interface Course {
  course_id: string;
}

interface CourseContextType {
  allCourses: string[];
  successMessage: string;
  errorMessage: string;
  getAllCourses: () => Promise<void>;
}

export const CourseContext = createContext<CourseContextType>({
  allCourses: [],
  successMessage: '',
  errorMessage: '',
  getAllCourses: async () => {
    return;
  },
});

export const CourseProvider: FC<CompProps> = ({ children }): JSX.Element => {
  const urlPrefix = getUrlPrefix();
  const defaultCourses = [] as string[];
  if (urlPrefix) {
    defaultCourses.push(urlPrefix);
  }
  const [allCourses, setAllCourses] = useState<string[]>(defaultCourses);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const getAllCourses = async (): Promise<void> => {
    setSuccessMessage('');
    setErrorMessage('');
    try {
      const data: AxiosResponse = await api.get(GET_COURSES_API);
      const { status, data: returnData } = data;
      if (status === 200) {
        if (returnData.value && returnData.value.length > 0) {
          setAllCourses(
            returnData.value.map((course: Course) => {
              if (course.course_id === '') {
                course.course_id = 'Default formgrader';
              }
              return course.course_id;
            }),
          );
        } else {
          throw new Error('No data found!');
        }
      } else if (status === 400) {
        throw new Error('Not course found! Please create new or contact your administrator');
      } else {
        throw new Error('Something went wrong. Please try again later!');
      }
    } catch (err: unknown) {
      setErrorMessage((err as ErrorProps).message);
    }
  };

  return (
    <CourseContext.Provider
      value={{
        allCourses,
        successMessage,
        errorMessage,
        getAllCourses,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
};
