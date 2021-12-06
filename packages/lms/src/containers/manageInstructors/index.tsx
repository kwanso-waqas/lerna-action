import React, { FC, useState } from 'react';
import { Box, Button, Grid, InputAdornment, TableContainer, TextField } from '@material-ui/core';
import { Search, Cancel } from '@material-ui/icons';
import { ContainerStyles, Pagination } from '@illumidesk/common-ui';

// import { useStyles } from '../common/style';
import TableComp from '../../components/tableComp';
import DialogComponent from '../../components/dialogComp';
import SubHeader from '../../components/subHeader';

import { INSTRUCTOR_TABLE_HEAD, TableName } from '../../common/constants';
import { SyncIcon } from '../../assets';

const dummyInstructors = [
  {
    id: '2323',
    email: 'faizan@gmail.com',
    firstName: 'Faizan',
    lastName: 'Saleem',
  },
  {
    id: '2423',
    email: 'abdullah@gmail.com',
    firstName: 'Abdullah',
    lastName: 'Nadeem',
  },
];

const ManageInstructors: FC = (): JSX.Element => {
  const [open, openDelModal] = useState<boolean>(false);

  // const classes = useStyles();
  const contClasses = ContainerStyles();

  const editAction = () => {
    console.log('EDIT ACTION INSTRUCTORS CLICKED');
  };

  const deleteAction = () => {
    openDelModal(!open);
  };

  /**
   * All JSX Elements used in this page
   * @Type JSX.Element
   */
  const tableView = (
    <div className={contClasses.mainSection}>
      <div className={contClasses.innerSection}>
        <Box pt={1.75} pb={1.75} pl={2} pr={2} data-cy="studentPageTableHeader">
          <Grid container direction="row" justifyContent="flex-start" alignItems="center">
            <Grid item xs={12} sm={5}>
              <TextField
                id="outlined-start-adornment"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment
                      className={contClasses.cursorPointer}
                      onClick={() => console.log('CLEAR INSTRUCTOR SEARCH')}
                      position="end"
                    >
                      <Cancel fontSize="small" />
                    </InputAdornment>
                  ),
                }}
                onChange={() => console.log('CHANGE SEARCH ITEM')}
                value={''}
                placeholder="Search"
                variant="outlined"
                className={contClasses.tableSearch}
                data-cy="addStudentTableHeaderSearch"
              />
            </Grid>
            <Grid item xs={12} sm={7}>
              <Box mt={{ xs: 2.4, sm: 0 }}>
                <Grid container justifyContent="flex-end" alignItems="center">
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => console.log('INSTRUCTOR SYNC BTN ACTION')}
                    data-cy="studentTableHeaderSyncBtn"
                  >
                    <img src={SyncIcon} alt="sync icon" /> <span className="btnName"> Sync </span>
                  </Button>
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Box>

        <TableContainer
          style={{
            minHeight: 439,
          }}
          data-cy="studentDataTable"
        >
          <TableComp
            headings={INSTRUCTOR_TABLE_HEAD}
            type={TableName.MANAGE_INSTRUCTORS}
            apiData={dummyInstructors}
            updateAction={editAction}
            deleteAction={deleteAction}
            redirectUrl="/manage-instructors"
          />
        </TableContainer>
      </div>
      <Pagination
        page={1}
        onChangePage={(): void => {
          console.log('page change has been called');
        }}
        PAGE_SIZE={6}
        isMobilePaginator={false}
      />
    </div>
  );

  return (
    <>
      <SubHeader
        title="Instructors"
        btnText="Add New Instructor"
        btnAction={() => console.log('Btn has been clicked')}
        emptyData={false}
      />
      {tableView}
      <DialogComponent
        open={open}
        buttonText="Remove Instructor"
        primaryTitle="Are you Sure you want to Remove this Instructor from your Course?"
        secondaryTitle="Remove this Instructor from your Campus?"
        description="Are you sure you want to remove this Instructor? All of this Instructor rights will be lost."
        primaryBtnAction={(): void => openDelModal(!open)}
        secondaryBtnAction={(): void => openDelModal(!open)}
        type="deleteInstructor"
        onClose={(): void => openDelModal(!open)}
      />
    </>
  );
};

export default ManageInstructors;
