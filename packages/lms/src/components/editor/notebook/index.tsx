/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { FC, useEffect, useRef } from 'react';

//@ts-ignore //TODO fix type generation in starboard-nbgrader
import {
  GraderNotebookWrap,
  convertStarboardGraderNotebookContentToIpynb,
} from '@illumidesk/starboard-nbgrader/dist/graderWrap.js';
import type {
  GraderNotebookWrap as GNWType,
  GraderNotebookWrapOptions,
} from '@illumidesk/starboard-nbgrader/dist/types/elements/graderWrap';

export type NotebookViewerMode = 'student' | 'assignment-creator';

// To be replaced with values from Illumidesk CDN
const PLUGIN_URL = 'https://unpkg.com/@illumidesk/starboard-nbgrader/dist/plugin.js';
const STARBOARD_SRC = 'https://cdn.illumidesk.com/npm/starboard-notebook@0.14.2/dist/index.html';

interface NotebookViewerComponentData {
  mode: NotebookViewerMode;
  onSave: (ipynbContent: string) => Promise<boolean> | boolean;
  onHasUnsavedChangesChange: (hasUnsavedChanges: boolean) => void;
  notebook: {
    ipynbContent: string;
  };
}

export const NotebookViewer: FC<NotebookViewerComponentData> = ({
  notebook,
  mode,
  onSave,
  onHasUnsavedChangesChange,
}): JSX.Element => {
  const notebookMountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const opts: GraderNotebookWrapOptions = {
      embedOptions: {
        src: STARBOARD_SRC,
        preventNavigationWithUnsavedChanges: true,
        autoResize: true,
        onSaveMessage: (payload) => {
          const ipynbContent = convertStarboardGraderNotebookContentToIpynb(payload.content);
          return onSave(ipynbContent);
        },
        onUnsavedChangesStatusChange(hasUnsavedChanges) {
          onHasUnsavedChangesChange(hasUnsavedChanges);
        },
      },
      pluginOptions: {
        pluginUrl: PLUGIN_URL,
        jupyterBaseUrl: 'http://localhost:8888',
        mode: mode,
      },
    };
    const wrapper: GNWType = new GraderNotebookWrap(opts);
    notebookMountRef.current!.appendChild(wrapper);
    wrapper.setIpynbContent(notebook.ipynbContent);

    return () => {
      wrapper.remove();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notebookMountRef]);

  return <div ref={notebookMountRef}></div>;
};
