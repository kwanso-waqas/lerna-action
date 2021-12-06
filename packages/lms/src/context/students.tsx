import { FC, useState, createContext } from 'react';
import { AxiosResponse } from 'axios';

import {
  CompProps,
  Student,
  IStudentContext,
  StudentAddUpdate,
  StudentAssignment,
  ErrorProps,
} from '../common/types';
import { GET_STUDENTS, ADD_UPDATE_STUDENT, GET_STUDENT_ASSIGNMENTS } from '../common/constants';
import { api } from '../common/requests';

export const StudentContext = createContext<IStudentContext>({
  allStudents: [],
  successMessage: '',
  errorMessage: '',
  studentAssignments: [],
  getAllStudents: async () => {
    return;
  },
  getStudentAssignments: async () => {
    return;
  },
  updateOrCreateStudent: async () => {
    return;
  },
  clearStudentAssginments: async () => {
    return;
  },
});

export const StudentProvider: FC<CompProps> = ({ children }): JSX.Element => {
  const [allStudents, setStudentsData] = useState<Student[]>([]);
  const [studentAssignments, setStudentAssignments] = useState<StudentAssignment[]>([]);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const getAllStudents = async () => {
    setSuccessMessage('');
    setErrorMessage('');
    setStudentsData([]);

    try {
      const data: AxiosResponse<Student[]> = await api.get(GET_STUDENTS);
      const { status, data: returnData } = data;

      if (status === 200 || status === 304) {
        if (returnData.length === 0) throw new Error('No data found!');
        setStudentsData(returnData);
      } else throw new Error('No data found!');
    } catch (err: unknown) {
      setErrorMessage((err as ErrorProps).message);
    }
  };

  const updateOrCreateStudent = async (
    studentData: StudentAddUpdate,
    isUpdate: boolean,
  ): Promise<void> => {
    const { id: studentId } = studentData;
    setSuccessMessage('');
    setErrorMessage('');
    try {
      const data = await api.put(`${ADD_UPDATE_STUDENT}/${studentId}`, studentData);

      if (data.status !== 200) throw new Error('Something went wrong. Please try again later.');

      if (isUpdate) {
        const localStudents = [...allStudents];
        const searchedIndex = localStudents.findIndex((student) => student.id === studentId);

        if (searchedIndex >= 0) localStudents[searchedIndex] = data.data;

        setStudentsData(localStudents);
        setSuccessMessage("Student's details have been updated successfully!");
      } else {
        setStudentsData([data.data, ...allStudents]);
        setSuccessMessage('Student has been created successfully!');
      }
    } catch (err: unknown) {
      setErrorMessage((err as ErrorProps).message);
    }
  };

  const getStudentAssignments = async (studentId: string): Promise<void> => {
    setSuccessMessage('');
    setErrorMessage('');
    setStudentAssignments([]);

    try {
      const data: AxiosResponse<StudentAssignment[]> = await api.get(
        `${GET_STUDENT_ASSIGNMENTS}/${studentId}`,
      );
      const { status, data: returnData } = data;

      if (status === 200 || status === 304) {
        if (returnData.length === 0) throw new Error('No data found!');
        setStudentAssignments(returnData);
      } else throw new Error('No data found!');
    } catch (err: unknown) {
      setErrorMessage((err as ErrorProps).message);
    }
  };

  const clearStudentAssginments = (): void => {
    // setStudentAssignments([])
  };

  return (
    <StudentContext.Provider
      value={{
        allStudents,
        studentAssignments,
        successMessage,
        errorMessage,
        getAllStudents,
        updateOrCreateStudent,
        getStudentAssignments,
        clearStudentAssginments,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
};
