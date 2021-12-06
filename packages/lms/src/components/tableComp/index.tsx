import { FC, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Table, TableHead, TableRow, TableBody, TableCell, IconButton } from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';

import TableRowComp from '../tableRowComp';
import TableRowSkeleton from '../tableRowSkeleton';

import { PAGE_SIZE, TableName } from '../../common/constants';
import {
  Assignment,
  AssignmentChapter,
  Student,
  Instructor,
  StudentAssignment,
  ChapterSubmission,
  AssignmentSubmissionAutograde,
} from '../../common/types';

interface TableCompProps {
  headings: string[];
  type: string;
  redirectUrl?: string;
  apiData?:
    | Assignment[]
    | AssignmentChapter[]
    | Student[]
    | Instructor[]
    | StudentAssignment[]
    | ChapterSubmission[]
    | AssignmentSubmissionAutograde[];
  // eslint-disable-next-line @typescript-eslint/ban-types
  updateAction?: Function;
  // eslint-disable-next-line @typescript-eslint/ban-types
  deleteAction?: Function;
}

const TableComp: FC<TableCompProps> = ({
  headings,
  type,
  redirectUrl,
  apiData,
  updateAction,
  deleteAction,
}): JSX.Element => {
  const [userName, setUserNameVisibility] = useState<boolean>(false);
  const history = useHistory();

  const redirectAction = (dataToAppend: string, studentId?: string, index?: number): void => {
    if (type === TableName.MANAGE_ASSIGNMENTS) {
      window.open(`${redirectUrl}/${dataToAppend}`, '_blank');
    } else {
      let extraData = '?';
      if (studentId) extraData += `id=${studentId}`;
      if (index) {
        if (extraData.length > 1) extraData += '&';
        extraData += `index=${index}`;
      }
      history.push(`${redirectUrl}/${encodeURI(dataToAppend)}${extraData}`);
    }
  };

  const changeNameVisibility = (): void => {
    setUserNameVisibility((prevState) => !prevState);
  };

  return (
    <Table>
      <TableHead>
        <TableRow>
          {type === TableName.NOTBOOKS_AGAINST_CHAPTERS ? (
            <TableCell>
              <IconButton size="small" onClick={changeNameVisibility}>
                {userName ? <Visibility fontSize="small" /> : <VisibilityOff fontSize="small" />}
              </IconButton>
            </TableCell>
          ) : (
            <></>
          )}
          {headings.map((title: string, index: number) => (
            <TableCell key={index}>{title}</TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {apiData && apiData.length > 0
          ? apiData.map(
              (
                data:
                  | Assignment
                  | AssignmentChapter
                  | Student
                  | Instructor
                  | StudentAssignment
                  | ChapterSubmission
                  | AssignmentSubmissionAutograde,
                index: number,
              ) => (
                <TableRowComp
                  key={index}
                  singleData={data}
                  redirectAction={redirectAction}
                  type={type}
                  parentNode={userName}
                  updateAction={updateAction}
                  deleteAction={deleteAction}
                />
              ),
            )
          : Array(PAGE_SIZE)
              .fill(PAGE_SIZE)
              .map((_, index: number) => <TableRowSkeleton key={index} type={type} />)}
      </TableBody>
    </Table>
  );
};

export default TableComp;
