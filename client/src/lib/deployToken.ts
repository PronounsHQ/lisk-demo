import getSmartAccount from "./smartAccount";
import { abi, bytecode } from "./abi";
import type { EIP1193Provider } from "@privy-io/react-auth";
import { network } from "./constants";
import { createPublicClient, http } from "viem";

const publicClient = createPublicClient({
  chain: network,
  transport: http()
});

export default async function deployToken(provider: EIP1193Provider, tokenName: string, tokenSymbol: string) {
  const walletClient = await getSmartAccount(provider);

  const hash = await walletClient.deployContract({
    chain: network,
    abi,
    bytecode,
    args: [tokenName, tokenSymbol]
  });

  const { contractAddress: tokenAddress } = await publicClient.waitForTransactionReceipt({ hash });

  return tokenAddress;
}
