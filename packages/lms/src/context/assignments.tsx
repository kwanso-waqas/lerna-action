import { FC, createContext, useState } from 'react';
import { AxiosResponse } from 'axios';

import {
  GET_ASSIGNMENTS,
  ADD_ASSIGNMENT,
  ACT_ON_ASSIGNMENT,
  ASSIGNMENT_GRADING,
  AUTOGRADE_ASSIGNMENT,
  GET_ASSIGNMENT_NOTEBOOKS,
  GET_ASSIGNMENT_NOTEBOOK_SUBMISSION,
} from '../common/constants';
import {
  Assignment,
  AssignmentAddUpdate,
  AssignmentContextType,
  CompProps,
  AssignmentChapter,
  ChapterSubmission,
  ErrorProps,
  AssignmentSubmissionAutograde,
} from '../common/types';
import { api } from '../common/requests';

export const AssignmentContext = createContext<AssignmentContextType>({
  allAssignments: [],
  assignmentByName: new Map(),
  assignmentsLoadedStatus: 'unstarted',
  assignmentChapters: [],
  chapterSubmissions: [],
  assignmentSubmissions: [],
  getAllAssignments: async () => {
    return;
  },
  getAssignmentChapters: async () => {
    return;
  },
  clearAssignmentChapters: () => {
    return;
  },
  getChapterSubmissions: async () => {
    return;
  },
  clearChapterSubmissions: () => {
    return;
  },
  updateOrCreateAssignment: async () => {
    return;
  },
  actionOnAssignment: async () => {
    return;
  },
  getAssignmentSubmissions: async () => {
    return;
  },
  autogradeAssignment: async () => {
    return;
  },
});

