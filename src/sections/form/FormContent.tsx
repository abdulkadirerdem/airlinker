'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';

import { Box, Paper, Alert, Button, Snackbar, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter, usePathname } from 'src/routes/hooks';

import { QuestionType } from 'src/constants/types';
import { submitForm } from 'src/api/form/submitForm';
import { submitQuiz } from 'src/api/quiz/submitQuiz';
import { submitRaffle } from 'src/api/raffle/submitRaffle';
import { getAllAirlinksByWorkspace } from 'src/api/airlink/getAllAirlinksByWorkspace';

import QuestionRenderer from './QuestionRenderer';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Form',
};

export default function FormContent() {
  const pathname = usePathname();
  const workspaceType = pathname.split('/')[1];
  const workspaceId = pathname.split('/')[2];
  const airlinkId = pathname.split('/')[3];
  const [answers, setAnswers] = useState<{ [key: string]: string | string[] }>({});
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const {
    data,
    error: queryError,
    isLoading,
  } = useQuery({
    queryKey: ['airlinks'],
    queryFn: async () => {
      const result = await getAllAirlinksByWorkspace(workspaceId);
      return result;
    },
  });

  let mutationFn;
  if (workspaceType === 'raffle') {
    mutationFn = submitRaffle;
  } else if (workspaceType === 'quiz') {
    mutationFn = submitQuiz;
  } else {
    mutationFn = submitForm;
  }

  const { isPending, mutateAsync } = useMutation({
    mutationKey: ['submit-form', workspaceType],
    mutationFn,
  });

  if (queryError) {
    return <p style={{ padding: 5 }}>Something went wrong!</p>;
  }

  const formData: any =
    !isLoading && data !== undefined ? data.filter((item) => item?._id === airlinkId)[0] : [];

  const validateForm = (): boolean => {
    const { participationInformation, questions } = formData[workspaceType] || {}; // Ensure safe destructuring

    const hasError = (workspaceType === 'raffle' ? participationInformation : questions)?.some(
      (question: QuestionType) => {
        const answer = answers[question._id];

        // Eğer sorunun yanıtı eksikse
        if (
          question.required &&
          (answer === undefined || answer === '' || (Array.isArray(answer) && answer.length === 0))
        ) {
          setError(`Question "${question.title}" is required.`);
          return true;
        }
        return false;
      }
    );

    if (!hasError) {
      setError(null);
    }
    return !hasError;
  };

  const handleInputChange = (questionId: string, value: string | string[]) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      console.log('Errrrrrr');
      return; // Eğer doğrulama başarısızsa gönderim işlemini durdur
    }

    try {
      console.log('🚀 ~ handleSubmit ~ formData:', formData, answers);
      await mutateAsync({ id: formData[workspaceType]._id, data: answers });
      // Başarılı işlem sonrası yapılacaklar
      console.log('Form submitted successfully');

      router.push(paths.dashboard.root);
    } catch (err) {
      console.error('Error submitting form:', err);
    }
  };

  if (isLoading) return 'Loading...';

  return (
    <Paper elevation={12} sx={{ p: 2, px: 4, mt: 4 }}>
      <Typography variant="h3" gutterBottom textAlign="right">
        Airlinker
      </Typography>
      <Typography variant="h4" gutterBottom>
        {formData.title}
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        {formData.description}
      </Typography>
      <Box
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        {(
          formData[workspaceType]?.[
            workspaceType === 'raffle' ? 'participationInformation' : 'questions'
          ] || []
        ).map((question: QuestionType, qIndex: number) => (
          <QuestionRenderer
            key={question._id}
            question={question}
            qIndex={qIndex}
            answers={answers}
            handleInputChange={handleInputChange}
          />
        ))}
        <Box mt={4}>
          <Button variant="contained" color="primary" type="submit">
            Submit
          </Button>
        </Box>
      </Box>

      {/* Error Snackbar */}
      <Snackbar open={Boolean(error)} autoHideDuration={6000} onClose={() => setError(null)}>
        <Alert onClose={() => setError(null)} severity="error">
          {error}
        </Alert>
      </Snackbar>
    </Paper>
  );
}
