export interface WorkspaceAPI {
  _id: string;
  title: string;
  description: string;
  user: string;
  airlinks: Array<AirlinkAPI> | null;
}

export interface AirlinkAPI {
  _id: string;
  title: string;
  description: string;
  type: string;
  form: string;
  workspace: string;
}
