import { endpoints } from 'src/utils/axios';
import { deleteData, getData } from 'src/utils/request';


export const deleteAirlink = async (id: string | undefined): Promise<any[]> => {
    if (!id) return [];
    return deleteData<any[]>(`${endpoints.airlinks.deleteAirlink}/${id}`, {});
};
