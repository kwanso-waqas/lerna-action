import { StoreResult } from '..';

// NOTE(gzuidhof): Maybe we should just make peace with the poor typings in Jupyter and instead
// have a singular type instead of this complicated construct - even though we will lose
// some type safety it will be easier to work with.

// Metadata present for both files and folders
export type AssignmentContentSharedMetadata = {
  /**
   * Basename of the entity.
   */
  name: string;
  /**
   * Full ([API-style](https://jupyter-notebook.readthedocs.io/en/stable/extending/contents.html#api-paths)) path to the entity.
   */
  path: string;
  /**
   * Last modified date of the entity.
   */
  last_modified: string; // RFC3339 timestamp
  /**
   * Creation date of the entity.
   */
  created: string; // RFC3339 timestamp
  writable: boolean;
};

export type AssignmentExpandedFileContent = {
  type: 'file';
  mimetype: string | null;
  size: number;
  format: 'text' | 'base64';
  content: string;
};

export type AssignmentExpandedNotebookContent = {
  type: 'notebook';
  mimetype: string | null;
  size: number;
  format: 'json';
  // eslint-disable-next-line @typescript-eslint/ban-types
  content: object;
};

/** Present in directory listings, in this case the `format` and `content` are both null as it
 *  would be wasteful to ship the file contents when all we do is look at a folder.
 **/
export type AssignmentUnexpandedFileOrNotebookContent = {
  type: 'file' | 'notebook';
  mimetype: string | null;
  size: number;
  format: null;
  content: null;
};

export type AssignmentDirectoryContent = {
  type: 'directory';
  mimetype: null;
  size: number | null;
  format: 'json';
  content: (AssignmentContentSharedMetadata &
    (AssignmentUnexpandedFileOrNotebookContent | AssignmentDirectoryContent))[];
};

// See https://jupyter-notebook.readthedocs.io/en/stable/extending/contents.html
export type AssignmentContent = AssignmentContentSharedMetadata &
  (
    | AssignmentExpandedFileContent
    | AssignmentExpandedNotebookContent
    | AssignmentUnexpandedFileOrNotebookContent
    | AssignmentDirectoryContent
  );

export type AssignmentContentSaveData = Partial<AssignmentContent>;

export interface AssignmentStore {
  getAssignmentContent(
    assignmentId: string,
    filepath: string,
  ): Promise<StoreResult<AssignmentContent>>;
  saveAssignmentContent(
    assignmentId: string,
    filepath: string,
    model: AssignmentContentSaveData,
  ): Promise<StoreResult<'ok'>>;
}
