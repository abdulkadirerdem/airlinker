export interface WorkspaceAPI {
  _id?: string;
  title: string;
  description: string;
  user?: string;
  airlinks?: Array<AirlinkAPI> | null;
}

export interface FormAPI {
  _id?: string;
  title: string;
  description: string;
  questions: Array<{ title: string; type: string; options: Array<string> }>;
  responses?: [string];
  airlink: string;
}

export interface QuizAPI {
  _id?: string;
  title: string;
  description: string;
  questions: Array<{
    title: string;
    type: string;
    options: Array<string>;
    correctAnswer?: string;
  }>;
  responses?: Array<{ answers: Array<any> }>;
  airlink: string;
}

export interface RaffleAPI {
  _id?: string;
  title: string;
  description: string;
  participationInformation: Array<{
    title: string;
    type: string;
    options: Array<string>;
  }>;
  participants?: Array<{ answers: Array<any> }>;
  winner?: any;
  airlink: string;
}

export interface AirlinkAPI {
  _id?: string;
  title: string;
  description: string;
  type: string;
  form?: FormAPI;
  workspace: string;
}

export interface QuestionType {
  required: boolean;
  _id?: any;
  title: string;
  type: string;
  options: Array<string>;
}

export interface Component {
  type: string;
  label: string;
  options?: string[];
  correctAnswer?: [string] | [] | any | string;
}

export interface FormValues {
  title: string;
  description: string;
  components: Component[];
  correctAnswer?: [string] | [] | any | string;
}