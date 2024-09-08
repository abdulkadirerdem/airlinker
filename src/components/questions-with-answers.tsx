import { Box, Divider, Typography } from '@mui/material';

interface QuestionWithAnswerProps {
  questionTitle: string;
  answer: string | string[];
  index: any
}

function QuestionWithAnswer({ questionTitle, answer, index }: QuestionWithAnswerProps) {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
        Q{index + 1}. <span style={{ fontWeight: 500, fontSize: 14 }}>{questionTitle}</span>
      </Typography>
      <Typography variant="body2" sx={{ mt: 1 }}>
        <span style={{ fontSize: 13, fontWeight: 700 }}>Asnwer:</span> {Array.isArray(answer) ? answer.join(', ') : answer}
      </Typography>
    </Box>

  );
}

export default QuestionWithAnswer;
