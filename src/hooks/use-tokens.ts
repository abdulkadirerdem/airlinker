import { useState, useEffect } from 'react';
import { PublicKey, Connection } from '@solana/web3.js';

import { Token } from 'src/components/web-3/types';

const TOKEN_LIST_URL =
  'https://raw.githubusercontent.com/solana-labs/token-list/main/src/tokens/solana.tokenlist.json';

export default function useTokens(walletPublicKey: PublicKey | null): Token[] {
  const [tokens, setTokens] = useState<Token[]>([]);

  useEffect(() => {
    const fetchTokens = async () => {
      if (!walletPublicKey) return;

      const connection = new Connection('https://api.devnet.solana.com');
      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(walletPublicKey, {
        programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
      });

      const tokenData = tokenAccounts.value.map((account) => ({
        mintAddress: account.account.data.parsed.info.mint,
        amount: account.account.data.parsed.info.tokenAmount.uiAmount,
        decimals: account.account.data.parsed.info.tokenAmount.decimals,
      }));

      // Fetch the token list
      const response = await fetch(TOKEN_LIST_URL);
      const { tokens: tokenList } = await response.json();

      // Map the token data to include names and icons
      const enrichedTokens = tokenData.map((token) => {
        const tokenMetadata = tokenList.find((t: any) => t.address === token.mintAddress);
        return {
          ...token,
          name: tokenMetadata?.name || 'Unknown Token',
          icon: tokenMetadata?.logoURI || '',
        };
      });

      setTokens(enrichedTokens);
    };

    fetchTokens();
  }, [walletPublicKey]);

  return tokens;
}
