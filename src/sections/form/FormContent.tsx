'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';

import {
  Box,
  Radio,
  Paper,
  Alert,
  Button,
  Checkbox,
  Snackbar,
  TextField,
  Typography,
  RadioGroup,
  FormControl,
  FormControlLabel,
} from '@mui/material';

import { useRouter } from 'src/routes/hooks';
import { usePathname } from 'src/routes/hooks';

import { QuestionType } from 'src/constants/types';
import { submitForm } from 'src/api/form/submitForm';
import { getAllAirlinksByWorkspace } from 'src/api/airlink/getAllAirlinksByWorkspace';
import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Form',
};

export default function FormContent() {
  const pathname = usePathname();
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

  const { isPending, mutateAsync } = useMutation({
    mutationKey: ['submit-form'],
    mutationFn: submitForm,
  });

  if (queryError) {
    return <p style={{ padding: 5 }}>Something went wrong!</p>;
  }

  const formData: any =
    !isLoading && data !== undefined ? data.filter((item) => item?._id === airlinkId)[0] : [];

  const validateForm = (): boolean => {
    const { questions } = formData.form;

    const hasError = questions.some((question: QuestionType) => {
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
    });

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
      await mutateAsync({ id: formData.form._id, data: answers });
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
        {formData.form.questions.map((question: QuestionType, qIndex: number) => (
          <FormControl key={question._id} component="fieldset" margin="normal" fullWidth>
            <Typography variant="h6" fontWeight={500} mb={0.5}>
              <span style={{ fontWeight: 700 }}>{`${qIndex + 1}. `}</span>
              {question.title}
              {question.type === 'multiple-choice' && (
                <span style={{ fontWeight: 700, fontSize: 12, color: 'red', marginLeft: 8 }}>
                  Multiple Choice
                </span>
              )}
            </Typography>
            {question.type === 'radio' && (
              <RadioGroup
                name={question.title}
                onChange={(e) => handleInputChange(question._id, e.target.value)}
              >
                {question.options.map((option, index) => (
                  <FormControlLabel key={index} value={option} control={<Radio />} label={option} />
                ))}
              </RadioGroup>
            )}
            {question.type === 'multiple-choice' && (
              <>
                {question.options.map((option, index) => (
                  <FormControlLabel
                    key={index}
                    control={
                      <Checkbox
                        onChange={(e) => {
                          const value = answers[question._id] || [];
                          handleInputChange(
                            question._id,
                            e.target.checked
                              ? [...(value as string[]), option]
                              : (value as string[]).filter((v) => v !== option)
                          );
                        }}
                      />
                    }
                    label={option}
                  />
                ))}
              </>
            )}
            {question.type === 'text' && (
              <TextField
                size="small"
                fullWidth
                variant="outlined"
                placeholder="Type answer.."
                onChange={(e) => handleInputChange(question._id, e.target.value)}
              />
            )}
          </FormControl>
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
