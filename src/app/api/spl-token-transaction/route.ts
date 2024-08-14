import { NextResponse } from 'next/server';
import { PublicKey, Connection, Transaction } from '@solana/web3.js';
import { getAssociatedTokenAddress, createTransferInstruction } from '@solana/spl-token';

export async function POST(request: any) {
  try {
    const { fromPublicKey, toPublicKey, amount, tokenMintAddress, decimals } = await request.json();

    const connection = new Connection('https://api.devnet.solana.com');

    const senderPublicKey = new PublicKey(fromPublicKey);
    const recipientPublicKey = new PublicKey(toPublicKey);
    const tokenMint = new PublicKey(tokenMintAddress);

    const senderTokenAccount = await getAssociatedTokenAddress(tokenMint, senderPublicKey);
    const recipientTokenAccount = await getAssociatedTokenAddress(tokenMint, recipientPublicKey);

    const amountInLamports = amount * 10 ** decimals;

    const transaction = new Transaction().add(
      createTransferInstruction(
        senderTokenAccount,
        recipientTokenAccount,
        senderPublicKey,
        amountInLamports
      )
    );

    // Fetch a recent blockhash from the cluster
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;

    // Set the fee payer (typically the sender's public key)
    transaction.feePayer = senderPublicKey;

    // Serialize the transaction and send it back to the frontend
    const serializedTransaction = transaction.serialize({
      requireAllSignatures: false, // Partially signed, as the wallet will sign on the client
    });

    return NextResponse.json({ transaction: serializedTransaction.toString('base64') });
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to create transaction.', error: error.message },
      { status: 500 }
    );
  }
}
