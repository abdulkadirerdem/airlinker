'use client';

import { useState } from 'react';
import { useFormik } from 'formik';
import { toast } from 'react-hot-toast';
import { useMutation } from '@tanstack/react-query';

import { Box, Stack, Paper, Divider, Container, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter, usePathname } from 'src/routes/hooks';

import { useResponsive } from 'src/hooks/use-responsive';

import { createQuiz } from 'src/api/quiz/createQuiz';
import { createAirlink } from 'src/api/airlink/createAirlink';

import FormBuilder from 'src/components/form-builder';
import WidgetPanel from 'src/components/widget-panel';
import { FormValues } from 'src/constants/types';
import Image from 'next/image';
import BuilderBadge from '../../../../assets/illustrations/builder-quiz.png';

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
    mutationFn: createQuiz,
  });

  const formik = useFormik<FormValues>({
    initialValues: {
      type: 'quiz',
      prize: '0',
      title: 'Quiz Title',
      description: 'Quiz Description',
      components: [],
      whiteList: [],
    },
    onSubmit: async (values) => {
      console.info(values);
      console.info(
        values.components.map((item) =>
          item.type === 'connect-wallet'
            ? { type: item.type, title: 'Connect Wallet', options: [] }
            : {
                type: item.type,
                options: item.options || [],
                title: item.label,
                correctAnswer: values.correctAnswer,
              }
        )
      );
      try {
        const airlink = await createAirlinkMutation({
          description: values.description,
          title: values.title,
          type: 'quiz',
          workspace: pathname.split('/')[3],
          whiteList: values.whiteList,
        });

        const form = {
          title: values.title,
          description: values.description,
          questions: values.components.map((item) =>
            item.type === 'connect-wallet'
              ? { type: item.type, title: 'Connect Wallet', options: [] }
              : {
                  type: item.type,
                  options: item.options || [],
                  title: item.label,
                  correctAnswer: item.correctAnswer,
                }
          ),
        };

        await createFormMutation({
          description: form.description,
          title: form.title,
          // @ts-ignore
          airlink: airlink._id,
          questions: form.questions,
        });

        toast.success('Quiz created!', { duration: 2000 });
        router.push(paths.dashboard.root);
      } catch (error) {
        console.error('Error creating quiz:', error);
        toast.error('Failed to create quiz. Please try again.');
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

  const handleFormAuthWhitelistChange = (newWhitelist: string[]) => {
    formik.setFieldValue('whiteList', newWhitelist);
  };
  return (
    <Container maxWidth="xl">
      <Typography mt={0} mb={1} variant="h4">
        Quiz Builder
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
            left: 300,
            zIndex: 9,
          }}
        />
      )}
      <Divider sx={{ mb: 3 }} />

      <Stack direction="row" spacing={2}>
        <Stack flex={2}>
          <Paper elevation={2} sx={{ height: 300 }}>
            <WidgetPanel
              onSelect={(type, options) => handleWidgetAdded(type, options)}
              onFormAuthWhitelistChange={handleFormAuthWhitelistChange}
            />
          </Paper>
        </Stack>
        <Stack flex={4}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <FormBuilder
              formik={formik}
              selectedType={selectedType}
              onWidgetAdded={handleWidgetAdded}
              formType="quiz"
            />
          </Paper>
        </Stack>
        <Stack flex={{ md: 0, lg: 2 }}>
          <Image
            src={BuilderBadge}
            alt="My Image"
            width={500}
            height={300}
            objectFit="contain"
            layout="responsive"
            priority
          />
        </Stack>
      </Stack>
    </Container>
  );
}
