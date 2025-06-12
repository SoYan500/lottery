import { describe, it, expect, beforeEach } from 'vitest';
import { ethers } from 'hardhat';
import { Lottery } from '../src/contracts/Lottery.sol';

describe('Lottery Round History', () => {
  let lottery: Lottery;

  beforeEach(async () => {
    const LotteryFactory = await ethers.getContractFactory('Lottery');
    lottery = await LotteryFactory.deploy() as Lottery;
  });

  it('should handle round history', async () => {
    const [owner, player1, player2] = await ethers.getSigners();

    // Verify initial state
    const initialRoundCount = await lottery.getLotteryRoundCount();
    expect(initialRoundCount).toBe(0);

    // Manually record rounds for testing
    const participants1 = [player1.address, player2.address];
    const participants2 = [owner.address, player1.address];

    // Call internal method to simulate round recording
    await lottery.connect(owner)._recordLotteryRound(
      player1.address, 
      ethers.utils.parseEther('10'), 
      participants1
    );

    await lottery.connect(owner)._recordLotteryRound(
      owner.address, 
      ethers.utils.parseEther('20'), 
      participants2
    );

    // Verify round count
    const roundCount = await lottery.getLotteryRoundCount();
    expect(roundCount).toBe(2);
  });
});