import { createBicoPaymasterClient, createSmartAccountClient, toNexusAccount } from "@biconomy/abstractjs";
import type { EIP1193Provider } from "@privy-io/react-auth";
import { custom } from "viem";

import { network } from "./constants";

export default async function getSmartAccount (provider: EIP1193Provider) {
  try {
    const nexusAccountClient = createSmartAccountClient({
      account: await toNexusAccount({
        signer: provider,
        chain: network,
        transport: custom(provider),
      }),
      paymaster: createBicoPaymasterClient({ paymasterUrl: import.meta.env.VITE_PAYMASTER_URL }),
    });

    return nexusAccountClient.account.walletClient;
  } catch (error) {
    console.error(error);
    throw new Error(error as string);
  }
};
