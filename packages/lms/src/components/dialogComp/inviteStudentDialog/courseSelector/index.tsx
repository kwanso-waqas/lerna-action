import { ModalStyles } from '@illumidesk/common-ui';
import { Box, TextField } from '@material-ui/core';
import React, { FC } from 'react';

const CourseSelector: FC = (): JSX.Element => {
  const modal = ModalStyles();

  return (
    <>
      <Box className={modal.gcDialog} pt={2.25}>
        <Box mb={1.5}>
          <TextField variant="outlined" placeholder="student@email.com" fullWidth={true} />
        </Box>
      </Box>
    </>
  );
};

export default CourseSelector;
