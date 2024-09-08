import { NextResponse } from 'next/server';
import * as solanaWeb3 from '@solana/web3.js';

export async function POST(request: any) {
  try {
    const body = await request.json();
    const { fromAddress, toAddress } = body;
    const devnetRPC = 'https://api.devnet.solana.com';

    const connection = new solanaWeb3.Connection(devnetRPC);

    // Create PublicKey objects from the addresses
    const fromPubKey = new solanaWeb3.PublicKey(fromAddress);
    const toPubKey = new solanaWeb3.PublicKey(toAddress);

    const prizeAmountLamports = solanaWeb3.LAMPORTS_PER_SOL * 0.5;

    const transaction = new solanaWeb3.Transaction().add(
      solanaWeb3.SystemProgram.transfer({
        fromPubkey: fromPubKey,
        toPubkey: toPubKey,
        lamports: prizeAmountLamports,
      })
    );

    // Set the fee payer to the fromAddress
    transaction.feePayer = fromPubKey;

    // Get the latest blockhash
    const latestBlockhash = await connection.getLatestBlockhash();
    transaction.recentBlockhash = latestBlockhash.blockhash;

    // Serialize the transaction
    const serializedTransaction = transaction.serialize({
      requireAllSignatures: false,
      verifySignatures: false,
    });

    const transactionBase64 = serializedTransaction.toString('base64');

    return NextResponse.json({
      message: 'Transaction created',
      transaction: transactionBase64,
    });
  } catch (error) {
    console.error('Transaction creation error:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
