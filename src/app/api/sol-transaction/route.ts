import bs58 from 'bs58';
import { NextResponse } from 'next/server';
import * as solanaWeb3 from '@solana/web3.js';

export async function POST(request: any) {
  const body = await request.json();
  const { fromAddress, toAddress, prizeAmount } = body;
  const devnetRPC = 'https://api.devnet.solana.com';

  const connection = new solanaWeb3.Connection(devnetRPC);

  const fromWallet = solanaWeb3.Keypair.fromSecretKey(bs58.decode(fromAddress));

  const sendToPubKey = new solanaWeb3.PublicKey(toAddress);

  const prizeAmountLamports = solanaWeb3.LAMPORTS_PER_SOL * prizeAmount;

  const transaction = new solanaWeb3.Transaction().add(
    solanaWeb3.SystemProgram.transfer({
      fromPubkey: fromWallet.publicKey,
      toPubkey: sendToPubKey,
      lamports: prizeAmountLamports,
    })
  );
  transaction.feePayer = fromWallet.publicKey;

  const signature = await solanaWeb3.sendAndConfirmTransaction(connection, transaction, [
    fromWallet,
  ]);

  return NextResponse.json({ message: 'Congrats!', signature });
}
