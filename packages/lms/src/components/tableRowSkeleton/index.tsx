import { FC } from 'react';
import { TableRow, TableCell, Typography } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { ContainerStyles } from '@illumidesk/common-ui';

import { TableName } from '../../common/constants';
interface TableRowSkeletonProps {
  type: string;
}

const TableRowSkeleton: FC<TableRowSkeletonProps> = ({ type }): JSX.Element => {
  const classes = ContainerStyles();

  let skeletonStruct: JSX.Element = <></>;

  switch (type) {
    case TableName.MANAGE_ASSIGNMENTS:
      skeletonStruct = (
        <>
          <TableCell style={{ height: 79 }} variant="body">
            <div>
              <Typography variant="body1">
                <Skeleton />
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Due Date: <Skeleton style={{ width: '50%', display: 'inline-block' }} />
              </Typography>
            </div>
          </TableCell>
          <TableCell style={{ height: '79px' }} variant="body">
            <Skeleton variant="rect" />
          </TableCell>
          <TableCell style={{ height: '79px' }} variant="body">
            <div className={classes.counterTd}>
              <Skeleton style={{ width: 20 }} />
            </div>
          </TableCell>
          <TableCell style={{ height: '79px' }} variant="body">
            <Skeleton />
          </TableCell>
          <TableCell style={{ height: '79px' }} variant="body"></TableCell>
        </>
      );
      break;

    case TableName.MANUAL_GRADING:
      skeletonStruct = (
        <>
          <TableCell style={{ height: 79 }} variant="body">
            <div>
              <Typography variant="body1">
                <Skeleton />
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Due Date: <Skeleton style={{ width: '50%', display: 'inline-block' }} />
              </Typography>
            </div>
          </TableCell>
          <TableCell style={{ height: '79px' }} variant="body">
            <div className={classes.counterTd}>
              <Skeleton style={{ width: 20 }} />
            </div>
          </TableCell>
          <TableCell>
            <div className={classes.counterTd}>
              <Skeleton style={{ display: 'inline-block', width: 15 }} /> /
              <Skeleton style={{ display: 'inline-block', width: 15 }} />
            </div>
          </TableCell>
        </>
      );
      break;
    case TableName.ASSIGNMENT_CHAPTERS:
      skeletonStruct = (
        <>
          <TableCell>
            <div>
              <Typography variant="body1" color="textPrimary">
                <Skeleton />
              </Typography>
            </div>
          </TableCell>
          <TableCell>
            <div className={classes.counterTd}>
              <Skeleton style={{ display: 'inline-block', width: 15 }} /> /
              <Skeleton style={{ display: 'inline-block', width: 15 }} />
            </div>
          </TableCell>
          <TableCell>
            <div className={classes.counterTd}>
              <Skeleton style={{ display: 'inline-block', width: 15 }} /> /
              <Skeleton style={{ display: 'inline-block', width: 15 }} />
            </div>
          </TableCell>
          <TableCell>
            <div className={classes.counterTd}>
              <Skeleton style={{ display: 'inline-block', width: 15 }} /> /
              <Skeleton style={{ display: 'inline-block', width: 15 }} />
            </div>
          </TableCell>
          <TableCell>
            <div className={classes.counterTd}>
              <Skeleton style={{ display: 'inline-block', width: 15 }} /> /
              <Skeleton style={{ display: 'inline-block', width: 15 }} />
            </div>
          </TableCell>
          <TableCell> </TableCell>
        </>
      );
      break;
    case TableName.NOTBOOKS_AGAINST_CHAPTERS:
      skeletonStruct = (
        <>
          <TableCell>
            <div>
              <Typography variant="body1" color="textPrimary">
                <Skeleton />
              </Typography>
            </div>
          </TableCell>
          <TableCell>
            <div className={classes.counterTd}>
              <Skeleton style={{ display: 'inline-block', width: 15 }} /> /
              <Skeleton style={{ display: 'inline-block', width: 15 }} />
            </div>
          </TableCell>
          <TableCell>
            <div className={classes.counterTd}>
              <Skeleton style={{ display: 'inline-block', width: 15 }} /> /
              <Skeleton style={{ display: 'inline-block', width: 15 }} />
            </div>
          </TableCell>
          <TableCell>
            <div className={classes.counterTd}>
              <Skeleton style={{ display: 'inline-block', width: 15 }} /> /
              <Skeleton style={{ display: 'inline-block', width: 15 }} />
            </div>
          </TableCell>
          <TableCell>
            <div className={classes.counterTd}>
              <Skeleton style={{ display: 'inline-block', width: 15 }} /> /
              <Skeleton style={{ display: 'inline-block', width: 15 }} />
            </div>
          </TableCell>
          <TableCell> </TableCell>
          <TableCell> </TableCell>
          <TableCell> </TableCell>
        </>
      );
      break;

    case TableName.MANAGE_STUDENTS:
      skeletonStruct = (
        <>
          <TableCell style={{ height: 79 }}>
            <div className={classes.cursorPointer}>
              <Typography variant="body1">
                <Skeleton />
              </Typography>
              <Typography variant="caption">
                <Skeleton />
              </Typography>
            </div>
          </TableCell>
          <TableCell>
            <Typography variant="body1">
              <Skeleton variant="rect" />
            </Typography>
          </TableCell>
          <TableCell>
            <div className={classes.counterTd}>
              <Skeleton style={{ display: 'inline-block', width: 15 }} /> /
              <Skeleton style={{ display: 'inline-block', width: 15 }} />
            </div>
          </TableCell>
          <TableCell> </TableCell>
        </>
      );
      break;
    case TableName.STUDENT_ASSIGNMENTS:
      skeletonStruct = (
        <>
          <TableCell style={{ height: 79 }}>
            <div className={classes.cursorPointer}>
              <Typography variant="body1">
                <Skeleton />
              </Typography>
              <Typography variant="caption">
                <Skeleton />
              </Typography>
            </div>
          </TableCell>
          <TableCell>
            <div className={classes.counterTd}>
              <Skeleton style={{ display: 'inline-block', width: 15 }} /> /
              <Skeleton style={{ display: 'inline-block', width: 15 }} />
            </div>
          </TableCell>
          <TableCell>
            <div className={classes.counterTd}>
              <Skeleton style={{ display: 'inline-block', width: 15 }} /> /
              <Skeleton style={{ display: 'inline-block', width: 15 }} />
            </div>
          </TableCell>
          <TableCell>
            <div className={classes.counterTd}>
              <Skeleton style={{ display: 'inline-block', width: 15 }} /> /
              <Skeleton style={{ display: 'inline-block', width: 15 }} />
            </div>
          </TableCell>
          <TableCell>
            <div className={classes.counterTd}>
              <Skeleton style={{ display: 'inline-block', width: 15 }} /> /
              <Skeleton style={{ display: 'inline-block', width: 15 }} />
            </div>
          </TableCell>
          <TableCell>
            <div className={classes.counterTd}>
              <Skeleton style={{ display: 'inline-block', width: 20 }} />
            </div>
          </TableCell>
        </>
      );
      break;
    default:
      break;
  }

  return <TableRow>{skeletonStruct}</TableRow>;
};

export default TableRowSkeleton;
