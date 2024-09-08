import { useCallback } from 'react';
import * as solanaWeb3 from '@solana/web3.js';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';

import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import { useTheme } from '@mui/material/styles';
import { Box, Button, Link } from '@mui/material';
import IconButton from '@mui/material/IconButton';

import { useOffSetTop } from 'src/hooks/use-off-set-top';
import { useResponsive } from 'src/hooks/use-responsive';

import { useSettingsContext } from 'src/components/settings';

import { HEADER } from '../config-layout';
import AccountPopover from '../common/account-popover';

// ----------------------------------------------------------------------

type Props = {
  onOpenNav?: VoidFunction;
};

export default function Header({ onOpenNav }: Props) {
  const theme = useTheme();

  const settings = useSettingsContext();

  const isNavHorizontal = settings.themeLayout === 'horizontal';

  const isNavMini = settings.themeLayout === 'mini';

  const lgUp = useResponsive('up', 'lg');

  const offset = useOffSetTop(HEADER.H_DESKTOP);

  const offsetTop = offset && !isNavHorizontal;
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const onClick = useCallback(async () => {
    if (!publicKey) {
      console.log('error', `Send Transaction: Wallet not connected!`);
      return;
    }

    let signature: solanaWeb3.TransactionSignature = '';
    try {
      // Create instructions to send, in this case a simple transfer
      const instructions = [
        solanaWeb3.SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: solanaWeb3.Keypair.generate().publicKey,
          lamports: 1_000_000,
        }),
      ];

      // Get the lates block hash to use on our transaction and confirmation
      const latestBlockhash = await connection.getLatestBlockhash();

      // Create a new TransactionMessage with version and compile it to legacy
      const messageLegacy = new solanaWeb3.TransactionMessage({
        payerKey: publicKey,
        recentBlockhash: latestBlockhash.blockhash,
        instructions,
      }).compileToLegacyMessage();

      // Create a new VersionedTransacction which supports legacy and v0
      const transation = new solanaWeb3.VersionedTransaction(messageLegacy);

      // Send transaction and await for signature
      signature = await sendTransaction(transation, connection);

      // Send transaction and await for signature
      await connection.confirmTransaction({ signature, ...latestBlockhash }, 'confirmed');

      console.log(signature);
    } catch (error: any) {
      console.log('error', `Transaction failed! ${error?.message}`, signature);
    }
  }, [publicKey, connection, sendTransaction]);

  const renderContent = (
    <>
      {/* {lgUp && isNavHorizontal && (
        <p color="red" style={{ marginRight: 2.5 }}>
          AirLinker
        </p>
      )} */}
      {lgUp && (
        <Link component="a" href="/">
          <Box
            component="img"
            src="/assets/images/logo/logo-without-airy.png"
            sx={{ height: 54, mr: 2.5 }}
          />
        </Link>
      )}

      {!lgUp && (
        <IconButton onClick={onOpenNav}>
          <Box component="img" src="/assets/images/logo/airy.png" sx={{ height: 54, mr: 2.5 }} />
        </IconButton>
      )}

      {/* <Searchbar /> */}

      <Stack
        flexGrow={1}
        direction="row"
        alignItems="center"
        justifyContent="flex-end"
        spacing={{ xs: 0.5, sm: 1 }}
      >
        {/* <LanguagePopover /> */}
        {/* <NotificationsPopover /> */}
        {/* <ContactsPopover /> */}
        {/* <SettingsButton /> */}
        {/* <Button
            variant="contained"
            sx={{ marginLeft: 'auto', mt: 1, borderRadius: 0.5 }}
            color="primary"
            onClick={onClick}
          >
            SEND SOL
          </Button>
          */}
        <WalletMultiButton />
        <AccountPopover />
      </Stack>
    </>
  );

  return (
    // <AppBar
    //   sx={{
    //     height: HEADER.H_MOBILE,
    //     zIndex: theme.zIndex.appBar + 1,
    //     ...bgBlur({
    //       color: theme.palette.background.default,
    //     }),
    //     transition: theme.transitions.create(['height'], {
    //       duration: theme.transitions.duration.shorter,
    //     }),
    //     ...(lgUp && {
    //       width: `calc(100% - ${NAV.W_VERTICAL + 1}px)`,
    //       height: HEADER.H_DESKTOP,
    //       ...(offsetTop && {
    //         height: HEADER.H_DESKTOP_OFFSET,
    //       }),
    //       ...(isNavHorizontal && {
    //         width: 1,
    //         bgcolor: 'background.default',
    //         height: HEADER.H_DESKTOP_OFFSET,
    //         borderBottom: `solid 1px ${theme.palette.divider}`,
    //       }),
    //       ...(isNavMini && {
    //         width: `calc(100% - ${NAV.W_MINI + 1}px)`,
    //       }),
    //     }),
    //   }}
    // >
    <Box
      sx={{
        height: HEADER.H_MOBILE,
        zIndex: theme.zIndex.appBar + 1,
        bgcolor: theme.palette.primary.lighter,
      }}
    >
      <Toolbar
        sx={{
          height: 1,
          px: { lg: 5 },
        }}
      >
        {renderContent}
      </Toolbar>
    </Box>
    // </AppBar>
  );
}
