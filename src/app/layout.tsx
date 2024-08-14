'use client';

/* eslint-disable perfectionist/sort-imports */
import 'src/global.css';

// ----------------------------------------------------------------------

import ThemeProvider from 'src/theme';
import { primaryFont } from 'src/theme/typography';

import ProgressBar from 'src/components/progress-bar';
import { MotionLazy } from 'src/components/animate/motion-lazy';
import { SettingsDrawer, SettingsProvider } from 'src/components/settings';

import { AuthProvider } from 'src/auth/context/jwt';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

import { clusterApiUrl } from '@solana/web3.js';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { WalletProvider, ConnectionProvider } from '@solana/wallet-adapter-react';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { useMemo } from 'react';

require('@solana/wallet-adapter-react-ui/styles.css');
// ----------------------------------------------------------------------

const queryClient = new QueryClient();

export const viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

// export const metadata = {
//   title: 'Airlinker UI Kit',
//   description:
//     'The starting point for your next project with Airlinker UI Kit, built on the newest version of Material-UI ©, ready to be customized to your style',
//   keywords: 'react,material,kit,application,dashboard,admin,template',
//   manifest: '/manifest.json',
//   icons: [
//     { rel: 'icon', url: '/favicon/favicon.ico' },
//     { rel: 'icon', type: 'image/png', sizes: '16x16', url: '/favicon/favicon-16x16.png' },
//     { rel: 'icon', type: 'image/png', sizes: '32x32', url: '/favicon/favicon-32x32.png' },
//     { rel: 'apple-touch-icon', sizes: '180x180', url: '/favicon/apple-touch-icon.png' },
//   ],
// };

type Props = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: Props) {
  const network = WalletAdapterNetwork.Devnet; // Mainnet, Testnet veya Devnet seçin

  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(
    () => [new PhantomWalletAdapter(), new SolflareWalletAdapter({ network })],
    [network]
  );
  return (
    <html lang="en" className={primaryFont.className}>
      <body>
        <ConnectionProvider endpoint={endpoint}>
          <WalletProvider wallets={wallets} autoConnect>
            <WalletModalProvider>
              <QueryClientProvider client={queryClient}>
                <AuthProvider>
                  <SettingsProvider
                    defaultSettings={{
                      themeMode: 'dark', // 'light' | 'dark'
                      themeDirection: 'ltr', //  'rtl' | 'ltr'
                      themeContrast: 'default', // 'default' | 'bold'
                      themeLayout: 'vertical', // 'vertical' | 'horizontal' | 'mini'
                      themeColorPresets: 'red', // 'default' | 'cyan' | 'purple' | 'blue' | 'orange' | 'red'
                      themeStretch: false,
                    }}
                  >
                    <ThemeProvider>
                      <MotionLazy>
                        <SettingsDrawer />
                        <ProgressBar />
                        {children}
                        <Toaster />
                      </MotionLazy>
                    </ThemeProvider>
                  </SettingsProvider>
                </AuthProvider>
              </QueryClientProvider>
            </WalletModalProvider>
          </WalletProvider>
        </ConnectionProvider>
      </body>
    </html>
  );
}
