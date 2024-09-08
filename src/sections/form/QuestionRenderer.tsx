import React, { useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

import {
  Radio,
  Checkbox,
  TextField,
  Typography,
  RadioGroup,
  FormControl,
  FormControlLabel,
} from '@mui/material';

import { QuestionType } from 'src/constants/types';

interface QuestionRendererProps {
  question: QuestionType;
  qIndex: number;
  answers: { [key: string]: string | string[] };
  handleInputChange: (questionId: string, value: string | string[]) => void;
}

export default function QuestionRenderer({
  question,
  qIndex,
  answers,
  handleInputChange,
}: QuestionRendererProps) {
  const { connected, publicKey } = useWallet();

  useEffect(() => {
    if (question.type === 'connect-wallet' && connected && publicKey) {
      handleInputChange(question._id, publicKey.toBase58());
    }
  }, [connected, publicKey, question._id, handleInputChange, question.type]);
  return (
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
      {question.type === 'connect-wallet' && <WalletMultiButton />}
    </FormControl>
  );
}
