import axios from 'src/utils/axios';

// ----------------------------------------------------------------------

// JWT'yi decode eden fonksiyonu artık kullanmamıza gerek yok, çünkü session token JWT değil.

// ----------------------------------------------------------------------

export const isValidToken = () => {
  const sessionToken = document.cookie
    .split('; ')
    .find((row) => row.startsWith('COOKIE-KEY='))
    ?.split('=')[1];

  return !!sessionToken;
};

// ----------------------------------------------------------------------

export const setSession = () => {
  const sessionToken = document.cookie
    .split('; ')
    .find((row) => row.startsWith('COOKIE-KEY='))
    ?.split('=')[1];

  if (sessionToken) {
    axios.defaults.headers.common.Authorization = `Bearer ${sessionToken}`;
  } else {
    delete axios.defaults.headers.common.Authorization;
  }
};
