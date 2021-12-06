import { FC, useState } from 'react';
import { Grid, Typography } from '@material-ui/core';
import { Color } from '@material-ui/lab';
import { ContainerStyles, CustomAlert } from '@illumidesk/common-ui';

import { NotebookViewer, NotebookViewerMode } from '../notebook';

import useStyles from './styles';
import { CheckCircle, ErrorIcon } from '../../../assets';
import { ContentBreadcrumbs } from '../breadcrumbs';
import { Assignment } from '../../../common/types';
import {
  AssignmentExpandedNotebookContent,
  AssignmentContentSharedMetadata,
} from '../../../store/assignment';
import { JupyterContentsStore } from '../../../store/jupyter';

interface NotebookEditorProps {
  store: JupyterContentsStore;
  assignment: Assignment;
  assignmentContent: AssignmentExpandedNotebookContent & AssignmentContentSharedMetadata;
  filepath: string;
  courseId: string;
}

const NotebookEditor: FC<NotebookEditorProps> = (p: NotebookEditorProps): JSX.Element => {
  const classes = useStyles();
  const themeClass = ContainerStyles();

  const [msg, openMessage] = useState<{
    open: boolean;
    message?: string;
    severity?: Color;
  }>({ open: false });
  const [hasUnsavedChanges, setUnsavedChanges] = useState<boolean>(false);
  const handleClose = () => openMessage({ open: false });

  if (p.assignmentContent.type !== 'notebook') {
    throw new Error('Non-notebook content can not be displayed in the notebook editor');
  }

  if (p.assignmentContent.format !== 'json') {
    // Should never happen unless something changes in Jupyter's content format.
    return (
      <>
        <h2>I don{`&apos;`}t understand the format of this content file :(</h2>
      </>
    );
  }

  const onSave = async (ipynbString: string) => {
    const savedResult = await p.store.saveAssignmentContent(p.assignment.name, p.filepath, {
      name: p.assignmentContent.name,
      content: JSON.parse(ipynbString),
      type: 'notebook',
      format: 'json',
      mimetype: p.assignmentContent.mimetype,
      path: p.assignmentContent.path,
    });
    if (savedResult.ok) {
      openMessage({
        open: true,
        message: `Assignment file ${p.assignmentContent.name} saved!`,
      });
      return true;
    } else {
      console.error(savedResult.error);
      openMessage({
        open: true,
        severity: 'error',
        message: `Something went wrong saving this file, status ${savedResult.status} (${savedResult.error})`,
      });
      return false;
    }
  };

  const mode: NotebookViewerMode = 'assignment-creator';
  const nbdata = {
    ipynbContent: JSON.stringify(p.assignmentContent.content),
  };

  const unsavedChangesIndicator = hasUnsavedChanges ? '(you have unsaved changes) - ' : '';
  return (
    <>
      <CustomAlert
        alertType={msg.severity || 'success'}
        alertIcon={
          msg.severity ? (msg.severity === 'success' ? CheckCircle : ErrorIcon) : CheckCircle
        }
        alertMessage={msg.message || ''}
        showAlert={msg.open}
        closeAlert={handleClose}
      />

      <Grid container direction="row" className={classes.pageTitleContainer}>
        <Grid item xs={6} sm={4}>
          <Typography variant="h1"> Assignment Editor</Typography>
        </Grid>
        <Grid container justifyContent="flex-end" alignItems="center" item xs={6} sm={8}>
          <Typography>
            {unsavedChangesIndicator +
              ((mode as string) === 'student'
                ? 'Viewing as Student'
                : 'Viewing as Assignment Creator')}
          </Typography>
        </Grid>
      </Grid>

      <div className={themeClass.mainSection}>
        <ContentBreadcrumbs
          courseId={p.courseId}
          assignment={p.assignment}
          filepath={p.filepath || '/'}
        ></ContentBreadcrumbs>

        <div className={themeClass.innerSection}>
          <NotebookViewer
            notebook={nbdata}
            mode={mode}
            onSave={onSave}
            onHasUnsavedChangesChange={(v) => setUnsavedChanges(v)}
          ></NotebookViewer>
        </div>
      </div>
    </>
  );
};

export default NotebookEditor;