export const AssignmentProvider: FC<CompProps> = ({ children }): JSX.Element => {
  /**
   * @var AssignmentProviderStateVars
   */
  const [allAssignments, setAssignmentsArr] = useState<Assignment[]>([]);
  const [assignmentSubmissions, setAssignmentSubmissionArr] = useState<
    AssignmentSubmissionAutograde[]
  >([]);
  const [assignmentByName, setAssignmentByNameMap] = useState<Map<string, Assignment>>(new Map());
  const [assignmentsLoadedStatus, setAssignmentsLoadedStatus] = useState<
    'unstarted' | 'started' | 'loaded' | 'errored'
  >('unstarted');
  const [assignmentChapters, setAssignmentChapters] = useState<AssignmentChapter[]>([]);
  const [chapterSubmissions, setChapterSubmissions] = useState<ChapterSubmission[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  /**
   * Getting Assignment Listing From NBGrader
   * @param
   * @return Promise<void>
   */
  const getAllAssignments = async (): Promise<void> => {
    setSuccessMessage('');
    setErrorMessage('');
    setAssignmentsArr([]);
    setAssignmentsLoadedStatus('started');
    setAssignmentByNameMap(new Map());
    try {
      const data: AxiosResponse<Assignment[]> = await api.get(GET_ASSIGNMENTS);

      if (data.status === 200 || data.status === 304) {
        const assignmentData: Assignment[] = data.data;
        if (assignmentData.length === 0) throw new Error('No data found!');
        setAssignmentsArr(assignmentData);
        const mapping = new Map<string, Assignment>();
        assignmentData.map((a) => {
          mapping.set(a.name, a);
        });
        setAssignmentByNameMap(mapping);
        setAssignmentsLoadedStatus('loaded');
      } else if (data.status !== 200 && errorMessage.length === 0) {
        throw new Error('Something went wrong. Please try again later');
      }
    } catch (err: unknown) {
      setErrorMessage((err as ErrorProps).message);
      setAssignmentsLoadedStatus('errored');
    }
  };

  /**
   * Get Assignment Name and its Action Type and ask server for execution
   * @param assignmentName
   * @param action ["assign", "release", "collect", "generate_feedback", "release_feedback"]
   * @return Promise<void>
   */
  const actionOnAssignment = async (assignmentName: string, action: string): Promise<void> => {
    setSuccessMessage('');
    setErrorMessage('');
    try {
      const data = await api.post(`${ACT_ON_ASSIGNMENT}/${assignmentName}/${action}`);

      if (data.status !== 200) {
        throw new Error('No notebook created against your assignment');
      }

      let localSuccessMessage = '';
      const assignmentIndex: number = allAssignments.findIndex(
        (assignment) => assignment.name === assignmentName,
      );

      if (assignmentIndex >= 0) {
        const localAssignments = [...allAssignments];
        const currentAssignment = localAssignments[assignmentIndex];

        if (data.data.success === true) {
          localSuccessMessage = data.data.log;
          switch (action) {
            case 'assign':
              currentAssignment.release_path = `release/${assignmentName}`;
              break;
            case 'release':
              currentAssignment.status = `released`;
              break;
            case 'unrelease':
              currentAssignment.status = `draft`;
              break;
            default:
              break;
          }
        } else throw new Error(data.data.log);

        localAssignments[assignmentIndex] = currentAssignment;
        setAssignmentsArr(localAssignments);
      }
      setSuccessMessage(localSuccessMessage);
    } catch (err: unknown) {
      setErrorMessage((err as ErrorProps).message);
    }
  };

  /**
   * Handling creating and updating assignment functionalities
   * @param assignmentData
   * @param isUpdate Whether it is to create an assignment or update an assignment
   * @return Promise<void>
   */
  const updateOrCreateAssignment = async (
    assignmentData: AssignmentAddUpdate,
    isUpdate: boolean,
  ): Promise<void> => {
    setSuccessMessage('');
    setErrorMessage('');
    try {
      const data = await api.put(`${ADD_ASSIGNMENT}/${assignmentData.name}`, assignmentData);

      if (data.status !== 200) throw new Error('Something went wrong. Please try again later.');

      const localAssignments = [...allAssignments];
      const searchedIndex = localAssignments.findIndex(
        (assignment) => assignment.name === assignmentData.name,
      );

      if (isUpdate || searchedIndex !== -1) {
        localAssignments[searchedIndex] = data.data;
        setSuccessMessage('Assignment has been updated successfully!');
      } else {
        localAssignments.unshift(data.data);
        setSuccessMessage('Assignment has been created successfully!');
      }
      setAssignmentsArr(localAssignments);
      setErrorMessage('');
    } catch (err: unknown) {
      setErrorMessage((err as ErrorProps).message);
    }
  };

  const getAssignmentChapters = async (assignmentId: string): Promise<void> => {
    setErrorMessage('');
    setSuccessMessage('');
    setAssignmentChapters([]);
    try {
      const data: AxiosResponse<AssignmentChapter[]> = await api.get(
        `${GET_ASSIGNMENT_NOTEBOOKS}/${assignmentId}`,
      );

      if (data.status === 200 || data.status === 304) {
        if (data.data.length <= 0) throw new Error('No data found!');

        const assignmentData = data.data;
        setAssignmentChapters(assignmentData);
      } else if (data.status !== 200 && errorMessage.length === 0)
        throw new Error('Something went wrong. Please try again later');
    } catch (err: unknown) {
      setErrorMessage((err as ErrorProps).message);
    }
  };

  const clearAssignmentChapters = (): void => {
    setAssignmentChapters([]);
  };

  const getChapterSubmissions = async (assignmentId: string, chapterId: string): Promise<void> => {
    setSuccessMessage('');
    setErrorMessage('');
    try {
      const data: AxiosResponse<ChapterSubmission[]> = await api.get(
        `${GET_ASSIGNMENT_NOTEBOOK_SUBMISSION}/${assignmentId}/${chapterId}`,
      );

      if (data.status === 200) {
        if (data.data.length <= 0) throw new Error('No data found');

        const assignmentData: ChapterSubmission[] = data.data;
        setChapterSubmissions(assignmentData);
      } else if (data.status !== 200 && errorMessage.length === 0)
        throw new Error('Something went wrong. Please try again later');
    } catch (err: unknown) {
      setErrorMessage((err as ErrorProps).message);
    }
  };

  const clearChapterSubmissions = (): void => {
    setChapterSubmissions([]);
  };

  const getAssignmentSubmissions = async (assignmentId: string): Promise<void> => {
    setSuccessMessage('');
    setErrorMessage('');
    try {
      const data: AxiosResponse<AssignmentSubmissionAutograde[]> = await api.get(
        `${ASSIGNMENT_GRADING}/${assignmentId}`,
      );
      if (data.status === 200) {
        if (data.data.length <= 0) throw new Error('No data found!');

        const assignmentData: AssignmentSubmissionAutograde[] = data.data;
        setAssignmentSubmissionArr(assignmentData);
      }
    } catch (err: unknown) {
      setErrorMessage((err as ErrorProps).message);
    }
  };

  const autogradeAssignment = async (assignmentName: string, studentId: string): Promise<void> => {
    setSuccessMessage('');
    setErrorMessage('');
    try {
      const data = await api.post(
        `${AUTOGRADE_ASSIGNMENT}/${assignmentName}/${studentId}/autograde`,
      );
      if (data.status === 200) {
        if (data.data.success === true) {
          const localSuccessMessage = data.data.log;
          setSuccessMessage(localSuccessMessage);
        } else {
          throw new Error('Something went wrong! Please try again in a while.');
        }
      }
    } catch (err: unknown) {
      setErrorMessage((err as ErrorProps).message);
    }
  };

  return (
    <AssignmentContext.Provider
      value={{
        allAssignments,
        assignmentByName,
        assignmentsLoadedStatus,
        assignmentChapters,
        chapterSubmissions,
        assignmentSubmissions,
        errorMessage,
        successMessage,
        getAllAssignments,
        getAssignmentChapters,
        clearAssignmentChapters,
        getChapterSubmissions,
        clearChapterSubmissions,
        updateOrCreateAssignment,
        actionOnAssignment,
        getAssignmentSubmissions,
        autogradeAssignment,
      }}
    >
      {children}
    </AssignmentContext.Provider>
  );
};
