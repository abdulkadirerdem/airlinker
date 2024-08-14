import { endpoints } from 'src/utils/axios';
import { getData } from 'src/utils/request';

import { AirlinkAPI } from 'src/constants/types';

export const getAllAirlink = async (): Promise<AirlinkAPI[]> =>
  getData<AirlinkAPI[]>(endpoints.airlinks.getAllAirlinks);
