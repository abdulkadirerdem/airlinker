import { endpoints } from 'src/utils/axios';
import { postData } from 'src/utils/request';

import { AirlinkAPI } from 'src/constants/types';

export const createAirlink = async (data: AirlinkAPI): Promise<AirlinkAPI[]> =>
  postData<AirlinkAPI[]>(endpoints.airlinks.addAirlink, data);
