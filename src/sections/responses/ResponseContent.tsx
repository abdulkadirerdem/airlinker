'use client';

import { useQuery } from '@tanstack/react-query';

import { Divider, Paper, Typography } from '@mui/material';

import { usePathname } from 'src/routes/hooks';

import { getAllAirlinksByWorkspace } from 'src/api/airlink/getAllAirlinksByWorkspace';

import QuestionWithAnswer from 'src/components/questions-with-answers';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Form',
};

export default function ResponseContent() {
  const pathname = usePathname();
  const workspaceId = pathname.split('/')[2];
  const airlinkId = pathname.split('/')[3];

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

  if (queryError) {
    return <p style={{ padding: 5 }}>Something went wrong!</p>;
  }

  const formData: any =
    !isLoading && data !== undefined ? data.filter((item) => item?._id === airlinkId)[0] : [];

  console.log('Dataa: ', formData);

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

      {formData.form.responses.map((response: any, index: number) => (
        <Paper elevation={6} sx={{ p: 2, mt: 3 }} key={response._id}>
          <Typography variant="h5" gutterBottom>
            Client {index + 1}
          </Typography>
          <Divider sx={{ mb: 2, borderWidth: 0.25 }} />
          {formData.form.questions.map((question: any) => (
            <QuestionWithAnswer
              key={question._id}
              questionTitle={question.title}
              answer={
                response.answers.filter((item: any) => item.questionId === question._id)[0]
                  ?.answer || 'Yanıt yok'
              }
            />
          ))}
        </Paper>
      ))}
    </Paper>
  );
}
