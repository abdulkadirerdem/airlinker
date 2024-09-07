import { endpoints } from 'src/utils/axios';
import { postData } from 'src/utils/request';

import { RaffleAPI } from 'src/constants/types';

export const createRaffle = async (data: RaffleAPI): Promise<RaffleAPI[]> =>
  postData<RaffleAPI[]>(endpoints.raffles.addRaffle, data);
