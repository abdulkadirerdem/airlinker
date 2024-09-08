import { endpoints } from 'src/utils/axios';
import { postData } from 'src/utils/request';

export const drawWinner = async ({ id, data }: { id: string; data: any }): Promise<any[]> =>
  postData<any[]>(endpoints.raffles.drawWinner(id), data);
