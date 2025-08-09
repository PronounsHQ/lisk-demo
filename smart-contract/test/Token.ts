import {
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

describe("Pronouns Lisk Demo Token", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployToken() {
    const token = await hre.viem.deployContract("PronounsLiskDemo", ["Test Token", "TT"]);

    return {
      token
    };
  }

  describe("Deployment", function () {
    it("Should successfully deploy token", async function () {
      const { token } = await loadFixture(deployToken);

      expect(token.address).to.be.of.string(`0x`);
    });
  });
});
