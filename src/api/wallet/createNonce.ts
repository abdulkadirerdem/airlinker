// @ts-ignore
import { getData } from 'src/utils/request';

export const createNonce = async (): Promise<{ message: string }> =>
  getData<{ message: string }>("/wallet-login/request-message");
