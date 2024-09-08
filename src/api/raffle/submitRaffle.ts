import { endpoints } from 'src/utils/axios';
import { postData } from 'src/utils/request';

export const submitRaffle = async ({ id, data }: { id: string; data: any }): Promise<any[]> =>
  postData<any[]>(endpoints.raffles.submitRaffle(id), data);
