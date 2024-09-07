import { endpoints } from 'src/utils/axios';
import { postData } from 'src/utils/request';

import { QuizAPI } from 'src/constants/types';

export const createQuiz = async (data: QuizAPI): Promise<QuizAPI[]> =>
  postData<QuizAPI[]>(endpoints.quizzes.addQuiz, data);
