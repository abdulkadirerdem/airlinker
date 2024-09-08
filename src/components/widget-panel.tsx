import { OverridableStringUnion } from '@mui/types';
import { ButtonPropsColorOverrides } from '@mui/material/Button';
import { Box, Stack, Button, Divider, Typography } from '@mui/material';
import Iconify from './iconify';

const widgets: Array<{
  type: string;
  label: string;
  defaultOptions?: [] | [string] | any;
  icon: string,
  color: OverridableStringUnion<
    'primary' | 'secondary' | 'info' | 'error' | 'warning' | 'success' | 'inherit',
    ButtonPropsColorOverrides
  >;
}> = [
    {
      type: 'radio',
      label: 'Radio Button',
      defaultOptions: ['Option 1', 'Option 2'],
      color: 'info',
      icon: "ci:radio-fill"
    },
    {
      type: 'multiple-choice',
      label: 'Multiple Choice',
      defaultOptions: ['Option 1', 'Option 2'],
      color: 'error',
      icon: "healthicons:i-exam-multiple-choice-outline"
    },
    { type: 'text', label: 'Text Field', color: 'warning', icon: "solar:text-bold" },
    { type: 'connect-wallet', label: 'Connect Wallet', color: 'success', icon: "mingcute:solana-sol-line" },
  ];

export default function WidgetPanel({
  onSelect,
}: {
  onSelect: (type: string, options?: string[]) => void;
}) {
  return (
    <Box p={2} width={"100%"}>
      <Typography variant="h6" fontWeight={500} mb={0.5}>
        Widgets
      </Typography>
      <Divider sx={{ mb: 2.25, borderColor: "lightgray" }} />
      <Stack spacing={1} flexWrap="wrap" flexDirection="row" justifyContent={"center"} width={"100%"}>
        {widgets.map((widget) => (
          <Button
            sx={{ background: "#F6F6FB", borderRadius: 0.3, width: "30%", p: 5, height: 100, alignSelf: "baseline" }}
            key={widget.type}
            onClick={() => onSelect(widget.type, widget.defaultOptions)}
            variant="contained"

          >
            <Stack alignItems={"center"} gap={1}>
              <Iconify width={36} icon={widget.icon} color={"lightgrey"} />
              <Typography variant='caption' color='textPrimary' fontWeight={700} >{widget.label}</Typography>
            </Stack>
          </Button>
        ))}
      </Stack>
    </Box >
  );
}
