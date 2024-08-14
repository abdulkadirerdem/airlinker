import { Transaction } from '@solana/web3.js';
import React, { useState, ReactNode } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

import Avatar from '@mui/material/Avatar';
import {
  Box,
  Button,
  Select,
  MenuItem,
  TextField,
  InputLabel,
  FormControl,
  ListItemText,
  ListItemIcon,
  SelectChangeEvent,
} from '@mui/material';

import { Token } from './types';

interface TokenTransferFormProps {
  tokens: Token[];
}

const TokenTransferForm: React.FC<TokenTransferFormProps> = ({ tokens }) => {
  const [selectedToken, setSelectedToken] = useState<string>('');
  const [recipientAddress, setRecipientAddress] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const wallet = useWallet();

  const handleTokenChange = (e: SelectChangeEvent<string>, child: ReactNode) => {
    setSelectedToken(e.target.value as string);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!wallet.connected) {
      console.error('Wallet not connected');
      return;
    }

    const selectedTokenData = tokens.find((token) => token.mintAddress === selectedToken);
    if (!selectedTokenData) return;

    const { decimals } = selectedTokenData;

    try {
      const response = await fetch('/api/spl-token-transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fromPublicKey: wallet.publicKey,
          toPublicKey: recipientAddress,
          amount: parseFloat(amount),
          tokenMintAddress: selectedToken,
          decimals,
        }),
      });

      const { transaction: serializedTransaction } = await response.json();

      const transaction = Transaction.from(Buffer.from(serializedTransaction, 'base64'));

      if (!transaction || !wallet.signTransaction) {
        console.error('Transaction not found');
        return;
      }

      const signedTransaction = await wallet.signTransaction(transaction);

      const finalResponse = await fetch('/api/submit-spl-transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          signedTransaction: signedTransaction.serialize().toString('base64'),
        }),
      });

      const result = await finalResponse.json();
      if (finalResponse.ok) {
        console.log('Transaction successful', result.signature);
      } else {
        console.error('Transaction failed', result.error);
      }
    } catch (error) {
      console.error('Transaction error', error);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
    >
      <FormControl fullWidth>
        <InputLabel id="token-select-label">Select Token</InputLabel>
        <Select
          labelId="token-select-label"
          id="token-select"
          value={selectedToken}
          label="Select Token"
          onChange={handleTokenChange}
        >
          {tokens.map((token) => (
            <MenuItem key={token.mintAddress} value={token.mintAddress}>
              <ListItemIcon>
                <Avatar src={token.icon} alt={token.name} sx={{ width: 24, height: 24 }} />
              </ListItemIcon>
              <ListItemText primary={token.name} secondary={`Balance: ${token.amount}`} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        id="recipient-address"
        label="Recipient Address"
        value={recipientAddress}
        onChange={(e) => setRecipientAddress(e.target.value)}
        fullWidth
      />

      <TextField
        id="amount"
        label="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        fullWidth
      />

      <Button variant="contained" color="primary" type="submit">
        Send
      </Button>
    </Box>
  );
};

export default TokenTransferForm;
