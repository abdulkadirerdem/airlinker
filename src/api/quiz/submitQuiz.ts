import { endpoints } from 'src/utils/axios';
import { postData } from 'src/utils/request';

export const submitQuiz = async ({ id, data }: { id: string; data: any }): Promise<any[]> =>
  postData<any[]>(endpoints.quizzes.submitQuiz(id), data);
