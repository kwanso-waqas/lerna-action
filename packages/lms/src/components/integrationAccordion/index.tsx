import React, { FC, useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  AccordionActions,
  Button,
  Grid,
  TextField,
  Typography,
  Box,
} from '@material-ui/core';
import { ModalStyles } from '@illumidesk/common-ui';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import clsx from 'clsx';

import useStyles from './style';

import DeleteDialog from '../dialogComp/deleteDialog';

const IntegrationView: FC = (): JSX.Element => {
  const [open, setDeleteDialog] = useState<boolean>(false);
  const classes = useStyles();
  const modalClasses = ModalStyles();

  return (
    <>
      <Accordion className={classes.customAccordian}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>Intergration1 LTI (v1.1)</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box p={2} style={{ width: '100%' }}>
            <Box mb={1}>
              <Typography variant="h4">Integration setting</Typography>
            </Box>
            <Typography variant="body1">Edit or Delete your integration settings</Typography>
            <Box mb={2}>
              <hr />
            </Box>
            <Grid
              container
              direction="row"
              justifyContent="flex-start"
              alignItems="center"
              spacing={2}
            >
              <Grid item xs={12} sm={4} lg={2}>
                <Typography>Consumer Key</Typography>
              </Grid>
              <Grid item xs={12} sm={8} lg={4}>
                <TextField variant="outlined" placeholder="Illumi Desk" />
              </Grid>
              <Grid item xs={12} sm={4} lg={2}>
                <Typography>Shared Secret</Typography>
              </Grid>
              <Grid item xs={12} sm={8} lg={4}>
                <TextField variant="outlined" placeholder="Illumi Desk" />
              </Grid>
            </Grid>
          </Box>
        </AccordionDetails>
        <AccordionActions style={{ padding: 0 }}>
          <Box className={clsx(modalClasses.gcDialogFooter, classes.customFooter)}>
            <Box mr={2}>
              <Button variant="outlined" onClick={() => setDeleteDialog(!open)}>
                Delete
              </Button>
            </Box>
            <Button color="primary" variant="contained">
              Update Integration
            </Button>
          </Box>
        </AccordionActions>
      </Accordion>
      <>
        <Accordion className={classes.customAccordian}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>Intergration1 LTI (v1.3)</Typography>
          </AccordionSummary>
          <AccordionDetails style={{ padding: 0 }}>
            <Box p={2} style={{ width: '100%' }}>
              <Box mb={1}>
                <Typography variant="h4">Integration setting</Typography>
              </Box>
              <Typography variant="body1">Edit or Delete your integration settings</Typography>
              <Box mb={2}>
                <hr />
              </Box>
              <Grid
                container
                direction="row"
                justifyContent="flex-start"
                alignItems="center"
                spacing={2}
              >
                <Grid item xs={12} sm={4} lg={2}>
                  <Typography>Client ID</Typography>
                </Grid>
                <Grid item xs={12} sm={8} lg={4}>
                  <TextField variant="outlined" placeholder="Illumi Desk" />
                </Grid>
                <Grid item xs={12} sm={4} lg={2}>
                  <Typography>Redirect URL</Typography>
                </Grid>
                <Grid item xs={12} sm={8} lg={4}>
                  <TextField variant="outlined" placeholder="Illumi Desk" />
                </Grid>
                <Grid item xs={12} sm={4} lg={2}>
                  <Typography>Token URL</Typography>
                </Grid>
                <Grid item xs={12} sm={8} lg={4}>
                  <TextField variant="outlined" placeholder="Illumi Desk" />
                </Grid>
                <Grid item xs={12} sm={4} lg={2}>
                  <Typography>Authorization URL</Typography>
                </Grid>
                <Grid item xs={12} sm={8} lg={4}>
                  <TextField variant="outlined" placeholder="Illumi Desk" />
                </Grid>
              </Grid>
            </Box>
          </AccordionDetails>
          <AccordionActions style={{ padding: 0 }}>
            <Box className={clsx(modalClasses.gcDialogFooter, classes.customFooter)}>
              <Box mr={2}>
                <Button variant="outlined" onClick={() => setDeleteDialog(!open)}>
                  Delete
                </Button>
              </Box>
              <Button color="primary" variant="contained">
                Update Integration
              </Button>
            </Box>
          </AccordionActions>
        </Accordion>
      </>
      <DeleteDialog
        primaryTitle={'Are you sure you want to remove this Integration?'}
        description={
          'Are you sure you want to Delete your Integration? All of your Integration settings will be lost.'
        }
        buttonText={'Delete Integration'}
        primaryBtnAction={function (): void {
          console.log('confirm deleted');
        }}
        onClose={() => setDeleteDialog(!open)}
        open={open}
        type={'deleteIntegration'}
      />
    </>
  );
};

export default IntegrationView;
