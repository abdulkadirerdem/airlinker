'use client';

import Confetti from 'react-confetti';
import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';

import { Box, Paper, Button, Divider, Typography } from '@mui/material';

import { usePathname } from 'src/routes/hooks';

import { drawWinner } from 'src/api/raffle/drawWinner';
import { getAllAirlinksByWorkspace } from 'src/api/airlink/getAllAirlinksByWorkspace';

import QuestionWithAnswer from 'src/components/questions-with-answers';
import { Stack } from '@mui/system';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Form',
};

export default function ResponseContent() {
  const pathname = usePathname();
  const workspaceId = pathname.split('/')[2];
  const airlinkId = pathname.split('/')[3];
  const [winner, setWinner] = useState<string | null>(null); // State to hold the winner
  const [isRaffling, setIsRaffling] = useState(false);
  const [currentParticipant, setCurrentParticipant] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);

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
    mutationKey: ['draw-winner'],
    mutationFn: drawWinner,
  });

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  if (queryError) {
    return <p style={{ padding: 5 }}>Something went wrong!</p>;
  }

  const formData: any =
    !isLoading && data !== undefined ? data.filter((item) => item?._id === airlinkId)[0] : null; // Changed to null

  // Check if formData is valid and has a type
  if (!formData || !formData.type) return <p style={{ padding: 5 }}>Invalid data!</p>; // Added check


  if (isLoading) return 'Loading...';

  // Updated function to draw a winner
  const drawServerSideWinner = async () => {
    if (formData.type === 'raffle') {
      setIsRaffling(true);
      const participants = formData[formData.type]?.participants || [];
      let animationInterval: NodeJS.Timeout;

      try {
        // Start the animation
        animationInterval = setInterval(() => {
          const randomParticipant = participants[Math.floor(Math.random() * participants.length)];
          setCurrentParticipant(randomParticipant.answers[0].answer);
        }, 100);

        // Call the server-side mutation
        const result = await mutateAsync({ id: formData[formData.type]?._id, data: {} });

        // Continue animation for a short time after getting the result
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // @ts-ignore
        setWinner(result.winner.answers[0].answer);
        setShowConfetti(true);
      } catch (error) {
        console.error('Error drawing winner:', error);
        // Handle error (e.g., show error message to user)
      } finally {
        // @ts-ignore
        clearInterval(animationInterval);
        setIsRaffling(false);
        setCurrentParticipant('');
      }
    }
  };

  return (
    <Paper elevation={12} sx={{ p: 2, px: 4, mt: 4 }}>
      <Stack direction="row" justifyContent="space-between">
        <Box>
          <Typography variant="h4" gutterBottom>
            {formData.title || 'No Title'}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            {formData.description || 'No Description'}
          </Typography>
        </Box>
        {formData.type === 'raffle' && (
          <Button
            variant="contained"
            color="primary"
            onClick={drawServerSideWinner}
            disabled={isPending}
            sx={{ mb: 2 }}
          >
            {isPending ? 'Drawing...' : 'Draw Raffle Winner'}
          </Button>
        )}
      </Stack>

      {/* Raffle Animation */}
      {isRaffling && (
        <Box sx={{ my: 2, textAlign: 'center' }}>
          <Typography variant="h4" sx={{ animation: 'pulse 0.5s infinite' }}>
            {currentParticipant}
          </Typography>
        </Box>
      )}

      {/* Winner Display */}
      {winner && (
        <Box sx={{ my: 2, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>
            Winner: {winner}
          </Typography>
          {showConfetti && <Confetti />}
        </Box>
      )}

      {formData[formData.type]?.[formData.type === 'raffle' ? 'participants' : 'responses']?.map(
        (response: any, index: number) => (
          <Paper elevation={6} sx={{ p: 2, mt: 3 }} key={response._id}>
            <Typography variant="h5" gutterBottom>
              Client {index + 1}
            </Typography>
            <Divider sx={{ mb: 2, borderWidth: 0.25 }} />
            {formData[formData.type]?.[
              formData.type === 'raffle' ? 'participationInformation' : 'questions'
            ].map((question: any) => (
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
        )
      ) || <p>No Responses Available</p>}
    </Paper>
  );
}

// Add this CSS animation at the end of the file
const styles = `
@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}
`;

// Inject the styles
const styleSheet = document.createElement('style');
styleSheet.type = 'text/css';
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);
