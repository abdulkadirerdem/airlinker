import { postData } from 'src/utils/request';

export const submitForm = async ({ id, data }: { id: string; data: any }): Promise<any[]> =>
  postData<any[]>(`/forms/${id}/responses`, data);
