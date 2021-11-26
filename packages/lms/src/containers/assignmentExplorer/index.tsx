import { FC, useState, useEffect, useContext, Fragment, useRef, ChangeEvent } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import {
  Grid,
  Typography,
  Button,
  Box,
  TableRow,
  TableBody,
  TableHead,
  TableCell,
  TableContainer,
  Table,
} from '@material-ui/core';
import { Color } from '@material-ui/lab';
import { Add, CloudUploadOutlined, FolderOutlined, Info } from '@material-ui/icons';
import { ContainerStyles, CustomAlert, EmptyView } from '@illumidesk/common-ui';

import useStyles from './styles';
import { CheckCircle, ErrorIcon } from '../../assets';
import {
  AssignmentContent,
  AssignmentContentSaveData,
  AssignmentContentSharedMetadata,
  AssignmentExpandedNotebookContent,
} from '../../store/assignment';
import { JupyterContentsStore } from '../../store/jupyter';
import { ContentBreadcrumbs } from '../../components/editor/breadcrumbs';
import { AssignmentContext } from '../../context/assignments';
import { Assignment } from '../../common/types';
import { joinFilepath } from '../../common/filepath';
import NotebookEditor from '../../components/editor/notebookEditor';
import { createNewNotebookContent } from './empty';

const ASSIGNMENT_NOT_FOUND = 'NOT_FOUND';
const CONTENT_NOT_FOUND = 'CONTENT_NOT_FOUND';

/**
 * The Assignment explorer shows an assignment's metadata and a tree of files.
 */
