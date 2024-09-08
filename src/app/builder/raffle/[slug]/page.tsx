'use client';

import { useState } from 'react';
import { useFormik } from 'formik';
import { toast } from 'react-hot-toast';
import { useMutation } from '@tanstack/react-query';

import { Box, Stack, Paper, Divider, Container, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter, usePathname } from 'src/routes/hooks';

import { useResponsive } from 'src/hooks/use-responsive';

import { createRaffle } from 'src/api/raffle/createRaffle';
import { createAirlink } from 'src/api/airlink/createAirlink';

import FormBuilder from 'src/components/form-builder';
import WidgetPanel from 'src/components/widget-panel';
import { FormValues } from 'src/constants/types';

export default function Page() {
  const pathname = usePathname();
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const lgUp = useResponsive('up', 'lg');

  const { mutateAsync: createAirlinkMutation } = useMutation({
    mutationKey: ['create-airlink'],
    mutationFn: createAirlink,
  });

  const { mutateAsync: createFormMutation } = useMutation({
    mutationKey: ['create-form'],
    mutationFn: createRaffle,
  });

  const formik = useFormik<FormValues>({
    initialValues: {
      title: 'Raffle Title',
      description: 'Raffle Description',
      components: [],
    },
    onSubmit: async (values) => {
      try {
        const airlink = await createAirlinkMutation({
          description: values.description,
          title: values.title,
          type: 'raffle',
          workspace: pathname.split('/')[3],
        });

        const form = {
          title: values.title,
          description: values.description,
          questions: values.components.map(
            (item): { type: string; title: string; options: string[] } => {
              if (item.type === 'connect-wallet') {
                return { type: item.type, title: 'Connect Wallet', options: [] };
              }
              return {
                type: item.type,
                title: item.label,
                options: item.options || [],
              };
            }
          ),
        };

        await createFormMutation({
          description: form.description,
          title: form.title,
          // @ts-ignore
          airlink: airlink._id,
          participationInformation: form.questions,
        });

        toast.success('Raffle created!', { duration: 2000 });
        router.push(paths.dashboard.root);
      } catch (error) {
        console.error('Error creating raffle:', error);
        toast.error('Failed to create raffle. Please try again.');
      }
    },
  });

  const handleWidgetAdded = (type: string, options?: string[]) => {
    formik.setFieldValue('components', [
      ...formik.values.components,
      { type, label: '', options: options || [] },
    ]);
    setSelectedType(null);
  };

  return (
    <Container maxWidth="xl">
      <Typography mt={0} mb={1} variant="h4">
        Raffle Builder
      </Typography>
      {lgUp && (
        <Box
          component="img"
          src="/assets/images/logo/airy.png"
          sx={{
            height: 85,
            mr: 2.5,
            position: 'absolute',
            top: 62,
            left: 220,
            zIndex: 9,
          }}
        />
      )}
      <Divider sx={{ mb: 3 }} />

      <Stack direction="row" spacing={2}>
        <Stack flex={2}>
          <Paper elevation={2} sx={{ height: 300 }}>
            <WidgetPanel onSelect={(type, options) => handleWidgetAdded(type, options)} />
          </Paper>
        </Stack>
        <Stack flex={4}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <FormBuilder
              formik={formik}
              selectedType={selectedType}
              onWidgetAdded={handleWidgetAdded}
            />
          </Paper>
        </Stack>
        <Stack flex={{ md: 0, lg: 2 }} />
      </Stack>
    </Container>
  );
}
