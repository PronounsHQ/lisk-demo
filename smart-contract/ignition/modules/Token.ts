// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const TokenModule = buildModule("TokenModule", (deployer) => {

  const token = deployer.contract("PronounsLiskDemo", ["Pronouns Lisk Demo Token", "PLDT"]);

  return { token };
});

export default TokenModule;
