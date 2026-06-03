"use client";
import { Avatar, Name } from "@coinbase/onchainkit/identity";
import { base } from "viem/chains";
import { useLeaderboard } from "@/lib/useLeaderboard";

// On-chain leaderboard. OnchainKit's <Avatar>/<Name> resolve Basename / ENS /
// Farcaster identity for each address (resolved on Base mainnet).
export function Leaderboard({ me }: { me?: `0x${string}` }) {
  const { rows, isLoading } = useLeaderboard();

  if (isLoading) return <p className="muted">Loading leaderboard…</p>;
  if (rows.length === 0) return <p className="muted">No entrants yet — be the first.</p>;

  return (
    <div>
      {rows.map((r, i) => {
        const isMe = me && r.address.toLowerCase() === me.toLowerCase();
        return (
          <div key={r.address} className={`lrow ${isMe ? "me" : ""}`}>
            <span className={`rank ${i < 3 ? "t" + (i + 1) : ""}`}>{i + 1}</span>
            <Avatar address={r.address} chain={base} className="lav" />
            <div className="lname">
              <Name address={r.address} chain={base} />
              <small>{r.correct} correct</small>
            </div>
            <div className="lpts">{r.points}<small>pts</small></div>
          </div>
        );
      })}
    </div>
  );
}
