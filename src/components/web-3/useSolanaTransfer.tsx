import { useState } from 'react';
import * as web3 from '@solana/web3.js';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';

interface TransferResult {
  signature: string | null;
  error: string | null;
}

export const useSolanaTransfer = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [isLoading, setIsLoading] = useState(false);

  const transfer = async (
    recipientAddress: string,
    amount: number,
    network: 'devnet' | 'testnet' | 'mainnet-beta' = 'devnet'
  ): Promise<TransferResult> => {
    if (!publicKey) {
      return { signature: null, error: 'Wallet not connected' };
    }

    setIsLoading(true);

    try {
      const recipientPubkey = new web3.PublicKey(recipientAddress);
      const amountLamports = web3.LAMPORTS_PER_SOL * amount;

      const transaction = new web3.Transaction().add(
        web3.SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: recipientPubkey,
          lamports: amountLamports,
        })
      );

      // Get the latest blockhash
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      const signature = await sendTransaction(transaction, connection);

      // Wait for transaction confirmation
      await connection.confirmTransaction(signature);

      return { signature, error: null };
    } catch (error) {
      console.error('Transfer error:', error);
      return { signature: null, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  return { transfer, isLoading };
};

// Usage example:
// function MyComponent() {
//   const { transfer, isLoading } = useSolanaTransfer();
//
//   const handleTransfer = async () => {
//     const { signature, error } = await transfer('RECIPIENT_ADDRESS', 1, 'devnet');
//     if (signature) {
//       console.log('Transfer successful:', signature);
//     } else {
//       console.error('Transfer failed:', error);
//     }
//   };
//
//   return (
//     <button onClick={handleTransfer} disabled={isLoading}>
//       {isLoading ? 'Transferring...' : 'Send 1 SOL'}
//     </button>
//   );
// }
