import React, { FC, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

import { Button, Stack, Typography } from '@mui/material';

import { useRouter } from 'src/routes/hooks';

import { useAuthContext } from 'src/auth/hooks';
import { PATH_AFTER_LOGIN } from 'src/config-global';
import { createNonce } from 'src/api/wallet/createNonce';
import { verifyWallet } from 'src/api/wallet/verifiyWallet';
import { LoadingButton } from '@mui/lab';
import Iconify from '../iconify';

const LoginWithWallet: FC = () => {
    const { publicKey, signMessage } = useWallet();
    const { login } = useAuthContext();
    const router = useRouter();

    const { data, isLoading } = useQuery({
        queryKey: ["nonce"],
        queryFn: createNonce,
    });

    const { isPending, mutateAsync } = useMutation({
        mutationKey: ["verify-wallet"],
        mutationFn: verifyWallet,
    });

    const loginWithWallet = useCallback(async () => {
        if (!publicKey || !signMessage) {
            alert('Please connect your wallet!');
            return;
        }

        // Kullanıcıdan mesajı imzalamasını iste
        const encodedMessage = new TextEncoder().encode(data?.message);
        const signedMessage = await signMessage(encodedMessage);

        // İmzayı backend'e gönder
        const verifyResponse = await mutateAsync({
            publicKey: publicKey.toBase58(),  // Base58 formatında string
            signature: Buffer.from(signedMessage).toString('base64'),  // Base64 formatına dönüştürüyoruz
            message: data?.message,
        });

        if (verifyResponse) {
            const { token: accessToken } = verifyResponse;

            // @ts-ignore
            login(null, null, publicKey, accessToken);
            router.push(PATH_AFTER_LOGIN);
        } else {
            alert('Authentication failed.');
        }
    }, [data?.message, login, mutateAsync, publicKey, router, signMessage]);

    return (
        <div>
            {!isLoading ? (
                <Stack direction="row" spacing={2} width="100%">
                    <WalletMultiButton />
                    <LoadingButton
                        fullWidth
                        color="inherit"
                        size="large"
                        onClick={loginWithWallet}
                        disabled={!publicKey}
                        variant="contained"
                        loading={isPending}
                        sx={{ borderRadius: 0.5 }}
                    >
                        <Stack direction="row" spacing={1} alignItems="center" justifyContent="center" >
                            <Iconify width={18} icon="mdi:wallet-outline" />
                            <Typography fontSize={12} fontWeight={700}>Login with Wallet</Typography>
                        </Stack>
                    </LoadingButton>
                </Stack>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default LoginWithWallet;
