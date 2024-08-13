import { endpoints } from 'src/utils/axios';
import { getData } from 'src/utils/request';

import { AirlinkAPI } from 'src/constants/types';

export const getAllAirlinksByWorkspace = async (id: string | undefined): Promise<AirlinkAPI[]> => {
  if (!id) return [];
  return getData<AirlinkAPI[]>(`${endpoints.airlinks.getAirlinksByWorkstations}/${id}`);
};
