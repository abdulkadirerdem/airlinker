import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { useTheme, Typography } from '@mui/material';

import { useMockedUser } from 'src/hooks/use-mocked-user';

import { hideScroll } from 'src/theme/css';

import { NavSectionMini } from 'src/components/nav-section';

import { NAV } from '../config-layout';
import { useNavData } from './config-navigation';
import NavToggleButton from '../common/nav-toggle-button';

// ----------------------------------------------------------------------

export default function NavMini() {
  const { user } = useMockedUser();
  const theme = useTheme();
  const navData = useNavData();

  return (
    <Box
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV.W_MINI },
      }}
    >
      <NavToggleButton
        sx={{
          top: 22,
          left: NAV.W_MINI - 12,
        }}
      />

      <Stack
        sx={{
          pb: 2,
          height: 1,
          position: 'fixed',
          width: NAV.W_MINI,
          borderRight: `dashed 1px ${theme.palette.divider}`,
          ...hideScroll.x,
        }}
      >
        {/* <Logo sx={{ mx: 'auto', my: 2 }} /> */}
        <Typography
          sx={{ mx: 'auto', my: 2, textAlign: 'center' }}
          variant="h6"
          color={theme.palette.primary.main}
        >
          AirLinker
        </Typography>

        <NavSectionMini
          data={navData}
          slotProps={{
            currentRole: user?.role,
          }}
        />
      </Stack>
    </Box>
  );
}
