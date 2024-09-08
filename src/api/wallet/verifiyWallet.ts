import { postData } from 'src/utils/request';


export const verifyWallet = async (data: any): Promise<{ token: string }> =>
    postData<{ token: string }>("/wallet-login/verify", data);
