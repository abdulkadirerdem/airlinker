import { useState } from 'react';
import { useFormik } from 'formik';

import {
  Box,
  Stack,
  Button,
  Divider,
  Typography,
  Grid,
  useTheme,
  TextField,
  Chip,
} from '@mui/material';

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
    icon: 'ci:radio-fill',
    category: 'Primary',
  },
  {
    type: 'multiple-choice',
    label: 'Multiple Choice',
    defaultOptions: ['Option 1', 'Option 2'],
    icon: 'healthicons:i-exam-multiple-choice-outline',
    category: 'Primary',
  },
  { type: 'text', label: 'Text Field', icon: 'solar:text-bold', category: 'Secondary' },
  {
    type: 'connect-wallet',
    label: 'Connect Wallet',
    icon: 'mingcute:solana-sol-line',
    category: 'Primary',
  },
  // Example data for other categories
  { type: 'checkbox', label: 'Checkbox', icon: 'ic:outline-check-box', category: 'Secondary' },
  { type: 'phone', label: 'Phone', icon: 'ph:phone', category: 'Secondary' },
  { type: 'email', label: 'Email', icon: 'mage:email', category: 'Secondary' },
  { type: 'location', label: 'Location', icon: 'mingcute:location-line', category: 'Secondary' },
  { type: 'yes-no', label: 'Yes/No', icon: 'humbleicons:switch-off', category: 'Secondary' },
  {
    type: 'file-upload',
    label: 'File Uploads',
    icon: 'fluent:attach-32-regular',
    category: 'Secondary',
  },
  { type: 'slider', label: 'Slider', icon: 'fluent-mdl2:slider', category: 'Secondary' },
  { type: 'datepicker', label: 'Date Picker', icon: 'ic:outline-event', category: 'Secondary' },
  { type: 'dropdown', label: 'Dropdown', icon: 'mdi:form-dropdown', category: 'Other' },
  { type: 'date-time', label: 'Date Time', icon: 'solar:calendar-outline', category: 'Other' },
  {
    type: 'open-question',
    label: 'Open Question',
    icon: 'iconoir:align-right-box',
    category: 'Other',
  },
  // { type: 'section-break', label: 'Section Break', icon: "mdi:form-dropdown", category: 'Other' },
];

const whiteList = ['text', 'multiple-choice', 'radio', 'connect-wallet'];

export default function WidgetPanel({
  onSelect,
  onFormAuthWhitelistChange,
}: {
  onSelect: (type: string, options?: string[]) => void;
  onFormAuthWhitelistChange: (whitelist: string[]) => void;
}) {
  const theme = useTheme();
  const [formAuthWhitelist, setFormAuthWhitelist] = useState<string[]>([]);

  const formik = useFormik({
    initialValues: {
      newWhitelistItem: '',
    },
    onSubmit: (values, { resetForm }) => {
      if (values.newWhitelistItem && !formAuthWhitelist.includes(values.newWhitelistItem)) {
        const newWhitelist = [...formAuthWhitelist, values.newWhitelistItem];
        setFormAuthWhitelist(newWhitelist);
        onFormAuthWhitelistChange(newWhitelist);
        resetForm();
      }
    },
  });

  const handleDelete = (itemToDelete: string) => {
    const newWhitelist = formAuthWhitelist.filter((item) => item !== itemToDelete);
    setFormAuthWhitelist(newWhitelist);
    onFormAuthWhitelistChange(newWhitelist);
  };

  const renderWidgets = (category: 'Primary' | 'Secondary' | 'Other') => (
    <Stack spacing={1} mb={2}>
      <Typography variant="subtitle1" fontWeight={600} color="lightgrey">
        {category}
      </Typography>
      <Grid container spacing={1}>
        {widgets
          .filter((widget) => widget.category === category)
          .map((widget) => (
            <Grid item xs={6} sm={widget.category === 'Primary' ? 4 : 4} key={widget.type}>
              <Button
                sx={{
                  background: '#F6F6FB',
                  borderRadius: 0.3,
                  width: '100%',
                  height: 100,
                  p: 2,
                  alignSelf: 'baseline',
                  ':hover': {
                    color: 'white',
                  },
                }}
                onClick={() => onSelect(widget.type, widget.defaultOptions)}
                variant="contained"
                disabled={!whiteList.includes(widget.type)}
              >
                <Stack alignItems="center" gap={1}>
                  <Iconify
                    width={36}
                    icon={widget.icon}
                    color={
                      whiteList.includes(widget.type)
                        ? theme.palette.primary.lighter
                        : theme.palette.grey[400]
                    }
                  />
                  <Typography
                    variant="caption"
                    color="textSecondary"
                    sx={{ ':hover': { color: 'inherit' } }}
                    fontWeight={700}
                  >
                    {widget.label}
                  </Typography>
                </Stack>
              </Button>
            </Grid>
          ))}
      </Grid>
    </Stack>
  );

  return (
    <Box p={2} width="100%">
      {renderWidgets('Primary')}
      {renderWidgets('Secondary')}
      {renderWidgets('Other')}

      <Divider sx={{ my: 2 }} />

      <Typography variant="subtitle1" fontWeight={600} color="lightgrey" mb={1}>
        Form Auth Whitelist
      </Typography>

      <form onSubmit={formik.handleSubmit}>
        <Stack direction="row" spacing={1} mb={2}>
          <TextField
            fullWidth
            size="small"
            name="newWhitelistItem"
            placeholder="Add to form auth whitelist"
            value={formik.values.newWhitelistItem}
            onChange={formik.handleChange}
          />
          <Button type="submit" variant="contained" size="small">
            Add
          </Button>
        </Stack>
      </form>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {formAuthWhitelist.map((item) => (
          <Chip
            key={item}
            label={item}
            onDelete={() => handleDelete(item)}
            color="primary"
            variant="outlined"
          />
        ))}
      </Box>
    </Box>
  );
}
