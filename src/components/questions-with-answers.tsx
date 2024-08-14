import { Box, Typography } from '@mui/material';

interface QuestionWithAnswerProps {
  questionTitle: string;
  answer: string | string[];
}

function QuestionWithAnswer({ questionTitle, answer }: QuestionWithAnswerProps) {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="h6" sx={{ textTransform: 'capitalize' }}>
        {questionTitle}
      </Typography>
      <Typography variant="body1" sx={{ ml: 2 }}>
        {Array.isArray(answer) ? answer.join(', ') : answer}
      </Typography>
    </Box>
  );
}

export default QuestionWithAnswer;
