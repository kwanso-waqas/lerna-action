/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { StoreResult } from '.';
import { AssignmentContent, AssignmentStore, AssignmentContentSaveData } from './assignment';

export const MOCK_IPYNB_FILE_STRING = JSON.stringify({
  cells: [
    {
      cell_type: 'code',
      execution_count: 3,
      id: 'cooperative-healthcare',
      metadata: {
        nbgrader: {
          grade: false,
          grade_id: 'cell-ff14169315ad87d3',
          locked: false,
          schema_version: 3,
          solution: true,
          task: false,
        },
      },
      outputs: [],
      source: [
        'def squares(n):\n',
        '    """Compute the squares of numbers from 1 to n"""\n',
        '    \n',
        '    ### BEGIN SOLUTION\n',
        '    if n < 1:\n',
        '        raise ValueError("n must be greater than or equal to 1")\n',
        '    return [i**2 for i in range(1, n+1)]\n',
        '    ### END SOLUTION',
      ],
    },
  ],
  metadata: {},
  nbformat: 4,
  nbformat_minor: 5,
});

export class MockMemoryStore implements AssignmentStore {
  saveAssignmentContent(
    assignmentId: string,
    filepath: string,
    model: AssignmentContentSaveData,
  ): Promise<StoreResult<'ok', any>> {
    throw new Error('Method not implemented.');
  }

  async getAssignmentContent(
    assignmentId: string,
    filepath: string,
  ): Promise<StoreResult<AssignmentContent, any>> {
    if (filepath === '' || filepath === '/') {
      return {
        ok: true,
        data: {
          created: '2021-07-10T14:14:56+00:00',
          last_modified: '2021-07-14T14:14:56+00:00',
          format: 'json',
          name: '',
          path: '',
          writable: false,

          type: 'directory',
          mimetype: null,
          size: null,
          content: [
            {
              created: '2021-07-14T14:14:56+00:00',
              last_modified: '2021-07-16T14:14:56+00:00',

              name: 'my-notebook.ipynb',
              path: 'my-notebook.ipynb',
              writable: true,

              format: null,
              content: null,

              type: 'file',
              mimetype: 'application/x-ipynb+json',
              size: MOCK_IPYNB_FILE_STRING.length,
            },
            {
              created: '2021-07-10T14:14:56+00:00',
              last_modified: '2021-07-12T14:14:56+00:00',

              name: 'my-other-notebook.ipynb',
              path: 'my-other-notebook.ipynb',
              writable: true,

              format: null,
              content: null,

              type: 'file',
              mimetype: 'application/x-ipynb+json',
              size: MOCK_IPYNB_FILE_STRING.length,
            },
          ],
        },
      };
    }

    if (filepath.endsWith('.ipynb')) {
      return {
        ok: true,
        data: {
          created: '2021-07-14T14:14:56+00:00',
          last_modified: '2021-07-16T14:14:56+00:00',

          name: filepath.substring(filepath.lastIndexOf('/')),
          path: filepath,
          writable: true,

          format: 'text',
          content: MOCK_IPYNB_FILE_STRING,

          type: 'file',
          mimetype: 'application/x-ipynb+json',
          size: MOCK_IPYNB_FILE_STRING.length,
        },
      };
    }

    return {
      ok: false,
      status: 404,
      error: new Error('File not found'),
    };
  }
}
