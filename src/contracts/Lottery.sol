// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Lottery {
    // Struct to represent a lottery round
    struct LotteryRound {
        uint256 roundNumber;
        uint256 timestamp;
        address winner;
        uint256 potSize;
        address[] participants;
    }

    // Array to store lottery round history
    LotteryRound[] public lotteryRounds;

    // Function to get the number of completed lottery rounds
    function getLotteryRoundCount() public view returns (uint256) {
        return lotteryRounds.length;
    }

    // Function to retrieve a specific lottery round by index
    function getLotteryRound(uint256 _roundIndex) public view returns (LotteryRound memory) {
        require(_roundIndex < lotteryRounds.length, "Round index out of bounds");
        return lotteryRounds[_roundIndex];
    }

    // Function to retrieve multiple lottery rounds
    function getLotteryRounds(uint256 _startIndex, uint256 _count) public view returns (LotteryRound[] memory) {
        require(_startIndex < lotteryRounds.length, "Start index out of bounds");
        
        // Adjust count to prevent out of bounds
        uint256 count = _count;
        if (_startIndex + _count > lotteryRounds.length) {
            count = lotteryRounds.length - _startIndex;
        }

        LotteryRound[] memory rounds = new LotteryRound[](count);
        for (uint256 i = 0; i < count; i++) {
            rounds[i] = lotteryRounds[_startIndex + i];
        }
        
        return rounds;
    }

    // Internal function to record a new lottery round (to be called after a round is completed)
    function _recordLotteryRound(address _winner, uint256 _potSize, address[] memory _participants) internal {
        LotteryRound memory newRound = LotteryRound({
            roundNumber: lotteryRounds.length + 1,
            timestamp: block.timestamp,
            winner: _winner,
            potSize: _potSize,
            participants: _participants
        });
        
        lotteryRounds.push(newRound);
    }
}