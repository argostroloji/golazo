import { parseAbi } from "viem";
import { base, baseSepolia } from "viem/chains";

export const CONTRACT_ADDRESS =
  (process.env.NEXT_PUBLIC_CONTRACT ??
    "0x0000000000000000000000000000000000000000") as `0x${string}`;

// Flip NEXT_PUBLIC_USE_MAINNET to "true" only after testing on Sepolia.
export const CHAIN =
  process.env.NEXT_PUBLIC_USE_MAINNET === "true" ? base : baseSepolia;

// Human-readable ABI for the functions the app uses.
export const ABI = parseAbi([
  // player
  "function registerAndPredict(uint8[] phase0Predictions)",
  "function submitPredictions(uint256 phaseId, uint8[] preds)",
  "function registered(address) view returns (bool)",
  "function scoreOf(address player) view returns (uint256)",
  // reads for leaderboard / rendering
  "function playerCount() view returns (uint256)",
  "function players(uint256) view returns (address)",
  "function phaseCount() view returns (uint256)",
  "function getPredictions(uint256 phaseId, address player) view returns (uint8[])",
  "function getFixtures(uint256 phaseId) view returns (string[] home, string[] away)",
  // owner / admin
  "function createPhase(string name, uint256 matchCount, uint256 deadline, bool allowsDraw) returns (uint256)",
  "function setFixtures(uint256 phaseId, string[] home, string[] away)",
  "function setMatchResult(uint256 phaseId, uint256 matchId, uint8 outcome)",
]);
