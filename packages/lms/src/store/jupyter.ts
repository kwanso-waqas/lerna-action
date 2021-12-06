import { StoreResult } from '.';
import { AssignmentStore, AssignmentContent, AssignmentContentSaveData } from './assignment';

import { ContentsManager, ServerConnection } from '@jupyterlab/services';
import { Assignment } from '../common/types';
import { joinFilepath } from '../common/filepath';

export class JupyterContentsStore implements AssignmentStore {
  private manager: ContentsManager;

  private assignments: Map<string, Assignment>;

  constructor(contentManagerOpts: {
    assignments: Map<string, Assignment>;
    serverSettings: Partial<ServerConnection.ISettings>;
  }) {
    const serverSettings = ServerConnection.makeSettings(contentManagerOpts.serverSettings);
    this.manager = new ContentsManager({ serverSettings });
    this.assignments = contentManagerOpts.assignments;
  }

  private getAssignmentFilepath(assignmentId: string, filepath: string) {
    const a = this.assignments.get(assignmentId);
    if (a === undefined) {
      throw new Error(`Assignment with id ${assignmentId} does not exist`);
    }
    return joinFilepath(a.source_path, filepath);
  }

  async saveAssignmentContent(
    assignmentId: string,
    filepath: string,
    model: AssignmentContentSaveData,
  ): Promise<StoreResult<'ok', any>> {
    const fp = this.getAssignmentFilepath(assignmentId, filepath);

    try {
      await this.manager.save(fp, model as any); // Again the Jupyter typings are just plain wrong here (or not specific enough).
      return {
        ok: true,
        data: 'ok',
      };
    } catch (e) {
      return {
        ok: false,
        error: e,
        status: e.response?.status || 1000,
      };
    }
  }

  async getAssignmentContent(
    assignmentId: string,
    filepath: string,
  ): Promise<StoreResult<AssignmentContent, any>> {
    const fp = this.getAssignmentFilepath(assignmentId, filepath);

    try {
      const r = await this.manager.get(fp);
      return {
        ok: true,
        data: r as AssignmentContent,
      };
    } catch (e) {
      return {
        ok: false,
        status: e.response?.status || 1000,
        error: e,
      };
    }
  }
}
