"use client";
import { useReadContract, useReadContracts } from "wagmi";
import { ABI, CONTRACT_ADDRESS, CHAIN } from "@/lib/contract";

export type LbRow = { address: `0x${string}`; points: number; correct: number };

/**
 * Reads the leaderboard straight from the contract (no indexer).
 *  1) playerCount()            -> how many entrants
 *  2) players(i)  x count      -> their addresses   (one multicall)
 *  3) scoreOf(addr) x count    -> their points       (one multicall)
 * Points are then sorted client-side. Each correct pick = 3 pts.
 *
 * Fine for modest entrant counts (multicall batches the reads). At large scale,
 * scoreOf loops every match for every player, so move to an events-based
 * indexer — but you can ship with this and swap later without UI changes.
 */
export function useLeaderboard() {
  const { data: countData } = useReadContract({
    address: CONTRACT_ADDRESS, abi: ABI, functionName: "playerCount", chainId: CHAIN.id,
  });
  const count = countData ? Number(countData) : 0;

  // 1) addresses
  const { data: playersData } = useReadContracts({
    contracts: Array.from({ length: count }, (_, i) => ({
      address: CONTRACT_ADDRESS, abi: ABI, functionName: "players",
      args: [BigInt(i)], chainId: CHAIN.id,
    })),
    query: { enabled: count > 0 },
  });

  const addresses = (playersData ?? [])
    .map((r) => r.result as `0x${string}` | undefined)
    .filter((a): a is `0x${string}` => Boolean(a));

  // 2) scores
  const { data: scoresData, isLoading } = useReadContracts({
    contracts: addresses.map((addr) => ({
      address: CONTRACT_ADDRESS, abi: ABI, functionName: "scoreOf",
      args: [addr], chainId: CHAIN.id,
    })),
    query: { enabled: addresses.length > 0 },
  });

  const rows: LbRow[] = addresses
    .map((address, i) => {
      const pts = scoresData?.[i]?.result ? Number(scoresData[i].result as bigint) : 0;
      return { address, points: pts, correct: pts / 3 };
    })
    .sort((a, b) => b.points - a.points);

  return { rows, count, isLoading };
}
