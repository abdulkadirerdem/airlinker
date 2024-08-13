import { endpoints } from 'src/utils/axios';
import { getData } from 'src/utils/request';

import { WorkspaceAPI } from 'src/constants/types';

export const getAllWorkspaces = async (): Promise<WorkspaceAPI[]> =>
  getData<WorkspaceAPI[]>(endpoints.workspaces.getAllWorkspaces);
