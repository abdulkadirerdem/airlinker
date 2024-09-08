import { OverridableStringUnion } from '@mui/types';
import { ButtonPropsColorOverrides } from '@mui/material/Button';
import { Box, Stack, Button, Divider, Typography, Grid } from '@mui/material';
import Iconify from './iconify';

const widgets: Array<{
  type: string;
  label: string;
  defaultOptions?: [] | [string] | any;
  icon: string;
  category: 'Primary' | 'Secondary' | 'Other';
}> = [
    {
      type: 'radio',
      label: 'Radio Button',
      defaultOptions: ['Option 1', 'Option 2'],
      icon: "ci:radio-fill",
      category: 'Primary'
    },
    {
      type: 'multiple-choice',
      label: 'Multiple Choice',
      defaultOptions: ['Option 1', 'Option 2'],
      icon: "healthicons:i-exam-multiple-choice-outline",
      category: 'Primary'
    },
    { type: 'text', label: 'Text Field', icon: "solar:text-bold", category: 'Secondary' },
    { type: 'connect-wallet', label: 'Connect Wallet', icon: "mingcute:solana-sol-line", category: 'Primary' },
    // Example data for other categories
    { type: 'checkbox', label: 'Checkbox', icon: "ic:outline-check-box", category: 'Secondary' },
    { type: 'phone', label: 'Phone', icon: "ph:phone", category: 'Secondary' },
    { type: 'email', label: 'Email', icon: "mage:email", category: 'Secondary' },
    { type: 'location', label: 'Location', icon: "mingcute:location-line", category: 'Secondary' },
    { type: 'yes-no', label: 'Yes/No', icon: "humbleicons:switch-off", category: 'Secondary' },
    { type: 'file-upload', label: 'File Uploads', icon: "fluent:attach-32-regular", category: 'Secondary' },
    { type: 'slider', label: 'Slider', icon: "fluent-mdl2:slider", category: 'Secondary' },
    { type: 'datepicker', label: 'Date Picker', icon: "ic:outline-event", category: 'Secondary' },
    { type: 'dropdown', label: 'Dropdown', icon: "mdi:form-dropdown", category: 'Other' },
    { type: 'date-time', label: 'Date Time', icon: "solar:calendar-outline", category: 'Other' },
    { type: 'open-question', label: 'Open Question', icon: "iconoir:align-right-box", category: 'Other' },
    // { type: 'section-break', label: 'Section Break', icon: "mdi:form-dropdown", category: 'Other' },

  ];

export default function WidgetPanel({
  onSelect,
}: {
  onSelect: (type: string, options?: string[]) => void;
}) {
  const renderWidgets = (category: 'Primary' | 'Secondary' | 'Other') => (
    <Stack spacing={1} mb={2}>
      <Typography variant="subtitle1" fontWeight={600} color="lightgrey" >
        {category}
      </Typography>
      <Grid container spacing={1}>
        {widgets
          .filter(widget => widget.category === category)
          .map(widget => (
            <Grid item xs={6} sm={widget.category === "Primary" ? 4 : 4} key={widget.type}>
              <Button
                sx={{
                  background: "#F6F6FB",
                  borderRadius: 0.3,
                  width: '100%',
                  height: 100,
                  p: 2,
                  alignSelf: "baseline",
                  ":hover": {
                    color: "white"
                  }
                }}
                onClick={() => onSelect(widget.type, widget.defaultOptions)}
                variant="contained"
              >
                <Stack alignItems={"center"} gap={1}>
                  <Iconify width={36} icon={widget.icon} color={"lightgrey"} />
                  <Typography variant='caption' color='textSecondary' sx={{ ":hover": { color: "inherit" } }} fontWeight={700}>{widget.label}</Typography>
                </Stack>
              </Button>
            </Grid>
          ))}
      </Grid>
    </Stack >
  );

  return (
    <Box p={2} width={"100%"}>
      {renderWidgets('Primary')}
      {renderWidgets('Secondary')}
      {renderWidgets('Other')}
    </Box>
  );
}
