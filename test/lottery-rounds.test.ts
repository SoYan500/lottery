import { describe, it, expect } from 'vitest';
import { ethers } from 'hardhat';
import { Lottery } from '../src/contracts/Lottery.sol';

describe('Lottery Round History', () => {
  let lottery: Lottery;

  beforeEach(async () => {
    const LotteryFactory = await ethers.getContractFactory('Lottery');
    lottery = await LotteryFactory.deploy();
    await lottery.deployed();
  });

  it('should record and retrieve lottery rounds', async () => {
    const [owner, player1, player2] = await ethers.getSigners();

    // Simulate recording multiple lottery rounds
    const participants1 = [player1.address, player2.address];
    const participants2 = [owner.address, player1.address];

    // Simulate recording rounds using the internal method 
    // (Note: In actual implementation, this would be called from the main lottery logic)
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

    // Check round count
    const roundCount = await lottery.getLotteryRoundCount();
    expect(roundCount).toBe(2);

    // Retrieve specific rounds
    const round1 = await lottery.getLotteryRound(0);
    const round2 = await lottery.getLotteryRound(1);

    expect(round1.roundNumber).toBe(1);
    expect(round1.winner).toBe(player1.address);
    expect(round1.participants.length).toBe(2);

    expect(round2.roundNumber).toBe(2);
    expect(round2.winner).toBe(owner.address);
    expect(round2.participants.length).toBe(2);

    // Test multiple round retrieval
    const multiRounds = await lottery.getLotteryRounds(0, 2);
    expect(multiRounds.length).toBe(2);
  });

  it('should handle out of bounds retrieval', async () => {
    // Ensure retrieving non-existent rounds throws an error
    await expect(lottery.getLotteryRound(0)).rejects.toThrow('Round index out of bounds');
    await expect(lottery.getLotteryRounds(0, 1)).rejects.toThrow('Start index out of bounds');
  });
});