import { MouseEventHandler } from 'react';

/**
 * @Type CommonProps
 */
export interface CompProps {
  children?: JSX.Element;
}

export interface PropTypeHeader {
  onClickTrigger: MouseEventHandler;
  classes: { [key: string]: string };
  sidebarOpen: boolean;
  coursesLength: number;
}

// Routes Props Type
export interface RouteProps {
  path: string;
}

// Catch Error Type
export interface ErrorProps {
  message: string;
}

// Student Dialog Structure
export interface StudentDialogProps {
  studentModal: boolean;
  closeStudentModal: MouseEventHandler;
}

// Assignment Table Edit Menu
export interface AssignmentEditMenuProps {
  assignmentName: string;
}

// default reducer payload type
export interface CourseState {
  allCourses: string[];
  selectedCourse: string;
}

/**
 * @Type StudentContexts
 */
export interface Student {
  id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  score: number;
  max_score: number;
}

export interface Instructor {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface StudentAddUpdate {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
}

export interface StudentAssignment {
  id: string;
  name: string;
  student: string;
  needs_manual_grade: boolean;
  score: number;
  max_score: number;
  code_score: number;
  max_code_score: number;
  written_score: number;
  max_written_score: number;
  task_score: number;
  max_task_score: number;
  display_timestamp: string;
  timestamp: string;
  submitted: boolean;
}

export interface IStudentContext {
  allStudents: Student[];
  errorMessage: string;
  successMessage: string;
  studentAssignments: StudentAssignment[];
  getAllStudents: () => Promise<void>;
  getStudentAssignments: (studentId: string) => Promise<void>;
  updateOrCreateStudent: (student: StudentAddUpdate, isUpdate: boolean) => Promise<void>;
  clearStudentAssginments: () => void;
}

/**
 * @Type Student Add/Update Dialog
 */
export interface IStudentDialog {
  studentModal: boolean;
  closeStudentModal: MouseEventHandler;
  studentData: Student | null;
  setErrorMessage: (errorMessage: string) => void;
}

export interface IStudentDialogState {
  id: string;
  studentIdErr: string;
  first_name: string;
  first_nameErr: string;
  last_name: string;
  last_nameErr: string;
  email: string;
  emailErr: string;
  loadingDialog: boolean;
  updateBtn: boolean;
}

export enum StudentDialogActions {
  UPDATE_STUDENT_ID = 'updateStudentId',
  SET_STUDENT_ID_ERR = 'setStudentIdErr',
  UPDATE_FIRST_NAME = 'updateFirstName',
  SET_FIRST_NAME_ERR = 'setFirstNameErr',
  UPDATE_LAST_NAME = 'updateLastName',
  SET_LAST_NAME_ERR = 'setLastNameErr',
  UPDATE_EMAIL = 'updateEmail',
  SET_EMAIL_ERR = 'setEmailErr',
  SET_LOADING_DIALOG = 'setLoadingDialog',
  SET_UPDATE_BTN = 'setUpdateBtn',
  SET_SUCCESS_SNACKBAR = 'setSuccessSnackbar',
  SET_ERROR_SNACKBAR = 'setErrorSnackbar',
}

export interface IStudentDialogAction {
  type: StudentDialogActions;
  payload: string | boolean;
}

/**
 * @type ManageAssignments
 */
export interface Assignment {
  id: string;
  name: string;
  duedate_notimezone: string;
  display_duedate: string;
  duedate_timezone: string;
  status: string;
  num_submissions: number;
  releaseable: boolean;
  source_path: string;
  release_path: string | null;
  max_score: number;
  average_score: number;
}

export interface AssignmentChapter {
  id: string;
  name: string;
  average_score: number;
  max_score: number;
  average_code_score: number;
  max_code_score: number;
  average_task_score: number;
  max_task_score: number;
  average_written_score: number;
  max_written_score: number;
  needs_manual_grade: boolean;
  num_submissions: number;
}

export interface ChapterSubmission {
  id: string;
  student: string;
  first_name: string | null;
  last_name: string | null;
  name: string;
  score: number;
  max_score: number;
  code_score: number;
  max_code_score: number;
  task_score: number;
  max_task_score: number;
  written_score: number;
  max_written_score: number;
  index: number;
  flagged: boolean;
  failed_tests: boolean;
  needs_manual_grade: boolean;
}

export interface AssignmentAddUpdate {
  name: string;
  duedate_notimezone: string | null;
  duedate_timezone: string | null;
}

export interface AssignmentContextType {
  allAssignments: Assignment[];
  assignmentByName: Map<string, Assignment>;
  // A small state var so we know whether there are 0 assignments, or we didnt even start/finish loading.
  assignmentsLoadedStatus: 'unstarted' | 'started' | 'loaded' | 'errored';
  assignmentChapters: AssignmentChapter[];
  chapterSubmissions: ChapterSubmission[];
  assignmentSubmissions: AssignmentSubmissionAutograde[];
  selectedAssignment?: Assignment;
  errorMessage?: string;
  successMessage?: string;
  getAllAssignments: () => Promise<void>;
  getAssignmentChapters: (assignmentId: string) => Promise<void>;
  clearAssignmentChapters: () => void;
  getChapterSubmissions: (assignmentId: string, chapterId: string) => Promise<void>;
  clearChapterSubmissions: () => void;
  getAssignmentSubmissions: (assignmentId: string) => Promise<void>;
  updateOrCreateAssignment: (
    newAssignment: AssignmentAddUpdate,
    isUpdate: boolean,
  ) => Promise<void>;
  actionOnAssignment: (assignmentName: string, action: string) => Promise<void>;
  autogradeAssignment: (assignmentName: string, studentId: string) => Promise<void>;
}

export interface SubmissionCellOutput {
  output_type: string;
  name?: string;
  ename?: string;
  text?: string;
  traceback?: string[];
  data: {
    'image/png': string;
  };
}

export interface Kernelspec {
  name: string;
  language: string;
}

export interface SubmissionMetadata {
  kernelspec: Kernelspec;
}

export interface SubmissionCellNbgrader {
  grade_id: string;
  points: number;
  grade: boolean;
  solution: boolean;
  task: boolean;
}

export interface SubmissionCellMetadata {
  deletable: boolean;
  trusted: boolean;
  nbgrader: SubmissionCellNbgrader;
}

export interface SubmissionCell {
  cell_type: string;
  id: string;
  outputs: SubmissionCellOutput[];
  source: string;
  metadata: SubmissionCellMetadata;
  execution_count: number;
}

export interface SubmissionData {
  cells: SubmissionCell[];
  metadata: SubmissionMetadata;
}

export interface SubmissionCellGrades {
  id: string;
  assignment: string;
  auto_score: number | null;
  cell_type: string;
  extra_credit: number;
  failed_tests: boolean | null;
  manual_score: number;
  max_score: number;
  name: string;
  needs_manual_grade: boolean;
  notebook: string;
}

export interface SubmissionCellComment {
  id: string;
  assignment: string;
  name: string;
  manual_comment: string;
  auto_comment: string | null;
  notebook: string;
  student: string;
}

export interface Course {
  name: string;
}

export interface AssignmentSubmissionAutograde {
  id: string;
  name: string;
  timestamp: string;
  first_name: string;
  last_name: string;
  student: string;
  score: number;
  max_score: number;
  needs_manual_grade: boolean;
  display_timestamp: string;
  autograded: boolean;
  submitted: boolean;
}
