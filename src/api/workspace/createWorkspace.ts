import { endpoints } from 'src/utils/axios';
import { postData } from 'src/utils/request';

import { WorkspaceAPI } from 'src/constants/types';

export const createWorkspace = async (data: WorkspaceAPI): Promise<WorkspaceAPI[]> =>
  postData<WorkspaceAPI[]>(endpoints.workspaces.addWorkspace, data);
