import { FC, useState, createContext } from 'react';
import { AxiosResponse } from 'axios';

import {
  GET_ASSIGNMENT_CONTENT,
  GET_SUBMISSION_GRADES,
  GET_SUBMISSION_COMMENTS,
  UPDATE_SUBMISSION_COMMENT,
  UPDATE_SUBMISSION_GRADE,
} from '../common/constants';
import {
  CompProps,
  SubmissionData,
  SubmissionCellGrades,
  SubmissionCellComment,
  ErrorProps,
} from '../common/types';
import { api } from '../common/requests';

interface SubmissionContextType {
  submissionData: SubmissionData;
  submissionGrades: SubmissionCellGrades[];
  submissionComments: SubmissionCellComment[];
  successMessage: string;
  errorMessage: string;
  getSubmissionDetails: (
    courseId: string,
    assignmentId: string,
    chapterId: string,
    studentId: string,
  ) => Promise<void>;
  clearSubmissionDetails: () => void;
  getSubmissionGrades: (submissionId: string) => Promise<void>;
  getSubmissionComments: (submissionId: string) => Promise<void>;
  updateSubmissionMarks: (
    gradeId: string,
    manual_score: number,
    extra_credit: number,
  ) => Promise<void>;
  updateSubmissionComment: (commentId: string, message: string) => Promise<void>;
}

export const SubmissionContext = createContext<SubmissionContextType>({
  submissionData: {
    cells: [],
    metadata: { kernelspec: { name: '', language: '' } },
  },
  submissionGrades: [],
  submissionComments: [],
  successMessage: '',
  errorMessage: '',
  getSubmissionDetails: async () => {
    return;
  },
  clearSubmissionDetails: () => {
    return;
  },
  getSubmissionGrades: async () => {
    return;
  },
  getSubmissionComments: async () => {
    return;
  },
  updateSubmissionMarks: async () => {
    return;
  },
  updateSubmissionComment: async () => {
    return;
  },
});

export const SubmissionProvider: FC<CompProps> = ({ children }): JSX.Element => {
  const [submissionData, setSubmissionData] = useState<SubmissionData>({
    cells: [],
    metadata: { kernelspec: { name: '', language: '' } },
  });
  const [submissionGrades, setSubmissionGrades] = useState<SubmissionCellGrades[]>([]);
  const [submissionComments, setSubmissionComments] = useState<SubmissionCellComment[]>([]);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const getSubmissionDetails = async (
    courseId: string,
    assignmentId: string,
    chapterId: string,
    locStudentId: string,
  ): Promise<void> => {
    setSuccessMessage('');
    setErrorMessage('');
    try {
      const path = `${courseId}/autograded/${locStudentId}/${assignmentId}/${chapterId}.ipynb`;
      const data: AxiosResponse = await api.get(`${GET_ASSIGNMENT_CONTENT}/${path}`);
      const { status, data: returnData } = data;
      if (status === 200) {
        setSubmissionData(returnData.content);
      } else if (status === 404) {
        throw new Error('The submission you are trying to access no longer exist');
      }
    } catch (err: unknown) {
      setErrorMessage((err as ErrorProps).message);
    }
  };

  const clearSubmissionDetails = () => {
    setSubmissionData({
      cells: [],
      metadata: { kernelspec: { name: '', language: '' } },
    });
  };

  const getSubmissionGrades = async (submissionId: string): Promise<void> => {
    setSuccessMessage('');
    setErrorMessage('');
    try {
      const data: AxiosResponse<SubmissionCellGrades[]> = await api.get(
        `${GET_SUBMISSION_GRADES}${submissionId}`,
      );
      const { status, data: returnData } = data;
      if (status === 200) setSubmissionGrades(returnData);
      else throw new Error('Something went wrong. Please try again!');
    } catch (err: unknown) {
      setErrorMessage((err as ErrorProps).message);
    }
  };

  const getSubmissionComments = async (submissionId: string): Promise<void> => {
    setSuccessMessage('');
    setErrorMessage('');
    try {
      const data: AxiosResponse<SubmissionCellComment[]> = await api.get(
        `${GET_SUBMISSION_COMMENTS}${submissionId}`,
      );
      const { status, data: returnData } = data;
      if (status === 200) setSubmissionComments(returnData);
      else throw new Error('Something went wrong. Please try again!');
    } catch (err: unknown) {
      setErrorMessage((err as ErrorProps).message);
    }
  };

  const updateSubmissionComment = async (commentId: string, message: string): Promise<void> => {
    setSuccessMessage('');
    setErrorMessage('');
    try {
      const data: AxiosResponse<SubmissionCellComment> = await api.put(
        `${UPDATE_SUBMISSION_COMMENT}/${commentId}`,
        {
          manual_comment: message,
        },
      );
      const { status, data: returnData } = data;
      if (status === 200) {
        const commentIndex = submissionComments.findIndex((comment) => comment.id === commentId);
        if (commentIndex > -1) {
          const allComments = [...submissionComments];
          allComments[commentIndex] = returnData;
          setSubmissionComments(allComments);
          setSuccessMessage('Comment has been saved successfully!');
        } else {
          throw new Error('No such data found! Please try updating comments later');
        }
      } else {
        throw new Error('Something went wrong! Please try updating comments later');
      }
    } catch (err: unknown) {
      setErrorMessage((err as ErrorProps).message);
    }
  };

  const updateSubmissionMarks = async (
    gradeId: string,
    manual_score: number,
    extra_credit: number,
  ): Promise<void> => {
    setSuccessMessage('');
    setErrorMessage('');
    try {
      const data: AxiosResponse<SubmissionCellGrades> = await api.put(
        `${UPDATE_SUBMISSION_GRADE}/${gradeId}`,
        {
          manual_score,
          extra_credit,
        },
      );
      const { status, data: returnData } = data;
      if (status === 200) {
        const gradeIndex = submissionGrades.findIndex((grade) => grade.id === gradeId);
        if (gradeIndex > -1) {
          const allGrades = [...submissionGrades];
          allGrades[gradeIndex] = returnData;
          setSubmissionGrades(allGrades);
          setSuccessMessage('Grade has been updated successfully!');
        } else {
          throw new Error('No such data found! Please try updating comments later');
        }
      } else {
        throw new Error('Something went wrong! Please try updating comments later');
      }
    } catch (err: unknown) {
      setErrorMessage((err as ErrorProps).message);
    }
  };

  return (
    <SubmissionContext.Provider
      value={{
        submissionData,
        submissionGrades,
        submissionComments,
        successMessage,
        errorMessage,
        getSubmissionDetails,
        clearSubmissionDetails,
        getSubmissionGrades,
        getSubmissionComments,
        updateSubmissionMarks,
        updateSubmissionComment,
      }}
    >
      {children}
    </SubmissionContext.Provider>
  );
};
