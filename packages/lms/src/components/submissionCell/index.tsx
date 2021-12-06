import { FC, useState, useEffect, useContext, Fragment } from 'react';
import { Box, Grid, Typography, IconButton, TextField, InputAdornment } from '@material-ui/core';
import { MathComponent } from 'mathjax-react';
import { CodeBlock, dracula } from 'react-code-blocks';
import Convert from 'ansi-to-html';
import marked from 'marked';
import clsx from 'clsx';

import { SubmissionContext } from '../../context/submissions';
import { SubmissionCell } from '../../common/types';
import { SERVER_ENDPOINT } from '../../common/constants';

import MarksSection from './marksSection';

import useStyles from '../../containers/manualGradingAssignment/styles';
import noResIcon from '../../assets/img/noResIcon.svg';

interface SubmissionCellProps {
  cellData: SubmissionCell;
  submissionId: string;
}

marked.setOptions({
  breaks: true,
});

const SubmissionCellComp: FC<SubmissionCellProps> = ({ cellData, submissionId }): JSX.Element => {
  /**
   * @var SubmissionCellState
   */
  const [commentId, setCommentId] = useState<string>('');
  const [message, addMessage] = useState<string>('');
  const [mathjaxError, setMathJaxError] = useState<boolean>(false);

  const { submissionComments, updateSubmissionComment } = useContext(SubmissionContext);
  const convert = new Convert();
  const classes = useStyles();

  /**
   * @var CellData
   */
  const { cell_type, source, outputs, metadata, execution_count } = cellData;
  const { nbgrader } = metadata;
  const { grade_id } = nbgrader || {};

  /**
   * Calculating grades from online repository and storing it in state
   */
  useEffect(() => {
    if (grade_id) {
      if (submissionComments.length > 0) {
        const currentCell = submissionComments.filter((comment) => {
          if (grade_id === comment.name) return comment;
          return null;
        });

        if (currentCell.length > 0) {
          const { id, manual_comment } = currentCell[0];
          addMessage(manual_comment || '');
          setCommentId(id);
        }
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submissionComments]);

  /**
   * Updating comment on submission
   */
  const submitResponse = async (): Promise<void> => {
    await updateSubmissionComment(commentId, message);
  };

  /**
   * Changing encoded HTML to actual HTML for DOM management
   * @param markdownText
   * @returns
   */
  const getMarkdownText = (markdownText: string) => {
    let updatedString = markdownText.replace(/rightarrow/g, '→');
    updatedString = updatedString.replace(/\$/g, '');
    updatedString = updatedString.replace(/\\/g, '').trim();
    let rawMarkup = marked(updatedString, { sanitize: true });
    const search = rawMarkup.search('src=');
    if (search > -1) {
      const string = `src="${SERVER_ENDPOINT}/formgrader/submissions/${submissionId}/`;
      rawMarkup = rawMarkup.substr(0, search) + string + rawMarkup.substr(search + `src="`.length);
    }
    return { __html: rawMarkup };
  };

  /**
   * @section Component JSX Elements
   */
  let cellType: JSX.Element = <></>;
  let cellBody: JSX.Element = <></>;

  if (cell_type === 'markdown') {
    cellType = <Grid item xs={12} sm={1}></Grid>;
    cellBody = (
      <Grid item xs={12} sm={11}>
        <pre
          className={clsx(classes.preTag, {
            [classes.singleLine]: source === '---',
          })}
        >
          <div dangerouslySetInnerHTML={getMarkdownText(source)}></div>
        </pre>
      </Grid>
    );
  }

  if (cell_type === 'code') {
    cellType = (
      <Grid item xs={12} sm={1}>
        {source === '' ? <p style={{ margin: 0 }}> In []: </p> : <p> In [{execution_count}]: </p>}
      </Grid>
    );
    cellBody = (
      <Grid item xs={12} sm={11}>
        <Box className={classes.studentAns}>
          {grade_id ? (
            <Box
              py={
                nbgrader && nbgrader.grade
                  ? { xs: 2.4, sm: 2.4, md: 0 }
                  : { xs: 2.4, sm: 2.4, md: 2.4 }
              }
            >
              <Grid container alignItems="center">
                <Grid item xs={12} sm={6} md={4}>
                  <Typography
                    variant="body1"
                    className={clsx({
                      [classes.lowerCell]: nbgrader && nbgrader.grade,
                    })}
                  >
                    {nbgrader && nbgrader.grade ? grade_id : "Student's Answer"}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={8}>
                  {nbgrader && nbgrader.grade ? <MarksSection cellData={cellData} /> : ''}
                </Grid>
              </Grid>
            </Box>
          ) : (
            ''
          )}
          <Box style={{ fontSize: 15 }} className={classes.studentCode}>
            {nbgrader ? (
              <CodeBlock text={source} language="python" showLineNumbers={false} theme={dracula} />
            ) : (
              <pre className={classes.preTag}>{source}</pre>
            )}
          </Box>
          {nbgrader && nbgrader.solution ? (
            <TextField
              className={classes.ansResponse}
              placeholder="Type any comments here"
              fullWidth
              variant="outlined"
              value={message}
              onChange={(event) => addMessage(event?.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={submitResponse}
                      data-cy="manualGradingAssignmentAddCommentBtn"
                    >
                      <img src={noResIcon} alt="send icon" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              data-cy="manualGradingAssignmentComment"
            />
          ) : (
            ''
          )}
        </Box>
        {outputs && outputs.length > 0 ? (
          <div className={clsx(classes.output, classes.studentOutput)}>
            {outputs.map((output, index: number) => {
              const { name, output_type, traceback, data } = output;
              if (name === 'stdout') return <p key={index}> {output.text} </p>;
              else if (output_type === 'error')
                return (
                  <div key={index} style={{ fontSize: '12px !important' }}>
                    {traceback
                      ? traceback.map((tracestring, index: number) => (
                          <pre
                            key={index}
                            dangerouslySetInnerHTML={{
                              __html: convert.toHtml(tracestring),
                            }}
                          />
                        ))
                      : ''}
                  </div>
                );
              else if (output_type === 'display_data')
                return (
                  <img
                    style={{ width: '100%' }}
                    key={index}
                    src={`data:${Object.keys(data)[0]};base64,${data['image/png']}`}
                    alt=""
                  />
                );
              else return <Fragment key={index}></Fragment>;
            })}
          </div>
        ) : (
          ''
        )}
      </Grid>
    );
  } else if (
    cell_type === 'markdown' &&
    nbgrader &&
    (nbgrader.task || nbgrader.grade || nbgrader.solution)
  ) {
    cellBody = (
      <Grid item xs={12} sm={11}>
        <Box className={classes.studentAns}>
          <Box py={{ xs: 2.4, sm: 2.4, md: 0 }}>
            <Grid container alignItems="center">
              <Grid item xs={12} sm={6} md={4}>
                <Typography
                  variant="body1"
                  className={clsx({
                    [classes.lowerCell]: nbgrader && nbgrader.grade,
                  })}
                >
                  {grade_id}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={8}>
                {nbgrader && (nbgrader.solution || nbgrader.task) ? (
                  <MarksSection cellData={cellData} />
                ) : (
                  ''
                )}
              </Grid>
            </Grid>
          </Box>
          <Box style={{ fontSize: 15 }}>
            <pre className={classes.preTag}>
              {mathjaxError ? <div dangerouslySetInnerHTML={getMarkdownText(source)} /> : ''}
              {source === 'YOUR ANSWER HERE' ? (
                source
              ) : (
                <MathComponent
                  tex={String.raw`${source}`}
                  onError={() => {
                    setMathJaxError(!mathjaxError);
                  }}
                />
              )}
            </pre>
          </Box>
          {nbgrader && (nbgrader.solution || nbgrader.task) ? (
            <TextField
              className={classes.ansResponse}
              id="your-response"
              placeholder="Type any comments here"
              fullWidth
              variant="outlined"
              value={message}
              onChange={(event) => addMessage(event?.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={submitResponse}
                      data-cy="manualGradingAssignmentAddCommentBtn"
                    >
                      <img src={noResIcon} alt="send icon" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              data-cy="manualGradingAssignmentComment"
            />
          ) : (
            ''
          )}
        </Box>
        {outputs && outputs.length > 0 ? (
          <div className={classes.output}>
            {outputs.map((output, index: number) => {
              const { traceback } = output;
              if (output.name === 'stdout') return <p key={index}> {output.text} </p>;
              else if (output.output_type === 'error')
                return (
                  <div key={index} style={{ fontSize: '12px !important' }}>
                    {traceback
                      ? traceback.map((tracestring, index: number) => (
                          <div
                            key={index}
                            dangerouslySetInnerHTML={{
                              __html: convert.toHtml(tracestring.trim()),
                            }}
                          />
                        ))
                      : ''}
                  </div>
                );
              else return <Fragment key={index}></Fragment>;
            })}
          </div>
        ) : (
          ''
        )}
      </Grid>
    );
  } else {
    cellBody = (
      <Grid item xs={12} sm={11}>
        <pre className={classes.preTag}>
          <div dangerouslySetInnerHTML={getMarkdownText(source)} />
        </pre>
      </Grid>
    );
  }

  return (
    <Box px={{ xs: 0, sm: 1.5 }} pl={{ xs: 1.5, sm: 1.5 }} ml={{ xs: 0, sm: 1.5 }}>
      <Grid
        container
        alignItems="flex-start"
        justifyContent="flex-start"
        className={`${classes.answers}`}
      >
        {cellType}
        {cellBody}
      </Grid>
    </Box>
  );
};

export default SubmissionCellComp;
