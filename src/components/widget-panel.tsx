import { OverridableStringUnion } from '@mui/types';
import { ButtonPropsColorOverrides } from '@mui/material/Button';
import { Box, Stack, Button, Divider, Typography } from '@mui/material';

const widgets: Array<{
  type: string;
  label: string;
  defaultOptions?: [] | [string] | any;
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
  },
  {
    type: 'multiple-choice',
    label: 'Multiple Choice',
    defaultOptions: ['Option 1', 'Option 2'],
    color: 'error',
  },
  { type: 'text', label: 'Text Field', color: 'warning' },
];

export default function WidgetPanel({
  onSelect,
}: {
  onSelect: (type: string, options?: string[]) => void;
}) {
  return (
    <Box p={2}>
      <Typography variant="h5" mb={0.5}>
        Widgets
      </Typography>
      <Divider sx={{ mb: 2.25 }} />
      <Stack spacing={1} flexWrap="wrap" flexDirection="row">
        {widgets.map((widget) => (
          <Button
            color={widget.color}
            sx={{ maxWidth: '50%' }}
            key={widget.type}
            onClick={() => onSelect(widget.type, widget.defaultOptions)}
            variant="contained"
          >
            {widget.label}
          </Button>
        ))}
      </Stack>
    </Box>
  );
}
