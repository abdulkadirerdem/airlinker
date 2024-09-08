'use client';

import Confetti from 'react-confetti';
import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
  Bar,
  XAxis,
  YAxis,
  Legend,
  Tooltip,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';


import { DataGrid, GridColDef } from '@mui/x-data-grid';
        import { Container } from '@mui/system';
import {
  Box,
  Tab,
  Grid,
  Card,
  Tabs,
  Paper,
  Button,
  Typography,
  IconButton,
  CardContent,
  Container,
     Divider,
     TextField,
    InputAdornment
} from '@mui/material';


import { usePathname } from 'src/routes/hooks';

import { drawWinner } from 'src/api/raffle/drawWinner';
import { getAllAirlinksByWorkspace } from 'src/api/airlink/getAllAirlinksByWorkspace';

import QuestionWithAnswer from 'src/components/questions-with-answers';

import { useSolanaTransfer } from 'src/components/web-3/useSolanaTransfer';

import { Icon } from '@iconify/react';


// ----------------------------------------------------------------------

export const metadata = {
  title: 'Form',
};

export default function ResponseContent() {
  const pathname = usePathname();
  const workspaceId = pathname.split('/')[2];
  const airlinkId = pathname.split('/')[3];
  const [winner, setWinner] = useState<string | null>(null);
  const [winnerAddress, setWinnerAddress] = useState<string>('');
  const [isRaffling, setIsRaffling] = useState(false);
  const [currentParticipant, setCurrentParticipant] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [viewMode, setViewMode] = useState<'card' | 'grid'>('card');
  const [tabValue, setTabValue] = useState(0);

  const { transfer, isLoading: isTransferLoading } = useSolanaTransfer();

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


  if (isLoading || isTransferLoading) return 'Loading...';

  const handleTransfer = async (recieveAddress: string, prizeAmount: number) => {
    const { signature, error } = await transfer(recieveAddress, prizeAmount, 'devnet');
    if (signature) {
      console.log('Transfer successful:', signature);
    } else {
      console.error('Transfer failed:', error);
    }
  };


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
          setCurrentParticipant(randomParticipant.answers[1].answer);
        }, 100);

        // Call the server-side mutation
        const result = await mutateAsync({ id: formData[formData.type]?._id, data: {} });

        // Continue animation for a short time after getting the result
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // @ts-ignore
        setWinner(result.winner.answers[1].answer);
        // @ts-ignore
        setWinnerAddress(result.winner.answers[0].answer);

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

  const handleViewModeChange = () => {
    setViewMode(viewMode === 'card' ? 'grid' : 'card');
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const responses =
    formData[formData.type]?.[formData.type === 'raffle' ? 'participants' : 'responses'] || [];
  const questions =
    formData[formData.type]?.[
      formData.type === 'raffle' ? 'participationInformation' : 'questions'
    ] || [];

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    ...questions.map((question: any, index: number) => ({
      field: `question${index}`,
      headerName: question.title,
      width: 200,
    })),
  ];

  const rows = responses.map((response: any, index: number) => ({
    id: index + 1,
    ...response.answers.reduce((acc: any, answer: any, idx: number) => {
      acc[`question${idx}`] = answer.answer;
      return acc;
    }, {}),
  }));

  const chartData = questions.map((question: any) => ({
    question: question.title,
    count: responses.filter((response: any) =>
      response.answers.some((answer: any) => answer.questionId === question._id)
    ).length,
  }));

  // Add this new function to prepare data for pie charts
  const preparePieChartData = () =>
    questions.map((question: any) => {
      const answerCounts: { [key: string]: number } = {};
      responses.forEach((response: any) => {
        const answer = response.answers.find((a: any) => a.questionId === question._id)?.answer;
        if (answer) {
          answerCounts[answer] = (answerCounts[answer] || 0) + 1;
        }
      });
      return {
        question: question.title,
        data: Object.entries(answerCounts).map(([name, value]) => ({ name, value })),
      };
    });

  const pieChartData = preparePieChartData();
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (

    <Container maxWidth="md">
      <Paper elevation={12} sx={{ p: 2, px: 4, mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>

          <Box>
            <Typography variant="h4" gutterBottom>
              {formData.title || 'No Title'}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              {formData.description || 'No Description'}
            </Typography>
          </Box>
          {formData.type === 'raffle' && (

            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
              <TextField
                label="Solana Prize"
                variant="outlined"
                size="small"
                value={formData.raffle.prizeAmount}
                disabled
                InputProps={{
                  endAdornment: <InputAdornment position="end">SOL</InputAdornment>,
                }}
                sx={{ width: '150px' }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={drawServerSideWinner}
                disabled={isPending}
              >
                {isPending ? 'Drawing...' : 'Draw Raffle Winner'}
              </Button>
            </Box>
          )}
        </Box>

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
            {winner !== null && (
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleTransfer(winnerAddress, formData.raffle.prizeAmount)}
              >
                Send SOL
              </Button>
            )}
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
              ].map((question: any, questionIndex: number) => (
                <QuestionWithAnswer
                  key={question._id}
                  questionTitle={question.title}
                  answer={
                    response.answers.filter((item: any) => item.questionId === question._id)[0]
                      ?.answer || 'Yanıt yok'
                  }
                  questionIndex={questionIndex}
                />
              ))}
            </Paper>
          )
        ) || <p>No Responses Available</p>}
      </Paper>
    </Container>
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