const AssignmentExplorer: FC = (): JSX.Element => {
  const classes = useStyles();
  const themeClass = ContainerStyles();

  const uploadInputRef = useRef(null);
  const {
    courseId,
    assignmentId,
    filepath: filepathOrUndefined,
  } = useParams<{ courseId: string; assignmentId: string; filepath?: string }>();

  const {
    assignmentByName,
    getAllAssignments,
    assignmentsLoadedStatus,
    errorMessage: assignmentContextErrorMessage,
  } = useContext(AssignmentContext);

  const history = useHistory();
  const filepath = filepathOrUndefined || '/';

  function redirectToContentPathInAssignment(contentPath: string) {
    const contentPathWithoutAssignmentPrefix = contentPath.replace(
      typeof assignment !== 'string' && assignment ? assignment.source_path : '',
      '',
    );
    history.push(
      `/assignment/${joinFilepath(encodeURI(assignmentId), contentPathWithoutAssignmentPrefix)}`,
    );
  }

  const [msg, openMessage] = useState<{
    open: boolean;
    message: string;
    severity: Color;
  }>({ open: false, message: '', severity: 'info' });
  const handleClose = () => openMessage({ open: false, message: '', severity: 'info' });

  const [assignment, setAssignmentData] = useState<Assignment | typeof ASSIGNMENT_NOT_FOUND>();
  const [assignmentContent, setAssignmentContent] = useState<
    AssignmentContent | typeof CONTENT_NOT_FOUND
  >();
  const [store, setStore] = useState<JupyterContentsStore>();

  /**
   * Fetch assignments list from API, this loads the assignment metadata.
   */
  useEffect(() => {
    getAllAssignments().catch(() => {
      openMessage({
        open: true,
        message: assignmentContextErrorMessage || '<no message>',
        severity: 'error',
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assignmentId]);

  useEffect(() => {
    let localAssignment: Assignment | undefined | typeof ASSIGNMENT_NOT_FOUND =
      assignmentByName.get(assignmentId);
    if (!localAssignment) {
      localAssignment = assignmentsLoadedStatus === 'loaded' ? ASSIGNMENT_NOT_FOUND : undefined;
    }
    setAssignmentData(localAssignment);
  }, [assignmentId, assignmentByName, assignmentsLoadedStatus]);

  useEffect(() => {
    setAssignmentContent(undefined);
    if (
      !assignment ||
      assignment === ASSIGNMENT_NOT_FOUND ||
      assignmentsLoadedStatus !== 'loaded'
    ) {
      return;
    }
    const store = new JupyterContentsStore({
      assignments: assignmentByName,
      serverSettings: {
        baseUrl: '/',
        token: ' ',
      },
    });
    setStore(store);
    store.getAssignmentContent(assignmentId, filepath).then((a) => {
      if (a.ok) {
        setAssignmentContent(a.data);
      } else {
        if (a.status === 404) {
          openMessage({
            open: true,
            message: `404, file or folder "${filepath}" not found`,
            severity: 'error',
          });
          setAssignmentContent('CONTENT_NOT_FOUND');
        } else {
          console.error(a.error);
          if (a.detail) console.error(a.detail);
          openMessage({
            open: true,
            message: `${a.status} - something went wrong loading the assignment content`,
            severity: 'error',
          });
        }
      }
    });
  }, [assignmentId, assignment, filepath, assignmentByName, assignmentsLoadedStatus]);

  async function openCreateModal(isDirectory: boolean) {
    if (!store || !assignment || assignment === 'NOT_FOUND') return;
    let name = prompt(
      isDirectory
        ? 'Enter a name for the directory'
        : 'Enter notebook filename (should end in .ipynb)',
    );
    if (!name) {
      return;
    }
    if (!isDirectory) {
      name = name.replace(/(.ipynb)?$/, '.ipynb');
    }

    const createPayload: AssignmentContentSaveData = isDirectory
      ? {
          type: 'directory',
          path: joinFilepath(filepath, name),
        }
      : {
          type: 'notebook',
          format: 'json',
          content: createNewNotebookContent(name),
        };

    const savedResult = await store.saveAssignmentContent(
      assignment.name,
      joinFilepath(filepath, name),
      createPayload,
    );
    if (savedResult.ok) {
      openMessage({
        open: true,
        message: `Created ${name}!`,
        severity: 'success',
      });
    } else {
      console.error(savedResult.error);
      openMessage({
        open: true,
        severity: 'error',
        message: `Something went wrong, status ${savedResult.status} (${savedResult.error})`,
      });
    }
    alert('You have to manually reload for now.');
  }

  // Upload file button event
  async function onUploadChange(e: ChangeEvent<HTMLInputElement>) {
    const target = e.target;
    if (!target || !store || !assignment || assignment === 'NOT_FOUND') return;

    const files = (target as HTMLInputElement).files;

    if (!files) return;

    for (let i = 0; i < files.length; i++) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const file = files.item(i)!;
      const name = file.name;
      const contentBuffer = await file.arrayBuffer();
      const bytes = new Uint8Array(contentBuffer);

      // TODO we should import a proper base64 library instead of this ad-hoc conversion.
      let binary = '';
      for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      const base64 = window.btoa(binary);

      const savedResult = await store.saveAssignmentContent(
        assignment.name,
        joinFilepath(filepath, name),
        {
          format: 'base64',
          content: base64,
          mimetype: file.type,
        },
      );
      if (savedResult.ok) {
        openMessage({
          open: true,
          message: `Created ${name}!`,
          severity: 'success',
        });
      } else {
        console.error(savedResult.error);
        openMessage({
          open: true,
          severity: 'error',
          message: `Something went wrong uploading ${name}, status ${savedResult.status} (${savedResult.error})`,
        });
        return;
      }
    }
  }

  if (!assignment) {
    // TODO: this part is repeated 3 times now, surely we can pull this out and re-use it instead.
    return (
      <>
        {/* TODO nicer load indicator */}
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
            <Typography variant="h1"> {assignmentId} </Typography>
          </Grid>
          <Grid container justifyContent="flex-end" alignItems="center" item xs={6} sm={8}>
            <Info /> <Typography color="textSecondary"> Loading ... </Typography>
          </Grid>
        </Grid>
      </>
    );
  }

  if (assignment === ASSIGNMENT_NOT_FOUND) {
    return (
      <EmptyView
        title={`Assignment not found`}
        message={`Assigment "${assignmentId}" does not exist in this course.`}
        btnText="Back to assignments overview"
        openModal={() => {
          history.push(`/manage-assignments/`);
        }}
      ></EmptyView>
    );
  }

  const snackbar = (
    <CustomAlert
      alertType={msg.severity || 'success'}
      alertIcon={
        msg.severity ? (msg.severity === 'success' ? CheckCircle : ErrorIcon) : CheckCircle
      }
      alertMessage={msg.message || ''}
      showAlert={msg.open}
      closeAlert={handleClose}
    />
  );

  const titleBar = (
    <Grid container direction="row" className={classes.pageTitleContainer}>
      <Grid item xs={6} sm={4}>
        <Typography variant="h1"> {assignment.name} </Typography>
      </Grid>
      <Grid container justifyContent="flex-end" alignItems="center" item xs={6} sm={8}>
        <Typography color="textSecondary">{assignment.id}</Typography>
      </Grid>
    </Grid>
  );

  if (!assignmentContent) {
    // TODO nicer loading screen.
    return (
      <>
        {snackbar}
        {titleBar}
        Loading content..
      </>
    );
  }

  if (assignmentContent === CONTENT_NOT_FOUND) {
    // TODO nicer loading screen.
    return (
      <>
        {snackbar}
        {titleBar}

        <div className={themeClass.mainSection}>
          <ContentBreadcrumbs
            courseId={courseId}
            assignment={assignment}
            filepath={filepath || '/'}
          ></ContentBreadcrumbs>

          <EmptyView
            title={`No such file or directory`}
            message={joinFilepath(assignmentId, filepath)}
            btnText={`Back to ${assignmentId}`}
            openModal={() => {
              history.push(`/assignment/${assignmentId}`);
            }}
          ></EmptyView>
        </div>
      </>
    );
  }

  if (assignmentContent.type === 'notebook' && store) {
    return (
      <>
        {snackbar}

        <NotebookEditor
          courseId={courseId}
          assignment={assignment}
          store={store}
          assignmentContent={
            assignmentContent as AssignmentExpandedNotebookContent & AssignmentContentSharedMetadata
          }
          filepath={filepath}
        ></NotebookEditor>
      </>
    );
  }

  if (assignmentContent.type === 'file' && store) {
    return (
      <>
        {snackbar}
        {titleBar}

        <div className={themeClass.mainSection}>
          <ContentBreadcrumbs
            courseId={courseId}
            assignment={assignment}
            filepath={filepath || '/'}
          ></ContentBreadcrumbs>
          <div className={themeClass.innerSection}>
            <EmptyView
              title={assignmentContent.name}
              message={
                "This is a file we don't understand yet :(. Maybe there should be a download button here?"
              }
            ></EmptyView>
          </div>
        </div>
      </>
    );
  }

  // An assignment content is either a notebook, a file or a directory. Only the last option is left.
  let files = assignmentContent.content as AssignmentContent[];

  // Sort so that the directories come first in the file view.
  // TODO: also sort alphabetically. Jupyter happens to return them in order by default, thats why they
  // are sorted now, but we shouldn't depend on that.
  files.sort((a: AssignmentContent, b: AssignmentContent) => {
    if (a.type === 'directory' && b.type !== 'directory') {
      return -1;
    }
    if (a.type !== 'directory' && b.type === 'directory') {
      return 1;
    }
    return 0;
  });

  // We insert a fake entry which is a shortcut for going up one directory when not in the root of the assignment.
  if (filepath.length > 1) {
    files = [
      {
        type: 'directory',
        name: '../',
        path: filepath.substr(0, filepath.lastIndexOf('/')), // One folder up
        last_modified: '',
        created: '',
        size: null,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any,
      ...files,
    ];
  }

  return (
    <>
      {snackbar}
      {titleBar}

      <div className={themeClass.mainSection}>
        <ContentBreadcrumbs
          courseId={courseId}
          assignment={assignment}
          filepath={filepath || '/'}
        ></ContentBreadcrumbs>

        {
          /* We only show the assigment box at the root of the file explorer*/
          filepath === '/' ? (
            <Box marginBottom={2}>
              {/* TODO make this a nice box with a bunch of assignment controls and info */}
              <div className={themeClass.innerSection}>
                <Box margin={2}>
                  Assignment: {assignment.name} <br />
                  ID: {assignment.id} <br />
                  Status: {assignment.status} <br />
                  Due Date: {assignment.display_duedate} <br />
                </Box>
              </div>
            </Box>
          ) : undefined
        }

        <div className={themeClass.innerSection}>
          {files.length === 0 ? (
            <EmptyView
              title={`Nothing here`}
              message={'This assignment has no files or folders yet'}
            ></EmptyView>
          ) : (
            <>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell align="left"> Filename </TableCell>
                      <TableCell align="left"> Mimetype </TableCell>
                      <TableCell align="left"> Last Modified </TableCell>
                      <TableCell align="left"> Size </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {files.map((c: AssignmentContent) => (
                      <TableRow key={c.path}>
                        <TableCell align="left">
                          <Button
                            style={{ textTransform: 'none' }}
                            onClick={() => {
                              redirectToContentPathInAssignment(c.path);
                            }}
                          >
                            {c.type === 'directory' ? <FolderOutlined></FolderOutlined> : undefined}
                            <span style={{ marginLeft: '4px' }}>{c.name}</span>
                          </Button>
                        </TableCell>
                        <TableCell align="left">{c.mimetype}</TableCell>
                        <TableCell align="left">{c.last_modified}</TableCell>
                        <TableCell align="left">
                          {c.size === null ? null : `${c.size} bytes`}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
        </div>
        {/* Toolbar with create and upload buttons */}
        <Box pt={1.75} pb={1} pl={2} pr={2}>
          <Grid container direction="row" justifyContent="flex-start">
            <Grid item xs={12} sm={7}>
              <Box mt={{ xs: 2.4, sm: 0 }}>
                <Grid container>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => openCreateModal(false)}
                  >
                    <Add />
                    <span className="btnName">Notebook</span>
                  </Button>
                  &nbsp;{' '}
                  {/* TODO spacing with margins or gap or something? I'm not a React expert :(*/}
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => openCreateModal(true)}
                  >
                    <Add />
                    <span className="btnName">Folder</span>
                  </Button>
                  &nbsp;
                  <Fragment>
                    <input ref={uploadInputRef} type="file" hidden onChange={onUploadChange} />

                    <Button
                      onClick={() =>
                        uploadInputRef.current &&
                        //@ts-ignore
                        uploadInputRef.current.click()
                      }
                      variant="outlined"
                      color="secondary"
                    >
                      <CloudUploadOutlined />
                      <span className="btnName">Upload</span>
                    </Button>
                  </Fragment>
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </div>
    </>
  );
};

export default AssignmentExplorer;
