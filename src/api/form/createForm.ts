import { endpoints } from 'src/utils/axios';
import { postData } from 'src/utils/request';

import { FormAPI } from 'src/constants/types';

export const createForm = async (data: FormAPI): Promise<FormAPI[]> =>
  postData<FormAPI[]>(endpoints.forms.addForm, data);
