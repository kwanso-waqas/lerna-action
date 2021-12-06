import { getBaseUrl } from './graderConstants';

// Adding Active to sidebar elements
export const UPDATE_SIDEBAR_ELEMENT = 'UPDATE_SIDEBAR_ELEMENT';

// Types for Getting and Setting Assignments
export const GET_ASSIGNMENTS_REQUEST = 'GET_ASSIGNMENTS_REQUEST';

// TYPES FOR COURSES ACTIONS
export const GET_ALL_COURSES = 'GET_ALL_COURSES';
export const SELECT_COURSE = 'SELECT_COURSE';

/**
 * @var TableNamesEnum
 */
export enum TableName {
  MANAGE_ASSIGNMENTS = 'manageAssignments',
  MANAGE_STUDENTS = 'manageStudents',
  MANAGE_INSTRUCTORS = 'manageInstructors',
  STUDENT_ASSIGNMENTS = 'studentAssignments',
  MANUAL_GRADING = 'manualGrading',
  ASSIGNMENT_CHAPTERS = 'assignmentChapters',
  NOTBOOKS_AGAINST_CHAPTERS = 'notebooksAgainstChapters',
  ASSIGNMENT_SUBMISSIONS = 'assignmentSubmissions',
}

/**
 * @var ManageAssignmentsTable
 */
type AssignmentTableHead = 'name' | 'status' | 'submissions' | 'action' | '';
export const ASSIGNMENT_TABLE_HEAD: AssignmentTableHead[] = [
  'name',
  'status',
  'submissions',
  'action',
  '',
];

/**
 * @var ManageStudentsTable
 */
type StudentTableHead = 'student name' | 'student id' | 'overall score' | 'action';
export const STUDENT_TABLE_HEAD: StudentTableHead[] = [
  'student name',
  'student id',
  'overall score',
  'action',
];

/**
 * @var StudentAssignmentsTable
 */
type StudentAssignmentHead =
  | 'assignment id'
  | 'overall score'
  | 'code score'
  | 'written score'
  | 'task score'
  | 'need manual grade?';
export const STUDENT_ASSIGNMENT_HEAD: StudentAssignmentHead[] = [
  'assignment id',
  'overall score',
  'code score',
  'written score',
  'task score',
  'need manual grade?',
];

/**
 * @var ManageInstructorssTable
 */
type InstructorTableHead =
  | 'instructor email'
  | 'instructor first name'
  | 'instructor last name'
  | 'action';
export const INSTRUCTOR_TABLE_HEAD: InstructorTableHead[] = [
  'instructor email',
  'instructor first name',
  'instructor last name',
  'action',
];

/**
 * @var ManualGradingTable
 */
type ManualGradingHead = 'assignment id' | 'submissions' | 'score';
export const MANUAL_GRADING_HEAD: ManualGradingHead[] = ['assignment id', 'submissions', 'score'];

/**
 * @var ManualGradingAssignmentChapters
 */
type AssignmentChaptersHead =
  | 'notebook id'
  | 'avg. score'
  | 'avg. code score'
  | 'avg. written score'
  | 'avg. task score'
  | 'need manual grading';
export const ASSIGNMENT_CHAPTERS_HEAD: AssignmentChaptersHead[] = [
  'notebook id',
  'avg. score',
  'avg. code score',
  'avg. written score',
  'avg. task score',
  'need manual grading',
];

/**
 * @var ManualGradingNotebooksAgainstChapters
 */
type NotebooksAgainstChaptersHead =
  | 'submission id'
  | 'overall score'
  | 'code score'
  | 'written score'
  | 'task score'
  | 'needs manual grading'
  | 'test'
  | 'flagged';
export const NOTEBOOKS_AGAINST_CHAPTERS_HEAD: NotebooksAgainstChaptersHead[] = [
  'submission id',
  'overall score',
  'code score',
  'written score',
  'task score',
  'needs manual grading',
  'test',
  'flagged',
];

/**
 * @var ManageAssignmentsAutoGradingTable
 */
type assignmentAutogradingTableHead = 'name' | 'status' | 'score' | 'autograde';
export const ASSIGNMENT_AUTOGRADING_HEAD: assignmentAutogradingTableHead[] = [
  'name',
  'score',
  'status',
  'autograde',
];

/**
 * Error Data Array
 */
export const ERROR_MESSAGES = [
  'No data found!',
  'Something went wrong. Please try again later.',
  'Request failed with status code 500',
  'Request failed with status code 404',
];

// API endpoint and token
export const API_ENDPOINT = `${window.location.origin.toString()}${getBaseUrl()}`;
export const API_TOKEN = process.env.REACT_APP_API_TOKEN as unknown as string;
export const SERVER_ENDPOINT = (process.env.REACT_APP_SERVER_ENDPOINT as string) || API_ENDPOINT;
export const PAGE_SIZE = Number(process.env.REACT_APP_RECORD_LIMIT || 6);

/**
 * Manage Courses Page APIs
 */
export const GET_COURSES_API = '/formgraders';

/**
 * Manage Assignment Page APIs
 */
export const ASSIGNMENT_PATH = 'source';
export const GET_ASSIGNMENTS = '/formgrader/api/assignments';
export const ADD_ASSIGNMENT = '/formgrader/api/assignment';
export const ACT_ON_ASSIGNMENT = '/formgrader/api/assignment';
export const ASSIGNMENT_GRADING = '/formgrader/api/submissions';
export const AUTOGRADE_ASSIGNMENT = '/formgrader/api/submission';

/**
 * Manual Grading Page APIs
 */
export const GET_ASSIGNMENT_NOTEBOOKS = '/formgrader/api/notebooks';
export const GET_ASSIGNMENT_NOTEBOOK_SUBMISSION = '/formgrader/api/submitted_notebooks';

/**
 * Manual Grading Assignment Page APIs
 */
export const GET_ASSIGNMENT_CONTENT = '/api/contents';
export const GET_SUBMISSION_GRADES = '/formgrader/api/grades?submission_id=';
export const GET_SUBMISSION_COMMENTS = '/formgrader/api/comments?submission_id=';
export const UPDATE_SUBMISSION_COMMENT = '/formgrader/api/comment';
export const UPDATE_SUBMISSION_GRADE = '/formgrader/api/grade';

/**
 * Manage Students Page APIs
 */
export const GET_STUDENTS = '/formgrader/api/students';
export const ADD_UPDATE_STUDENT = '/formgrader/api/student';
export const GET_STUDENT_ASSIGNMENTS = '/formgrader/api/student_submissions';
