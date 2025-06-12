export interface LotteryRound {
  roundNumber: number;
  timestamp: number;
  winner: string;
  potSize: number;
  participants: string[];
}