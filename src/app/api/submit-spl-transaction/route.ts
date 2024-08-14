import { NextResponse } from 'next/server';
import { Connection, Transaction } from '@solana/web3.js';

export async function POST(request: any) {
  try {
    const { signedTransaction } = await request.json();
    const connection = new Connection('https://api.devnet.solana.com');

    // Deserialize the signed transaction
    const transaction = Transaction.from(Buffer.from(signedTransaction, 'base64'));

    // Submit the transaction to the blockchain
    const signature = await connection.sendRawTransaction(transaction.serialize());

    // Get the latest blockhash to use for confirmation
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();

    // Confirm the transaction using the new method
    await connection.confirmTransaction({
      signature,
      blockhash,
      lastValidBlockHeight,
    });

    return NextResponse.json({ message: 'Transaction successful!', signature });
  } catch (error) {
    console.error('Error submitting transaction:', error);
    return NextResponse.json(
      { message: 'Transaction submission failed.', error: error.message },
      { status: 500 }
    );
  }
}
